import { AuthWrapper } from '@/components/AuthWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Lỗi', result.error || 'Đăng nhập thất bại');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <View className="flex-1 justify-center px-6">
        <View className="items-center mb-8">
          <View className="items-center justify-center">
            <Image
              source={require('@/assets/images/favicon.png')}
              className="w-32 h-32"
              resizeMode="contain"
            />
          </View>
          <Text className="text-3xl font-bold text-gray-900 mb-2">BlindTreasure</Text>
          <Text className="text-gray-500 text-center">Đăng nhập để tiếp tục</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 font-medium mb-2">Email</Text>
            <View className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex-row items-center">
              <Ionicons name="mail-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-gray-900"
                placeholder="Nhập email của bạn"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View>
            <Text className="text-gray-700 font-medium mb-2">Mật khẩu</Text>
            <View className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex-row items-center">
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-gray-900"
                placeholder="Nhập mật khẩu"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            className={`rounded-xl py-4 items-center mt-6 ${isLoading ? 'bg-gray-400' : 'bg-red-500'
              }`}
          >
            <Text className="text-white font-semibold text-lg">
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function LoginScreen() {
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  );
}
