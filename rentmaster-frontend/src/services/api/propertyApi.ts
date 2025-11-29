import apiClient from './apiClient';
import { Property, Room } from '../../types';

export const propertyApi = {
  getAll: async (): Promise<Property[]> => {
    const response = await apiClient.get<Property[]>('/properties');
    return response.data;
  },
  getById: async (id: number): Promise<Property> => {
    const response = await apiClient.get<Property>(`/properties/${id}`);
    return response.data;
  },
  create: async (data: Omit<Property, 'id' | 'createdAt'>): Promise<Property> => {
    const response = await apiClient.post<Property>('/properties', data);
    return response.data;
  },
  update: async (id: number, data: Omit<Property, 'id' | 'createdAt'>): Promise<Property> => {
    const response = await apiClient.put<Property>(`/properties/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/properties/${id}`);
  },
};

export const roomApi = {
  getAll: async (): Promise<Room[]> => {
    const response = await apiClient.get<Room[]>('/rooms');
    return response.data;
  },
  getByPropertyId: async (propertyId: number): Promise<Room[]> => {
    const response = await apiClient.get<Room[]>(`/rooms/property/${propertyId}`);
    return response.data;
  },
  getById: async (id: number): Promise<Room> => {
    const response = await apiClient.get<Room>(`/rooms/${id}`);
    return response.data;
  },
  create: async (data: Omit<Room, 'id' | 'propertyName'>): Promise<Room> => {
    const response = await apiClient.post<Room>('/rooms', data);
    return response.data;
  },
  update: async (id: number, data: Omit<Room, 'id' | 'propertyName'>): Promise<Room> => {
    const response = await apiClient.put<Room>(`/rooms/${id}`, data);
    return response.data;
  },
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/rooms/${id}`);
  },
};

