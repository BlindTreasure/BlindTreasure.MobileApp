import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "./types";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const apiCall = async <T>(
  url: string,
  options: RequestInit
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    return {
      isSuccess: false,
      isFailure: true,
      value: {
        code: 500,
        message: "Network error",
      },
      error: {
        code: 500,
        message: error instanceof Error ? error.message : "Unknown error",
      },
    };
  }
};

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const authApi = {
  login: async (data: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiCall<LoginResponse>(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  refreshToken: async (
    data: RefreshTokenRequest
  ): Promise<ApiResponse<RefreshTokenResponse>> => {
    return apiCall<RefreshTokenResponse>(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  logout: async (token: string): Promise<ApiResponse<null>> => {
    return apiCall<null>(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: getHeaders(token),
    });
  },
};
