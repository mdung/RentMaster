import apiClient from './apiClient';

export interface TenantDashboard {
  profile: TenantProfile;
  currentContract: TenantContract;
  upcomingPayments: TenantInvoice[];
  recentPayments: PaymentHistory[];
  maintenanceRequests: MaintenanceRequest[];
  documents: TenantDocument[];
  notifications: TenantNotification[];
  paymentMethods: PaymentMethod[];
  stats: TenantStats;
}

export interface TenantProfile {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  idNumber: string;
  dateOfBirth?: string;
  address: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  occupation?: string;
  employer?: string;
  monthlyIncome?: number;
  profilePicture?: string;
  preferredLanguage?: string;
  timezone?: string;
  createdAt: string;
  updatedAt: string;
  notificationPreferences?: {
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

export interface TenantContract {
  id: number;
  contractCode: string;
  property: {
    id: number;
    name: string;
    address: string;
  };
  room: {
    id: number;
    code: string;
    floor: string;
    type: string;
  };
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: string;
  renewalEligible: boolean;
  daysUntilExpiry: number;
  autoRenewal: boolean;
  nextRentDue: string;
  totalPaid: number;
  totalOutstanding: number;
}

export interface TenantInvoice {
  id: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  canPay: boolean;
  lateFee?: number;
  daysOverdue?: number;
  items?: InvoiceItem[];
  paymentHistory?: PaymentHistory[];
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  type: string;
  period?: string;
}

export interface PaymentHistory {
  id: number;
  invoiceId?: number;
  invoiceNumber?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId?: string;
  status: string;
  description?: string;
  receiptUrl?: string;
  processingFee?: number;
}

export interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  location: string;
  preferredTime?: string;
  allowEntry: boolean;
  photos?: string[];
  submittedAt: string;
  acknowledgedAt?: string;
  assignedTechnician?: string;
  technicianPhone?: string;
  completedAt?: string;
  actualCost?: number;
  workDescription?: string;
  tenantRating?: number;
  tenantFeedback?: string;
  updates?: MaintenanceUpdate[];
}

export interface MaintenanceUpdate {
  id: number;
  message: string;
  type: string;
  createdAt: string;
  createdBy: string;
}

export interface TenantDocument {
  id: number;
  name: string;
  type: string;
  description?: string;
  fileSize: number;
  uploadDate: string;
  downloadUrl: string;
  isImportant: boolean;
  requiresAction: boolean;
  category: string;
}

export interface TenantNotification {
  id: number;
  type: string;
  title: string;
  message: string;
  priority: string;
  read: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  readAt?: string;
  relatedEntityId?: number;
  relatedEntityType?: string;
}

export interface PaymentMethod {
  id: number;
  type: string;
  name: string;
  lastFour: string;
  expiryDate?: string;
  isDefault: boolean;
  isActive: boolean;
  provider: string;
  createdAt: string;
}

export interface TenantStats {
  totalPaid: number;
  totalOutstanding: number;
  onTimePayments: number;
  latePayments: number;
  averagePaymentTime: number;
  contractDuration: number;
  maintenanceRequests: number;
  resolvedRequests: number;
  averageResolutionTime: number;
  paymentHistory?: Array<{
    month: string;
    amount: number;
    onTime: boolean;
  }>;
}

export const tenantPortalApi = {
  getDashboard: async (tenantId?: number): Promise<TenantDashboard> => {
    const params = tenantId ? { tenantId } : {};
    const response = await apiClient.get<TenantDashboard>('/tenant-portal/dashboard', { params });
    return response.data;
  },

  getProfile: async (tenantId?: number): Promise<TenantProfile> => {
    const params = tenantId ? { tenantId } : {};
    const response = await apiClient.get<TenantProfile>('/tenant-portal/profile', { params });
    return response.data;
  },

  updateProfile: async (tenantId: number | undefined, profileData: Partial<TenantProfile>): Promise<TenantProfile> => {
    const params = tenantId ? { tenantId } : {};
    const response = await apiClient.put<TenantProfile>('/tenant-portal/profile', profileData, { params });
    return response.data;
  },

  getContract: async (tenantId?: number): Promise<TenantContract> => {
    const params = tenantId ? { tenantId } : {};
    const response = await apiClient.get<TenantContract>('/tenant-portal/contract', { params });
    return response.data;
  },

  getInvoices: async (tenantId?: number, status: string = 'PENDING', limit: number = 10): Promise<TenantInvoice[]> => {
    const params: any = { status, limit };
    if (tenantId) params.tenantId = tenantId;
    const response = await apiClient.get<TenantInvoice[]>('/tenant-portal/invoices', { params });
    return response.data;
  },

  getPaymentHistory: async (tenantId?: number, limit: number = 10): Promise<PaymentHistory[]> => {
    const params: any = { limit };
    if (tenantId) params.tenantId = tenantId;
    const response = await apiClient.get<PaymentHistory[]>('/tenant-portal/payments', { params });
    return response.data;
  },

  getMaintenanceRequests: async (tenantId?: number, limit: number = 10): Promise<MaintenanceRequest[]> => {
    const params: any = { limit };
    if (tenantId) params.tenantId = tenantId;
    const response = await apiClient.get<MaintenanceRequest[]>('/tenant-portal/maintenance-requests', { params });
    return response.data;
  },

  submitMaintenanceRequest: async (tenantId: number | undefined, requestData: any): Promise<MaintenanceRequest> => {
    const params = tenantId ? { tenantId } : {};
    const response = await apiClient.post<MaintenanceRequest>('/tenant-portal/maintenance-requests', requestData, { params });
    return response.data;
  },

  getDocuments: async (tenantId?: number): Promise<TenantDocument[]> => {
    const params = tenantId ? { tenantId } : {};
    const response = await apiClient.get<TenantDocument[]>('/tenant-portal/documents', { params });
    return response.data;
  },

  downloadDocument: async (documentId: number, tenantId?: number): Promise<Blob> => {
    const params = tenantId ? { tenantId } : {};
    const response = await apiClient.get(`/tenant-portal/documents/${documentId}/download`, { 
      params,
      responseType: 'blob'
    });
    return response.data;
  },

  getNotifications: async (tenantId?: number, unreadOnly: boolean = false, limit: number = 20): Promise<TenantNotification[]> => {
    const params: any = { unreadOnly, limit };
    if (tenantId) params.tenantId = tenantId;
    const response = await apiClient.get<TenantNotification[]>('/tenant-portal/notifications', { params });
    return response.data;
  },

  markNotificationAsRead: async (notificationId: number, tenantId?: number): Promise<void> => {
    const params = tenantId ? { tenantId } : {};
    await apiClient.put(`/tenant-portal/notifications/${notificationId}/read`, {}, { params });
  },

  getStats: async (tenantId?: number): Promise<TenantStats> => {
    const params = tenantId ? { tenantId } : {};
    const response = await apiClient.get<TenantStats>('/tenant-portal/stats', { params });
    return response.data;
  },

  getPaymentMethods: async (tenantId?: number): Promise<PaymentMethod[]> => {
    const params = tenantId ? { tenantId } : {};
    const response = await apiClient.get<PaymentMethod[]>('/tenant-portal/payment-methods', { params });
    return response.data;
  },

  addPaymentMethod: async (tenantId: number | undefined, paymentMethodData: any): Promise<PaymentMethod> => {
    const params = tenantId ? { tenantId } : {};
    const response = await apiClient.post<PaymentMethod>('/tenant-portal/payment-methods', paymentMethodData, { params });
    return response.data;
  },

  processPayment: async (tenantId: number | undefined, paymentData: any): Promise<PaymentHistory> => {
    const params = tenantId ? { tenantId } : {};
    const response = await apiClient.post<PaymentHistory>('/tenant-portal/payments', paymentData, { params });
    return response.data;
  },
};
