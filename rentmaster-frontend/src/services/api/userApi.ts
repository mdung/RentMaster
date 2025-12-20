import apiClient from './apiClient';
import { User } from '../../types';

export interface UserCreateData {
  username: string;
  password?: string;
  fullName: string;
  email?: string;
  role: string;
  active?: boolean;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const userApi = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>('/users');
    return response.data;
  },
  getById: async (id: number): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },
  create: async (data: UserCreateData): Promise<User> => {
    const response = await apiClient.post<User>('/users', data);
    return response.data;
  },
  update: async (id: number, data: UserCreateData): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
  changePassword: async (id: number, data: PasswordChangeData): Promise<void> => {
    await apiClient.post(`/users/${id}/change-password`, data);
  },
  toggleActive: async (id: number): Promise<User> => {
    const response = await apiClient.put<User>(`/users/${id}/toggle-active`);
    return response.data;
  },
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/profile');
    return response.data;
  },
};



