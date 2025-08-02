import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ORDER_STATUS_COLORS, ORDER_STATUS_MAP } from '../../constants/orderStatus';
import { ordersApi } from '../../services/api/orders';

// Temporary types until we fix the import
interface Order {
  id: string;
  status: string;
  totalAmount: number;
  placedAt: string;
  completedAt?: string;
  details: OrderDetail[];
  payment: OrderPayment;
  finalAmount: number;
  totalShippingFee: number;
}

interface OrderDetail {
  id: string;
  productId: string;
  productName: string;
  productImages: string[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
}

interface OrderPayment {
  id: string;
  amount: number;
  method: string;
  status: string;
  paidAt: string;
}



const orderTabs = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'PENDING', label: 'Chờ thanh toán' },
  { key: 'DELIVERING', label: 'Đang giao hàng' },
  { key: 'CANCELLED', label: 'Đã hủy' },
];

export default function OrdersScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

  const fetchOrders = async () => {
    try {
      const response = await ordersApi.getOrders(1, 50);

      if (response.isSuccess && response.data) {
        const ordersData = response.data;

        // Handle different response structures
        let ordersList = [];
        if (Array.isArray(ordersData)) {
          ordersList = ordersData;
        } else if (ordersData.orders && Array.isArray(ordersData.orders)) {
          ordersList = ordersData.orders;
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

        // Handle response structure
        let detailsList = [];
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

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchOrderDetails()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  // Get filtered data based on active tab
  const getFilteredData = () => {
    if (activeTab === 'DELIVERING') {
      // For "Đang giao hàng", use orderDetails from /orders/order-details
      return Array.isArray(orderDetails) ? orderDetails.filter(detail => detail.status === 'DELIVERING') : [];
    } else if (activeTab === 'ALL') {
      // For "Tất cả", combine all orders
      return Array.isArray(orders) ? orders : [];
    } else {
      // For other tabs, filter orders by status
      return Array.isArray(orders) ? orders.filter(order => order.status === activeTab) : [];
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
    if (activeTab === 'DELIVERING') {
      // For order details, navigate to tracking
      router.push(`/order/tracking/${item.id}`);
    } else {
      // For orders, navigate based on status
      if (item.status === 'RETURNED') {
        router.push(`/order/return/${item.id}`);
      } else if (item.status === 'CANCELLED') {
        router.push(`/order/refund/${item.id}`);
      } else {
        router.push(`/order/${item.id}`);
      }
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    // Check if this is an OrderDetail (from /orders/order-details) or Order (from /orders)
    const isOrderDetail = activeTab === 'DELIVERING';

    return (
      <TouchableOpacity
        className="bg-white rounded-lg p-4 mb-4 shadow-sm"
        onPress={() => handleOrderPress(item)}
      >
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-gray-900 font-semibold text-base">
              {isOrderDetail ? `#${item.id.slice(-8).toUpperCase()}` : `#${item.id.slice(-8).toUpperCase()}`}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              {isOrderDetail ? 'Chi tiết đơn hàng' : formatDate(item.placedAt)}
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
              {formatCurrency(isOrderDetail ? item.totalPrice : item.totalAmount)}
            </Text>
          </View>
        </View>

        <View className="border-t border-gray-100 pt-3">
          <Text className="text-gray-600 text-sm mb-2">Sản phẩm:</Text>
          {isOrderDetail ? (
            // Render single OrderDetail
            <View className="flex-row items-center mb-1">
              {item.productImages && item.productImages.length > 0 && (
                <Image
                  source={{ uri: item.productImages[0] }}
                  className="w-8 h-8 rounded mr-2"
                />
              )}
              <Text className="text-gray-800 text-sm flex-1" numberOfLines={1}>
                {item.productName} x{item.quantity}
              </Text>
            </View>
          ) : (
            // Render Order with multiple details
            <>
              {item.details && item.details.slice(0, 2).map((detail: any) => (
                <View key={detail.id} className="flex-row items-center mb-1">
                  {detail.productImages && detail.productImages.length > 0 && (
                    <Image
                      source={{ uri: detail.productImages[0] }}
                      className="w-8 h-8 rounded mr-2"
                    />
                  )}
                  <Text className="text-gray-800 text-sm flex-1" numberOfLines={1}>
                    {detail.productName} x{detail.quantity}
                  </Text>
                </View>
              ))}
              {item.details && item.details.length > 2 && (
                <Text className="text-gray-500 text-sm">
                  +{item.details.length - 2} sản phẩm khác
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
      <View className="bg-white px-4 py-3">
        <View className="flex-row justify-evenly">
          {orderTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              className={`pb-2 ${activeTab === tab.key ? 'border-b-2 border-orange-500' : ''}`}
            >
              <Text
                className={`text-sm ${activeTab === tab.key ? 'text-orange-500 font-semibold' : 'text-gray-600'}`}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
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
