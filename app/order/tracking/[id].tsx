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


// Types for tracking data
interface TrackingTimeline {
  time: string;
  status: string;
  isCompleted: boolean;
  isDelivered?: boolean;
}

interface OrderDetailData {
  id: string;
  productId: string;
  logs: string;
  productName: string;
  productImages: string[];
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
  shipments: Array<{
    id: string;
    orderCode: string;
    totalFee: number;
    provider: string;
    trackingNumber: string;
    shippedAt: string;
    estimatedDelivery: string;
    status: string;
  }>;
}

export default function TrackingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null);
  const [parentOrder, setParentOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchTrackingData();
  }, [id]);

  const fetchTrackingData = async () => {
    try {
      // Get order detail info
      const detailResponse = await ordersApi.getTrackingInfo(id as string);
      if (detailResponse.isSuccess && detailResponse.data) {
        setOrderDetail(detailResponse.data);

        // Get parent order info
        const orderResponse = await ordersApi.getOrderFromDetail(id as string);
        if (orderResponse.isSuccess && orderResponse.data) {
          setParentOrder(orderResponse.data);
        }
      } else {
        Alert.alert('Lỗi', 'Không thể tải thông tin tracking');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tải thông tin tracking');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderInfoPress = () => {
    if (parentOrder) {
      router.push(`/order/${parentOrder.id}`);
    } else {
      Alert.alert('Thông báo', 'Không tìm thấy thông tin đơn hàng');
    }
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const translateStatus = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'PENDING': 'Chờ xác nhận',
      'PAID': 'Đã thanh toán',
      'PROCESSING': 'Đang xử lý',
      'DELIVERING': 'Đang giao hàng',
      'DELIVERED': 'Đã giao hàng',
      'COMPLETED': 'Hoàn thành',
      'CANCELLED': 'Đã hủy',
      'RETURNED': 'Trả hàng',
      'REFUNDED': 'Đã hoàn tiền'
    };
    return statusMap[status] || status;
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

  const translateLogStatus = (logText: string): string => {
    const translations: { [key: string]: string } = {
      'Created': 'Đã tạo đơn hàng',
      'Status changed': 'Thay đổi trạng thái',
      'Available': 'Sẵn sàng',
      'Delivering': 'Đang giao hàng',
      'Shipment requested': 'Yêu cầu vận chuyển',
      'InventoryItem': 'Sản phẩm'
    };

    let translatedText = logText;
    Object.entries(translations).forEach(([en, vi]) => {
      translatedText = translatedText.replace(new RegExp(en, 'gi'), vi);
    });

    return translatedText;
  };

  const parseLogsToTimeline = (logs: string): TrackingTimeline[] => {
    const lines = logs.split('\n').filter(line => line.trim());
    return lines.map((line) => {
      const match = line.match(/\[(.*?)\] (.*)/);
      if (match) {
        const [, timestamp, status] = match;
        const translatedStatus = translateLogStatus(status);
        return {
          time: new Date(timestamp).toLocaleDateString('vi-VN'),
          status: translatedStatus,
          isCompleted: true,
          isDelivered: translatedStatus.toLowerCase().includes('giao hàng thành công')
        };
      }
      return {
        time: 'N/A',
        status: translateLogStatus(line),
        isCompleted: true
      };
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text className="text-gray-500 mt-2">Đang tải thông tin tracking...</Text>
      </View>
    );
  }

  if (!orderDetail) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500">Không tìm thấy thông tin tracking</Text>
        <TouchableOpacity
          className="mt-4 bg-orange-500 px-4 py-2 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const timeline = parseLogsToTimeline(orderDetail.logs);
  const shipment = orderDetail.shipments[0]; // Get first shipment

  // Define 3 tracking states
  const trackingStates = [
    { key: 'SHIPPED', label: 'Đã vận chuyển', icon: 'checkmark-circle' },
    { key: 'DELIVERING', label: 'Đang giao hàng', icon: 'bicycle' },
    { key: 'DELIVERED', label: 'Đã giao hàng', icon: 'checkmark-done-circle' }
  ];

  // Determine current progress based on order status
  const getCurrentProgress = () => {
    const status = orderDetail.status;
    if (status === 'DELIVERED') {
      return 3; // All 3 states completed
    } else if (status === 'DELIVERING') {
      return 2; // Only first 2 states completed
    } else {
      return 1; // Only first state completed
    }
  };

  const currentProgress = getCurrentProgress();



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
            <Text className="text-lg font-medium text-gray-900">{translateStatus(orderDetail.status)}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Delivery Status */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <Text className="text-teal-600 font-medium text-base mb-4">
            {shipment ? `Dự kiến giao: ${formatDate(shipment.estimatedDelivery)}` : 'Đang xử lý'}
          </Text>

          {/* Progress Bar */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 flex-row items-center">
              {trackingStates.map((state, index) => (
                <React.Fragment key={state.key}>
                  {/* Progress Circle */}
                  <View className={`w-6 h-6 rounded-full items-center justify-center ${index < currentProgress ? 'bg-teal-500' : 'bg-gray-300'
                    }`}>
                    <Ionicons
                      name={index < currentProgress ? state.icon as any : 'ellipse-outline'}
                      size={16}
                      color="white"
                    />
                  </View>

                  {/* Progress Line */}
                  {index < trackingStates.length - 1 && (
                    <View className={`flex-1 h-0.5 mx-2 ${index < currentProgress - 1 ? 'bg-teal-500' : 'bg-gray-300'
                      }`}></View>
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>

          <View className="flex-row justify-between mb-4">
            {trackingStates.map((state, index) => (
              <Text
                key={state.key}
                className={`text-xs ${index < currentProgress ? 'text-teal-600 font-medium' : 'text-gray-500'}`}
              >
                {state.label}
              </Text>
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: orderDetail.productImages[0] || 'https://via.placeholder.com/60x60' }}
              className="w-16 h-16 rounded-lg mr-3"
            />
            <View className="flex-1">
              <Text className="text-gray-900 font-medium text-base">{orderDetail.productName}</Text>
              <Text className="text-gray-500 text-sm">Số lượng: {orderDetail.quantity}</Text>
              <Text className="text-orange-500 font-semibold">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetail.totalPrice)}
              </Text>
            </View>
            <TouchableOpacity
              className="px-3 py-1 border border-gray-200 rounded-md"
              onPress={handleOrderInfoPress}
            >
              <Text className="text-gray-700 text-sm">Thông tin đơn hàng</Text>
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
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shipment.totalFee)}
              </Text>
            </View>
          </View>
        )}

        {/* Timeline */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <Text className="text-gray-900 font-medium text-base mb-4">Lịch sử vận chuyển</Text>
          <View className="space-y-4">
            {timeline.reverse().map((item, index) => (
              <View key={index} className="flex-row">
                <View className="items-center mr-4">
                  <Text className="text-gray-500 text-xs text-center w-12">
                    {item.time}
                  </Text>
                </View>
                <View className="items-center mr-4">
                  <View className={`w-2 h-2 rounded-full ${item.isCompleted ? 'bg-teal-500' : 'bg-gray-300'}`}></View>
                  {index < timeline.length - 1 && (
                    <View className="w-0.5 h-8 bg-gray-200 mt-1"></View>
                  )}
                </View>
                <View className="flex-1 pb-4">
                  <Text className={`text-sm ${item.isDelivered ? 'text-teal-600 font-medium' : 'text-gray-700'}`}>
                    {item.status}
                  </Text>
                  {item.isDelivered && (
                    <TouchableOpacity>
                      <Text className="text-blue-500 text-sm">Xem hình ảnh giao hàng</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="h-4"></View>
      </ScrollView >
    </View >
  );
}
