import apiClient from './apiClient';
import { Tenant } from '../../types';

export const tenantApi = {
  getAll: async (search?: string): Promise<Tenant[]> => {
    const params = search ? { search } : {};
    const response = await apiClient.get<Tenant[]>('/tenants', { params });
    return response.data;
  },
  getById: async (id: number): Promise<Tenant> => {
    const response = await apiClient.get<Tenant>(`/tenants/${id}`);
    return response.data;
  },
  create: async (data: Omit<Tenant, 'id' | 'createdAt'>): Promise<Tenant> => {
    const response = await apiClient.post<Tenant>('/tenants', data);
    return response.data;
  },
  update: async (id: number, data: Omit<Tenant, 'id' | 'createdAt'>): Promise<Tenant> => {
    const response = await apiClient.put<Tenant>(`/tenants/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/tenants/${id}`);
  },
};

