import apiClient from './apiClient';
import { 
  DashboardStats, 
  EnhancedDashboardData, 
  RevenueData, 
  OccupancyData, 
  PaymentMethodData,
  ActivityItem,
  UpcomingDueDate,
  QuickAction,
  DashboardWidget
} from '../../types';

export const reportApi = {
  getDashboard: async (): Promise<DashboardStats> => {
    const response = await apiClient.get<DashboardStats>('/reports/dashboard');
    return response.data;
  },

  getEnhancedDashboard: async (): Promise<EnhancedDashboardData> => {
    const response = await apiClient.get<EnhancedDashboardData>('/reports/enhanced-dashboard');
    return response.data;
  },

  getRevenueData: async (period: 'monthly' | 'yearly' = 'monthly'): Promise<RevenueData> => {
    const response = await apiClient.get<RevenueData>(`/reports/revenue?period=${period}`);
    return response.data;
  },

  getOccupancyData: async (period: 'monthly' | 'yearly' = 'monthly'): Promise<OccupancyData> => {
    const response = await apiClient.get<OccupancyData>(`/reports/occupancy?period=${period}`);
    return response.data;
  },

  getPaymentMethodData: async (): Promise<PaymentMethodData> => {
    const response = await apiClient.get<PaymentMethodData>('/reports/payment-methods');
    return response.data;
  },

  getRecentActivities: async (limit: number = 20): Promise<ActivityItem[]> => {
    const response = await apiClient.get<ActivityItem[]>(`/reports/activities?limit=${limit}`);
    return response.data;
  },

  getUpcomingDueDates: async (days: number = 30): Promise<UpcomingDueDate[]> => {
    const response = await apiClient.get<UpcomingDueDate[]>(`/reports/due-dates?days=${days}`);
    return response.data;
  },

  getQuickActions: async (): Promise<QuickAction[]> => {
    const response = await apiClient.get<QuickAction[]>('/reports/quick-actions');
    return response.data;
  },

  getDashboardWidgets: async (): Promise<DashboardWidget[]> => {
    const response = await apiClient.get<DashboardWidget[]>('/reports/widgets');
    return response.data;
  },

  updateDashboardWidgets: async (widgets: DashboardWidget[]): Promise<DashboardWidget[]> => {
    const response = await apiClient.put<DashboardWidget[]>('/reports/widgets', widgets);
    return response.data;
  },
};

