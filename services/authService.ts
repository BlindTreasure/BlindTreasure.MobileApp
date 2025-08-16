import { axiosInstance } from "@/api/axiosInstance";
import { LoginResponse, RefreshTokenResponse, User } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_DATA: "userData",
};

class AuthService {
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      console.log("🔍 Login attempt:", {
        email,
        baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
      });

      const response = await axiosInstance.post<LoginResponse>(
        "/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.isSuccess) {
        const { accessToken, refreshToken, user } = response.data.value.data;

        await this.saveTokens(accessToken, refreshToken);
        await this.saveUser(user);

        return { success: true, user };
      }

      return { success: false, error: response.data.value.message };
    } catch (error: any) {
      console.error("❌ Login error:", error);
      console.error("❌ Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
      return {
        success: false,
        error:
          error.response?.data?.value?.message ||
          error.response?.data?.error?.message ||
          "Đăng nhập thất bại",
      };
    }
  }

  async logout(): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      if (accessToken) {
        await axiosInstance.post(
          "/api/auth/logout",
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      await this.clearStorage();
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();

      if (!refreshToken) return false;

      const response = await axiosInstance.post<RefreshTokenResponse>(
        "/api/auth/refresh-token",
        {
          refreshToken,
        }
      );

      if (response.data.isSuccess) {
        const { accessToken, refreshToken: newRefreshToken } =
          response.data.value.data;
        await this.saveTokens(accessToken, newRefreshToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Refresh token error:", error);
      return false;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken();
      const user = await this.getCurrentUser();
      return !!(accessToken && user);
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    }
  }

  private async saveTokens(
    accessToken: string,
    refreshToken: string
  ): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  }

  private async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  private async getAccessToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  private async getRefreshToken(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  async updateProfile(profileData: {
    fullName?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    avatarUrl?: string;
    gender?: boolean;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await axiosInstance.put("/api/me", profileData);

      if (response.data.isSuccess) {
        const updatedUser = response.data.value.data;

        await this.saveUser(updatedUser);

        return { success: true, user: updatedUser };
      }

      return { success: false, error: response.data.value.message };
    } catch (error: any) {
      console.error("Update profile error:", error);
      return {
        success: false,
        error:
          error.response?.data?.value?.message || "Cập nhật thông tin thất bại",
      };
    }
  }

  async getCurrentProfile(): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> {
    try {
      const response = await axiosInstance.get("/api/me");

      if (response.data.isSuccess) {
        const user = response.data.value.data;

        await this.saveUser(user);

        return { success: true, user };
      }

      return { success: false, error: response.data.value.message };
    } catch (error: any) {
      console.error("Get profile error:", error);
      return {
        success: false,
        error: error.response?.data?.value?.message || "Lấy thông tin thất bại",
      };
    }
  }

  private async clearStorage(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
}

export const authService = new AuthService();
