import apiClient from './apiClient';
import { Payment } from '../../types';

export interface PaymentCreateRequest {
  invoiceId: number;
  amount: number;
  method?: string;
  note?: string;
}

export interface PaymentUpdateRequest {
  amount?: number;
  method?: string;
  note?: string;
}

export const paymentApi = {
  getAll: async (): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>('/payments');
    return response.data;
  },
  getByInvoiceId: async (invoiceId: number): Promise<Payment[]> => {
    const response = await apiClient.get<Payment[]>(`/payments/invoice/${invoiceId}`);
    return response.data;
  },
  getById: async (id: number): Promise<Payment> => {
    const response = await apiClient.get<Payment>(`/payments/${id}`);
    return response.data;
  },
  create: async (data: PaymentCreateRequest): Promise<Payment> => {
    const response = await apiClient.post<Payment>('/payments', data);
    return response.data;
  },
  update: async (id: number, data: PaymentUpdateRequest): Promise<Payment> => {
    const response = await apiClient.put<Payment>(`/payments/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/payments/${id}`);
  },
};

