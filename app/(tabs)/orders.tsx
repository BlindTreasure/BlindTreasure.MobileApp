// import { Ionicons } from '@expo/vector-icons';
// import { useRouter } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   RefreshControl,
//   ScrollView,
//   StatusBar,
//   Text,
//   TouchableOpacity,
//   View
// } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';

// // Mock data - sẽ thay thế bằng API call
// const mockOrders = [
//   {
//     id: '1',
//     orderCode: 'BT001',
//     status: 'Chờ xác nhận',
//     totalAmount: 2500000,
//     createdAt: '2024-01-15',
//     items: ['BlindBox Mystery A', 'BlindBox Mystery B'],
//   },
//   {
//     id: '2',
//     orderCode: 'BT002',
//     status: 'Chờ lấy hàng',
//     totalAmount: 1800000,
//     createdAt: '2024-01-10',
//     items: ['BlindBox Premium C'],
//   },
//   {
//     id: '3',
//     orderCode: 'BT003',
//     status: 'Chờ giao hàng',
//     totalAmount: 3200000,
//     createdAt: '2024-01-12',
//     items: ['BlindBox Limited D', 'BlindBox Special E'],
//   },
//   {
//     id: '4',
//     orderCode: 'BT004',
//     status: 'Đã giao',
//     totalAmount: 1500000,
//     createdAt: '2024-01-08',
//     items: ['BlindBox Classic F'],
//   },
//   {
//     id: '5',
//     orderCode: 'BT005',
//     status: 'Đã giao',
//     totalAmount: 2200000,
//     createdAt: '2024-01-05',
//     items: ['BlindBox Rare G', 'BlindBox Common H'],
//   },
//   {
//     id: '6',
//     orderCode: 'BT006',
//     status: 'Trả hàng',
//     totalAmount: 1200000,
//     createdAt: '2024-01-03',
//     items: ['BlindBox Defective I'],
//   },
//   {
//     id: '7',
//     orderCode: 'BT007',
//     status: 'Đã hủy',
//     totalAmount: 800000,
//     createdAt: '2024-01-01',
//     items: ['BlindBox Cancelled J'],
//   },
// ];

// const orderTabs = [
//   { key: 'Chờ xác nhận', label: 'Chờ xác nhận', icon: 'receipt-outline' },
//   { key: 'Chờ lấy hàng', label: 'Chờ lấy hàng', icon: 'cube-outline' },
//   { key: 'Chờ giao hàng', label: 'Chờ giao hàng', icon: 'car-outline' },
//   { key: 'Đã giao', label: 'Đã giao', icon: 'checkmark-circle-outline' },
//   { key: 'Trả hàng', label: 'Trả hàng', icon: 'return-up-back-outline' },
//   { key: 'Đã hủy', label: 'Đã hủy', icon: 'close-circle-outline' },
// ];

// export default function OrdersScreen() {
//   const router = useRouter();
//   const [orders, setOrders] = useState(mockOrders);
//   const [refreshing, setRefreshing] = useState(false);
//   const [activeTab, setActiveTab] = useState('Chờ xác nhận');
//   const insets = useSafeAreaInsets();

//   const onRefresh = async () => {
//     setRefreshing(true);
//     // TODO: Call API to refresh orders
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 1000);
//   };

//   const filteredOrders = orders.filter(order => order.status === activeTab);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Chờ xác nhận':
//         return '#FF9500';
//       case 'Chờ lấy hàng':
//         return '#007AFF';
//       case 'Chờ giao hàng':
//         return '#FF6B35';
//       case 'Đã giao':
//         return '#34C759';
//       case 'Trả hàng':
//         return '#FF3B30';
//       case 'Đã hủy':
//         return '#8E8E93';
//       default:
//         return '#8E8E93';
//     }
//   };

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat('vi-VN', {
//       style: 'currency',
//       currency: 'VND',
//     }).format(amount);
//   };

//   return (
//     <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
//       <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

//       {/* Header */}
//       <View className="bg-white px-4 pb-4 border-b border-gray-100">

//         {/* Order status tabs */}
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           className="flex-row"
//         >
//           {orderTabs.map((tab) => (
//             <TouchableOpacity
//               key={tab.key}
//               className="items-center mr-6"
//               onPress={() => setActiveTab(tab.key)}
//             >
//               <Text className={`text-sm pb-2 ${activeTab === tab.key
//                 ? 'text-orange-500 font-medium border-b-2 border-orange-500'
//                 : 'text-gray-600'
//                 }`}>
//                 {tab.label}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       <ScrollView
//         className="flex-1 bg-gray-50"
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       >
//         {/* Orders list */}
//         <View className="p-4">
//           {filteredOrders.length === 0 ? (
//             <View className="items-center justify-center py-20">
//               <View className="w-32 h-32 bg-gray-100 rounded-full justify-center items-center mb-6">
//                 <Text className="text-6xl">📋</Text>
//               </View>
//               <Text className="text-gray-500 text-base text-center mb-8">
//                 Bạn chưa có đơn hàng nào cả
//               </Text>
//             </View>
//           ) : (
//             filteredOrders.map((order) => (
//               <TouchableOpacity
//                 key={order.id}
//                 className="bg-white p-4 rounded-xl mb-3 shadow-sm"
//                 onPress={() => {
//                   // Nếu đơn hàng đã hủy, chuyển đến trang refund
//                   if (order.status === 'Đã hủy') {
//                     router.push(`/order/refund/${order.id}` as any);
//                   }
//                   // Nếu đơn hàng trả hàng, chuyển đến trang return
//                   else if (order.status === 'Trả hàng') {
//                     router.push(`/order/return/${order.id}` as any);
//                   }
//                   else {
//                     router.push(`/order/${order.id}` as any);
//                   }
//                 }}
//               >
//                 <View className="flex-row justify-between items-center mb-2">
//                   <Text className="text-base font-semibold text-gray-900">
//                     #{order.orderCode}
//                   </Text>
//                   <View
//                     className="px-2 py-1 rounded-xl"
//                     style={{ backgroundColor: getStatusColor(order.status) }}
//                   >
//                     <Text className="text-xs font-semibold text-white">
//                       {order.status}
//                     </Text>
//                   </View>
//                 </View>

//                 <Text className="text-sm text-gray-500 mb-1">
//                   Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
//                 </Text>

//                 <Text className="text-sm text-gray-500 mb-3">
//                   Sản phẩm: {order.items.join(', ')}
//                 </Text>

//                 <View className="flex-row justify-between items-center">
//                   <Text className="text-base font-semibold text-orange-600">
//                     {formatCurrency(order.totalAmount)}
//                   </Text>
//                   <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
//                 </View>
//               </TouchableOpacity>
//             ))
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const mockOrders = [
  {
    id: '1',
    shopName: 'L\'Oreal Paris Official Store',
    orderCode: 'BT001',
    status: 'Chờ lấy hàng',
    totalAmount: 144319,
    createdAt: '2024-01-15',
    productImage: 'https://down-vn.img.susercontent.com/file/13c15e38db390...', // ảnh mẫu
    productName: 'Nước tẩy trang giúp làm sạch sâu...',
    quantity: 1,
    originalPrice: 234655,
    discountPrice: 178999,
    expectedDelivery: '12 Th07 - 14 Th07',
  },
  {
    id: '2',
    shopName: 'Kenvue Official Store',
    orderCode: 'BT002',
    status: 'Chờ lấy hàng',
    totalAmount: 86700,
    createdAt: '2024-01-10',
    productImage: 'https://down-vn.img.susercontent.com/file/kenvue-example',
    productName: 'Dầu mát xa dưỡng ẩm Johnson\'s baby...',
    quantity: 1,
    originalPrice: 123000,
    discountPrice: 102000,
    expectedDelivery: '12 Th07 - 14 Th07',
  },
];

export default function OrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState(mockOrders);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Chờ lấy hàng');
  const insets = useSafeAreaInsets();

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredOrders = orders.filter(order => order.status === activeTab);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['right', 'left']}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View className="flex-1">
        <View className="bg-white border-b border-gray-200">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="px-4"
            contentContainerStyle={{ paddingVertical: 12 }}
          >
            {['Chờ xác nhận', 'Chờ lấy hàng', 'Chờ giao hàng', 'Đã giao', 'Trả hàng', 'Đã hủy'].map(status => (
              <TouchableOpacity
                key={status}
                className="mr-6 relative"
                onPress={() => setActiveTab(status)}
              >
                <Text
                  className={`text-sm py-2 ${activeTab === status
                    ? 'text-orange-500 font-medium'
                    : 'text-gray-600'
                    }`}
                >
                  {status}
                </Text>
                {activeTab === status && (
                  <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView
          className="bg-gray-50 flex-1"
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View className="p-4">
            {filteredOrders.length === 0 ? (
              <View className="items-center justify-center py-20">
                <Text className="text-4xl">📋</Text>
                <Text className="text-gray-500 text-base text-center mt-4">
                  Bạn chưa có đơn hàng nào cả
                </Text>
              </View>
            ) : (
              filteredOrders.map(order => (
                <TouchableOpacity
                key={order.id}
                 activeOpacity={0.8}
                onPress={() => {
                  // Nếu đơn hàng đã hủy, chuyển đến trang refund
                  if (order.status === 'Đã hủy') {
                    router.push(`/order/refund/${order.id}` as any);
                  }
                  // Nếu đơn hàng trả hàng, chuyển đến trang return
                  else if (order.status === 'Trả hàng') {
                    router.push(`/order/return/${order.id}` as any);
                  }
                  else {
                    router.push(`/order/${order.id}` as any);
                  }
                }}
              >
                  <View key={order.id} className="bg-white rounded-xl mb-4 p-4 shadow-sm">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-2">
                      <Text className="font-semibold text-sm text-black">{order.shopName}</Text>
                      <Text className="text-sm text-orange-500">{order.status}</Text>
                    </View>

                    {/* Product Info */}
                    <View className="flex-row mb-3">
                      <Image
                        source={{ uri: order.productImage }}
                        className="w-16 h-16 rounded-md mr-3"
                        resizeMode="cover"
                      />
                      <View className="flex-1">
                        {/* Tên sản phẩm và x1 */}
                        <View className="flex-row justify-between items-start">
                          <Text className="text-sm text-gray-800 flex-1 pr-2" numberOfLines={2}>
                            {order.productName}
                          </Text>
                          <Text className="text-sm text-gray-500">x{order.quantity}</Text>
                        </View>

                        {/* Giá gốc và giá sau giảm */}
                        <View className="flex-row mt-1 justify-end space-x-2">
                          <Text className="text-xs text-gray-400 line-through">
                            {formatCurrency(order.originalPrice)}
                          </Text>
                          <Text className="text-sm text-gray-900">
                            {formatCurrency(order.discountPrice)}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Total Amount */}
                    <Text className="text-right text-sm text-gray-800 mb-2">
                      Tổng số tiền (1 sản phẩm):{' '}
                      <Text className="font-semibold">{formatCurrency(order.totalAmount)}</Text>
                    </Text>

                    {/* Delivery Time */}
                    <View className="bg-green-100 px-3 py-2 rounded-md mb-2">
                      <Text className="text-sm text-green-700 font-medium">
                        Thời gian đảm bảo nhận hàng: {order.expectedDelivery}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}