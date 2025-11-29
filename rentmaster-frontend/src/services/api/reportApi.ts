import apiClient from './apiClient';
import { DashboardStats } from '../../types';

export const reportApi = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/reports/dashboard');
    return response.data;
  },
};

