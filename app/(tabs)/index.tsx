import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity } from 'react-native';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default function HomeScreen() {
  const [blindBoxes, setBlindBoxes] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleBlindBoxPress = (blindBoxId: string) => {
    router.push(`/blindbox/${blindBoxId}` as any);
  };

  const handleProductPress = (productId: string) => {
    router.push(`/product/${productId}` as any);
  };

  const handleViewAllBlindBoxes = () => {
    router.push('/blindboxes' as any);
  };

  const handleViewAllProducts = () => {
    router.push('/products' as any);
  };

  const fetchBlindBoxes = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_BASE_URL}/api/blind-boxes`, {
        params: {
          status: 'Approved',
          ...params,
        },
      });

      const result = response?.data?.value?.data?.result;
      if (response.data?.isSuccess && Array.isArray(result)) {
        const sorted = result
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6);
        setBlindBoxes(sorted);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Unknown error';
      setError(message);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products`, {
        params: { status: 'Approved' },
      });

      const result = response?.data?.value?.data?.result || [];
      if (response.data?.isSuccess && Array.isArray(result)) {
        const sorted = result
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6);
        setProducts(sorted);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Unknown error';
      setError(message);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    await Promise.all([fetchBlindBoxes(), fetchProducts()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Loading BlindBoxes...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-red-500 text-center mb-4">Error: {error}</Text>
        <TouchableOpacity onPress={() => fetchBlindBoxes()}>
          <Box className="bg-blue-500 px-6 py-3 rounded-lg">
            <Text className="text-white font-semibold">Retry</Text>
          </Box>
        </TouchableOpacity>
      </Box>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Box className="p-4">
        <Box className="flex-row justify-between items-center mb-4">
          <Heading size="lg" className="text-gray-800">BlindBoxes</Heading>
          <TouchableOpacity onPress={handleViewAllBlindBoxes}>
            <Text className="text-blue-500 font-medium">Xem tất cả</Text>
          </TouchableOpacity>
        </Box>

        {!Array.isArray(blindBoxes) || blindBoxes.length === 0 ? (
          <Text className="text-center text-gray-500 mt-8">No BlindBoxes found</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {blindBoxes.map((item, index) => (
              <TouchableOpacity
                key={item.id || index}
                onPress={() => handleBlindBoxPress(item.id)}
                activeOpacity={0.8}
                style={{ marginRight: 16 }}
              >
                <Box
                  className="bg-white rounded-2xl p-4 items-center w-64 shadow-sm"
                  style={{ elevation: 3 }}
                >
                  <Image
                    source={{ uri: item.imageUrl || 'https://via.placeholder.com/300x200' }}
                    alt={item.name}
                    className="w-40 h-40 rounded-2xl mb-4"
                    resizeMode="contain"
                  />
                  <Text className="font-semibold text-center text-gray-800 mb-2 text-base" numberOfLines={2}>
                    {item.name || 'No name'}
                  </Text>
                  <Text className="text-xl text-red-500">
                    {item.price?.toLocaleString() ?? 'N/A'}₫
                  </Text>
                </Box>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Box className="flex-row justify-between items-center mt-8 mb-4">
          <Heading size="lg" className="text-gray-800">Sản phẩm</Heading>
          <TouchableOpacity onPress={handleViewAllProducts}>
            <Text className="text-blue-500 font-medium">Xem tất cả</Text>
          </TouchableOpacity>
        </Box>

        {products.length === 0 ? (
          <Text className="text-center text-gray-500 mt-8">No Products found</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products.map((item, index) => (
              <TouchableOpacity
                key={item.id || index}
                onPress={() => handleProductPress(item.id)}
                activeOpacity={0.8}
                style={{ marginRight: 16 }}
              >
                <Box className="bg-white rounded-2xl p-4 items-center w-64 shadow-sm" style={{ elevation: 3 }}>
                  <Image
                    source={{ uri: item.imageUrls?.[0] || 'https://via.placeholder.com/300x200' }}
                    alt={item.name}
                    className="w-40 h-40 rounded-2xl mb-4"
                    resizeMode="contain"
                  />

                  <Text className="font-semibold text-center text-gray-800 mb-2 text-base" numberOfLines={2}>
                    {item.name || 'No name'}
                  </Text>
                  <Text className="text-xl text-red-500">
                    {item.price?.toLocaleString() ?? 'N/A'}₫
                  </Text>
                </Box>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </Box>
    </ScrollView>
  );
}
