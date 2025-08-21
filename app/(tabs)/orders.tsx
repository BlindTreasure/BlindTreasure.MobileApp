import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ORDER_STATUS_COLORS, ORDER_STATUS_MAP } from '../../constants/orderStatus';
import { ordersApi } from '../../services/api/orders';
import { InventoryItem, Order, OrderDetail } from '../../services/api/types/orders';

const orderTabs = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ xác nhận' },
  { key: 'DELIVERING', label: 'Chờ giao hàng' },
  { key: 'DELIVERED', label: 'Hoàn thành' },
  { key: 'CANCELLED', label: 'Đã hủy' },
  { key: 'INVENTORY', label: 'Giao hàng túi đồ' },
  { key: 'IN_INVENTORY', label: 'Trong túi đồ' },
];

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<OrderDetail[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await ordersApi.getOrders(1, 50);

      if (response.isSuccess && response.data) {
        const ordersData = response.data;

        let ordersList: Order[] = [];
        if (Array.isArray(ordersData)) {
          ordersList = ordersData;
        } else if (ordersData.result && Array.isArray(ordersData.result)) {
          ordersList = ordersData.result;
        }

        setOrders(ordersList);
      } else {
        setOrders([]);
      }
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async () => {
    try {
      const response = await ordersApi.getOrderDetails(1, 50);

      if (response.isSuccess && response.data) {
        const detailsData = response.data;

        let detailsList: OrderDetail[] = [];
        if (Array.isArray(detailsData)) {
          detailsList = detailsData;
        } else if (detailsData.result && Array.isArray(detailsData.result)) {
          detailsList = detailsData.result;
        }

        setOrderDetails(detailsList);
      } else {
        setOrderDetails([]);
      }
    } catch (error) {
      setOrderDetails([]);
    }
  };

  const fetchDeliveredOrders = async () => {
    try {
      const response = await ordersApi.getDeliveredOrders(1, 50);

      if (response.isSuccess && response.data) {
        const deliveredData = response.data;

        let deliveredList: OrderDetail[] = [];
        if (Array.isArray(deliveredData)) {
          deliveredList = deliveredData;
        } else if (deliveredData.result && Array.isArray(deliveredData.result)) {
          deliveredList = deliveredData.result;
        }

        setDeliveredOrders(deliveredList);
      } else {
        setDeliveredOrders([]);
      }
    } catch (error) {
      setDeliveredOrders([]);
    }
  };

  const fetchInventoryItems = async () => {
    try {
      const response = await ordersApi.getInventoryItems(1, 50);

      if (response.isSuccess && response.data) {
        const inventoryData = response.data;
        let inventoryList: InventoryItem[] = [];
        if (Array.isArray(inventoryData)) {
          inventoryList = inventoryData;
        } else if (inventoryData.result && Array.isArray(inventoryData.result)) {
          inventoryList = inventoryData.result;
        }

        setInventoryItems(inventoryList);
      } else {
        setInventoryItems([]);
      }
    } catch (error) {
      setInventoryItems([]);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchOrderDetails(), fetchDeliveredOrders(), fetchInventoryItems()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const getFilteredData = () => {
    if (activeTab === 'INVENTORY') {
      const result = Array.isArray(inventoryItems) ? inventoryItems : [];
      return result;
    } else if (activeTab === 'IN_INVENTORY') {
      const detailList = Array.isArray(orderDetails) ? orderDetails.filter(detail => detail.status === 'IN_INVENTORY') : [];
      return detailList;
    } else if (activeTab === 'DELIVERING') {
      const orderList = Array.isArray(orders) ? orders.filter(order => order.status === 'DELIVERING') : [];
      const detailList = Array.isArray(orderDetails) ? orderDetails.filter(detail => detail.status === 'DELIVERING') : [];
      return [...orderList, ...detailList];
    } else if (activeTab === 'DELIVERED') {
      const orderList = Array.isArray(orders) ? orders.filter(order => order.status === 'DELIVERED') : [];
      const detailList = Array.isArray(deliveredOrders) ? deliveredOrders : [];
      return [...orderList, ...detailList];
    } else if (activeTab === 'PENDING') {
      const orderList = Array.isArray(orders) ? orders.filter(order => order.status === 'PENDING') : [];
      const detailList = Array.isArray(orderDetails) ? orderDetails.filter(detail => detail.status === 'PENDING') : [];
      return [...orderList, ...detailList];
    } else if (activeTab === 'CANCELLED') {
      const orderList = Array.isArray(orders) ? orders.filter(order => order.status === 'CANCELLED' || order.status === 'EXPIRED') : [];
      return orderList;
    } else if (activeTab === 'ALL') {
      const result = Array.isArray(orders) ? orders : [];
      return result;
    } else {
      const result = Array.isArray(orders) ? orders.filter(order => order.status === activeTab) : [];
      return result;
    }
  };

  const filteredData = getFilteredData();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleOrderPress = (item: any) => {
    if (activeTab === 'INVENTORY') {
      router.push(`/order/tracking/${item.id}`);
    } else if (activeTab === 'DELIVERING') {
      router.push(`/order/tracking/${item.id}`);
    } else if (activeTab === 'DELIVERED') {
      const targetId = (item as OrderDetail).orderId || item.id;
      router.push(`/order/delivered/${targetId}`);
    } else if (activeTab === 'IN_INVENTORY') {
      if ('orderId' in item) {
        router.push(`/order/${item.orderId}`);
      } else {
        router.push(`/order/${item.id}`);
      }
    } else {
      if (item.status === 'RETURNED') {
        router.push(`/order/return/${item.id}`);
      } else if (item.status === 'CANCELLED') {
        router.push(`/order/${item.id}`);
      } else {
        router.push(`/order/${item.id}`);
      }
    }
  };

  const renderItem = ({ item }: { item: Order | OrderDetail | InventoryItem }) => {
    const isInventoryItem = activeTab === 'INVENTORY';
    const isOrderDetail = activeTab === 'DELIVERING' || activeTab === 'DELIVERED' || activeTab === 'IN_INVENTORY';

    const findParentOrder = (orderDetail: OrderDetail): Order | null => {
      if (!('orderId' in orderDetail)) return null;
      return orders.find(order => order.id === orderDetail.orderId) || null;
    };

    const getTotalShippingFee = (item: Order | OrderDetail): number => {
      if ('orderId' in item && item.shipments) {
        return item.shipments.reduce((total, shipment) => {
          return total + (shipment.totalFee || 0);
        }, 0);
      }

      if ('details' in item && item.details) {
        return item.details.reduce((total, detail) => {
          if (detail.shipments && detail.shipments.length > 0) {
            return total + detail.shipments.reduce((shipmentTotal, shipment) => {
              return shipmentTotal + (shipment.totalFee || 0);
            }, 0);
          }
          return total;
        }, 0);
      }

      return 0;
    };

    // Calculate total payment for orders: finalAmount + totalShippingFee - discount - promotion
    const calculateTotalPayment = (item: Order | OrderDetail): number => {
      // If this is an OrderDetail, try to get parent order for accurate calculation
      if ('orderId' in item) {
        const parentOrder = findParentOrder(item);

        if (parentOrder) {
          // Use parent order's calculation but proportional to this detail
          const promotionDiscount = item.detailDiscountPromotion || 0;
          const shippingFee = getTotalShippingFee(item);
          const total = (item.totalPrice || 0) + shippingFee - promotionDiscount;

          return total;
        } else {
          // Fallback: just use totalPrice + shipping fee
          const shippingFee = getTotalShippingFee(item);
          const total = (item.totalPrice || 0) + shippingFee;
          return total;
        }
      }

      // If this is an Order, use finalAmount + shipping fee - discounts
      if ('finalAmount' in item) {
        const paymentDiscount = item.payment?.discountRate || 0;
        const promotionDiscount = item.details?.[0]?.detailDiscountPromotion || 0;
        const shippingFee = getTotalShippingFee(item);
        const total = item.finalAmount + shippingFee - paymentDiscount - promotionDiscount;
        return total;
      }

      return 0;
    };

    return (
      <TouchableOpacity
        className="bg-white rounded-lg p-4 mb-4 shadow-sm"
        onPress={() => handleOrderPress(item)}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-base">
              #{isInventoryItem && (item as InventoryItem).orderId
                ? (item as InventoryItem).orderId.slice(-8).toUpperCase()
                : item.id.slice(-8).toUpperCase()
              }
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              {isInventoryItem ?
                'Kho hàng'
                : isOrderDetail ?
                  (activeTab === 'DELIVERED' ? 'Đơn hàng đã giao' : 'Chi tiết đơn hàng')
                  : formatDate((item as Order).placedAt)
              }
            </Text>
          </View>
          <View className="items-end">
            <View
              className="px-2 py-1 rounded"
              style={{ backgroundColor: ORDER_STATUS_COLORS[item.status as keyof typeof ORDER_STATUS_COLORS] || '#8E8E93' }}
            >
              <Text className="text-white text-xs font-medium">
                {ORDER_STATUS_MAP[item.status as keyof typeof ORDER_STATUS_MAP] || item.status}
              </Text>
            </View>
            <Text className="text-gray-900 font-bold text-lg mt-2">
              {isInventoryItem ? (
                // For inventory items (exchange orders), show "Trao đổi" instead of price
                <Text className="text-blue-600 font-semibold">Trao đổi</Text>
              ) : (
                formatCurrency(calculateTotalPayment(item as Order | OrderDetail))
              )}
            </Text>
          </View>
        </View>

        <View className="border-t border-gray-100 pt-3">
          <Text className="text-gray-600 text-sm mb-2">Sản phẩm:</Text>
          {isInventoryItem ? (
            // Render single InventoryItem
            <View className="flex-row items-center mb-1">
              {/* Show product image from product.imageUrls or fallback to blindBox/productImages */}
              {((item as InventoryItem).product?.imageUrls?.[0] || (item as InventoryItem).blindBoxImage || (item as InventoryItem).productImages?.[0]) && (
                <Image
                  source={{
                    uri: (item as InventoryItem).product?.imageUrls?.[0] ||
                      (item as InventoryItem).blindBoxImage ||
                      (item as InventoryItem).productImages?.[0]
                  }}
                  className="w-8 h-8 rounded mr-2"
                />
              )}
              <Text className="text-gray-800 text-sm flex-1" numberOfLines={1}>
                {/* Show product name from product.name or fallback to blindBox/productName */}
                {(item as InventoryItem).product?.name || (item as InventoryItem).blindBoxName || (item as InventoryItem).productName} x{(item as InventoryItem).quantity}
              </Text>
              {/* Show tracking info if available */}
              {(item as InventoryItem).shipments?.[0] && (
                <Text className="text-blue-500 text-xs mt-1">
                  Mã vận đơn: {(item as InventoryItem).shipments?.[0]?.trackingNumber}
                </Text>
              )}
            </View>
          ) : isOrderDetail ? (
            // Render single OrderDetail
            <View className="flex-row items-center mb-1">
              {/* Show BlindBox image if available, otherwise product image */}
              {((item as OrderDetail).blindBoxImage || ((item as OrderDetail).productImages && (item as OrderDetail).productImages.length > 0)) && (
                <Image
                  source={{ uri: (item as OrderDetail).blindBoxImage || (item as OrderDetail).productImages[0] }}
                  className="w-8 h-8 rounded mr-2"
                />
              )}
              <Text className="text-gray-800 text-sm flex-1" numberOfLines={1}>
                {/* Show BlindBox name if available, otherwise product name */}
                {(item as OrderDetail).blindBoxName || (item as OrderDetail).productName} x{(item as OrderDetail).quantity}
              </Text>
              {/* Show tracking info if available */}
              {(item as OrderDetail).shipments?.[0] && (
                <Text className="text-blue-500 text-xs mt-1">
                  Mã vận đơn: {(item as OrderDetail).shipments[0].trackingNumber}
                </Text>
              )}
            </View>
          ) : (
            // Render Order with multiple details
            <>
              {(item as Order).details && (item as Order).details.slice(0, 2).map((detail: OrderDetail) => (
                <View key={detail.id} className="flex-row items-center mb-1">
                  {/* Show BlindBox image if available, otherwise product image */}
                  {(detail.blindBoxImage || (detail.productImages && detail.productImages.length > 0)) && (
                    <Image
                      source={{ uri: detail.blindBoxImage || detail.productImages[0] }}
                      className="w-8 h-8 rounded mr-2"
                    />
                  )}
                  <Text className="text-gray-800 text-sm flex-1" numberOfLines={1}>
                    {/* Show BlindBox name if available, otherwise product name */}
                    {detail.blindBoxName || detail.productName} x{detail.quantity}
                  </Text>
                </View>
              ))}
              {(item as Order).details && (item as Order).details.length > 2 && (
                <Text className="text-gray-500 text-sm">
                  +{(item as Order).details.length - 2} sản phẩm khác
                </Text>
              )}
            </>
          )}
        </View>

        <View className="flex-row justify-end mt-3">
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text className="text-gray-500 mt-2">Đang tải đơn hàng...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-white px-4 py-3" style={{ paddingTop: insets.top }}>
        <Text className="text-xl font-bold text-center">Đơn hàng của tôi</Text>
      </View>

      {/* Tabs */}
      <View className="bg-white py-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {orderTabs.map((tab, index) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className={`pb-2 px-4 ${index < orderTabs.length - 1 ? 'mr-6' : ''} ${activeTab === tab.key ? 'border-b-2 border-orange-500' : ''}`}
            >
              <Text
                className={`text-sm whitespace-nowrap ${activeTab === tab.key ? 'text-orange-500 font-semibold' : 'text-gray-600'}`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>


      {/* Orders List */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mt-4">Không có đơn hàng nào</Text>
            <Text className="text-gray-400 text-sm mt-2">
              Các đơn hàng {orderTabs.find(t => t.key === activeTab)?.label.toLowerCase()} sẽ hiển thị ở đây
            </Text>
          </View>
        }
      />
    </View>
  );
}
