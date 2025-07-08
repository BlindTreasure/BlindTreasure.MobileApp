// Simple auth types - no namespaces

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Response types
export interface User {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl: string;
  dateOfBirth: string;
  phoneNumber: string;
  roleName: string;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Common API Response
export interface ApiResponse<T = any> {
  isSuccess: boolean;
  isFailure: boolean;
  value: {
    code: number;
    message: string;
    data?: T;
  };
  error?: {
    code: number;
    message: string;
  };
}
