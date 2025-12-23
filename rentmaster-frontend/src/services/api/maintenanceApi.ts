import apiClient from './apiClient';

export interface MaintenanceRequest {
  id?: number;
  propertyId: number;
  roomId?: number;
  tenantId?: number;
  title: string;
  description?: string;
  category: string;
  priority: string;
  status: string;
  location?: string;
  preferredTime?: string;
  allowEntry?: boolean;
  assignedTo?: number;
  workOrderId?: number;
  estimatedCost?: number;
  actualCost?: number;
  completedDate?: string;
  completionNotes?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  photos?: string[];
}

export interface WorkOrder {
  id?: number;
  workOrderNumber?: string;
  propertyId: number;
  maintenanceRequestId?: number;
  vendorId?: number;
  assignedTo?: number;
  title: string;
  description?: string;
  workType: string;
  priority: string;
  status: string;
  scheduledDate?: string;
  startedDate?: string;
  completedDate?: string;
  estimatedDuration?: number;
  actualDuration?: number;
  estimatedCost?: number;
  actualCost?: number;
  location?: string;
  specialInstructions?: string;
  materials?: string[];
  photos?: string[];
  completionNotes?: string;
  tenantSatisfactionRating?: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: number;
}

export interface Asset {
  id?: number;
  propertyId: number;
  roomId?: number;
  assetCode: string;
  name: string;
  category: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpiryDate?: string;
  currentValue?: number;
  depreciationRate?: number;
  location?: string;
  status: string;
  condition?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  maintenanceIntervalDays?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Vendor {
  id: number;
  name: string;
  companyName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
  licenseNumber?: string;
  insuranceInfo?: string;
  taxId?: string;
  rating?: number;
  hourlyRate?: number;
  emergencyContact?: string;
  availability?: string;
  totalJobs?: number;
  averageCost?: number;
  notes?: string;
  isPreferred?: boolean;
  isActive?: boolean;
  specialties?: string[];
  serviceAreas?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceSchedule {
  id: number;
  propertyId: number;
  vendorId?: number;
  title: string;
  description?: string;
  maintenanceType?: string;
  priority?: string;
  status?: string;
  scheduledDate?: string;
  estimatedDuration?: number;
  estimatedCost?: number;
  actualCost?: number;
  recurrenceType?: string;
  recurrenceInterval?: number;
  nextDueDate?: string;
  location?: string;
  specialInstructions?: string;
  completedDate?: string;
  completedBy?: string;
  completionNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const maintenanceApi = {
  // Maintenance Requests
  getMaintenanceRequests: async (params?: { propertyId?: number; status?: string; priority?: string }): Promise<MaintenanceRequest[]> => {
    const response = await apiClient.get('/maintenance/requests', { params });
    return response.data;
  },

  getMaintenanceRequest: async (id: number): Promise<MaintenanceRequest> => {
    const response = await apiClient.get(`/maintenance/requests/${id}`);
    return response.data;
  },

  createMaintenanceRequest: async (request: MaintenanceRequest): Promise<MaintenanceRequest> => {
    const response = await apiClient.post('/maintenance/requests', request);
    return response.data;
  },

  updateMaintenanceRequest: async (id: number, request: MaintenanceRequest): Promise<MaintenanceRequest> => {
    const response = await apiClient.put(`/maintenance/requests/${id}`, request);
    return response.data;
  },

  deleteMaintenanceRequest: async (id: number): Promise<void> => {
    await apiClient.delete(`/maintenance/requests/${id}`);
  },

  // Work Orders
  getWorkOrders: async (params?: { propertyId?: number; status?: string; vendorId?: number }): Promise<WorkOrder[]> => {
    const response = await apiClient.get('/maintenance/work-orders', { params });
    return response.data;
  },

  getWorkOrder: async (id: number): Promise<WorkOrder> => {
    const response = await apiClient.get(`/maintenance/work-orders/${id}`);
    return response.data;
  },

  createWorkOrder: async (workOrder: WorkOrder): Promise<WorkOrder> => {
    const response = await apiClient.post('/maintenance/work-orders', workOrder);
    return response.data;
  },

  updateWorkOrder: async (id: number, workOrder: WorkOrder): Promise<WorkOrder> => {
    const response = await apiClient.put(`/maintenance/work-orders/${id}`, workOrder);
    return response.data;
  },

  deleteWorkOrder: async (id: number): Promise<void> => {
    await apiClient.delete(`/maintenance/work-orders/${id}`);
  },

  // Assets
  getAssets: async (params?: { propertyId?: number; category?: string; status?: string }): Promise<Asset[]> => {
    const response = await apiClient.get('/maintenance/assets', { params });
    return response.data;
  },

  getAsset: async (id: number): Promise<Asset> => {
    const response = await apiClient.get(`/maintenance/assets/${id}`);
    return response.data;
  },

  createAsset: async (asset: Asset): Promise<Asset> => {
    const response = await apiClient.post('/maintenance/assets', asset);
    return response.data;
  },

  updateAsset: async (id: number, asset: Asset): Promise<Asset> => {
    const response = await apiClient.put(`/maintenance/assets/${id}`, asset);
    return response.data;
  },

  deleteAsset: async (id: number): Promise<void> => {
    await apiClient.delete(`/maintenance/assets/${id}`);
  },

  // Vendors
  getVendors: async (): Promise<Vendor[]> => {
    const response = await apiClient.get('/maintenance/vendors');
    return response.data;
  },

  // Maintenance History
  getMaintenanceHistory: async (propertyId?: number): Promise<MaintenanceSchedule[]> => {
    const response = await apiClient.get('/maintenance/history', { params: { propertyId } });
    return response.data;
  },
};

