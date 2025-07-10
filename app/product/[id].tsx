import { Image } from '@/components/ui/image';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface ProductDetail {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  stock: number;
  productStockStatus: string;
  height: number;
  material: string;
  productType: string;
  brand: string;
  status: string;
  imageUrls: string[];
  sellerId: string;
  isDeleted: boolean;
  createdAt: string;
}

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;

  const fetchProductDetail = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/products/${id}`);

      if (response.data?.isSuccess && response.data?.value?.data) {
        setProduct(response.data.value.data);
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
    fetchProductDetail();
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
          onPress={fetchProductDetail}
          className="bg-blue-500 px-6 py-3 rounded-lg mt-4"
        >
          <Text className="text-white font-semibold">Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!product) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-500">Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View
        className="bg-white px-4 py-3 flex-row items-center shadow-sm"
        style={{ paddingTop: statusBarHeight + 12 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-3 p-2 -ml-2 rounded-full"
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800 flex-1">Chi tiết sản phẩm</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-white mx-2 mt-4 rounded-3xl shadow-sm overflow-hidden">
          <View className="items-center bg-gray-50 p-2">
            <Image
              source={{ uri: product.imageUrls?.[currentImageIndex] || 'https://via.placeholder.com/300x300' }}
              alt={product.name}
              className="w-full h-64 rounded-2xl"
              resizeMode="cover"
            />
          </View>
        </View>

        {product.imageUrls?.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-3 px-5"
          >
            {product.imageUrls.map((imgUrl, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setCurrentImageIndex(idx)}
                className="mr-3"
              >
                <Image
                  source={{ uri: imgUrl }}
                  alt={`Thumbnail ${idx + 1}`}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 12,
                    borderWidth: currentImageIndex === idx ? 2 : 1,
                    borderColor: currentImageIndex === idx ? '#3B82F6' : '#E5E7EB',
                  }}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View className="bg-white mx-4 mt-4 rounded-3xl shadow-sm p-6">
          <Text className="text-2xl font-bold text-gray-900 mb-3">{product.name}</Text>
          <View className="bg-red-50 px-4 py-3 rounded-2xl mb-4">
            <Text className="text-2xl font-bold text-red-600 text-center">
              {product.price?.toLocaleString()}₫
            </Text>
          </View>

          <View className="bg-gray-50 p-4 rounded-2xl mb-4">
            <Text className="text-gray-700 font-medium mb-2">Mô tả sản phẩm:</Text>

            <Text className="text-gray-600 leading-6">
              {showFullDescription || product.description.length <= 160
                ? product.description
                : `${product.description.slice(0, 160)}... `}

              {product.description.length > 160 && (
                <TouchableOpacity onPress={() => setShowFullDescription(!showFullDescription)}>
                  <Text className="text-blue-500 font-medium">
                    {showFullDescription ? ' Thu gọn' : ' Xem thêm'}
                  </Text>
                </TouchableOpacity>
              )}
            </Text>
          </View>

          <View className="space-y-3 mb-6">
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600 font-medium">Thương hiệu:</Text>
              <Text className="text-gray-800 font-semibold">{product.brand || 'N/A'}</Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600 font-medium">Chiều cao:</Text>
              <Text className="text-sm font-medium">{product.height}cm</Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600 font-medium">Chất liệu:</Text>
              <View className="bg-green-100 px-3 py-1 rounded-full">
                <Text className="text-sm font-medium">{product.material}</Text>
              </View>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-600 font-medium">Còn lại:</Text>
              <Text className="text-gray-800 font-semibold">{product.stock || 0} sản phẩm</Text>
            </View>
          </View>

          <View className="border-t border-gray-200 pt-4">
            <Text className="text-gray-400 text-sm">
              Ngày tạo: {new Date(product.createdAt).toLocaleDateString('vi-VN')}
            </Text>

          </View>
        </View>
      </ScrollView>
    </View>
  );
}
