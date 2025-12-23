import apiClient from './apiClient';
import { 
  DashboardStats, 
  RevenueData, 
  OccupancyData, 
  PaymentMethodData,
  ChartDataPoint 
} from '../../types';

export const analyticsApi = {
  // Dashboard Analytics
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await apiClient.get('/analytics/dashboard/stats');
    return response.data;
  },

  getRevenueAnalytics: async (period: string = 'monthly'): Promise<RevenueData> => {
    const response = await apiClient.get(`/analytics/revenue?period=${period}`);
    return response.data;
  },

  getOccupancyAnalytics: async (period: string = 'monthly'): Promise<OccupancyData> => {
    const response = await apiClient.get(`/analytics/occupancy?period=${period}`);
    return response.data;
  },

  getPaymentMethodAnalytics: async (): Promise<PaymentMethodData> => {
    const response = await apiClient.get('/analytics/payment-methods');
    return response.data;
  },

  // Advanced Analytics
  getRevenueByProperty: async (startDate: string, endDate: string): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get(`/analytics/revenue/by-property?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  getOccupancyTrends: async (startDate: string, endDate: string): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get(`/analytics/occupancy/trends?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  getPaymentTrends: async (startDate: string, endDate: string): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get(`/analytics/payments/trends?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  getTenantRetention: async (): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get('/analytics/tenant-retention');
    return response.data;
  },

  getMaintenanceCosts: async (startDate: string, endDate: string): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get(`/analytics/maintenance/costs?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  getExpenseBreakdown: async (startDate: string, endDate: string): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get(`/analytics/expenses/breakdown?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // Forecasting
  getRevenueForecast: async (months: number = 12): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get(`/analytics/forecast/revenue?months=${months}`);
    return response.data;
  },

  getOccupancyForecast: async (months: number = 12): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get(`/analytics/forecast/occupancy?months=${months}`);
    return response.data;
  },

  // Performance Metrics
  getKPIs: async (): Promise<Record<string, any>> => {
    const response = await apiClient.get('/analytics/kpis');
    return response.data;
  },

  getPropertyPerformance: async (propertyId?: number): Promise<Record<string, any>> => {
    const url = propertyId ? `/analytics/property-performance/${propertyId}` : '/analytics/property-performance';
    const response = await apiClient.get(url);
    return response.data;
  },

  getTenantSatisfaction: async (): Promise<ChartDataPoint[]> => {
    const response = await apiClient.get('/analytics/tenant-satisfaction');
    return response.data;
  },

  // Custom Reports
  generateCustomReport: async (config: Record<string, any>): Promise<any> => {
    const response = await apiClient.post('/analytics/custom-report', config);
    return response.data;
  },

  exportAnalytics: async (type: string, filters: Record<string, any>): Promise<Blob> => {
    const response = await apiClient.post(`/analytics/export/${type}`, filters, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Business Intelligence endpoints
  getDashboardAnalytics: async (months: number = 12, propertyId?: number): Promise<any> => {
    const params: any = { months };
    if (propertyId) params.propertyId = propertyId;
    const response = await apiClient.get('/analytics/dashboard', { params });
    return response.data;
  },

  getKPIMetrics: async (propertyId?: number, period: string = 'current_month'): Promise<any> => {
    const params: any = { period };
    if (propertyId) params.propertyId = propertyId;
    const response = await apiClient.get('/analytics/kpis', { params });
    return response.data;
  },

  getTrendAnalysis: async (metric: string, months: number = 24, propertyId?: number): Promise<any> => {
    const params: any = { metric, months };
    if (propertyId) params.propertyId = propertyId;
    const response = await apiClient.get('/analytics/trends', { params });
    return response.data;
  },

  getForecasting: async (forecastMonths: number = 12, propertyId?: number, metrics: string = 'revenue,occupancy,expenses'): Promise<any> => {
    const params: any = { forecastMonths, metrics };
    if (propertyId) params.propertyId = propertyId;
    const response = await apiClient.get('/analytics/forecasting', { params });
    return response.data;
  }
};