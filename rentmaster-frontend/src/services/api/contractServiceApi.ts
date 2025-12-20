import apiClient from './apiClient';

export interface ContractService {
  id: number;
  contractId: number;
  contractCode: string;
  serviceId: number;
  serviceName: string;
  serviceType: string;
  pricingModel: string;
  defaultUnitPrice?: number;
  customPrice?: number;
  unitName?: string;
  active: boolean;
}

export interface ContractServiceCreateData {
  contractId: number;
  serviceId: number;
  customPrice?: number;
  active?: boolean;
}

export const contractServiceApi = {
  getByContractId: async (contractId: number): Promise<ContractService[]> => {
    const response = await apiClient.get<ContractService[]>(`/contract-services/contract/${contractId}`);
    return response.data;
  },
  getById: async (id: number): Promise<ContractService> => {
    const response = await apiClient.get<ContractService>(`/contract-services/${id}`);
    return response.data;
  },
  create: async (data: ContractServiceCreateData): Promise<ContractService> => {
    const response = await apiClient.post<ContractService>('/contract-services', data);
    return response.data;
  },
  update: async (id: number, data: ContractServiceCreateData): Promise<ContractService> => {
    const response = await apiClient.put<ContractService>(`/contract-services/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/contract-services/${id}`);
  },
  toggleActive: async (id: number): Promise<ContractService> => {
    const response = await apiClient.put<ContractService>(`/contract-services/${id}/toggle-active`);
    return response.data;
  },
};



