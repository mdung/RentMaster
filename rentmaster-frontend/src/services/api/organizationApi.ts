import apiClient from './apiClient';

export interface Organization {
  id: number;
  code: string;
  name: string;
  displayName?: string;
  description?: string;
  type: string;
  status: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  subscriptionPlan?: string;
  isTrial?: boolean;
  maxProperties?: number;
  maxUsers?: number;
  maxTenants?: number;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  createdAt: string;
}

export interface OrganizationCreateDTO {
  code: string;
  name: string;
  displayName?: string;
  description?: string;
  type: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  subscriptionPlan?: string;
  maxProperties?: number;
  maxUsers?: number;
  maxTenants?: number;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export const organizationApi = {
  getAll: async (): Promise<Organization[]> => {
    const response = await apiClient.get<Organization[]>('/organizations');
    return response.data;
  },

  getById: async (id: number): Promise<Organization> => {
    const response = await apiClient.get<Organization>(`/organizations/${id}`);
    return response.data;
  },

  getByCode: async (code: string): Promise<Organization> => {
    const response = await apiClient.get<Organization>(`/organizations/code/${code}`);
    return response.data;
  },

  create: async (data: OrganizationCreateDTO): Promise<Organization> => {
    const response = await apiClient.post<Organization>('/organizations', data);
    return response.data;
  },

  update: async (id: number, data: OrganizationCreateDTO): Promise<Organization> => {
    const response = await apiClient.put<Organization>(`/organizations/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/organizations/${id}`);
  },

  toggleStatus: async (id: number): Promise<Organization> => {
    const response = await apiClient.patch<Organization>(`/organizations/${id}/toggle-status`);
    return response.data;
  },
};

