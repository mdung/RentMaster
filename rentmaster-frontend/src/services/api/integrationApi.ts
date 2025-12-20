import apiClient from './apiClient';

export interface Integration {
  id: number;
  name: string;
  type: 'QUICKBOOKS' | 'XERO' | 'BANK_PLAID' | 'BANK_YODLEE' | 'GOOGLE_CALENDAR' | 'OUTLOOK_CALENDAR' | 'STRIPE' | 'PAYPAL' | 'SQUARE' | 'MAILCHIMP' | 'SENDGRID' | 'TWILIO' | 'SLACK' | 'ZAPIER' | 'CUSTOM_WEBHOOK';
  description?: string;
  configuration: Record<string, string>;
  isActive: boolean;
  autoSync: boolean;
  syncFrequencyMinutes: number;
  lastSyncAt?: string;
  nextSyncAt?: string;
  syncStatus: 'IDLE' | 'SYNCING' | 'SUCCESS' | 'ERROR' | 'CANCELLED';
  successCount: number;
  errorCount: number;
  lastErrorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WebhookConfiguration {
  id: number;
  name: string;
  url: string;
  method: string;
  eventTypes: string[];
  headers: Record<string, string>;
  secretKey?: string;
  signatureHeader: string;
  isActive: boolean;
  retryAttempts: number;
  retryDelaySeconds: number;
  timeoutSeconds: number;
  verifySsl: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
  lastTriggeredAt?: string;
  successCount: number;
  failureCount: number;
}

export interface WebhookEvent {
  id: number;
  configurationId: number;
  eventType: string;
  eventId: string;
  payload: string;
  headers: Record<string, string>;
  status: 'PENDING' | 'SENDING' | 'SUCCESS' | 'FAILED' | 'RETRYING' | 'CANCELLED';
  httpStatusCode?: number;
  response?: string;
  errorMessage?: string;
  attemptCount: number;
  maxAttempts: number;
  nextRetryAt?: string;
  createdAt: string;
  sentAt?: string;
  completedAt?: string;
  processingTimeMs?: number;
}

export const integrationApi = {
  // Integration Management
  getIntegrations: async (): Promise<Integration[]> => {
    const response = await apiClient.get('/integrations');
    return response.data;
  },

  getIntegration: async (id: number): Promise<Integration> => {
    const response = await apiClient.get(`/integrations/${id}`);
    return response.data;
  },

  createIntegration: async (integration: Omit<Integration, 'id' | 'successCount' | 'errorCount' | 'createdAt' | 'updatedAt'>): Promise<Integration> => {
    const response = await apiClient.post('/integrations', integration);
    return response.data;
  },

  updateIntegration: async (id: number, integration: Partial<Integration>): Promise<Integration> => {
    const response = await apiClient.put(`/integrations/${id}`, integration);
    return response.data;
  },

  deleteIntegration: async (id: number): Promise<void> => {
    await apiClient.delete(`/integrations/${id}`);
  },

  toggleIntegration: async (id: number): Promise<Integration> => {
    const response = await apiClient.post(`/integrations/${id}/toggle`);
    return response.data;
  },

  testIntegration: async (id: number): Promise<Record<string, any>> => {
    const response = await apiClient.post(`/integrations/${id}/test`);
    return response.data;
  },

  // QuickBooks Integration
  syncWithQuickBooks: async (syncData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/integrations/quickbooks/sync', syncData);
    return response.data;
  },

  getQuickBooksAccounts: async (): Promise<Record<string, any>[]> => {
    const response = await apiClient.get('/integrations/quickbooks/accounts');
    return response.data;
  },

  exportInvoicesToQuickBooks: async (exportData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/integrations/quickbooks/export-invoices', exportData);
    return response.data;
  },

  // Xero Integration
  syncWithXero: async (syncData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/integrations/xero/sync', syncData);
    return response.data;
  },

  getXeroContacts: async (): Promise<Record<string, any>[]> => {
    const response = await apiClient.get('/integrations/xero/contacts');
    return response.data;
  },

  exportTransactionsToXero: async (exportData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/integrations/xero/export-transactions', exportData);
    return response.data;
  },

  // Bank Integration
  getSupportedBanks: async (): Promise<Record<string, any>[]> => {
    const response = await apiClient.get('/integrations/banks');
    return response.data;
  },

  connectBank: async (bankData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/integrations/banks/connect', bankData);
    return response.data;
  },

  getBankAccounts: async (bankId: string): Promise<Record<string, any>[]> => {
    const response = await apiClient.get(`/integrations/banks/${bankId}/accounts`);
    return response.data;
  },

  getBankTransactions: async (bankId: string, startDate?: string, endDate?: string): Promise<Record<string, any>[]> => {
    let url = `/integrations/banks/${bankId}/transactions`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  syncBankTransactions: async (bankId: string): Promise<Record<string, any>> => {
    const response = await apiClient.post(`/integrations/banks/${bankId}/sync-transactions`);
    return response.data;
  },

  // Google Calendar Integration
  connectGoogleCalendar: async (authData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/integrations/google-calendar/connect', authData);
    return response.data;
  },

  getGoogleCalendars: async (): Promise<Record<string, any>[]> => {
    const response = await apiClient.get('/integrations/google-calendar/calendars');
    return response.data;
  },

  createCalendarEvent: async (eventData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/integrations/google-calendar/events', eventData);
    return response.data;
  },

  getCalendarEvents: async (calendarId?: string, startDate?: string, endDate?: string): Promise<Record<string, any>[]> => {
    let url = '/integrations/google-calendar/events';
    const params = new URLSearchParams();
    if (calendarId) params.append('calendarId', calendarId);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  syncMaintenanceToCalendar: async (): Promise<Record<string, any>> => {
    const response = await apiClient.post('/integrations/google-calendar/sync-maintenance');
    return response.data;
  },

  // Integration Statistics
  getIntegrationStats: async (): Promise<Record<string, any>> => {
    const response = await apiClient.get('/integrations/stats');
    return response.data;
  },

  getIntegrationLogs: async (id: number, page: number = 0, size: number = 50): Promise<Record<string, any>[]> => {
    const response = await apiClient.get(`/integrations/${id}/logs?page=${page}&size=${size}`);
    return response.data;
  },

  getSupportedIntegrationTypes: async (): Promise<Record<string, any>[]> => {
    const response = await apiClient.get('/integrations/types');
    return response.data;
  },

  // Webhook Management
  getWebhookConfigurations: async (): Promise<WebhookConfiguration[]> => {
    const response = await apiClient.get('/webhooks/configurations');
    return response.data;
  },

  createWebhookConfiguration: async (configuration: Omit<WebhookConfiguration, 'id' | 'createdAt' | 'updatedAt' | 'successCount' | 'failureCount'>): Promise<WebhookConfiguration> => {
    const response = await apiClient.post('/webhooks/configurations', configuration);
    return response.data;
  },

  updateWebhookConfiguration: async (id: number, configuration: Partial<WebhookConfiguration>): Promise<WebhookConfiguration> => {
    const response = await apiClient.put(`/webhooks/configurations/${id}`, configuration);
    return response.data;
  },

  deleteWebhookConfiguration: async (id: number): Promise<void> => {
    await apiClient.delete(`/webhooks/configurations/${id}`);
  },

  toggleWebhookConfiguration: async (id: number): Promise<WebhookConfiguration> => {
    const response = await apiClient.post(`/webhooks/configurations/${id}/toggle`);
    return response.data;
  },

  testWebhookConfiguration: async (id: number): Promise<Record<string, any>> => {
    const response = await apiClient.post(`/webhooks/configurations/${id}/test`);
    return response.data;
  },

  // Webhook Events
  getWebhookEvents: async (configurationId?: number, status?: string, page: number = 0, size: number = 50): Promise<WebhookEvent[]> => {
    let url = `/webhooks/events?page=${page}&size=${size}`;
    if (configurationId) url += `&configurationId=${configurationId}`;
    if (status) url += `&status=${status}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  getWebhookEvent: async (id: number): Promise<WebhookEvent> => {
    const response = await apiClient.get(`/webhooks/events/${id}`);
    return response.data;
  },

  retryWebhookEvent: async (id: number): Promise<Record<string, any>> => {
    const response = await apiClient.post(`/webhooks/events/${id}/retry`);
    return response.data;
  },

  getWebhookStats: async (configurationId?: number, period?: string): Promise<Record<string, any>> => {
    let url = '/webhooks/stats';
    const params = new URLSearchParams();
    if (configurationId) params.append('configurationId', configurationId.toString());
    if (period) params.append('period', period);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  getSupportedEventTypes: async (): Promise<Record<string, any>[]> => {
    const response = await apiClient.get('/webhooks/event-types');
    return response.data;
  },

  verifyWebhookSignature: async (verificationData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/webhooks/verify-signature', verificationData);
    return response.data;
  },

  // Payment Gateway Integration
  getPaymentGateways: async (active?: boolean): Promise<Record<string, any>[]> => {
    let url = '/payment-gateway/gateways';
    if (active !== undefined) url += `?active=${active}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  createPaymentGateway: async (gatewayData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/payment-gateway/gateways', gatewayData);
    return response.data;
  },

  updatePaymentGateway: async (id: number, gatewayData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.put(`/payment-gateway/gateways/${id}`, gatewayData);
    return response.data;
  },

  deletePaymentGateway: async (id: number): Promise<void> => {
    await apiClient.delete(`/payment-gateway/gateways/${id}`);
  },

  togglePaymentGateway: async (id: number): Promise<Record<string, any>> => {
    const response = await apiClient.patch(`/payment-gateway/gateways/${id}/toggle`);
    return response.data;
  },

  testPaymentGateway: async (id: number): Promise<Record<string, any>> => {
    const response = await apiClient.post(`/payment-gateway/gateways/${id}/test`);
    return response.data;
  },

  getSupportedPaymentMethods: async (): Promise<Record<string, any>[]> => {
    const response = await apiClient.get('/payment-gateway/supported-methods');
    return response.data;
  },

  getPaymentStats: async (period?: string, gatewayId?: number): Promise<Record<string, any>> => {
    let url = '/payment-gateway/stats';
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (gatewayId) params.append('gatewayId', gatewayId.toString());
    if (params.toString()) url += `?${params.toString()}`;

    const response = await apiClient.get(url);
    return response.data;
  }
};