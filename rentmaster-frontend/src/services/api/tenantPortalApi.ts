import apiClient from './apiClient';
import {
  TenantProfile,
  TenantDashboard,
  TenantContract,
  TenantInvoice,
  TenantPayment,
  TenantPaymentMethod,
  TenantMaintenanceRequest,
  TenantDocument,
  TenantNotification,
  PaymentGateway,
  PaymentIntent,
  TenantFeedback,
  TenantAnnouncement,
} from '../../types';

export interface TenantProfileUpdateData {
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  occupation?: string;
  employer?: string;
  monthlyIncome?: number;
  preferredLanguage: string;
  timezone: string;
  notificationPreferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    invoiceReminders: boolean;
    paymentConfirmations: boolean;
    maintenanceUpdates: boolean;
    contractNotifications: boolean;
    marketingEmails: boolean;
    reminderDaysBefore: number;
  };
}

export interface MaintenanceRequestCreateData {
  title: string;
  description: string;
  category: 'PLUMBING' | 'ELECTRICAL' | 'HVAC' | 'APPLIANCES' | 'STRUCTURAL' | 'CLEANING' | 'PEST_CONTROL' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  location: string;
  preferredTime?: string;
  allowEntry: boolean;
  photos: string[];
}

export interface PaymentMethodCreateData {
  type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_ACCOUNT' | 'DIGITAL_WALLET';
  name: string;
  lastFour: string;
  expiryDate?: string;
  provider: string;
  isDefault: boolean;
}

export interface PaymentCreateData {
  invoiceId: number;
  amount: number;
  paymentMethodId: number;
  description?: string;
}

export interface FeedbackCreateData {
  type: 'MAINTENANCE' | 'PAYMENT' | 'GENERAL' | 'SUGGESTION' | 'COMPLAINT';
  subject: string;
  message: string;
  rating?: number;
  category?: string;
  attachments: string[];
}

export const tenantPortalApi = {
  // Dashboard
  getTenantDashboard: async (): Promise<TenantDashboard> => {
    const response = await apiClient.get<TenantDashboard>('/tenant-portal/dashboard');
    return response.data;
  },

  // Profile Management
  getTenantProfile: async (): Promise<TenantProfile> => {
    const response = await apiClient.get<TenantProfile>('/tenant-portal/profile');
    return response.data;
  },

  updateTenantProfile: async (data: TenantProfileUpdateData): Promise<TenantProfile> => {
    const response = await apiClient.put<TenantProfile>('/tenant-portal/profile', data);
    return response.data;
  },

  uploadProfilePicture: async (file: File): Promise<TenantProfile> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<TenantProfile>('/tenant-portal/profile/picture', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Contract Information
  getCurrentContract: async (): Promise<TenantContract> => {
    const response = await apiClient.get<TenantContract>('/tenant-portal/contract');
    return response.data;
  },

  requestContractRenewal: async (data: {
    extensionMonths: number;
    message?: string;
  }): Promise<void> => {
    await apiClient.post('/tenant-portal/contract/renewal-request', data);
  },

  // Invoices and Payments
  getTenantInvoices: async (params?: {
    page?: number;
    size?: number;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{ content: TenantInvoice[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/tenant-portal/invoices', { params });
    return response.data;
  },

  getTenantInvoiceById: async (id: number): Promise<TenantInvoice> => {
    const response = await apiClient.get<TenantInvoice>(`/tenant-portal/invoices/${id}`);
    return response.data;
  },

  downloadInvoice: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/tenant-portal/invoices/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  getTenantPayments: async (params?: {
    page?: number;
    size?: number;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<{ content: TenantPayment[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/tenant-portal/payments', { params });
    return response.data;
  },

  downloadPaymentReceipt: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/tenant-portal/payments/${id}/receipt`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Payment Methods
  getPaymentMethods: async (): Promise<TenantPaymentMethod[]> => {
    const response = await apiClient.get<TenantPaymentMethod[]>('/tenant-portal/payment-methods');
    return response.data;
  },

  addPaymentMethod: async (data: PaymentMethodCreateData): Promise<TenantPaymentMethod> => {
    const response = await apiClient.post<TenantPaymentMethod>('/tenant-portal/payment-methods', data);
    return response.data;
  },

  updatePaymentMethod: async (id: number, data: Partial<PaymentMethodCreateData>): Promise<TenantPaymentMethod> => {
    const response = await apiClient.put<TenantPaymentMethod>(`/tenant-portal/payment-methods/${id}`, data);
    return response.data;
  },

  deletePaymentMethod: async (id: number): Promise<void> => {
    await apiClient.delete(`/tenant-portal/payment-methods/${id}`);
  },

  setDefaultPaymentMethod: async (id: number): Promise<void> => {
    await apiClient.post(`/tenant-portal/payment-methods/${id}/set-default`);
  },

  // Online Payments
  getPaymentGateways: async (): Promise<PaymentGateway[]> => {
    const response = await apiClient.get<PaymentGateway[]>('/tenant-portal/payment-gateways');
    return response.data;
  },

  createPaymentIntent: async (data: {
    invoiceId: number;
    amount: number;
    paymentMethodId: number;
    gatewayId: number;
  }): Promise<PaymentIntent> => {
    const response = await apiClient.post<PaymentIntent>('/tenant-portal/payments/create-intent', data);
    return response.data;
  },

  confirmPayment: async (paymentIntentId: string): Promise<TenantPayment> => {
    const response = await apiClient.post<TenantPayment>('/tenant-portal/payments/confirm', {
      paymentIntentId
    });
    return response.data;
  },

  makePayment: async (data: PaymentCreateData): Promise<TenantPayment> => {
    const response = await apiClient.post<TenantPayment>('/tenant-portal/payments', data);
    return response.data;
  },

  // Maintenance Requests
  getMaintenanceRequests: async (params?: {
    page?: number;
    size?: number;
    status?: string;
    category?: string;
  }): Promise<{ content: TenantMaintenanceRequest[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/tenant-portal/maintenance-requests', { params });
    return response.data;
  },

  getMaintenanceRequestById: async (id: number): Promise<TenantMaintenanceRequest> => {
    const response = await apiClient.get<TenantMaintenanceRequest>(`/tenant-portal/maintenance-requests/${id}`);
    return response.data;
  },

  createMaintenanceRequest: async (data: MaintenanceRequestCreateData): Promise<TenantMaintenanceRequest> => {
    const response = await apiClient.post<TenantMaintenanceRequest>('/tenant-portal/maintenance-requests', data);
    return response.data;
  },

  updateMaintenanceRequest: async (id: number, data: Partial<MaintenanceRequestCreateData>): Promise<TenantMaintenanceRequest> => {
    const response = await apiClient.put<TenantMaintenanceRequest>(`/tenant-portal/maintenance-requests/${id}`, data);
    return response.data;
  },

  cancelMaintenanceRequest: async (id: number, reason: string): Promise<TenantMaintenanceRequest> => {
    const response = await apiClient.post<TenantMaintenanceRequest>(`/tenant-portal/maintenance-requests/${id}/cancel`, {
      reason
    });
    return response.data;
  },

  rateMaintenanceRequest: async (id: number, rating: number, feedback?: string): Promise<TenantMaintenanceRequest> => {
    const response = await apiClient.post<TenantMaintenanceRequest>(`/tenant-portal/maintenance-requests/${id}/rate`, {
      rating,
      feedback
    });
    return response.data;
  },

  uploadMaintenancePhoto: async (requestId: number, file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<{ photoUrl: string }>(`/tenant-portal/maintenance-requests/${requestId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.photoUrl;
  },

  // Documents
  getTenantDocuments: async (params?: {
    page?: number;
    size?: number;
    type?: string;
    category?: string;
  }): Promise<{ content: TenantDocument[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/tenant-portal/documents', { params });
    return response.data;
  },

  downloadTenantDocument: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/tenant-portal/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Notifications
  getTenantNotifications: async (params?: {
    page?: number;
    size?: number;
    type?: string;
    read?: boolean;
  }): Promise<{ content: TenantNotification[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/tenant-portal/notifications', { params });
    return response.data;
  },

  markNotificationAsRead: async (id: number): Promise<TenantNotification> => {
    const response = await apiClient.post<TenantNotification>(`/tenant-portal/notifications/${id}/read`);
    return response.data;
  },

  markAllNotificationsAsRead: async (): Promise<void> => {
    await apiClient.post('/tenant-portal/notifications/read-all');
  },

  deleteNotification: async (id: number): Promise<void> => {
    await apiClient.delete(`/tenant-portal/notifications/${id}`);
  },

  // Feedback and Support
  submitFeedback: async (data: FeedbackCreateData): Promise<TenantFeedback> => {
    const response = await apiClient.post<TenantFeedback>('/tenant-portal/feedback', data);
    return response.data;
  },

  getFeedbackHistory: async (): Promise<TenantFeedback[]> => {
    const response = await apiClient.get<TenantFeedback[]>('/tenant-portal/feedback');
    return response.data;
  },

  // Announcements
  getAnnouncements: async (params?: {
    page?: number;
    size?: number;
    type?: string;
  }): Promise<{ content: TenantAnnouncement[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/tenant-portal/announcements', { params });
    return response.data;
  },

  markAnnouncementAsRead: async (id: number): Promise<void> => {
    await apiClient.post(`/tenant-portal/announcements/${id}/read`);
  },

  // Statistics
  getTenantStats: async (): Promise<{
    totalPaid: number;
    totalOutstanding: number;
    onTimePayments: number;
    latePayments: number;
    averagePaymentTime: number;
    contractDuration: number;
    maintenanceRequests: number;
    resolvedRequests: number;
    averageResolutionTime: number;
    paymentHistory: {
      month: string;
      amount: number;
      onTime: boolean;
    }[];
  }> => {
    const response = await apiClient.get('/tenant-portal/stats');
    return response.data;
  },

  // Utilities
  uploadFile: async (file: File, type: 'PROFILE_PICTURE' | 'MAINTENANCE_PHOTO' | 'FEEDBACK_ATTACHMENT'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await apiClient.post<{ fileUrl: string }>('/tenant-portal/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.fileUrl;
  },

  // Emergency Contact
  reportEmergency: async (data: {
    type: 'FIRE' | 'FLOOD' | 'ELECTRICAL' | 'GAS_LEAK' | 'SECURITY' | 'MEDICAL' | 'OTHER';
    description: string;
    location: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    contactNumber: string;
  }): Promise<void> => {
    await apiClient.post('/tenant-portal/emergency', data);
  },
};