import apiClient from './apiClient';
import { Invoice } from '../../types';

export interface InvoiceGenerateRequest {
  contractId: number;
  periodStart: string;
  periodEnd: string;
  issueDate?: string;
  dueDate?: string;
}

export const invoiceApi = {
  getAll: async (status?: string): Promise<Invoice[]> => {
    const params = status ? { status } : {};
    const response = await apiClient.get<Invoice[]>('/invoices', { params });
    return response.data;
  },
  getByContractId: async (contractId: number): Promise<Invoice[]> => {
    const response = await apiClient.get<Invoice[]>(`/invoices/contract/${contractId}`);
    return response.data;
  },
  getById: async (id: number): Promise<Invoice> => {
    const response = await apiClient.get<Invoice>(`/invoices/${id}`);
    return response.data;
  },
  generate: async (data: InvoiceGenerateRequest): Promise<Invoice> => {
    const response = await apiClient.post<Invoice>('/invoices/generate', data);
    return response.data;
  },
};

