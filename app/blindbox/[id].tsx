import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { rarityLabelMap } from '@/constants/enumTranslations';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface BlindBoxDetail {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  totalQuantity: number;
  blindBoxStockStatus: string;
  imageUrl: string;
  releaseDate: string;
  createdAt: string;
  status: string;
  hasSecretItem: boolean;
  secretProbability: number;
  items: BlindBoxItem[];
  isDeleted: boolean;
  rejectReason?: string;
}

interface BlindBoxItem {
  productId: string;
  productName: string;
  quantity: number;
  dropRate: number;
  rarity: string;
  imageUrl: string;
}

export default function BlindBoxDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [blindBox, setBlindBox] = useState<BlindBoxDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;

  const fetchBlindBoxDetail = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/blind-boxes/${id}`);

      if (response.data?.isSuccess && response.data?.value?.data) {
        setBlindBox(response.data.value.data);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlindBoxDetail();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-600">Đang tải...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="text-red-500 text-center mt-4 text-lg font-semibold">Lỗi</Text>
        <Text className="text-gray-600 text-center mt-2">{error}</Text>
        <TouchableOpacity
          onPress={fetchBlindBoxDetail}
          className="bg-blue-500 px-6 py-3 rounded-lg mt-4"
        >
          <Text className="text-white font-semibold">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!blindBox) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500">Không tìm thấy BlindBox</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View
        className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center"
        style={{ paddingTop: statusBarHeight + 12 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 flex-1">Chi tiết BlindBox</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Card className="m-4">
          <Image
            source={{ uri: blindBox.imageUrl || 'https://via.placeholder.com/400x300' }}
            alt={blindBox.name}
            className="w-full h-64 rounded-t-lg"
            resizeMode="cover"
          />
          <Box className="p-6">
            <View className="flex flex-row justify-between items-start mb-4">
              <View className="flex-1 pr-2">
                <TouchableOpacity
                  onPress={() => Alert.alert("Tên Blindbox", blindBox.name)}
                >
                  <Heading
                    size="xl"
                    className="text-gray-800"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {blindBox.name}
                  </Heading>
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center">
                <Text className="text-2xl font-bold text-red-600">
                  {blindBox.price?.toLocaleString() || 'N/A'}₫
                </Text>
              </View>
            </View>

            <View className="flex flex-row gap-2">
              <Text className="text-gray-600 font-medium mb-2">Mô tả:</Text>
              <TouchableOpacity
                onPress={() => Alert.alert("Tên sản phẩm", blindBox.description || "Không có mô tả")}
              >
                <Text
                  className="text-gray-800 leading-6 flex-1"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {blindBox.description || "Không có mô tả"}
                </Text>
              </TouchableOpacity>
            </View>

            <View className="border-b border-gray-200">
              <Text className="text-gray-600 text-sm">
                Ngày phát hành: {new Date(blindBox.releaseDate).toLocaleDateString('vi-VN')}
              </Text>
              <Text className="text-gray-500 text-sm mt-1">

              </Text>
            </View>
            <View className="mt-6">
              <Text className="text-lg font-semibold text-gray-800 mb-4">Danh sách phần thưởng</Text>

              {blindBox.items.length === 0 ? (
                <Text className="text-gray-500">Không có sản phẩm trong blindbox này.</Text>
              ) : (
                blindBox.items.map((item) => {
                  const rarityKey = item.rarity?.toUpperCase() || '';
                  const rarityInfo = rarityLabelMap[rarityKey];

                  return (
                    <View
                      key={item.productId}
                      className="flex-row items-center mb-4 p-3 border border-gray-200 rounded-lg"
                    >
                      <Image
                        source={{ uri: item.imageUrl || 'https://via.placeholder.com/80x80' }}
                        alt={item.productName}
                        className="w-20 h-20 rounded-lg mr-4"
                        resizeMode="cover"
                      />

                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-800">{item.productName}</Text>

                        <Text className="text-sm mt-1 text-gray-600">
                          Độ hiếm:{' '}
                          <Text style={{ color: rarityInfo?.color || '#6B7280', fontWeight: '600' }}>
                            {rarityInfo?.label || 'Không rõ'}
                          </Text>
                        </Text>

                        <Text className="text-sm text-gray-600 mt-1">
                          Tỉ lệ rơi: {item.dropRate}%
                        </Text>
                      </View>
                    </View>
                  );
                })
              )}
            </View>
          </Box>
        </Card>
      </ScrollView>
    </View>
  );
}
