import apiClient from './apiClient';
import {
  RecurringInvoice,
  ContractRenewalReminder,
  ScheduledReport,
  AutomationRule,
  AutomationExecution,
} from '../../types';

export interface RecurringInvoiceCreateData {
  contractId: number;
  frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  dayOfMonth?: number;
  dayOfWeek?: number;
  nextGenerationDate: string;
  active: boolean;
  autoSend: boolean;
  template: {
    includeRent: boolean;
    includeServices: boolean;
    serviceIds: number[];
    customItems: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      amount: number;
    }>;
    daysUntilDue: number;
    notes?: string;
  };
}

export interface ContractRenewalReminderCreateData {
  contractId: number;
  daysBefore: number;
  reminderType: 'EMAIL' | 'SMS' | 'IN_APP' | 'ALL';
  autoRenewal: boolean;
  renewalTerms?: {
    extensionMonths: number;
    newRentAmount?: number;
    rentIncrease?: number;
    rentIncreaseType: 'FIXED' | 'PERCENTAGE';
    requireTenantApproval: boolean;
    approvalDeadlineDays: number;
  };
  active: boolean;
}

export interface ScheduledReportCreateData {
  name: string;
  reportType: 'REVENUE' | 'OCCUPANCY' | 'PAYMENTS' | 'EXPENSES' | 'FINANCIAL_SUMMARY' | 'CUSTOM';
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
  format: 'PDF' | 'EXCEL' | 'CSV';
  filters: Record<string, any>;
  active: boolean;
}

export interface AutomationRuleCreateData {
  name: string;
  description: string;
  triggerType: 'INVOICE_OVERDUE' | 'CONTRACT_EXPIRING' | 'PAYMENT_RECEIVED' | 'SCHEDULED' | 'MANUAL';
  triggerConditions: Record<string, any>;
  actions: Array<{
    type: 'SEND_EMAIL' | 'SEND_SMS' | 'UPDATE_STATUS' | 'CREATE_NOTIFICATION' | 'GENERATE_REPORT' | 'RENEW_CONTRACT';
    parameters: Record<string, any>;
    order: number;
  }>;
  active: boolean;
}

export const automationApi = {
  // Recurring Invoices
  getRecurringInvoices: async (): Promise<RecurringInvoice[]> => {
    const response = await apiClient.get<RecurringInvoice[]>('/automation/recurring-invoices');
    return response.data;
  },

  createRecurringInvoice: async (data: RecurringInvoiceCreateData): Promise<RecurringInvoice> => {
    const response = await apiClient.post<RecurringInvoice>('/automation/recurring-invoices', data);
    return response.data;
  },

  updateRecurringInvoice: async (id: number, data: Partial<RecurringInvoiceCreateData>): Promise<RecurringInvoice> => {
    const response = await apiClient.put<RecurringInvoice>(`/automation/recurring-invoices/${id}`, data);
    return response.data;
  },

  deleteRecurringInvoice: async (id: number): Promise<void> => {
    await apiClient.delete(`/automation/recurring-invoices/${id}`);
  },

  toggleRecurringInvoice: async (id: number): Promise<RecurringInvoice> => {
    const response = await apiClient.patch<RecurringInvoice>(`/automation/recurring-invoices/${id}/toggle`);
    return response.data;
  },

  generateNowRecurringInvoice: async (id: number): Promise<void> => {
    await apiClient.post(`/automation/recurring-invoices/${id}/generate-now`);
  },

  // Contract Renewal Reminders
  getContractRenewalReminders: async (): Promise<ContractRenewalReminder[]> => {
    const response = await apiClient.get<ContractRenewalReminder[]>('/automation/contract-renewals');
    return response.data;
  },

  createContractRenewalReminder: async (data: ContractRenewalReminderCreateData): Promise<ContractRenewalReminder> => {
    const response = await apiClient.post<ContractRenewalReminder>('/automation/contract-renewals', data);
    return response.data;
  },

  updateContractRenewalReminder: async (id: number, data: Partial<ContractRenewalReminderCreateData>): Promise<ContractRenewalReminder> => {
    const response = await apiClient.put<ContractRenewalReminder>(`/automation/contract-renewals/${id}`, data);
    return response.data;
  },

  deleteContractRenewalReminder: async (id: number): Promise<void> => {
    await apiClient.delete(`/automation/contract-renewals/${id}`);
  },

  toggleContractRenewalReminder: async (id: number): Promise<ContractRenewalReminder> => {
    const response = await apiClient.patch<ContractRenewalReminder>(`/automation/contract-renewals/${id}/toggle`);
    return response.data;
  },

  // Scheduled Reports
  getScheduledReports: async (): Promise<ScheduledReport[]> => {
    const response = await apiClient.get<ScheduledReport[]>('/automation/scheduled-reports');
    return response.data;
  },

  createScheduledReport: async (data: ScheduledReportCreateData): Promise<ScheduledReport> => {
    const response = await apiClient.post<ScheduledReport>('/automation/scheduled-reports', data);
    return response.data;
  },

  updateScheduledReport: async (id: number, data: Partial<ScheduledReportCreateData>): Promise<ScheduledReport> => {
    const response = await apiClient.put<ScheduledReport>(`/automation/scheduled-reports/${id}`, data);
    return response.data;
  },

  deleteScheduledReport: async (id: number): Promise<void> => {
    await apiClient.delete(`/automation/scheduled-reports/${id}`);
  },

  toggleScheduledReport: async (id: number): Promise<ScheduledReport> => {
    const response = await apiClient.patch<ScheduledReport>(`/automation/scheduled-reports/${id}/toggle`);
    return response.data;
  },

  runScheduledReportNow: async (id: number): Promise<void> => {
    await apiClient.post(`/automation/scheduled-reports/${id}/run-now`);
  },

  // Automation Rules
  getAutomationRules: async (): Promise<AutomationRule[]> => {
    const response = await apiClient.get<AutomationRule[]>('/automation/rules');
    return response.data;
  },

  createAutomationRule: async (data: AutomationRuleCreateData): Promise<AutomationRule> => {
    const response = await apiClient.post<AutomationRule>('/automation/rules', data);
    return response.data;
  },

  updateAutomationRule: async (id: number, data: Partial<AutomationRuleCreateData>): Promise<AutomationRule> => {
    const response = await apiClient.put<AutomationRule>(`/automation/rules/${id}`, data);
    return response.data;
  },

  deleteAutomationRule: async (id: number): Promise<void> => {
    await apiClient.delete(`/automation/rules/${id}`);
  },

  toggleAutomationRule: async (id: number): Promise<AutomationRule> => {
    const response = await apiClient.patch<AutomationRule>(`/automation/rules/${id}/toggle`);
    return response.data;
  },

  executeAutomationRule: async (id: number): Promise<void> => {
    await apiClient.post(`/automation/rules/${id}/execute`);
  },

  // Automation Executions
  getAutomationExecutions: async (ruleId?: number): Promise<AutomationExecution[]> => {
    const params = ruleId ? { ruleId } : {};
    const response = await apiClient.get<AutomationExecution[]>('/automation/executions', { params });
    return response.data;
  },

  getAutomationExecution: async (id: number): Promise<AutomationExecution> => {
    const response = await apiClient.get<AutomationExecution>(`/automation/executions/${id}`);
    return response.data;
  },

  // Dashboard Stats
  getAutomationStats: async (): Promise<{
    totalRecurringInvoices: number;
    activeRecurringInvoices: number;
    totalRenewalReminders: number;
    activeRenewalReminders: number;
    totalScheduledReports: number;
    activeScheduledReports: number;
    totalAutomationRules: number;
    activeAutomationRules: number;
    executionsToday: number;
    successRate: number;
  }> => {
    const response = await apiClient.get('/automation/stats');
    return response.data;
  },
};