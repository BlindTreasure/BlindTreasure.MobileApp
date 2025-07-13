import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock data cho đơn hàng trả hàng
const mockReturnOrder = {
  id: '2506160MGMW3A6Q',
  status: 'Hoàn tiền thành công',
  refundAmount: 143000,
  refundMethod: 'Đến Ví của bạn',
  timeline: {
    accepted: '4 Th02 2025',
    processing: '4 Th02 2025',
    completed: 'trước 5 Th02'
  },
  shop: {
    name: 'Thế Giới Skincare Chính Hãng',
    isOfficial: true
  },
  product: {
    name: 'Kem chống nắng Skin1004 chiết xuất rau má cho da dầu, da khô nhạy cảm...',
    quantity: 1,
    image: 'https://via.placeholder.com/80x80/FFE4E1/FF6B35?text=Skincare'
  },
  refundNote: 'Yêu cầu hoàn tiền của bạn đã được Shopee xử lý. Với đơn hoàn tiền về Thẻ tín dụng/ghi nợ, Apple Pay/Google Pay, sẽ cần thêm 7-14 ngày để ngân hàng cập nhật tiền hoàn. Bạn có thể liên hệ ngân hàng để kiểm tra ngày cập nhật cụ thể nhé.'
};

const formatCurrency = (amount: number) => {
  return `đ${amount.toLocaleString('vi-VN')}`;
};

export default function ReturnOrderScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [showDetailExpanded, setShowDetailExpanded] = useState(false);

  const handleViewHistory = () => {
    Alert.alert('Lịch sử chat', 'Xem lịch sử chat với shop');
  };

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-medium text-gray-900">Chi tiết Trả hàng/Hoàn tiền</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Success Status */}
        <View className="bg-green-500 mx-4 mt-4 rounded-lg p-4">
          <Text className="text-white font-bold text-lg text-center">
            {mockReturnOrder.status}
          </Text>
        </View>

        {/* Refund Amount */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="items-center">
            <TouchableOpacity
              className="flex-row items-center mb-2"
              onPress={() => setShowRefundModal(true)}
            >
              <Text className="text-gray-500 text-sm">Chi tiết hoàn tiền</Text>
              <Ionicons name="chevron-forward" size={16} color="#8E8E93" className="ml-1" />
            </TouchableOpacity>
            <Text className="text-gray-900 font-bold text-2xl mb-1">
              {formatCurrency(mockReturnOrder.refundAmount)}
            </Text>
            <Text className="text-gray-500 text-sm">{mockReturnOrder.refundMethod}</Text>
          </View>
        </View>

        {/* Timeline */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="flex-row items-center justify-between mb-6">
            {/* Step 1 */}
            <View className="items-center flex-1">
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                <Image
                  source={require('@/assets/images/favicon.png')}
                  className="w-16 h-16"
                  resizeMode="contain"
                />
              </View>
              <Text className="text-xs text-gray-900 font-medium text-center">Chấp nhận hoàn tiền</Text>
              <Text className="text-xs text-gray-500 text-center">{mockReturnOrder.timeline.accepted}</Text>
            </View>

            {/* Connector 1 */}
            <View className="flex-1 h-0.5 bg-green-500 mx-2"></View>

            {/* Step 2 */}
            <View className="items-center flex-1">
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                <MaterialCommunityIcons name="bank-outline" size={24} color="black" />
              </View>
              <Text className="text-xs text-gray-900 font-medium text-center">Đang hoàn tiền</Text>
              <Text className="text-xs text-gray-500 text-center">{mockReturnOrder.timeline.processing}</Text>
            </View>

            {/* Connector 2 */}
            <View className="flex-1 h-0.5 bg-green-500 mx-2"></View>

            {/* Step 3 */}
            <View className="items-center flex-1">
              <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center mb-2">
                <Ionicons name="wallet-outline" size={24} color="black" />
              </View>
              <Text className="text-xs text-gray-900 font-medium text-center">Đã hoàn tiền</Text>
              <View className="bg-green-500 px-2 py-1 rounded mt-1">
                <Text className="text-white text-xs font-medium">{mockReturnOrder.timeline.completed}</Text>
              </View>
            </View>
          </View>

          {/* Refund Note */}
          <Text className="text-gray-600 text-sm leading-5">
            {mockReturnOrder.refundNote}
          </Text>
        </View>

        {/* Shop Info */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="flex-row items-center mb-3">
            <View className="w-6 h-6 bg-gray-800 rounded items-center justify-center mr-2">
              <Ionicons name="storefront" size={16} color="white" />
            </View>
            <Text className="text-gray-900 font-medium flex-1">{mockReturnOrder.shop.name}</Text>

          </View>

          {/* Product */}
          <View className="flex-row">
            <Image
              source={{ uri: mockReturnOrder.product.image }}
              className="w-16 h-16 rounded-lg mr-3"
            />
            <View className="flex-1">
              <Text className="text-gray-900 text-sm" numberOfLines={2}>
                {mockReturnOrder.product.name}
              </Text>
              <Text className="text-gray-500 text-right mt-2">x{mockReturnOrder.product.quantity}</Text>
            </View>
          </View>

          {showDetailExpanded && (
            <View className="mt-4 pt-4 border-t border-gray-200">
              <View className="space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Tổng tiền hoàn</Text>
                  <TouchableOpacity >
                    <Text className="text-black">đ143.000</Text>
                    <View className='flex flex-row items-center justify-end'>
                      <Text onPress={() => setShowRefundModal(true)} className="text-gray-400 text-sm">Chi tiết</Text>
                      <Ionicons name="chevron-forward" size={14} color="#8E8E93" />
                    </View>
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Hoàn tiền vào</Text>
                  <Text className="text-gray-900">Ví ShopeePay</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Lý do trả hàng/hoàn tiền</Text>
                  <TouchableOpacity>
                    <Text className="text-black">Hàng giả, nhái</Text>
                    <View className='flex flex-row items-center justify-end'>
                      <Text onPress={() => setShowReasonModal(true)} className="text-gray-400 text-sm">Chi tiết</Text>
                      <Ionicons name="chevron-forward" size={14} color="#8E8E93" />
                    </View>
                  </TouchableOpacity>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Đã yêu cầu lúc</Text>
                  <Text className="text-gray-900">11:50 24-01-25</Text>
                </View>

                <View className="flex-row justify-between items-start flex-wrap">
                  <Text className="text-gray-600 flex-1 mr-2">
                    Thời gian chấp nhận trả hàng/hoàn tiền
                  </Text>
                  <Text className="text-gray-900 text-right min-w-[120px]">
                    23:26 04-02-25
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Hoàn tiền vào</Text>
                  <Text className="text-gray-900">23:26 04-02-25</Text>
                </View>

                <View className="flex-row justify-between items-start flex-wrap">
                  <Text className="text-gray-600 flex-1 mr-2">Mã yêu cầu trả hàng/hoàn tiền</Text>
                  <View className="flex-row items-center space-x-2">
                    <Text className="text-gray-900 max-w-[120px]" numberOfLines={1}>25012408ED...</Text>
                    <TouchableOpacity>
                      <Text className="text-black border rounded-md px-2 py-1 text-sm">Sao chép</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          )}
          {/* Show More Button */}
          <TouchableOpacity
            className="items-center mt-4 py-2"
            onPress={() => setShowDetailExpanded(!showDetailExpanded)}
          >
            <View className="flex-row items-center">
              <Text className="text-gray-500 text-sm mr-1">
                {showDetailExpanded ? 'Thu gọn' : 'Xem thêm'}
              </Text>
              <Ionicons
                name={showDetailExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color="#8E8E93"
              />
            </View>
          </TouchableOpacity>

          {/* Expanded Details */}

        </View>

        <View className="h-6"></View>
      </ScrollView>

      {/* Refund Detail Modal */}
      <Modal
        visible={showRefundModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRefundModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl max-h-[80%]">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold">Chi tiết hoàn tiền</Text>
              <TouchableOpacity onPress={() => setShowRefundModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View className="p-4">
              <View className="items-center mb-6">
                <Text className="text-2xl font-bold text-gray-900 mb-1">đ143.000</Text>
                <Text className="text-gray-500">Ví ShopeePay</Text>
              </View>

              <View className="space-y-4">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Giá sản phẩm sau khuyến mãi</Text>
                  <Text className="text-gray-900">đ125.000</Text>
                </View>

                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Phí vận chuyển</Text>
                  <Text className="text-gray-900">đ18.000</Text>
                </View>

                <View className="border-t border-gray-200 pt-4">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-900 font-semibold">Số tiền hoàn nhận được</Text>
                    <Text className="text-gray-900 font-semibold">đ143.000</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* Return Reason Modal */}
      <Modal
        visible={showReasonModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReasonModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl" style={{ maxHeight: '80%' }}>
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold">Lý do Trả hàng/Hoàn tiền</Text>
              <TouchableOpacity onPress={() => setShowReasonModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView className="p-4" style={{ maxHeight: 400 }}>
              <View className="mb-4">
                <Text className="text-gray-900 font-medium mb-2">Lý do</Text>
                <Text className="text-gray-900">Hàng giả, nhái</Text>
              </View>

              <View className="mb-4">
                <Text className="text-gray-900 font-medium mb-2">Mô tả</Text>
                <Text className="text-gray-700 leading-6">
                  Sản phẩm chủ bao bì không rõ, đầu sản phẩm bị méo, chất kem khác với hàng thật tôi mua. Hàng thật kem màu ngà vàng nhẹ đặc và có mùi đặc trưng con hàng này chất kem lỏng màu trắng hoàn toàn và mùi lạ. Tôi muốn vào hỏi kĩ shop vì tôi đã mua ở shopee mall nhưng shopee cũng đã khóa shop này
                </Text>
              </View>

              <View className="mb-4">
                <Text className="text-gray-900 font-medium mb-2">Hình ảnh</Text>
                <View className="flex-row space-x-2">
                  <Image
                    source={{ uri: 'https://via.placeholder.com/80x80' }}
                    className="w-20 h-20 rounded-lg"
                  />
                  <Image
                    source={{ uri: 'https://via.placeholder.com/80x80' }}
                    className="w-20 h-20 rounded-lg"
                  />
                  <Image
                    source={{ uri: 'https://via.placeholder.com/80x80' }}
                    className="w-20 h-20 rounded-lg"
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
