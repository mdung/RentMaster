import apiClient from './apiClient';
import { Contract } from '../../types';

export const contractApi = {
  getAll: async (status?: string): Promise<Contract[]> => {
    const params = status ? { status } : {};
    const response = await apiClient.get<Contract[]>('/contracts', { params });
    return response.data;
  },
  getById: async (id: number): Promise<Contract> => {
    const response = await apiClient.get<Contract>(`/contracts/${id}`);
    return response.data;
  },
  create: async (data: Omit<Contract, 'id' | 'createdAt' | 'roomCode' | 'propertyName' | 'primaryTenantName'>): Promise<Contract> => {
    const response = await apiClient.post<Contract>('/contracts', data);
    return response.data;
  },
  update: async (id: number, data: Omit<Contract, 'id' | 'createdAt' | 'roomCode' | 'propertyName' | 'primaryTenantName'>): Promise<Contract> => {
    const response = await apiClient.put<Contract>(`/contracts/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/contracts/${id}`);
  },
};

