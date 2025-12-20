import apiClient from './apiClient';
import { User } from '../../types';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
  fullName: string;
}

export interface RefreshTokenResponse {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  email: string;
  username: string;
}

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh');
    return response.data;
  },

  forgotPassword: async (request: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post('/auth/forgot-password', request);
  },

  resetPassword: async (request: ResetPasswordRequest): Promise<void> => {
    await apiClient.post('/auth/reset-password', request);
  },

  validateResetToken: async (token: string): Promise<boolean> => {
    try {
      await apiClient.get(`/auth/validate-reset-token?token=${token}`);
      return true;
    } catch {
      return false;
    }
  },

  changePassword: async (request: ChangePasswordRequest): Promise<void> => {
    await apiClient.post('/auth/change-password', request);
  },

  updateProfile: async (request: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put<User>('/auth/profile', request);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },

  terminateSession: async (sessionId: string): Promise<void> => {
    await apiClient.delete(`/auth/sessions/${sessionId}`);
  },

  terminateAllSessions: async (): Promise<void> => {
    await apiClient.delete('/auth/sessions');
  },

  getSessions: async (): Promise<any[]> => {
    const response = await apiClient.get('/auth/sessions');
    return response.data;
  },
};

