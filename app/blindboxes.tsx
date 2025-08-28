import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface BlindBox {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  createdAt: string;
  status: string;
}

export default function BlindBoxesScreen() {
  const insets = useSafeAreaInsets();
  const [blindBoxes, setBlindBoxes] = useState<BlindBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const handleBlindBoxPress = (blindBoxId: string) => {
    router.push(`/blindbox/${blindBoxId}` as any);
  };

  const fetchBlindBoxes = async (pageNum = 1, isRefresh = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
        setError(null);
      }

      const response = await axios.get(`${API_BASE_URL}/api/blind-boxes`, {
        params: {
          status: 'Approved',
          page: pageNum,
          pageSize: 20,
        },
      });

      const result = response?.data?.value?.data?.result;
      if (response.data?.isSuccess && Array.isArray(result)) {
        const sortedData = result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        if (isRefresh || pageNum === 1) {
          setBlindBoxes(sortedData);
        } else {
          setBlindBoxes(prev => [...prev, ...sortedData]);
        }

        setHasMore(result.length === 20);
        setPage(pageNum);
      } else {
        throw new Error('Invalid response structure');
      }
    } catch (err: any) {
      const message = err.response?.data?.message || err.message || 'Unknown error';
      setError(message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBlindBoxes(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchBlindBoxes(page + 1);
    }
  };

  useEffect(() => {
    fetchBlindBoxes();
  }, []);

  const renderBlindBox = ({ item }: { item: BlindBox }) => (
    <TouchableOpacity
      onPress={() => handleBlindBoxPress(item.id)}
      activeOpacity={0.8}
      style={{ flex: 1, margin: 8, maxWidth: '50%' }}
    >
      <Box className="bg-white rounded-2xl p-4 items-center shadow-sm" style={{ elevation: 3 }}>
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/300x200' }}
          alt={item.name}
          className="w-full h-40 rounded-2xl mb-3"
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={() => Alert.alert("Tên sản phẩm", item.name || "No name")}
        >
          <Text
            className="font-semibold text-center text-gray-800 mb-2 text-base"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name || "No name"}
          </Text>
        </TouchableOpacity>
        <Text className="text-lg text-red-500 font-bold">
          {item.price?.toLocaleString() ?? 'N/A'}₫
        </Text>
      </Box>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loading || page === 1) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  };

  const renderEmpty = () => (
    <View className="flex-1 justify-center items-center py-20">
      <Text className="text-gray-500 text-center">Không tìm thấy BlindBox nào</Text>
    </View>
  );

  if (loading && page === 1) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600">Đang tải BlindBoxes...</Text>
      </View>
    );
  }

  if (error && blindBoxes.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Text className="text-red-500 text-center mb-4">Lỗi: {error}</Text>
        <TouchableOpacity onPress={() => fetchBlindBoxes()}>
          <Box className="bg-blue-500 px-6 py-3 rounded-lg">
            <Text className="text-white font-semibold">Thử lại</Text>
          </Box>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Heading size="lg" className="text-gray-900">Tất cả BlindBoxes</Heading>
        </View>
      </View>

      <FlatList
        data={blindBoxes}
        renderItem={renderBlindBox}
        keyExtractor={(item) => item.id}
        numColumns={2}
        key={2}
        columnWrapperStyle={{ flexDirection: 'row' }}
        contentContainerStyle={{ padding: 8 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
