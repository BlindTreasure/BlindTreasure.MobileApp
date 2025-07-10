import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export function AuthSplashScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-gray-50">
      <View className="items-center mb-12">
        <View className="w-20 h-20 bg-blue-500 rounded-full justify-center items-center mb-4">
          <Text className="text-white text-3xl font-bold">BT</Text>
        </View>
        <Text className="text-2xl font-bold text-gray-800">BlindTreasure</Text>
      </View>

      <ActivityIndicator size="large" color="#3B82F6" className="mb-4" />
      <Text className="text-base text-gray-500">Đang khởi tạo...</Text>
    </View>
  );
}
