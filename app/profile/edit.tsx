import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
// @ts-ignore
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    avatarUrl: '',
    gender: true
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const result = await authService.getCurrentProfile();
      if (result.success && result.user) {
        setProfile(result.user);
        setFormData({
          fullName: result.user.fullName || '',
          phoneNumber: result.user.phoneNumber || '',
          dateOfBirth: result.user.dateOfBirth || '',
          avatarUrl: result.user.avatarUrl || '',
          gender: (result.user as any).gender ?? true
        });
      } else {
        Alert.alert('Lỗi', result.error || 'Không thể tải thông tin profile');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi tải thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }

    setSaving(true);
    try {
      const result = await authService.updateProfile(formData);
      if (result.success) {
        // Refresh user data in context immediately
        await refreshUser();

        Alert.alert('Thành công', 'Cập nhật thông tin thành công', [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]);
      } else {
        Alert.alert('Lỗi', result.error || 'Cập nhật thông tin thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '0001-01-01T00:00:00') return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoString = selectedDate.toISOString();
      setFormData(prev => ({ ...prev, dateOfBirth: isoString }));
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const getDateForPicker = () => {
    if (formData.dateOfBirth && formData.dateOfBirth !== '0001-01-01T00:00:00') {
      return new Date(formData.dateOfBirth);
    }
    return new Date();
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#FF6B35" />
        <Text className="mt-4 text-gray-600">Đang tải thông tin...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-lg font-medium text-gray-900">Chỉnh sửa thông tin</Text>
          </View>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className={`px-4 py-2 rounded-lg ${saving ? 'bg-gray-300' : 'bg-orange-500'}`}
          >
            {saving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white font-medium">Lưu</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1">
        {/* Avatar Section */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-6 items-center">
          <Image
            source={{
              uri: formData.avatarUrl || 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg'
            }}
            className="w-24 h-24 rounded-full mb-4"
          />
          <TouchableOpacity className="bg-gray-100 px-4 py-2 rounded-lg">
            <Text className="text-gray-700">Thay đổi ảnh đại diện</Text>
          </TouchableOpacity>
        </View>

        {/* Form Section */}
        <View className="bg-white mx-4 mt-4 rounded-lg p-4">
          {/* Full Name */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Họ và tên *</Text>
            <TextInput
              value={formData.fullName}
              onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
              placeholder="Nhập họ và tên"
              className="border border-gray-200 rounded-lg px-3 py-3 text-gray-900"
            />
          </View>

          {/* Phone Number */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Số điện thoại *</Text>
            <TextInput
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNumber: text }))}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
              className="border border-gray-200 rounded-lg px-3 py-3 text-gray-900"
            />
          </View>

          {/* Date of Birth */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Ngày sinh</Text>
            <TouchableOpacity
              className="border border-gray-200 rounded-lg px-3 py-3"
              onPress={showDatePickerModal}
            >
              <View className="flex-row justify-between items-center">
                <Text className={`${formatDate(formData.dateOfBirth) ? 'text-gray-900' : 'text-gray-500'}`}>
                  {formatDate(formData.dateOfBirth) || 'Chọn ngày sinh'}
                </Text>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Gender */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Giới tính</Text>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setFormData(prev => ({ ...prev, gender: true }))}
                className={`flex-1 mr-2 border rounded-lg px-3 py-3 ${formData.gender ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
              >
                <Text className={`text-center ${formData.gender ? 'text-orange-500 font-medium' : 'text-gray-700'}`}>
                  Nam
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setFormData(prev => ({ ...prev, gender: false }))}
                className={`flex-1 ml-2 border rounded-lg px-3 py-3 ${!formData.gender ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                  }`}
              >
                <Text className={`text-center ${!formData.gender ? 'text-orange-500 font-medium' : 'text-gray-700'}`}>
                  Nữ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={getDateForPicker()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}
    </View>
  );
}
