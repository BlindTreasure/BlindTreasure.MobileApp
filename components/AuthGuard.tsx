import { useAuth } from '@/contexts/AuthContext';
import { Redirect, router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Force re-render when auth state changes
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <View className="bg-white rounded-xl p-8 items-center shadow-sm">
          <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mb-4">
            <Text className="text-white font-bold text-lg">BT</Text>
          </View>
          <Text className="text-gray-900 font-semibold text-lg mb-2">BlindTreasure</Text>
          <Text className="text-gray-500">Đang tải...</Text>
        </View>
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return <>{children}</>;
}