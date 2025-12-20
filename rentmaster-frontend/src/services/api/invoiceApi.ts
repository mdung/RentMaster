import apiClient from './apiClient';
import { Invoice } from '../../types';

export interface MeterReadingInput {
  serviceId: number;
  currentIndex: number;
}

export interface InvoiceGenerateRequest {
  contractId: number;
  periodStart: string;
  periodEnd: string;
  issueDate?: string;
  dueDate?: string;
  meterReadings?: MeterReadingInput[];
}

export interface InvoicePageResponse {
  items: Invoice[];
  total: number;
}

export const invoiceApi = {
  getAll: async (status?: string): Promise<Invoice[]> => {
    const params = status ? { status } : {};
    const response = await apiClient.get<Invoice[]>('/invoices', { params });
    return response.data;
  },
  getPaged: async (status: string | undefined, page: number, size: number): Promise<InvoicePageResponse> => {
    const params: any = { page, size };
    if (status) params.status = status;
    const response = await apiClient.get<InvoicePageResponse>('/invoices/paged', { params });
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

