import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock data cho đơn hàng đã hủy
const mockRefundOrder = {
  id: '2506160MGMW3A6Q',
  status: 'Đã hoàn tiền',
  refundAmount: 44700,
  refundMethod: 'Ví của bạn.',
  refundDate: '16-06-2025 00:01',
  requestedBy: 'Người mua',
  reason: 'Muốn thay đổi địa chỉ giao hàng',
  shop: {
    name: 'Luky_Store',
    isPreferred: true
  },
  product: {
    name: 'Bàn học gấp gọn ngồi bệt, dùng cho h...',
    color: 'Bàn đen',
    quantity: 1,
    originalPrice: 80000,
    salePrice: 54000,
    image: 'https://via.placeholder.com/80x80/F0F0F0/999999?text=Product'
  }
};

const formatCurrency = (amount: number) => {
  return `đ${amount.toLocaleString('vi-VN')}`;
};

export default function RefundOrderScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleOrderDetails = () => {
    Alert.alert('Chi tiết đơn hàng', 'Xem thông tin chi tiết đơn hàng');
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-lg font-medium text-gray-900">Chi tiết Hoàn tiền</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="help-circle-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Progress Bar */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="items-center">
              <View className="w-4 h-4 bg-gray-800 rounded-full mb-2"></View>
              <Text className="text-xs text-gray-600 text-center">Gửi yêu cầu</Text>
            </View>
            <View className="flex-1 h-0.5 bg-gray-800 mx-2"></View>
            <View className="items-center">
              <View className="w-4 h-4 bg-gray-800 rounded-full mb-2"></View>
              <Text className="text-xs text-gray-600 text-center">Được chấp nhận</Text>
            </View>
            <View className="flex-1 h-0.5 bg-gray-800 mx-2"></View>
            <View className="items-center">
              <View className="w-4 h-4 bg-gray-800 rounded-full mb-2"></View>
              <Text className="text-xs text-gray-600 text-center">Đã hoàn tiền</Text>
            </View>
          </View>
        </View>

        {/* Refund Status */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-red-500 font-bold text-lg">{mockRefundOrder.status}</Text>
            <View className="w-8 h-8 border-2 border-red-500 rounded-full items-center justify-center">
              <Ionicons name="checkmark" size={16} color="#EF4444" />
            </View>
          </View>
          <Text className="text-gray-600 text-sm">
            {formatCurrency(mockRefundOrder.refundAmount)} đã được hoàn về {mockRefundOrder.refundMethod}
          </Text>
        </View>

        {/* Shop Info */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              {mockRefundOrder.shop.isPreferred && (
                <View className="bg-red-500 px-2 py-1 rounded mr-2">
                  <Text className="text-white text-xs font-medium">Yêu thích</Text>
                </View>
              )}
              <Text className="text-gray-900 font-medium">{mockRefundOrder.shop.name}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
          </View>
        </View>

        {/* Product Info */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="flex-row">
            <Image 
              source={{ uri: mockRefundOrder.product.image }}
              className="w-20 h-20 rounded-lg mr-3"
            />
            <View className="flex-1">
              <Text className="text-gray-900 font-medium mb-1" numberOfLines={2}>
                {mockRefundOrder.product.name}
              </Text>
              <Text className="text-gray-500 text-sm mb-2">{mockRefundOrder.product.color}</Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-gray-400 text-sm line-through mr-2">
                    {formatCurrency(mockRefundOrder.product.originalPrice)}
                  </Text>
                  <Text className="text-gray-900 font-medium">
                    {formatCurrency(mockRefundOrder.product.salePrice)}
                  </Text>
                </View>
                <Text className="text-gray-500">x{mockRefundOrder.product.quantity}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Refund Details */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Số tiền hoàn</Text>
              <Text className="text-gray-900 font-medium">{formatCurrency(mockRefundOrder.refundAmount)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Hoàn tiền vào</Text>
              <Text className="text-gray-900">{mockRefundOrder.refundMethod}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Yêu cầu bởi</Text>
              <Text className="text-gray-900">{mockRefundOrder.requestedBy}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Yêu cầu vào</Text>
              <Text className="text-gray-900">{mockRefundOrder.refundDate}</Text>
            </View>
            <View className="flex-row justify-between items-start">
              <Text className="text-gray-500">ID Yêu cầu</Text>
              <View className="items-end">
                <Text className="text-gray-900">{mockRefundOrder.id}</Text>
                <Text className="text-red-500 text-xs font-medium">SAO CHÉP</Text>
              </View>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Lý do</Text>
              <Text className="text-gray-900 flex-1 text-right">{mockRefundOrder.reason}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
