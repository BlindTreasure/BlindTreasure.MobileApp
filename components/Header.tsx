import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export function Header() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [imageError, setImageError] = useState(false);

  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;

  const handleLogout = () => {
    setShowDropdown(false);
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

  const handleProfile = () => {
    setShowDropdown(false);
    router.push('/(tabs)/profile');
  };

  const renderAvatar = () => {
    if (user?.avatarUrl && !imageError) {
      return (
        <Image
          source={{ uri: user.avatarUrl }}
          className="w-10 h-10 rounded-full"
          onError={() => setImageError(true)}
        />
      );
    }

    const firstLetter = user?.fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U';
    return (
      <View className="w-10 h-10 bg-blue-500 rounded-full justify-center items-center">
        <Text className="text-white font-bold text-lg">{firstLetter}</Text>
      </View>
    );
  };

  return (
    <>
      <View
        className="bg-gray-50 px-4 py-2 flex-row justify-between items-center border-b border-gray-200"
        style={{ paddingTop: statusBarHeight + 12 }}
      >
        <Image
          source={require('@/assets/images/Logo.png')}
          className="w-36 h-20"
          resizeMode="contain"
           style={{ marginLeft: -16 }} 
        />

        <TouchableOpacity
          onPress={() => setShowDropdown(true)}
          className="flex-row items-center space-x-2"
        >
          {renderAvatar()}
          {/* <Ionicons name="chevron-down" size={16} color="#6B7280" /> */}
        </TouchableOpacity>
      </View>

      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/20"
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
        >
          <View className="absolute top-20 right-4 bg-white rounded-lg shadow-lg border border-gray-200 min-w-48">    
            <View className="px-4 py-3 border-b border-gray-100">
              <Text className="font-semibold text-gray-800">{user?.fullName || 'User'}</Text>
              <Text className="text-sm text-gray-500">{user?.email}</Text>
            </View>

            <View className="py-2">
              <TouchableOpacity
                onPress={handleProfile}
                className="flex-row items-center px-4 py-3 hover:bg-gray-50"
              >
                <Ionicons name="person-outline" size={20} color="#6B7280" />
                <Text className="ml-3 text-gray-700">Hồ sơ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                className="flex-row items-center px-4 py-3 hover:bg-gray-50"
              >
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                <Text className="ml-3 text-red-500">Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
