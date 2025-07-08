import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApi } from "./api-services";
import { User } from "./types";

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_DATA: "userData",
} as const;

// Helper function to save auth data to storage
const saveAuthData = async (
  accessToken: string,
  refreshToken: string,
  userData: User
) => {
  try {
    // Save to AsyncStorage (mobile)
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(userData)
    );

    // Save to localStorage (web)
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    }
  } catch (error) {
    console.error("Error saving auth data:", error);
    throw error;
  }
};

// Helper function to get auth data from storage
const getAuthData = async (): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
  userData: User | null;
}> => {
  try {
    let accessToken, refreshToken, userData;

    // Try localStorage first (web), then AsyncStorage (mobile)
    if (typeof window !== "undefined" && window.localStorage) {
      accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    } else {
      accessToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
      userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    }

    return {
      accessToken,
      refreshToken,
      userData: userData ? JSON.parse(userData) : null,
    };
  } catch (error) {
    console.error("Error getting auth data:", error);
    return {
      accessToken: null,
      refreshToken: null,
      userData: null,
    };
  }
};

// Helper function to clear auth data from storage
const clearAuthData = async () => {
  try {
    // Clear from AsyncStorage (mobile)
    await AsyncStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);

    // Clear from localStorage (web)
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    }
  } catch (error) {
    console.error("Error clearing auth data:", error);
    throw error;
  }
};

export const authServices = {
  // Login service
  login: async (
    email: string,
    password: string
  ): Promise<{
    success: boolean;
    user?: User;
    error?: string;
  }> => {
    try {
      const response = await authApi.login({ email, password });

      if (response.isSuccess && response.value.data) {
        const { accessToken, refreshToken, user } = response.value.data;
        await saveAuthData(accessToken, refreshToken, user);
        return { success: true, user };
      }

      return {
        success: false,
        error: response.value.message || "Login failed",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // Refresh token service
  refreshToken: async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const { refreshToken } = await getAuthData();

      if (!refreshToken) {
        return { success: false, error: "No refresh token found" };
      }

      const response = await authApi.refreshToken({ refreshToken });

      if (response.isSuccess && response.value.data) {
        const { accessToken, refreshToken: newRefreshToken } =
          response.value.data;
        const { userData } = await getAuthData();

        if (userData) {
          await saveAuthData(accessToken, newRefreshToken, userData);
          return { success: true };
        }
      }

      return {
        success: false,
        error: response.value.message || "Token refresh failed",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // Logout service
  logout: async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const { accessToken } = await getAuthData();

      // Call logout API if token exists
      if (accessToken) {
        await authApi.logout(accessToken);
      }

      // Clear local storage regardless of API response
      await clearAuthData();

      return { success: true };
    } catch (error) {
      // Still clear local storage even if API call fails
      try {
        await clearAuthData();
      } catch (clearError) {
        console.error("Error clearing auth data during logout:", clearError);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // Get current auth state
  getAuthState: async (): Promise<{
    isAuthenticated: boolean;
    user: User | null;
    accessToken: string | null;
  }> => {
    try {
      const { accessToken, userData } = await getAuthData();

      return {
        isAuthenticated: !!(accessToken && userData),
        user: userData,
        accessToken,
      };
    } catch (error) {
      console.error("Error getting auth state:", error);
      return {
        isAuthenticated: false,
        user: null,
        accessToken: null,
      };
    }
  },
};
