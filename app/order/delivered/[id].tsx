import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ordersApi } from '../../../services/api/orders';
import { Order, OrderDetail } from '../../../services/api/types/orders';

// Types for delivery timeline
interface DeliveryTimeline {
  time: string;
  status: string;
  isCompleted: boolean;
  icon: string;
}

export default function DeliveredOrderScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [parentOrder, setParentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderData();
  }, [id]);

  const fetchOrderData = async () => {
    try {
      // Get order info directly using order ID
      const orderResponse = await ordersApi.getOrderById(id as string);

      if (orderResponse.isSuccess && orderResponse.data) {
        const orderData = orderResponse.data.result || orderResponse.data;
        setParentOrder(orderData);

        // Find the first delivered order detail
        const deliveredDetail = orderData.details?.find((detail: any) =>
          detail.status === 'DELIVERED' || detail.status === 'COMPLETED'
        );

        if (deliveredDetail) {
          setOrderDetail(deliveredDetail);
        } else {
          setOrderDetail(orderData.details?.[0] || null);
        }
      } else {
        Alert.alert('Lỗi', 'Không thể tải thông tin đơn hàng');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'Chưa cập nhật';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const translateProvider = (provider: string): string => {
    const providerMap: { [key: string]: string } = {
      'GHN': 'Giao Hàng Nhanh',
      'GHTK': 'Giao Hàng Tiết Kiệm',
      'SPX': 'SPX Express',
      'VTP': 'Viettel Post',
      'J&T': 'J&T Express'
    };
    return providerMap[provider] || provider;
  };

  // Create delivery timeline from order data
  const createDeliveryTimeline = (): DeliveryTimeline[] => {
    if (!parentOrder || !orderDetail) return [];

    const timeline: DeliveryTimeline[] = [];
    const shipment = orderDetail.shipments?.[0];

    // 1. Đặt hàng thành công (completedAt)
    if (parentOrder.completedAt) {
      timeline.push({
        time: formatDateTime(parentOrder.completedAt),
        status: 'Đơn hàng đã được đặt thành công',
        isCompleted: true,
        icon: 'checkmark-circle'
      });
    }

    // 2. Dự kiến lấy hàng (estimatedPickupTime)
    if (shipment?.estimatedPickupTime) {
      timeline.push({
        time: formatDateTime(shipment.estimatedPickupTime),
        status: 'Đã lấy hàng và bắt đầu vận chuyển',
        isCompleted: true,
        icon: 'cube'
      });
    }

    // 3. Dự kiến giao hàng (estimatedDelivery)
    if (shipment?.estimatedDelivery) {
      timeline.push({
        time: formatDateTime(shipment.estimatedDelivery),
        status: 'Đang giao hàng đến địa chỉ nhận',
        isCompleted: true,
        icon: 'bicycle'
      });
    }

    // 4. Đã giao hàng thành công (shippedAt)
    if (orderDetail.status === 'DELIVERED' && shipment?.shippedAt) {
      timeline.push({
        time: formatDateTime(shipment.shippedAt),
        status: 'Đã giao hàng thành công',
        isCompleted: true,
        icon: 'checkmark-done-circle'
      });
    }

    return timeline;
  };

  const handleOrderInfoPress = () => {
    if (parentOrder) {
      router.push(`/order/${parentOrder.id}`);
    } else {
      Alert.alert('Thông báo', 'Không tìm thấy thông tin đơn hàng');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text className="text-gray-500 mt-2">Đang tải thông tin đơn hàng...</Text>
      </View>
    );
  }

  if (!orderDetail || !parentOrder) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500">Không tìm thấy thông tin đơn hàng</Text>
        <TouchableOpacity
          className="mt-4 bg-orange-500 px-4 py-2 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const timeline = createDeliveryTimeline();
  const shipment = orderDetail.shipments?.[0];

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
            <Text className="text-lg font-medium text-gray-900">Đơn hàng đã giao</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Delivery Status */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="flex-row items-center mb-4">
            <Ionicons name="checkmark-done-circle" size={24} color="#10B981" />
            <Text className="text-green-600 font-medium text-base ml-2">
              Đã giao hàng thành công
            </Text>
          </View>
          {orderDetail.shipments?.[0]?.shippedAt && (
            <Text className="text-gray-600 text-sm">
              Giao hàng vào: {formatDateTime(orderDetail.shipments[0].shippedAt)}
            </Text>
          )}
        </View>

        {/* Product Info */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: orderDetail.blindBoxImage || orderDetail.productImages[0] || 'https://via.placeholder.com/60x60' }}
              className="w-16 h-16 rounded-lg mr-3"
            />
            <View className="flex-1">
              <Text className="text-gray-900 font-medium text-base">{orderDetail.blindBoxName || orderDetail.productName}</Text>
              <Text className="text-gray-500 text-sm">Số lượng: {orderDetail.quantity}</Text>
              <Text className="text-orange-500 font-semibold">
                {formatCurrency(orderDetail.totalPrice)}
              </Text>
            </View>
            <TouchableOpacity
              className="px-3 py-1 border border-gray-200 rounded-md"
              onPress={handleOrderInfoPress}
            >
              <Text className="text-gray-700 text-sm">Chi tiết đơn hàng</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Shipping Info */}
        {shipment && (
          <View className="bg-white mx-4 mt-4 rounded-lg p-4">
            <Text className="text-gray-900 font-medium text-base mb-3">Thông tin vận chuyển</Text>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600">Đơn vị vận chuyển</Text>
              <Text className="text-gray-900">{translateProvider(shipment.provider)}</Text>
            </View>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-gray-600">Mã vận đơn</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-900">{shipment.trackingNumber}</Text>
                <TouchableOpacity
                  className="ml-2"
                  onPress={() => Alert.alert('Đã sao chép', 'Mã vận đơn đã được sao chép!')}
                >
                  <Ionicons name="copy-outline" size={16} color="#8E8E93" />
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-600">Phí vận chuyển</Text>
              <Text className="text-gray-900">
                {formatCurrency(shipment.totalFee)}
              </Text>
            </View>
          </View>
        )}

        {/* Delivery Timeline */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <Text className="text-gray-900 font-medium text-base mb-4">Lịch sử giao hàng</Text>
          <View className="space-y-4">
            {timeline.map((item, index) => (
              <View key={index} className="flex-row">
                <View className="items-center mr-4 w-6">
                  <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center">
                    <Ionicons
                      name={item.icon as any}
                      size={14}
                      color="white"
                    />
                  </View>
                  {index < timeline.length - 1 && (
                    <View className="w-0.5 h-8 bg-green-200 mt-1"></View>
                  )}
                </View>
                <View className="flex-1 pb-4">
                  <Text className="text-gray-900 font-medium text-sm">
                    {item.status}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    {item.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="h-4"></View>
      </ScrollView>
    </View>
  );
}
