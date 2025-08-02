
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;

  React.useEffect(() => {
    setImageError(false);
    setImageLoading(true);
  }, [user?.avatarUrl]);

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            await logout();
          }
        }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View
        className="bg-white px-4 py-3 border-b border-gray-200"
        style={{ paddingTop: statusBarHeight + 12 }}
      >
        <View className="flex-row justify-between items-center">
          <Text className="text-xl font-bold text-gray-800">Hồ sơ</Text>
          <TouchableOpacity
            onPress={() => router.push('/profile/edit' as any)}
            className="flex-row items-center"
          >
            <Ionicons name="create-outline" size={20} color="#FF6B35" />
            <Text className="text-orange-500 font-medium ml-1">Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1 p-6"
        contentContainerStyle={{ paddingBottom: 30, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mb-8">
          <View className="w-32 h-32 rounded-full overflow-hidden mb-4">
            {user?.avatarUrl && !imageError ? (
              <>
                <Image
                  source={{ uri: user.avatarUrl }}
                  style={{ width: '100%', height: '100%' }}
                  onError={() => {
                    setImageError(true);
                    setImageLoading(false);
                  }}
                  onLoad={() => setImageLoading(false)}
                />
                {imageLoading && (
                  <View className="absolute inset-0 bg-gray-200 items-center justify-center">
                    <Text className="text-gray-500 text-sm">...</Text>
                  </View>
                )}
              </>
            ) : (
              <View className="w-full h-full bg-blue-500 items-center justify-center">
                <Text className="text-white font-bold text-4xl">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
            )}
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {user?.fullName || 'Người dùng'}
          </Text>
        </View>

        <View className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Thông tin cá nhân</Text>
          <View className="flex-row items-center py-3 border-b border-gray-100">
            <AntDesign name="user" size={20} color="#6B7280" />
            <View className="ml-4 flex-1">
              <Text className="text-sm text-gray-500 mb-1">Họ và tên</Text>
              <Text className="text-gray-900 font-medium">
                {user?.fullName}
              </Text>
            </View>
          </View>

          <View className="space-y-4">
            <View className="flex-row items-center py-3 border-b border-gray-100">
              <Ionicons name="mail-outline" size={20} color="#6B7280" />
              <View className="ml-4 flex-1">
                <Text className="text-sm text-gray-500 mb-1">Email</Text>
                <Text className="text-gray-900 font-medium">
                  {user?.email || 'Chưa có email'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center py-3 border-b border-gray-100">
              <Ionicons name="call-outline" size={20} color="#6B7280" />
              <View className="ml-4 flex-1">
                <Text className="text-sm text-gray-500 mb-1">Số điện thoại</Text>
                <Text className="text-gray-900 font-medium">
                  {user?.phoneNumber || 'Chưa có số điện thoại'}
                </Text>
              </View>
            </View>

            {user?.dateOfBirth && (
              <View className="flex-row items-center py-3 border-b border-gray-100">
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                <View className="ml-4 flex-1">
                  <Text className="text-sm text-gray-500 mb-1">Ngày sinh</Text>
                  <Text className="text-gray-900 font-medium">
                    {new Date(user.dateOfBirth).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              </View>
            )}

            <View className="flex-row items-center py-3">
              <Ionicons name="time-outline" size={20} color="#6B7280" />
              <View className="ml-4 flex-1">
                <Text className="text-sm text-gray-500 mb-1">Ngày tham gia</Text>
                <Text className="text-gray-900 font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-red-50 border border-red-200 p-4 rounded-xl flex-row items-center justify-center mt-4"
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text className="text-lg font-semibold text-red-500 ml-3">
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}


