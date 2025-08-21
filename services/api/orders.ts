import { axiosInstance } from "../../api/axiosInstance";
import {
  ApiResponse,
  InventoryItem,
  InventoryItemsListResponse,
  Order,
  OrderDetail,
  OrderDetailsListResponse,
  OrdersListResponse,
  SingleInventoryItemResponse,
  SingleOrderResponse,
  TrackingInfo,
} from "./types/orders";

export const ordersApi = {
  getOrders: async (page: number = 1, pageSize: number = 10) => {
    try {
      const response = await axiosInstance.get<ApiResponse<OrdersListResponse>>(
        "/api/orders",
        {
          params: { page, pageSize },
        }
      );

      if (response.data?.isSuccess && response.data?.value?.data) {
        return {
          isSuccess: true,
          data: response.data.value.data,
          error: null,
        };
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      return {
        isSuccess: false,
        data: null,
        error: error.response?.data?.message || "Failed to fetch orders",
      };
    }
  },

  getOrderById: async (orderId: string) => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<SingleOrderResponse>
      >(`/api/orders/${orderId}`);

      if (response.data?.isSuccess && response.data?.value?.data) {
        return {
          isSuccess: true,
          data: response.data.value.data,
          error: null,
        };
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      return {
        isSuccess: false,
        data: null,
        error: error.response?.data?.message || "Failed to fetch order details",
      };
    }
  },

  getOrderDetails: async (page: number = 1, pageSize: number = 10) => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<OrderDetailsListResponse>
      >("/api/orders/order-details", {
        params: { page, pageSize },
      });

      if (response.data?.isSuccess && response.data?.value?.data) {
        return {
          isSuccess: true,
          data: response.data.value.data,
          error: null,
        };
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      return {
        isSuccess: false,
        data: null,
        error: error.response?.data?.message || "Failed to fetch order details",
      };
    }
  },

  getTrackingInfo: async (orderDetailId: string) => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<OrderDetailsListResponse>
      >(`/api/orders/order-details`, {
        params: { status: 'DELIVERING', page: 1, pageSize: 50 },
      });

      if (response.data?.isSuccess && response.data?.value?.data) {
        const data = response.data.value.data;
        const result = data.result || data;
        const orderDetail = Array.isArray(result)
          ? result.find((item: OrderDetail) => item.id === orderDetailId)
          : null;

        if (orderDetail) {
          return {
            isSuccess: true,
            data: orderDetail,
            error: null,
          };
        } else {
          throw new Error("Order detail not found");
        }
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      return {
        isSuccess: false,
        data: null,
        error: error.response?.data?.message || "Failed to fetch tracking info",
      };
    }
  },

  extractTrackingInfo: (
    orderDetail: OrderDetail,
    parentOrder?: Order
  ): TrackingInfo => {
    const shipment = orderDetail.shipments?.[0];

    return {
      orderId: orderDetail.orderId,
      orderDetailId: orderDetail.id,
      productName: orderDetail.productName,
      productImages: orderDetail.productImages,
      quantity: orderDetail.quantity,
      totalPrice: orderDetail.totalPrice,
      status: orderDetail.status,
      placedAt: parentOrder?.placedAt || "",
      completedAt: parentOrder?.completedAt,
      estimatedDelivery: shipment?.estimatedDelivery,
      estimatedPickupTime: shipment?.estimatedPickupTime,
      shippedAt: shipment?.shippedAt,
      pickedUpAt: shipment?.pickedUpAt,
      shipment: shipment,
      logs: orderDetail.logs,
      totalPayment: parentOrder
        ? parentOrder.finalAmount +
          (shipment?.totalFee || 0) -
          (parentOrder.payment?.discountRate || 0)
        : orderDetail.totalPrice,
    };
  },

  getDeliveredOrders: async (
    page: number = 1,
    pageSize: number = 50,
    orderId?: string,
    minPrice?: number
  ) => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<OrderDetailsListResponse>
      >("/api/orders/order-details", {
        params: { page, pageSize },
      });

      if (response.data?.isSuccess && response.data?.value?.data) {
        const allData = response.data.value.data;

        let filteredResult = Array.isArray(allData.result)
          ? allData.result.filter((item: any) => item.status === "DELIVERED")
          : [];

        if (orderId) {
          filteredResult = filteredResult.filter((item: any) =>
            item.orderId?.toString().includes(orderId)
          );
        }

        if (minPrice !== undefined) {
          filteredResult = filteredResult.filter(
            (item: any) => (item.totalPrice || 0) >= minPrice
          );
        }

        const filteredData = {
          ...allData,
          result: filteredResult,
        };

        return {
          isSuccess: true,
          data: filteredData,
          error: null,
        };
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      return {
        isSuccess: false,
        data: null,
        error:
          error.response?.data?.message || "Failed to fetch delivered orders",
      };
    }
  },

  getOrderFromDetail: async (orderDetailId: string) => {
    try {
      const ordersResponse = await axiosInstance.get("/api/orders", {
        params: { page: 1, pageSize: 100 },
      });

      if (ordersResponse.data?.isSuccess && ordersResponse.data?.value?.data) {
        const ordersData = ordersResponse.data.value.data;
        const ordersList = ordersData.result || ordersData;

        const order = ordersList.find(
          (order: any) =>
            order.details &&
            order.details.some((detail: any) => detail.id === orderDetailId)
        );

        if (order) {
          return {
            isSuccess: true,
            data: order,
            error: null,
          };
        } else {
          throw new Error("Order not found for this detail");
        }
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      return {
        isSuccess: false,
        data: null,
        error: error.response?.data?.message || "Failed to find order",
      };
    }
  },

  getInventoryItems: async (page: number = 1, pageSize: number = 50) => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<InventoryItemsListResponse>
      >("/api/inventory-items", {
        params: { page, pageSize },
      });

      if (response.data?.isSuccess && response.data?.value?.data) {
        const allData = response.data.value.data;
        // Option 2: Current filter (status + orderDetailId null)
        let filteredResult = Array.isArray(allData.result)
          ? allData.result.filter(
              (item: InventoryItem) =>
                (item.status === "Delivered" || item.status === "Delivering") &&
                item.orderDetailId === null
            )
          : [];

        const filteredData = {
          ...allData,
          result: filteredResult,
        };

        return {
          isSuccess: true,
          data: filteredData,
          error: null,
        };
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      return {
        isSuccess: false,
        data: null,
        error:
          error.response?.data?.message || "Failed to fetch inventory items",
      };
    }
  },

  getInventoryItemById: async (inventoryItemId: string) => {
    try {
      const response = await axiosInstance.get<
        ApiResponse<SingleInventoryItemResponse>
      >(`/api/inventory-items/${inventoryItemId}`);

      if (response.data?.isSuccess && response.data?.value?.data) {
        return {
          isSuccess: true,
          data: response.data.value.data,
          error: null,
        };
      } else {
        throw new Error("Invalid response structure");
      }
    } catch (error: any) {
      return {
        isSuccess: false,
        data: null,
        error:
          error.response?.data?.message ||
          "Failed to fetch inventory item details",
      };
    }
  },
};
