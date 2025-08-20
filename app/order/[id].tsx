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
import {
  ORDER_STATUS_COLORS,
  ORDER_STATUS_MAP,
  getTrackingStatus,
  hasTrackableItems
} from '../../constants/orderStatus';
import { ordersApi } from '../../services/api/orders';
import { Order } from '../../services/api/types/orders';



export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      const response = await ordersApi.getOrderById(id as string);
      if (response.isSuccess && response.data) {
        // Handle response structure - should have 'result' property
        const orderData = response.data.result || response.data;
        setOrder(orderData);
      } else {
        Alert.alert('Lỗi', 'Không thể tải chi tiết đơn hàng');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tải chi tiết đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Calculate total shipping fee from shipments
  const getTotalShippingFee = (order: Order): number => {
    if (!order.details) return 0;

    return order.details.reduce((total, detail) => {
      if (detail.shipments && detail.shipments.length > 0) {
        return total + detail.shipments.reduce((shipmentTotal, shipment) => {
          return shipmentTotal + (shipment.totalFee || 0);
        }, 0);
      }
      return total;
    }, 0);
  };



  const handleTogglePrice = () => {
    setIsDetailVisible(prev => !prev);
  };

  const handleReturnRequest = () => {
    Alert.alert(
      'Yêu cầu Trả hàng/Hoàn tiền',
      'Bạn có chắc chắn muốn gửi yêu cầu trả hàng/hoàn tiền cho đơn hàng này?',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xác nhận', onPress: () => Alert.alert('Thành công', 'Yêu cầu của bạn đã được gửi!') }
      ]
    );
  };

  const handleConfirmReceived = () => {
    Alert.alert(
      'Xác nhận đã nhận hàng',
      'Bạn có chắc chắn đã nhận được hàng và hài lòng với sản phẩm?',
      [
        { text: 'Chưa nhận', style: 'cancel' },
        { text: 'Đã nhận hàng', onPress: () => Alert.alert('Cảm ơn!', 'Đơn hàng đã được xác nhận hoàn thành.') }
      ]
    );
  };

  const handleTrackOrder = () => {
    if (!order?.details) return;

    // Use helper function to get trackable detail ID
    const trackableDetailId = getTrackingStatus(order.details);

    if (trackableDetailId) {
      router.push(`/order/tracking/${trackableDetailId}`);
    } else {
      Alert.alert('Thông báo', 'Không có sản phẩm nào có thể theo dõi');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text className="text-gray-500 mt-2">Đang tải chi tiết đơn hàng...</Text>
      </View>
    );
  }

  if (!order || !order.details) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500">Không tìm thấy đơn hàng</Text>
        <TouchableOpacity
          className="mt-4 bg-orange-500 px-4 py-2 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="white" />

      {/* Header */}
      <View className="bg-white px-4 py-3" style={{ paddingTop: insets.top + 12 }}>
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold flex-1">Chi tiết đơn hàng</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Order Status */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text
              className="text-lg font-semibold"
              style={{ color: ORDER_STATUS_COLORS[order.status as keyof typeof ORDER_STATUS_COLORS] || '#8E8E93' }}
            >
              {ORDER_STATUS_MAP[order.status as keyof typeof ORDER_STATUS_MAP] || order.status}
            </Text>
            {order?.details && hasTrackableItems(order.details) && (
              <TouchableOpacity onPress={handleTrackOrder}>
                <Text className="text-blue-500">Theo dõi đơn hàng</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text className="text-gray-600 text-sm mb-1">
            Đơn hàng: #{order.id.slice(-8).toUpperCase()}
          </Text>
          <Text className="text-gray-600 text-sm">
            Ngày đặt: {formatDate(order.placedAt)}
          </Text>
          {order.completedAt && (
            <Text className="text-gray-600 text-sm">
              Hoàn thành: {formatDate(order.completedAt)}
            </Text>
          )}
        </View>

        {/* Products */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <Text className="text-gray-900 font-medium mb-4">Sản phẩm</Text>

          {Array.isArray(order.details) && order.details.length > 0 ? order.details.map((detail) => (
            <View key={detail.id} className="flex-row mb-4">
              {/* Show BlindBox image if available, otherwise product image */}
              {(detail.blindBoxImage || (detail.productImages && detail.productImages.length > 0)) && (
                <Image
                  source={{ uri: detail.blindBoxImage || detail.productImages[0] }}
                  className="w-16 h-16 rounded-lg mr-3"
                />
              )}
              <View className="flex-1">
                <Text className="text-gray-900 text-sm" numberOfLines={2}>
                  {/* Show BlindBox name if available, otherwise product name */}
                  {detail.blindBoxName || detail.productName}
                </Text>
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-gray-900 font-medium">
                    {formatCurrency(detail.unitPrice)}
                  </Text>
                  <Text className="text-gray-500">x{detail.quantity}</Text>
                </View>
              </View>
            </View>
          )) : (
            <Text className="text-gray-500 text-center py-4">Không có thông tin sản phẩm</Text>
          )}

          {/* Price Details */}
          <View className="border-t border-gray-200 pt-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-gray-900 font-bold">Tổng thanh toán:</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-900 font-bold text-lg">
                  {formatCurrency(order.finalAmount + getTotalShippingFee(order) - (order.details?.[0]?.detailDiscountPromotion || 0))}
                </Text>
                <TouchableOpacity onPress={handleTogglePrice} className="ml-2">
                  <Ionicons
                    name={isDetailVisible ? "chevron-up" : "chevron-down"}
                    size={16}
                    color="#8E8E93"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {isDetailVisible && (
              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Tiền sản phẩm</Text>
                  <Text className="text-gray-900">{formatCurrency(order.finalAmount)}</Text>
                </View>
                {getTotalShippingFee(order) > 0 && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Phí vận chuyển</Text>
                    <Text className="text-gray-900">{formatCurrency(getTotalShippingFee(order))}</Text>
                  </View>
                )}
                {order.details?.[0]?.detailDiscountPromotion && (
                  <View className="flex-row justify-between">
                    <Text className="text-gray-600">Khuyến mãi</Text>
                    <Text className="text-green-600">
                      -{formatCurrency(order.details[0].detailDiscountPromotion)}
                    </Text>
                  </View>
                )}
                <View className="border-t border-gray-200 pt-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-900 font-bold">Tổng thanh toán</Text>
                    <Text className="text-gray-900 font-bold">
                      {formatCurrency(order.finalAmount + getTotalShippingFee(order) - (order.details?.[0]?.detailDiscountPromotion || 0))}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Payment Info */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <Text className="text-gray-900 font-medium mb-3">Thông tin thanh toán</Text>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Phương thức</Text>
            <Text className="text-gray-900">{order.payment.method}</Text>
          </View>
          {/* <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Trạng thái</Text>
            <Text className="text-green-600">{order.payment.status}</Text>
          </View> */}
          {order.payment.paidAt && (
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Thời gian thanh toán</Text>
              <Text className="text-gray-900">{formatDate(order.payment.paidAt)}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
