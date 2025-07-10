import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth();
  const [shouldRedirect, setShouldRedirect] = React.useState(false);

  // Wait a bit after loading completes before redirecting
  React.useEffect(() => {
    if (!isLoading && !user) {
      const timer = setTimeout(() => {
        setShouldRedirect(true);
      }, 100);

      return () => clearTimeout(timer);
    } else if (user) {
      setShouldRedirect(false);
    }
  }, [isLoading, user]);

  // Handle redirect
  React.useEffect(() => {
    if (shouldRedirect) {
      router.replace('/login');
    }
  }, [shouldRedirect]);

  // Show loading while auth is being checked or while waiting for redirect decision
  if (isLoading || (!user && !shouldRedirect)) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-600">Đang tải...</Text>
      </View>
    );
  }

  // Show content if user exists
  if (user) {
    return <>{children}</>;
  }

  // Show loading while redirecting
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#3B82F6" />
      <Text className="mt-2 text-gray-600">Đang chuyển hướng...</Text>
    </View>
  );
}
