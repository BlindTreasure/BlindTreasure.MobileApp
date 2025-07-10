import { AuthSplashScreen } from '@/components/AuthSplashScreen';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import React from 'react';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, isLoading, isInitializing } = useAuth();

  // Auto navigate if user is authenticated after initialization
  React.useEffect(() => {
    if (!isInitializing && !isLoading && user) {
      router.replace('/(tabs)');
    }
  }, [isInitializing, isLoading, user]);

  // Show splash screen while initializing
  if (isInitializing) {
    return <AuthSplashScreen />;
  }

  // Show children (login form, etc.)
  return <>{children}</>;
}
