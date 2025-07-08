import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Mock data - sẽ thay thế bằng API call
const mockOrders = [
  {
    id: '1',
    orderCode: 'BT001',
    status: 'Đang giao',
    totalAmount: 2500000,
    createdAt: '2024-01-15',
    items: ['Sản phẩm A', 'Sản phẩm B'],
  },
  {
    id: '2',
    orderCode: 'BT002',
    status: 'Hoàn thành',
    totalAmount: 1800000,
    createdAt: '2024-01-10',
    items: ['Sản phẩm C'],
  },
];

export default function OrdersScreen() {
  const [orders, setOrders] = useState(mockOrders);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // TODO: Call API to refresh orders
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang giao':
        return '#FF9500';
      case 'Hoàn thành':
        return '#34C759';
      case 'Đã hủy':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white p-5 pt-15 border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</Text>
      </View>

      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {orders.length === 0 ? (
          <View className="items-center justify-center py-20">
            <Ionicons name="receipt-outline" size={64} color="#8E8E93" />
            <Text className="text-lg font-semibold text-gray-900 mt-4 mb-2">
              Chưa có đơn hàng nào
            </Text>
            <Text className="text-sm text-gray-500 text-center">
              Các đơn hàng của bạn sẽ hiển thị ở đây
            </Text>
          </View>
        ) : (
          orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              className="bg-white p-4 rounded-xl mb-3 shadow-sm"
              onPress={() => {
                Alert.alert('Chi tiết đơn hàng', `Mã đơn: ${order.orderCode}`);
              }}
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-base font-semibold text-gray-900">
                  #{order.orderCode}
                </Text>
                <View
                  className="px-2 py-1 rounded-xl"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  <Text className="text-xs font-semibold text-white">
                    {order.status}
                  </Text>
                </View>
              </View>

              <Text className="text-sm text-gray-500 mb-1">
                Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </Text>

              <Text className="text-sm text-gray-500 mb-3">
                Sản phẩm: {order.items.join(', ')}
              </Text>

              <View className="flex-row justify-between items-center">
                <Text className="text-base font-semibold text-blue-500">
                  {formatCurrency(order.totalAmount)}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}


