import apiClient from './apiClient';

export interface PropertyAmenity {
  id: number;
  name: string;
  category: string;
  description?: string;
  available: boolean;
  cost?: number;
}

export interface PropertyImage {
  id: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  category: string;
  description?: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface FloorPlan {
  id: number;
  name: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  floor: string;
  roomCount: number;
  totalArea: number;
  description?: string;
  uploadedAt: string;
}

export interface MaintenanceSchedule {
  id: number;
  title: string;
  description: string;
  maintenanceType: string;
  recurrenceType: string;
  recurrenceInterval?: number;
  nextDueDate: string;
  scheduledDate?: string;
  completedDate?: string;
  completedBy?: string;
  assignedVendor?: string;
  vendorId?: number;
  estimatedCost?: number;
  actualCost?: number;
  priority: string;
  status: string;
  location?: string;
  specialInstructions?: string;
}

export interface Vendor {
  id: number;
  name: string;
  companyName?: string;
  contactPerson?: string;
  phone: string;
  mobile?: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
  specialties?: string[];
  serviceAreas?: string[];
  rating: number;
  totalJobs: number;
  averageCost: number;
  hourlyRate?: number;
  isPreferred: boolean;
  isActive: boolean;
  notes?: string;
  availability?: string;
}

export interface PropertyAnalytics {
  id: number;
  propertyId: number;
  month: string;
  occupancyRate: number;
  averageRent: number;
  totalRevenue: number;
  maintenanceCosts: number;
  profitMargin: number;
  tenantSatisfaction: number;
  renewalRate: number;
}

export const propertyManagementApi = {
  // Property Amenities
  getAmenities: async (propertyId: number): Promise<PropertyAmenity[]> => {
    const response = await apiClient.get(`/property-management/${propertyId}/amenities`);
    return response.data;
  },

  createAmenity: async (propertyId: number, amenity: Omit<PropertyAmenity, 'id'>): Promise<PropertyAmenity> => {
    const response = await apiClient.post(`/property-management/${propertyId}/amenities`, amenity);
    return response.data;
  },

  updateAmenity: async (propertyId: number, amenityId: number, amenity: Partial<PropertyAmenity>): Promise<PropertyAmenity> => {
    const response = await apiClient.put(`/property-management/${propertyId}/amenities/${amenityId}`, amenity);
    return response.data;
  },

  deleteAmenity: async (propertyId: number, amenityId: number): Promise<void> => {
    await apiClient.delete(`/property-management/${propertyId}/amenities/${amenityId}`);
  },

  // Property Images
  getImages: async (propertyId: number): Promise<PropertyImage[]> => {
    const response = await apiClient.get(`/property-management/${propertyId}/images`);
    return response.data;
  },

  uploadImage: async (propertyId: number, file: File, category: string, description?: string): Promise<PropertyImage> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    if (description) formData.append('description', description);

    const response = await apiClient.post(`/property-management/${propertyId}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateImage: async (propertyId: number, imageId: number, updates: Partial<PropertyImage>): Promise<PropertyImage> => {
    const response = await apiClient.put(`/property-management/${propertyId}/images/${imageId}`, updates);
    return response.data;
  },

  deleteImage: async (propertyId: number, imageId: number): Promise<void> => {
    await apiClient.delete(`/property-management/${propertyId}/images/${imageId}`);
  },

  setPrimaryImage: async (propertyId: number, imageId: number): Promise<void> => {
    await apiClient.post(`/property-management/${propertyId}/images/${imageId}/set-primary`);
  },

  // Floor Plans
  getFloorPlans: async (propertyId: number): Promise<FloorPlan[]> => {
    const response = await apiClient.get(`/property-management/${propertyId}/floor-plans`);
    return response.data;
  },

  uploadFloorPlan: async (propertyId: number, file: File, floorPlan: Omit<FloorPlan, 'id' | 'fileName' | 'filePath' | 'fileSize' | 'uploadedAt'>): Promise<FloorPlan> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', floorPlan.name);
    formData.append('floor', floorPlan.floor);
    formData.append('roomCount', floorPlan.roomCount.toString());
    formData.append('totalArea', floorPlan.totalArea.toString());
    if (floorPlan.description) formData.append('description', floorPlan.description);

    const response = await apiClient.post(`/property-management/${propertyId}/floor-plans`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateFloorPlan: async (propertyId: number, floorPlanId: number, updates: Partial<FloorPlan>): Promise<FloorPlan> => {
    const response = await apiClient.put(`/property-management/${propertyId}/floor-plans/${floorPlanId}`, updates);
    return response.data;
  },

  deleteFloorPlan: async (propertyId: number, floorPlanId: number): Promise<void> => {
    await apiClient.delete(`/property-management/${propertyId}/floor-plans/${floorPlanId}`);
  },

  // Maintenance Schedules
  getMaintenanceSchedules: async (propertyId: number): Promise<MaintenanceSchedule[]> => {
    const response = await apiClient.get(`/property-management/${propertyId}/maintenance-schedules`);
    return response.data;
  },

  createMaintenanceSchedule: async (propertyId: number, schedule: Omit<MaintenanceSchedule, 'id'>): Promise<MaintenanceSchedule> => {
    const response = await apiClient.post(`/property-management/${propertyId}/maintenance-schedules`, schedule);
    return response.data;
  },

  updateMaintenanceSchedule: async (propertyId: number, scheduleId: number, updates: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule> => {
    const response = await apiClient.put(`/property-management/${propertyId}/maintenance-schedules/${scheduleId}`, updates);
    return response.data;
  },

  deleteMaintenanceSchedule: async (propertyId: number, scheduleId: number): Promise<void> => {
    await apiClient.delete(`/property-management/${propertyId}/maintenance-schedules/${scheduleId}`);
  },

  completeMaintenanceTask: async (propertyId: number, scheduleId: number, completionData: Record<string, any>): Promise<void> => {
    await apiClient.post(`/property-management/${propertyId}/maintenance-schedules/${scheduleId}/complete`, completionData);
  },

  // Vendors
  getVendors: async (): Promise<Vendor[]> => {
    const response = await apiClient.get('/property-management/vendors');
    return response.data;
  },

  createVendor: async (vendor: Omit<Vendor, 'id' | 'rating' | 'totalJobs' | 'averageCost'>): Promise<Vendor> => {
    const response = await apiClient.post('/property-management/vendors', vendor);
    return response.data;
  },

  updateVendor: async (vendorId: number, updates: Partial<Vendor>): Promise<Vendor> => {
    const response = await apiClient.put(`/property-management/vendors/${vendorId}`, updates);
    return response.data;
  },

  deleteVendor: async (vendorId: number): Promise<void> => {
    await apiClient.delete(`/property-management/vendors/${vendorId}`);
  },

  rateVendor: async (vendorId: number, rating: number, feedback?: string): Promise<void> => {
    await apiClient.post(`/property-management/vendors/${vendorId}/rate`, { rating, feedback });
  },

  // Property Analytics
  getPropertyAnalytics: async (propertyId: number, startDate?: string, endDate?: string): Promise<PropertyAnalytics[]> => {
    let url = `/property-management/${propertyId}/analytics`;
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  getPropertyComparison: async (propertyIds: number[]): Promise<Record<string, any>> => {
    const response = await apiClient.post('/property-management/analytics/comparison', { propertyIds });
    return response.data;
  },

  // Room Management
  getRoomsByProperty: async (propertyId: number): Promise<any[]> => {
    const response = await apiClient.get(`/property-management/${propertyId}/rooms`);
    return response.data;
  },

  updateRoomStatus: async (propertyId: number, roomId: number, status: string): Promise<void> => {
    await apiClient.put(`/property-management/${propertyId}/rooms/${roomId}/status`, { status });
  },

  bulkUpdateRooms: async (propertyId: number, updates: Record<string, any>[]): Promise<void> => {
    await apiClient.post(`/property-management/${propertyId}/rooms/bulk-update`, { updates });
  }
};