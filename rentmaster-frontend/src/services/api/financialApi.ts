import apiClient from './apiClient';
import { 
  Currency, 
  Expense, 
  FinancialForecast, 
  ProfitLossReport, 
  TaxReport, 
  Deposit, 
  PaymentPlan 
} from '../../types';

export interface CreateExpenseRequest {
  propertyId?: number;
  category: string;
  description: string;
  amount: number;
  currency: string;
  expenseDate: string;
  vendor?: string;
  receiptNumber?: string;
  notes?: string;
}

export interface CreateDepositRequest {
  contractId: number;
  amount: number;
  currency: string;
  depositDate: string;
  notes?: string;
}

export interface CreatePaymentPlanRequest {
  invoiceId: number;
  installments: number;
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  startDate: string;
}

export interface RefundDepositRequest {
  refundAmount: number;
  deductions: Array<{
    description: string;
    amount: number;
    category: string;
  }>;
  notes?: string;
}

export const financialApi = {
  // Currency Management
  getCurrencies: async (): Promise<Currency[]> => {
    const response = await apiClient.get<Currency[]>('/financial/currencies');
    return response.data;
  },

  createCurrency: async (currency: Omit<Currency, 'id'>): Promise<Currency> => {
    const response = await apiClient.post<Currency>('/financial/currencies', currency);
    return response.data;
  },

  updateCurrency: async (id: number, currency: Partial<Currency>): Promise<Currency> => {
    const response = await apiClient.put<Currency>(`/financial/currencies/${id}`, currency);
    return response.data;
  },

  setDefaultCurrency: async (id: number): Promise<void> => {
    await apiClient.patch(`/financial/currencies/${id}/set-default`);
  },

  updateExchangeRates: async (): Promise<void> => {
    await apiClient.post('/financial/currencies/update-rates');
  },

  // Expense Tracking
  getExpenses: async (filters?: {
    propertyId?: number;
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Expense[]> => {
    const params = new URLSearchParams();
    if (filters?.propertyId) params.append('propertyId', filters.propertyId.toString());
    if (filters?.category) params.append('category', filters.category);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await apiClient.get<Expense[]>(`/financial/expenses?${params}`);
    return response.data;
  },

  createExpense: async (expense: CreateExpenseRequest): Promise<Expense> => {
    const response = await apiClient.post<Expense>('/financial/expenses', expense);
    return response.data;
  },

  updateExpense: async (id: number, expense: Partial<CreateExpenseRequest>): Promise<Expense> => {
    const response = await apiClient.put<Expense>(`/financial/expenses/${id}`, expense);
    return response.data;
  },

  deleteExpense: async (id: number): Promise<void> => {
    await apiClient.delete(`/financial/expenses/${id}`);
  },

  getExpenseCategories: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/financial/expenses/categories');
    return response.data;
  },

  // Financial Forecasting
  getForecast: async (months: number = 12): Promise<FinancialForecast[]> => {
    const response = await apiClient.get<FinancialForecast[]>(`/financial/forecast?months=${months}`);
    return response.data;
  },

  generateForecast: async (months: number = 12): Promise<FinancialForecast[]> => {
    const response = await apiClient.post<FinancialForecast[]>(`/financial/forecast/generate?months=${months}`);
    return response.data;
  },

  // Profit & Loss Reports
  getProfitLossReport: async (startDate: string, endDate: string): Promise<ProfitLossReport> => {
    const response = await apiClient.get<ProfitLossReport>(
      `/financial/reports/profit-loss?startDate=${startDate}&endDate=${endDate}`
    );
    return response.data;
  },

  // Tax Management
  getTaxReports: async (year?: number): Promise<TaxReport[]> => {
    const params = year ? `?year=${year}` : '';
    const response = await apiClient.get<TaxReport[]>(`/financial/tax-reports${params}`);
    return response.data;
  },

  generateTaxReport: async (year: number, quarter?: number): Promise<TaxReport> => {
    const params = new URLSearchParams();
    params.append('year', year.toString());
    if (quarter) params.append('quarter', quarter.toString());

    const response = await apiClient.post<TaxReport>(`/financial/tax-reports/generate?${params}`);
    return response.data;
  },

  // Deposit Management
  getDeposits: async (status?: string): Promise<Deposit[]> => {
    const params = status ? `?status=${status}` : '';
    const response = await apiClient.get<Deposit[]>(`/financial/deposits${params}`);
    return response.data;
  },

  createDeposit: async (deposit: CreateDepositRequest): Promise<Deposit> => {
    const response = await apiClient.post<Deposit>('/financial/deposits', deposit);
    return response.data;
  },

  refundDeposit: async (id: number, refundData: RefundDepositRequest): Promise<Deposit> => {
    const response = await apiClient.post<Deposit>(`/financial/deposits/${id}/refund`, refundData);
    return response.data;
  },

  forfeitDeposit: async (id: number, reason: string): Promise<Deposit> => {
    const response = await apiClient.post<Deposit>(`/financial/deposits/${id}/forfeit`, { reason });
    return response.data;
  },

  // Payment Plans
  getPaymentPlans: async (status?: string): Promise<PaymentPlan[]> => {
    const params = status ? `?status=${status}` : '';
    const response = await apiClient.get<PaymentPlan[]>(`/financial/payment-plans${params}`);
    return response.data;
  },

  createPaymentPlan: async (plan: CreatePaymentPlanRequest): Promise<PaymentPlan> => {
    const response = await apiClient.post<PaymentPlan>('/financial/payment-plans', plan);
    return response.data;
  },

  recordInstallmentPayment: async (planId: number, installmentId: number, amount: number): Promise<PaymentPlan> => {
    const response = await apiClient.post<PaymentPlan>(
      `/financial/payment-plans/${planId}/installments/${installmentId}/pay`,
      { amount }
    );
    return response.data;
  },

  cancelPaymentPlan: async (id: number): Promise<void> => {
    await apiClient.delete(`/financial/payment-plans/${id}`);
  },
};