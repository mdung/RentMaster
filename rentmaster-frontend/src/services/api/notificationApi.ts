import apiClient from './apiClient';
import { Notification, NotificationSettings } from '../../types';

export interface NotificationFilters {
  type?: string;
  read?: boolean;
  priority?: string;
}

export interface PagedNotifications {
  items: Notification[];
  total: number;
  page: number;
  size: number;
}

export const notificationApi = {
  // Get paginated notifications
  getPaged: async (
    filters?: NotificationFilters,
    page: number = 0,
    size: number = 20
  ): Promise<PagedNotifications> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.read !== undefined) params.append('read', filters.read.toString());
    if (filters?.priority) params.append('priority', filters.priority);

    const response = await apiClient.get<PagedNotifications>(`/notifications?${params}`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<{ count: number }>('/notifications/unread-count');
    return response.data.count;
  },

  // Mark notification as read
  markAsRead: async (id: number): Promise<void> => {
    await apiClient.patch(`/notifications/${id}/read`);
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    await apiClient.patch('/notifications/mark-all-read');
  },

  // Delete notification
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/notifications/${id}`);
  },

  // Get notification settings
  getSettings: async (): Promise<NotificationSettings> => {
    const response = await apiClient.get<NotificationSettings>('/notifications/settings');
    return response.data;
  },

  // Update notification settings
  updateSettings: async (settings: Partial<NotificationSettings>): Promise<NotificationSettings> => {
    const response = await apiClient.put<NotificationSettings>('/notifications/settings', settings);
    return response.data;
  },

  // Test notification (for development)
  testNotification: async (type: string): Promise<void> => {
    await apiClient.post('/notifications/test', { type });
  },
};