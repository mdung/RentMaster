import apiClient from './apiClient';
import { ExportRequest } from '../../types';

export const exportApi = {
  // Export data to Excel
  exportToExcel: async (request: ExportRequest): Promise<Blob> => {
    const response = await apiClient.post('/export/excel', request, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });
    return response.data;
  },

  // Export data to CSV
  exportToCsv: async (request: ExportRequest): Promise<Blob> => {
    const response = await apiClient.post('/export/csv', request, {
      responseType: 'blob',
      headers: {
        'Accept': 'text/csv'
      }
    });
    return response.data;
  },

  // Export data to PDF
  exportToPdf: async (request: ExportRequest): Promise<Blob> => {
    const response = await apiClient.post('/export/pdf', request, {
      responseType: 'blob',
      headers: {
        'Accept': 'application/pdf'
      }
    });
    return response.data;
  },

  // Get available columns for export
  getAvailableColumns: async (entity: string): Promise<string[]> => {
    const response = await apiClient.get<string[]>(`/export/columns/${entity}`);
    return response.data;
  },

  // Download file helper
  downloadFile: (blob: Blob, filename: string, mimeType: string) => {
    const url = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Generate filename with timestamp
  generateFilename: (entity: string, type: string): string => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const extension = type.toLowerCase();
    return `${entity.toLowerCase()}_export_${timestamp}.${extension}`;
  },
};