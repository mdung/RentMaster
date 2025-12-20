import apiClient from './apiClient';
import { Service } from '../../types';

export interface ServiceCreateData {
  name: string;
  type: string;
  pricingModel: string;
  unitPrice?: number;
  unitName?: string;
  active?: boolean;
}

export const serviceApi = {
  getAll: async (): Promise<Service[]> => {
    const response = await apiClient.get<Service[]>('/services');
    return response.data;
  },
  getActive: async (): Promise<Service[]> => {
    const response = await apiClient.get<Service[]>('/services/active');
    return response.data;
  },
  getById: async (id: number): Promise<Service> => {
    const response = await apiClient.get<Service>(`/services/${id}`);
    return response.data;
  },
  create: async (data: ServiceCreateData): Promise<Service> => {
    const response = await apiClient.post<Service>('/services', data);
    return response.data;
  },
  update: async (id: number, data: ServiceCreateData): Promise<Service> => {
    const response = await apiClient.put<Service>(`/services/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/services/${id}`);
  },
  toggleActive: async (id: number): Promise<Service> => {
    const response = await apiClient.put<Service>(`/services/${id}/toggle-active`);
    return response.data;
  },
};



