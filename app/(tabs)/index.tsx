import { Box } from '@/components/ui/box';
import { Card } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Image } from '@/components/ui/image';
import React from 'react';
import { ScrollView, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Box className="bg-blue-500 p-5 pt-16 items-center">
        <Text className="text-3xl font-bold text-white mb-2">BlindTreasure</Text>
        <Text className="text-base text-blue-100">Chào mừng bạn đến với ứng dụng</Text>
      </Box>

      <Box className="items-center mt-4">
        <Card size="md" variant="outline" className="w-72">
          <Box className="p-0">
            <Image
              source={{ uri: 'https://via.placeholder.com/300x200' }}
              alt="Product image"
              className="w-full h-40 rounded-t-md"
              resizeMode="cover"
            />
          </Box>

          <Box className="p-4">
            <Heading size="md" className="mb-1 text-base font-semibold">
              Sản phẩm ABC
            </Heading>
            <Text className="text-sm text-gray-600">Giá: 199.000₫</Text>
          </Box>
        </Card>
      </Box>
    </ScrollView>
  );
}
