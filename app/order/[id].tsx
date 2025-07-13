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

// Mock data cho chi tiết đơn hàng
const mockOrderDetail = {
  id: '1',
  orderCode: '2507T1U2R66WER',
  status: 'Đã giao',
  deliveryDate: '13 Th07',
  deliveryTime: '13-07-2025 12:32',
  trackingCode: 'SPXVN05964394057',
  customerName: 'Nguyễn Thị Hồng Hanh',
  customerPhone: '(+84) 987 570 351',
  customerAddress: 'Gần Bách Hoa Mỹ Lệ, Bụng Ông Thoàn, P...',
  fullAddress: 'Số 123, Đường Lê Văn Việt, Phường Tăng Nhơn Phú A, Quận 9, TP. Hồ Chí Minh',
  shop: {
    name: "YUMI'S MOM SHOP",
    logo: 'https://via.placeholder.com/40x40/FF3B30/FFFFFF?text=H'
  },
  product: {
    name: 'Tinh Chất Rau Má Hỗ Trợ Giảm Và ...',
    volume: '30ml',
    quantity: 1,
    originalPrice: 180000,
    salePrice: 129000,
    image: 'https://via.placeholder.com/80x80/F0F0F0/999999?text=Product'
  },
  totalAmount: 112230,
  paymentMethod: 'TK Ngân hàng liên kết ShopeePay',
  shippingFee: 12800,
  shippingDiscount: 12800,
  shopeeVoucher: 16770,
  orderTime: '11-07-2025 17:57',
  paymentTime: '11-07-2025 17:58',
  pickupTime: '12-07-2025 16:47',
  voucherInfo: 'Giao nhanh đúng hẹn: nhận Voucher đ15.000 nếu đơn hàng được giao đến bạn sau ngày 14-07-2025. Voucher sẽ được gửi vào tài khoản của bạn trong vòng 24h sau khi đơn hàng được giao thành công.'
};

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // State cho các expand
  const [showFullVoucherInfo, setShowFullVoucherInfo] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [isDetailVisible, setIsDetailVisible] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const handleToggleVoucherInfo = () => {
    setShowFullVoucherInfo(!showFullVoucherInfo);
  };

  const handleToggleOrderDetails = () => {
    setShowOrderDetails(!showOrderDetails);
  };

  const handleToggleAddress = () => {
    setShowFullAddress(!showFullAddress);
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
        { text: 'Đã nhận', onPress: () => Alert.alert('Cảm ơn!', 'Cảm ơn bạn đã xác nhận nhận hàng!') }
      ]
    );
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
          <Text className="text-lg font-medium text-gray-900">Thông tin đơn hàng</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Delivery Status */}
        <View className="bg-teal-500 mx-4 mt-4 rounded-lg p-4">
          <Text className="text-white font-medium text-base">
            Giao hàng thành công vào {mockOrderDetail.deliveryDate}
          </Text>
        </View>

        {/* Delivery Info */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <TouchableOpacity
            className="flex-row items-center justify-between py-3 border-t border-gray-100"
            onPress={() => router.push(`/order/tracking/${id}`)}
          >
            <View>
              <Text className="text-gray-900 font-medium">Thông tin vận chuyển</Text>
              <Text className="text-gray-500 text-sm">SPX Express: {mockOrderDetail.trackingCode}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <View className="flex-row items-center py-3 border-t border-gray-100">
            <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3">
              <Ionicons name="checkmark" size={16} color="#34C759" />
            </View>
            <View>
              <Text className="text-teal-600 font-medium">Giao hàng thành công</Text>
              <Text className="text-gray-500 text-sm">{mockOrderDetail.deliveryTime}</Text>
            </View>
          </View>
        </View>

        {/* Customer Address */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <Text className="text-gray-900 font-medium mb-3">Địa chỉ nhận hàng</Text>
          <View className="flex-row items-start">
            <Ionicons name="location-outline" size={20} color="#8E8E93" className="mr-3 mt-1" />
            <View className="flex-1">
              <Text className="text-gray-900 font-medium">{mockOrderDetail.customerName}</Text>
              <Text className="text-gray-500 text-sm">{mockOrderDetail.customerPhone}</Text>
              <Text className="text-gray-500 text-sm">
                {showFullAddress ? mockOrderDetail.fullAddress : mockOrderDetail.customerAddress}
              </Text>
              <TouchableOpacity onPress={handleToggleAddress}>
                <Text className="text-blue-500 text-sm mt-1">
                  {showFullAddress ? 'Thu gọn' : 'Xem thêm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Shop and Product */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="flex-row items-center mb-4">
            <View className="bg-red-500 px-2 py-1 rounded">
              <Text className="text-white text-xs font-bold">Mall</Text>
            </View>
            <Text className="text-gray-900 font-medium ml-2">{mockOrderDetail.shop.name}</Text>
            </View>

          <View className="flex-row">
            <Image
              source={{ uri: mockOrderDetail.product.image }}
              className="w-20 h-20 rounded-lg mr-3"
            />
            <View className="flex-1">
              <Text className="text-gray-900 font-medium mb-1" numberOfLines={2}>
                {mockOrderDetail.product.name}
              </Text>
              <Text className="text-gray-500 text-sm mb-2">{mockOrderDetail.product.volume}</Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-gray-400 text-sm line-through mr-2">
                    {formatCurrency(mockOrderDetail.product.originalPrice)}
                  </Text>
                  <Text className="text-gray-900 font-medium">
                    {formatCurrency(mockOrderDetail.product.salePrice)}
                  </Text>
                </View>
                <Text className="text-gray-500">x{mockOrderDetail.product.quantity}</Text>
              </View>
            </View>
          </View>

          <View className="border-t border-gray-200 pt-3 mt-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-900 font-bold">Thành tiền:</Text>
              <View className="flex-row items-center">
                <Text className="text-gray-900 font-bold text-lg">
                  {formatCurrency(mockOrderDetail.totalAmount)}
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
          </View>

          {isDetailVisible && (
            <>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Tổng tiền hàng</Text>
                <Text className="text-gray-900">{formatCurrency(mockOrderDetail.product.salePrice)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Phí vận chuyển</Text>
                <Text className="text-gray-900">{formatCurrency(mockOrderDetail.shippingFee)}</Text>
              </View>
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Text className="text-gray-500">Ưu đãi phí vận chuyển</Text>
                  <View className="w-4 h-4 bg-gray-300 rounded-full ml-1 items-center justify-center">
                    <Text className="text-white text-xs">i</Text>
                  </View>
                </View>
                <Text className="text-red-500">-{formatCurrency(mockOrderDetail.shippingDiscount)}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-500">Shopee Voucher</Text>
                <Text className="text-red-500">-{formatCurrency(mockOrderDetail.shopeeVoucher)}</Text>
              </View>
            </>
          )}
        </View>

        {/* Order Info */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-900 font-medium">Mã đơn hàng</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-900 mr-2">{mockOrderDetail.orderCode}</Text>
              <TouchableOpacity
                className="bg-gray-100 px-2 py-1 rounded"
                onPress={() => Alert.alert('Đã sao chép', 'Mã đơn hàng đã được sao chép!')}
              >
                <Text className="text-gray-700 text-xs">SAO CHÉP</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-500">Phương thức thanh toán</Text>
            <View className="flex-row items-center">
              <Text className="text-gray-900 mr-1">{mockOrderDetail.paymentMethod}</Text>

            </View>
          </View>

          {showOrderDetails && (
            <View className="border-t border-gray-100 pt-3 mt-3">
              <View className="space-y-3">
                {/* Thông tin thời gian */}
                <View className="border-t border-gray-100 pt-3 mt-3">
                  <View className="space-y-2">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-500">Thời gian đặt hàng</Text>
                      <Text className="text-gray-900">{mockOrderDetail.orderTime}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-500">Thời gian thanh toán</Text>
                      <Text className="text-gray-900">{mockOrderDetail.paymentTime}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-500">Thời gian đơn vị vận chuyển lấy hàng</Text>
                      <Text className="text-gray-900">{mockOrderDetail.pickupTime}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {!showOrderDetails && (
            <TouchableOpacity className="items-center py-3" onPress={handleToggleOrderDetails}>
              <View className="flex-row items-center">
                <Text className="text-blue-500">Xem chi tiết</Text>
                <Ionicons name="chevron-down" size={16} color="#3B82F6" className="ml-1" />
              </View>
            </TouchableOpacity>
          )}

          {showOrderDetails && (
            <TouchableOpacity className="items-center py-3" onPress={handleToggleOrderDetails}>
              <View className="flex-row items-center">
                <Text className="text-blue-500">Rút gọn</Text>
                <Ionicons name="chevron-up" size={16} color="#3B82F6" className="ml-1" />
              </View>
            </TouchableOpacity>
          )}
        </View>



      </ScrollView>

      {/* Bottom Actions */}
      <View className="bg-white border-t border-gray-100 px-4 py-3 mb-8">
        <View className="flex-row space-x-3">
          <TouchableOpacity
            className="flex-1 bg-[#d02a2a] rounded-lg py-3"
            onPress={handleConfirmReceived}
          >
            <Text className="text-center text-white font-medium">
              Đã nhận được hàng
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}