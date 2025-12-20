import apiClient from './apiClient';
import {
  EmailTemplate,
  SMSTemplate,
  NotificationChannel,
  CommunicationLog,
  BulkCommunication,
  NotificationPreference,
} from '../../types';

export interface EmailTemplateCreateData {
  name: string;
  subject: string;
  body: string;
  templateType: 'INVOICE_DUE' | 'PAYMENT_RECEIVED' | 'CONTRACT_EXPIRING' | 'WELCOME' | 'MAINTENANCE_REQUEST' | 'CUSTOM';
  variables: string[];
  isDefault: boolean;
  active: boolean;
}

export interface SMSTemplateCreateData {
  name: string;
  message: string;
  templateType: 'INVOICE_DUE' | 'PAYMENT_RECEIVED' | 'CONTRACT_EXPIRING' | 'REMINDER' | 'CUSTOM';
  variables: string[];
  active: boolean;
}

export interface NotificationChannelCreateData {
  name: string;
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP';
  configuration: Record<string, any>;
  active: boolean;
  isDefault: boolean;
}

export interface BulkCommunicationCreateData {
  name: string;
  recipientType: 'ALL_TENANTS' | 'ACTIVE_TENANTS' | 'OVERDUE_TENANTS' | 'EXPIRING_CONTRACTS' | 'CUSTOM';
  recipientIds: number[];
  channels: ('EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP')[];
  templateId?: number;
  subject?: string;
  message: string;
  scheduledAt?: string;
}

export interface NotificationPreferenceCreateData {
  userId: number;
  notificationType: 'INVOICE_DUE' | 'PAYMENT_RECEIVED' | 'CONTRACT_EXPIRING' | 'MAINTENANCE_REQUEST' | 'SYSTEM' | 'MARKETING';
  channels: ('EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP' | 'IN_APP')[];
  enabled: boolean;
  frequency: 'IMMEDIATE' | 'DAILY_DIGEST' | 'WEEKLY_DIGEST' | 'NEVER';
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

export const communicationApi = {
  // Email Templates
  getEmailTemplates: async (): Promise<EmailTemplate[]> => {
    const response = await apiClient.get<EmailTemplate[]>('/communication/email-templates');
    return response.data;
  },

  createEmailTemplate: async (data: EmailTemplateCreateData): Promise<EmailTemplate> => {
    const response = await apiClient.post<EmailTemplate>('/communication/email-templates', data);
    return response.data;
  },

  updateEmailTemplate: async (id: number, data: Partial<EmailTemplateCreateData>): Promise<EmailTemplate> => {
    const response = await apiClient.put<EmailTemplate>(`/communication/email-templates/${id}`, data);
    return response.data;
  },

  deleteEmailTemplate: async (id: number): Promise<void> => {
    await apiClient.delete(`/communication/email-templates/${id}`);
  },

  toggleEmailTemplate: async (id: number): Promise<EmailTemplate> => {
    const response = await apiClient.patch<EmailTemplate>(`/communication/email-templates/${id}/toggle`);
    return response.data;
  },

  previewEmailTemplate: async (id: number, variables: Record<string, any>): Promise<{ subject: string; body: string }> => {
    const response = await apiClient.post<{ subject: string; body: string }>(`/communication/email-templates/${id}/preview`, variables);
    return response.data;
  },

  // SMS Templates
  getSMSTemplates: async (): Promise<SMSTemplate[]> => {
    const response = await apiClient.get<SMSTemplate[]>('/communication/sms-templates');
    return response.data;
  },

  createSMSTemplate: async (data: SMSTemplateCreateData): Promise<SMSTemplate> => {
    const response = await apiClient.post<SMSTemplate>('/communication/sms-templates', data);
    return response.data;
  },

  updateSMSTemplate: async (id: number, data: Partial<SMSTemplateCreateData>): Promise<SMSTemplate> => {
    const response = await apiClient.put<SMSTemplate>(`/communication/sms-templates/${id}`, data);
    return response.data;
  },

  deleteSMSTemplate: async (id: number): Promise<void> => {
    await apiClient.delete(`/communication/sms-templates/${id}`);
  },

  toggleSMSTemplate: async (id: number): Promise<SMSTemplate> => {
    const response = await apiClient.patch<SMSTemplate>(`/communication/sms-templates/${id}/toggle`);
    return response.data;
  },

  // Notification Channels
  getNotificationChannels: async (): Promise<NotificationChannel[]> => {
    const response = await apiClient.get<NotificationChannel[]>('/communication/channels');
    return response.data;
  },

  createNotificationChannel: async (data: NotificationChannelCreateData): Promise<NotificationChannel> => {
    const response = await apiClient.post<NotificationChannel>('/communication/channels', data);
    return response.data;
  },

  updateNotificationChannel: async (id: number, data: Partial<NotificationChannelCreateData>): Promise<NotificationChannel> => {
    const response = await apiClient.put<NotificationChannel>(`/communication/channels/${id}`, data);
    return response.data;
  },

  deleteNotificationChannel: async (id: number): Promise<void> => {
    await apiClient.delete(`/communication/channels/${id}`);
  },

  toggleNotificationChannel: async (id: number): Promise<NotificationChannel> => {
    const response = await apiClient.patch<NotificationChannel>(`/communication/channels/${id}/toggle`);
    return response.data;
  },

  testNotificationChannel: async (id: number, testData: Record<string, any>): Promise<void> => {
    await apiClient.post(`/communication/channels/${id}/test`, testData);
  },

  // Communication Logs
  getCommunicationLogs: async (params?: {
    page?: number;
    size?: number;
    channel?: string;
    status?: string;
    recipientType?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{ content: CommunicationLog[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/communication/logs', { params });
    return response.data;
  },

  retryCommunication: async (id: number): Promise<void> => {
    await apiClient.post(`/communication/logs/${id}/retry`);
  },

  // Bulk Communication
  getBulkCommunications: async (): Promise<BulkCommunication[]> => {
    const response = await apiClient.get<BulkCommunication[]>('/communication/bulk');
    return response.data;
  },

  createBulkCommunication: async (data: BulkCommunicationCreateData): Promise<BulkCommunication> => {
    const response = await apiClient.post<BulkCommunication>('/communication/bulk', data);
    return response.data;
  },

  updateBulkCommunication: async (id: number, data: Partial<BulkCommunicationCreateData>): Promise<BulkCommunication> => {
    const response = await apiClient.put<BulkCommunication>(`/communication/bulk/${id}`, data);
    return response.data;
  },

  deleteBulkCommunication: async (id: number): Promise<void> => {
    await apiClient.delete(`/communication/bulk/${id}`);
  },

  sendBulkCommunication: async (id: number): Promise<void> => {
    await apiClient.post(`/communication/bulk/${id}/send`);
  },

  // Notification Preferences
  getNotificationPreferences: async (userId?: number): Promise<NotificationPreference[]> => {
    const params = userId ? { userId } : {};
    const response = await apiClient.get<NotificationPreference[]>('/communication/preferences', { params });
    return response.data;
  },

  updateNotificationPreference: async (id: number, data: Partial<NotificationPreferenceCreateData>): Promise<NotificationPreference> => {
    const response = await apiClient.put<NotificationPreference>(`/communication/preferences/${id}`, data);
    return response.data;
  },

  createNotificationPreference: async (data: NotificationPreferenceCreateData): Promise<NotificationPreference> => {
    const response = await apiClient.post<NotificationPreference>('/communication/preferences', data);
    return response.data;
  },

  // Statistics
  getCommunicationStats: async (): Promise<{
    totalEmailTemplates: number;
    activeEmailTemplates: number;
    totalSMSTemplates: number;
    activeSMSTemplates: number;
    totalChannels: number;
    activeChannels: number;
    communicationsToday: number;
    deliveryRate: number;
    failureRate: number;
  }> => {
    const response = await apiClient.get('/communication/stats');
    return response.data;
  },

  // Send Individual Communication
  sendEmail: async (data: {
    recipientId: number;
    templateId?: number;
    subject?: string;
    body?: string;
    variables?: Record<string, any>;
  }): Promise<void> => {
    await apiClient.post('/communication/send/email', data);
  },

  sendSMS: async (data: {
    recipientId: number;
    templateId?: number;
    message?: string;
    variables?: Record<string, any>;
  }): Promise<void> => {
    await apiClient.post('/communication/send/sms', data);
  },

  sendWhatsApp: async (data: {
    recipientId: number;
    message: string;
    attachments?: string[];
  }): Promise<void> => {
    await apiClient.post('/communication/send/whatsapp', data);
  },

  sendPushNotification: async (data: {
    recipientId: number;
    title: string;
    message: string;
    data?: Record<string, any>;
  }): Promise<void> => {
    await apiClient.post('/communication/send/push', data);
  },
};