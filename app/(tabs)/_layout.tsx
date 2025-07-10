
import { AuthGuard } from '@/components/AuthGuard';
import { Header } from '@/components/Header';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, usePathname } from 'expo-router';
import { View } from 'react-native';

export default function TabLayout() {
  const pathname = usePathname();
  const showHeader = !pathname.includes('profile');
  return (
    <AuthGuard>
      <View className="flex-1">
        {showHeader && <Header />}
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#d02a2a',
            tabBarInactiveTintColor: '#8E8E93',
            tabBarStyle: {
              backgroundColor: '#FFFFFF',
              borderTopWidth: 1,
              borderTopColor: '#E5E5EA',
              paddingBottom: 20,
              paddingTop: 8,
              height: 80,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: -2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 8,
            },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Trang chủ',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home" size={size} color={color} />
              ),
            }}
          />
          <Tabs.Screen
            name="orders"
            options={{
              title: 'Đơn hàng',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="receipt" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              title: 'Hồ sơ',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="person" size={size} color={color} />
              ),
            }}
          />
        </Tabs>
      </View>
    </AuthGuard>
  );
}
