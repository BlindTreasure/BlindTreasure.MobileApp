export interface User {
  userId: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  phoneNumber?: string;
  roleName: string;
  dateOfBirth?: string;
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  isFailure: boolean;
  value: {
    code: string;
    message: string;
    data: {
      accessToken: string;
      refreshToken: string;
      user: User;
    };
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  isSuccess: boolean;
  isFailure: boolean;
  value: {
    code: string;
    message: string;
    data: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}
