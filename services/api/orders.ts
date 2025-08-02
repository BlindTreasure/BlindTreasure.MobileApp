import { axiosInstance } from "../../api/axiosInstance";

export const ordersApi = {
  // Get all orders for current user
  getOrders: async (page: number = 1, pageSize: number = 10) => {
    try {
      const response = await axiosInstance.get("/orders", {
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
        error: error.response?.data?.message || "Failed to fetch orders",
      };
    }
  },

  // Get order details by ID
  getOrderById: async (orderId: string) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);

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

  // Get order details for delivering status
  getOrderDetails: async (page: number = 1, pageSize: number = 10) => {
    try {
      const response = await axiosInstance.get("/orders/order-details", {
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

  // Get tracking info for specific order detail
  getTrackingInfo: async (orderDetailId: string) => {
    try {
      const response = await axiosInstance.get(`/orders/order-details`);

      if (response.data?.isSuccess && response.data?.value?.data) {
        const data = response.data.value.data;
        const result = data.result || data;

        // Find the specific order detail by ID
        const orderDetail = Array.isArray(result)
          ? result.find((item: any) => item.id === orderDetailId)
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

  // Get order ID from order detail ID (if needed)
  getOrderFromDetail: async (orderDetailId: string) => {
    try {
      // First get all orders
      const ordersResponse = await axiosInstance.get("/orders", {
        params: { page: 1, pageSize: 100 },
      });

      if (ordersResponse.data?.isSuccess && ordersResponse.data?.value?.data) {
        const ordersData = ordersResponse.data.value.data;
        const ordersList = ordersData.result || ordersData;

        // Find order that contains this detail ID
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
};
