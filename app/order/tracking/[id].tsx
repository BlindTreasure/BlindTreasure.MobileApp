import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
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

// Mock data cho tracking
const mockTrackingData = {
  status: 'Đã giao hàng',
  deliveryDate: '13 Th07',
  carrier: 'SPX Express',
  trackingCode: 'SPXVN05964394057',
  productImage: 'https://via.placeholder.com/60x60/F0F0F0/999999?text=Product',
  timeline: [
    {
      time: '11 Th07\n17:57',
      status: 'Đơn hàng đã được đặt',
      isCompleted: true
    },
    {
      time: '12 Th07\n08:30',
      status: 'Người gửi đang chuẩn bị hàng',
      isCompleted: true
    },
    {
      time: '12 Th07\n16:47',
      status: 'Đơn vị vận chuyển lấy hàng thành công',
      isCompleted: true
    },
    {
      time: '12 Th07\n18:21',
      status: 'Đơn hàng đã đến bưu cục',
      isCompleted: true
    },
    {
      time: '12 Th07\n18:43',
      status: 'Đơn hàng đã rời bưu cục',
      isCompleted: true
    },
    {
      time: '12 Th07\n19:44',
      status: 'Đơn hàng đã đến bưu cục',
      isCompleted: true
    },
    {
      time: '12 Th07\n19:44',
      status: 'Đơn hàng đã đến kho phân loại Xã Tân Phú Trung, Huyện Củ Chi, TP Hồ Chí Minh',
      isCompleted: true
    },
    {
      time: '12 Th07\n02:27',
      status: 'Đơn hàng đã rời kho phân loại tới HCMCM D9/Phú Hữu Hub',
      isCompleted: true
    },
    {
      time: 'Hôm nay\n06:04',
      status: 'Đơn hàng đã đến trạm giao hàng tại khu vực của bạn Phường Phú Hữu, Thành Phố Thủ Đức, TP Hồ Chí Minh và sẽ được giao trong vòng 24 giờ tiếp theo',
      isCompleted: true
    },
    {
      time: 'Hôm nay\n08:18',
      status: 'Đã sắp xếp tài xế giao hàng',
      isCompleted: true
    },
    {
      time: 'Hôm nay\n08:18',
      status: 'Đơn hàng sẽ sớm được giao, vui lòng chú ý điện thoại',
      isCompleted: true
    },
    {
      time: 'Hôm nay\n12:32',
      status: 'Giao hàng thành công\nXem hình ảnh giao hàng',
      isCompleted: true,
      isDelivered: true
    }
  ]
};

export default function TrackingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [rating, setRating] = useState(0);

  const handleRating = (star: number) => {
    setRating(star);
    Alert.alert('Cảm ơn!', `Bạn đã đánh giá ${star} sao cho tài xế.`);
  };

  const renderStar = (index: number) => {
    return (
      <TouchableOpacity key={index} onPress={() => handleRating(index + 1)}>
        <Ionicons
          name={rating > index ? "star" : "star-outline"}
          size={32}
          color={rating > index ? "#FFD700" : "#D1D5DB"}
        />
      </TouchableOpacity>
    );
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
            <Text className="text-lg font-medium text-gray-900">{mockTrackingData.status}</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Delivery Status */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <Text className="text-teal-600 font-medium text-base mb-4">
            Giao vào {mockTrackingData.deliveryDate}
          </Text>

          {/* Progress Bar */}
          <View className="flex-row items-center mb-6">
            <View className="flex-1 flex-row items-center">
              <View className="w-3 h-3 bg-teal-500 rounded-full"></View>
              <View className="flex-1 h-0.5 bg-teal-500 mx-2"></View>
              <View className="w-3 h-3 bg-teal-500 rounded-full"></View>
              <View className="flex-1 h-0.5 bg-teal-500 mx-2"></View>
              <View className="w-6 h-6 bg-teal-500 rounded-full items-center justify-center">
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
            </View>
          </View>

          <View className="flex-row justify-between mb-4">
            <Text className="text-xs text-gray-500">Đã vận chuyển</Text>
            <Text className="text-xs text-gray-500">Đang giao hàng</Text>
            <Text className="text-xs text-gray-500">Đã giao hàng</Text>
          </View>
        </View>

        {/* Tracking Details */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: mockTrackingData.productImage }}
              className="w-12 h-12 rounded-lg mr-3"
            />
            <View className="flex-1">
              <Text className="text-gray-900 font-medium">{mockTrackingData.carrier}</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-500 text-sm">{mockTrackingData.trackingCode}</Text>
                <TouchableOpacity
                  className="ml-2"
                  onPress={() => Alert.alert('Đã sao chép', 'Mã vận đơn đã được sao chép!')}
                >
                  <Ionicons name="copy-outline" size={16} color="#8E8E93" />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              className="px-3 py-1 border border-gray-200 rounded-md"
              onPress={() => router.push(`/order/${id}`)}
            >
              <Text className="text-gray-700 text-sm">Thông tin đơn hàng</Text>
            </TouchableOpacity>
          </View>

          {/* Timeline */}
          <View className="space-y-4">
            {[...mockTrackingData.timeline].reverse().map((item, index) => (
              <View key={index} className="flex-row">
                <View className="items-center mr-4">
                  <Text className="text-gray-500 text-xs text-center w-12">
                    {item.time}
                  </Text>
                </View>
                <View className="items-center mr-4">
                  <View className={`w-2 h-2 rounded-full ${item.isCompleted ? 'bg-teal-500' : 'bg-gray-300'}`}></View>
                  {index < mockTrackingData.timeline.length - 1 && (
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
      </ScrollView>
    </View>
  );
}
