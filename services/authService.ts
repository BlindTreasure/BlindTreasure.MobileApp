import { axiosInstance } from "@/api/axiosInstance";
import { LoginResponse, RefreshTokenResponse, User } from "@/types/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_DATA: "userData",
};

class AuthService {
  // Login
  async login(
    email: string,
    password: string
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await axiosInstance.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      if (response.data.isSuccess) {
        const { accessToken, refreshToken, user } = response.data.value.data;

        // Save to storage
        await this.saveTokens(accessToken, refreshToken);
        await this.saveUser(user);

        return { success: true, user };
      }

      return { success: false, error: response.data.value.message };
    } catch (error: any) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error.response?.data?.value?.message || "Đăng nhập thất bại",
      };
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();

      if (accessToken) {
        // Call logout API
        await axiosInstance.post(
          "/auth/logout",
          {},
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear storage regardless of API result
      await this.clearStorage();
    }
  }

  // Refresh token
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await this.getRefreshToken();

      if (!refreshToken) return false;

      const response = await axiosInstance.post<RefreshTokenResponse>(
        "/auth/refresh-token",
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

  // Get current user from storage
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  }

  // Check if user is authenticated
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

  // Private methods
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

  private async clearStorage(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
}

export const authService = new AuthService();
