import apiClient from './apiClient';
import {
  Document,
  DocumentTemplate,
  DocumentSignature,
  DocumentVersion,
  BulkDocumentGeneration,
  DocumentFolder,
  DocumentShare,
} from '../../types';

export interface DocumentCreateData {
  name: string;
  documentType: 'CONTRACT' | 'ID_DOCUMENT' | 'RECEIPT' | 'INVOICE' | 'LEASE_AGREEMENT' | 'MAINTENANCE_REPORT' | 'INSURANCE' | 'OTHER';
  category: 'TENANT_DOCUMENTS' | 'PROPERTY_DOCUMENTS' | 'FINANCIAL_DOCUMENTS' | 'LEGAL_DOCUMENTS' | 'MAINTENANCE_DOCUMENTS';
  relatedEntityType?: string;
  relatedEntityId?: number;
  tenantId?: number;
  propertyId?: number;
  contractId?: number;
  description?: string;
  tags: string[];
  isPublic: boolean;
  requiresSignature: boolean;
  expiryDate?: string;
  folderId?: number;
}

export interface DocumentTemplateCreateData {
  name: string;
  templateType: 'INVOICE' | 'CONTRACT' | 'LEASE_AGREEMENT' | 'RECEIPT' | 'NOTICE' | 'REPORT' | 'CUSTOM';
  content: string;
  variables: string[];
  isDefault: boolean;
  active: boolean;
  category: string;
  description?: string;
}

export interface DocumentSignatureCreateData {
  documentId: number;
  signerName: string;
  signerEmail: string;
  signerRole: 'TENANT' | 'LANDLORD' | 'WITNESS' | 'ADMIN';
  expiresAt?: string;
}

export interface BulkDocumentGenerationCreateData {
  name: string;
  templateId: number;
  recipientType: 'ALL_TENANTS' | 'ACTIVE_TENANTS' | 'SPECIFIC_TENANTS' | 'PROPERTIES' | 'CONTRACTS';
  recipientIds: number[];
  variables: Record<string, any>;
  outputFormat: 'PDF' | 'DOCX' | 'HTML';
}

export interface DocumentFolderCreateData {
  name: string;
  parentFolderId?: number;
  description?: string;
}

export interface DocumentShareCreateData {
  documentId: number;
  sharedWith: number;
  permissions: 'READ' | 'WRITE' | 'FULL';
  expiresAt?: string;
}

export const documentApi = {
  // Document Management
  getDocuments: async (params?: {
    page?: number;
    size?: number;
    documentType?: string;
    category?: string;
    tenantId?: number;
    propertyId?: number;
    folderId?: number;
    search?: string;
  }): Promise<{ content: Document[]; totalElements: number; totalPages: number }> => {
    const response = await apiClient.get('/documents', { params });
    return response.data;
  },

  getDocumentById: async (id: number): Promise<Document> => {
    const response = await apiClient.get<Document>(`/documents/${id}`);
    return response.data;
  },

  uploadDocument: async (file: File, metadata: DocumentCreateData): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));
    
    const response = await apiClient.post<Document>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateDocument: async (id: number, data: Partial<DocumentCreateData>): Promise<Document> => {
    const response = await apiClient.put<Document>(`/documents/${id}`, data);
    return response.data;
  },

  deleteDocument: async (id: number): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
  },

  downloadDocument: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/documents/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  previewDocument: async (id: number): Promise<string> => {
    const response = await apiClient.get<{ previewUrl: string }>(`/documents/${id}/preview`);
    return response.data.previewUrl;
  },

  // Document Templates
  getDocumentTemplates: async (): Promise<DocumentTemplate[]> => {
    const response = await apiClient.get<DocumentTemplate[]>('/documents/templates');
    return response.data;
  },

  getDocumentTemplateById: async (id: number): Promise<DocumentTemplate> => {
    const response = await apiClient.get<DocumentTemplate>(`/documents/templates/${id}`);
    return response.data;
  },

  createDocumentTemplate: async (data: DocumentTemplateCreateData): Promise<DocumentTemplate> => {
    const response = await apiClient.post<DocumentTemplate>('/documents/templates', data);
    return response.data;
  },

  updateDocumentTemplate: async (id: number, data: Partial<DocumentTemplateCreateData>): Promise<DocumentTemplate> => {
    const response = await apiClient.put<DocumentTemplate>(`/documents/templates/${id}`, data);
    return response.data;
  },

  deleteDocumentTemplate: async (id: number): Promise<void> => {
    await apiClient.delete(`/documents/templates/${id}`);
  },

  toggleDocumentTemplate: async (id: number): Promise<DocumentTemplate> => {
    const response = await apiClient.patch<DocumentTemplate>(`/documents/templates/${id}/toggle`);
    return response.data;
  },

  previewDocumentTemplate: async (id: number, variables: Record<string, any>): Promise<{ content: string }> => {
    const response = await apiClient.post<{ content: string }>(`/documents/templates/${id}/preview`, variables);
    return response.data;
  },

  generateDocumentFromTemplate: async (templateId: number, variables: Record<string, any>, format: 'PDF' | 'DOCX' | 'HTML' = 'PDF'): Promise<Blob> => {
    const response = await apiClient.post(`/documents/templates/${templateId}/generate`, 
      { variables, format }, 
      { responseType: 'blob' }
    );
    return response.data;
  },

  // Document Signatures
  getDocumentSignatures: async (documentId: number): Promise<DocumentSignature[]> => {
    const response = await apiClient.get<DocumentSignature[]>(`/documents/${documentId}/signatures`);
    return response.data;
  },

  createSignatureRequest: async (data: DocumentSignatureCreateData): Promise<DocumentSignature> => {
    const response = await apiClient.post<DocumentSignature>('/documents/signatures/request', data);
    return response.data;
  },

  signDocument: async (signatureId: number, signatureData: string): Promise<DocumentSignature> => {
    const response = await apiClient.post<DocumentSignature>(`/documents/signatures/${signatureId}/sign`, {
      signatureData
    });
    return response.data;
  },

  rejectSignature: async (signatureId: number, reason: string): Promise<DocumentSignature> => {
    const response = await apiClient.post<DocumentSignature>(`/documents/signatures/${signatureId}/reject`, {
      reason
    });
    return response.data;
  },

  getSignatureStatus: async (documentId: number): Promise<{ 
    totalSignatures: number; 
    pendingSignatures: number; 
    completedSignatures: number; 
    rejectedSignatures: number; 
  }> => {
    const response = await apiClient.get(`/documents/${documentId}/signature-status`);
    return response.data;
  },

  // Document Versions
  getDocumentVersions: async (documentId: number): Promise<DocumentVersion[]> => {
    const response = await apiClient.get<DocumentVersion[]>(`/documents/${documentId}/versions`);
    return response.data;
  },

  uploadNewVersion: async (documentId: number, file: File, changeDescription?: string): Promise<DocumentVersion> => {
    const formData = new FormData();
    formData.append('file', file);
    if (changeDescription) {
      formData.append('changeDescription', changeDescription);
    }
    
    const response = await apiClient.post<DocumentVersion>(`/documents/${documentId}/versions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  downloadDocumentVersion: async (documentId: number, version: number): Promise<Blob> => {
    const response = await apiClient.get(`/documents/${documentId}/versions/${version}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  restoreDocumentVersion: async (documentId: number, version: number): Promise<Document> => {
    const response = await apiClient.post<Document>(`/documents/${documentId}/versions/${version}/restore`);
    return response.data;
  },

  // Bulk Document Generation
  getBulkGenerations: async (): Promise<BulkDocumentGeneration[]> => {
    const response = await apiClient.get<BulkDocumentGeneration[]>('/documents/bulk-generation');
    return response.data;
  },

  createBulkGeneration: async (data: BulkDocumentGenerationCreateData): Promise<BulkDocumentGeneration> => {
    const response = await apiClient.post<BulkDocumentGeneration>('/documents/bulk-generation', data);
    return response.data;
  },

  getBulkGenerationById: async (id: number): Promise<BulkDocumentGeneration> => {
    const response = await apiClient.get<BulkDocumentGeneration>(`/documents/bulk-generation/${id}`);
    return response.data;
  },

  startBulkGeneration: async (id: number): Promise<void> => {
    await apiClient.post(`/documents/bulk-generation/${id}/start`);
  },

  downloadBulkGeneration: async (id: number): Promise<Blob> => {
    const response = await apiClient.get(`/documents/bulk-generation/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },

  deleteBulkGeneration: async (id: number): Promise<void> => {
    await apiClient.delete(`/documents/bulk-generation/${id}`);
  },

  // Document Folders
  getFolders: async (parentId?: number): Promise<DocumentFolder[]> => {
    const params = parentId ? { parentId } : {};
    const response = await apiClient.get<DocumentFolder[]>('/documents/folders', { params });
    return response.data;
  },

  createFolder: async (data: DocumentFolderCreateData): Promise<DocumentFolder> => {
    const response = await apiClient.post<DocumentFolder>('/documents/folders', data);
    return response.data;
  },

  updateFolder: async (id: number, data: Partial<DocumentFolderCreateData>): Promise<DocumentFolder> => {
    const response = await apiClient.put<DocumentFolder>(`/documents/folders/${id}`, data);
    return response.data;
  },

  deleteFolder: async (id: number): Promise<void> => {
    await apiClient.delete(`/documents/folders/${id}`);
  },

  moveDocument: async (documentId: number, folderId?: number): Promise<Document> => {
    const response = await apiClient.post<Document>(`/documents/${documentId}/move`, { folderId });
    return response.data;
  },

  // Document Sharing
  getDocumentShares: async (documentId: number): Promise<DocumentShare[]> => {
    const response = await apiClient.get<DocumentShare[]>(`/documents/${documentId}/shares`);
    return response.data;
  },

  shareDocument: async (data: DocumentShareCreateData): Promise<DocumentShare> => {
    const response = await apiClient.post<DocumentShare>('/documents/shares', data);
    return response.data;
  },

  updateDocumentShare: async (id: number, data: Partial<DocumentShareCreateData>): Promise<DocumentShare> => {
    const response = await apiClient.put<DocumentShare>(`/documents/shares/${id}`, data);
    return response.data;
  },

  revokeDocumentShare: async (id: number): Promise<void> => {
    await apiClient.delete(`/documents/shares/${id}`);
  },

  getSharedWithMe: async (): Promise<DocumentShare[]> => {
    const response = await apiClient.get<DocumentShare[]>('/documents/shared-with-me');
    return response.data;
  },

  // Statistics
  getDocumentStats: async (): Promise<{
    totalDocuments: number;
    totalSize: number;
    documentsByType: Record<string, number>;
    documentsByCategory: Record<string, number>;
    recentUploads: number;
    pendingSignatures: number;
    totalTemplates: number;
    activeTemplates: number;
    bulkGenerationsToday: number;
  }> => {
    const response = await apiClient.get('/documents/stats');
    return response.data;
  },

  // Search
  searchDocuments: async (query: string, filters?: {
    documentType?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<Document[]> => {
    const params = { query, ...filters };
    const response = await apiClient.get<Document[]>('/documents/search', { params });
    return response.data;
  },

  // Tags
  getDocumentTags: async (): Promise<string[]> => {
    const response = await apiClient.get<string[]>('/documents/tags');
    return response.data;
  },

  addDocumentTag: async (documentId: number, tag: string): Promise<Document> => {
    const response = await apiClient.post<Document>(`/documents/${documentId}/tags`, { tag });
    return response.data;
  },

  removeDocumentTag: async (documentId: number, tag: string): Promise<Document> => {
    const response = await apiClient.delete<Document>(`/documents/${documentId}/tags/${tag}`);
    return response.data;
  },
};