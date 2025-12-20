import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { documentApi } from '../services/api/documentApi';
import {
  Document,
  DocumentTemplate,
  DocumentSignature,
  BulkDocumentGeneration,
  DocumentFolder,
} from '../types';
import './DocumentManagementPage.css';

export const DocumentManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'templates' | 'signatures' | 'bulk' | 'folders'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [bulkGenerations, setBulkGenerations] = useState<BulkDocumentGeneration[]>([]);
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState<number | null>(null);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        statsData,
        documentsData,
        templatesData,
        bulkData,
        foldersData,
      ] = await Promise.all([
        documentApi.getDocumentStats(),
        documentApi.getDocuments({ page: 0, size: 50 }),
        documentApi.getDocumentTemplates(),
        documentApi.getBulkGenerations(),
        documentApi.getFolders(),
      ]);

      setStats(statsData);
      setDocuments(documentsData.content);
      setTemplates(templatesData);
      setBulkGenerations(bulkData);
      setFolders(foldersData);
    } catch (error) {
      console.error('Failed to load document data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'CONTRACT': return '📄';
      case 'ID_DOCUMENT': return '🆔';
      case 'RECEIPT': return '🧾';
      case 'INVOICE': return '💰';
      case 'LEASE_AGREEMENT': return '🏠';
      case 'MAINTENANCE_REPORT': return '🔧';
      case 'INSURANCE': return '🛡️';
      default: return '📎';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'SIGNED':
      case 'COMPLETED':
      case 'ACTIVE': return 'success';
      case 'PENDING':
      case 'GENERATING': return 'warning';
      case 'REJECTED':
      case 'FAILED': return 'danger';
      case 'NOT_REQUIRED': return 'info';
      default: return 'gray';
    }
  };

  const handleDocumentUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const metadata = {
        name: file.name,
        documentType: 'OTHER' as const,
        category: 'TENANT_DOCUMENTS' as const,
        tags: [],
        isPublic: false,
        requiresSignature: false,
        folderId: currentFolder || undefined,
      };

      await documentApi.uploadDocument(file, metadata);
      loadData();
      alert('Document uploaded successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload document');
    }
  };

  const handleDownloadDocument = async (document: Document) => {
    try {
      const blob = await documentApi.downloadDocument(document.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.originalFileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to download document');
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentApi.deleteDocument(id);
      loadData();
    } catch (error) {
      alert('Failed to delete document');
    }
  };

  const handleToggleTemplate = async (id: number) => {
    try {
      await documentApi.toggleDocumentTemplate(id);
      loadData();
    } catch (error) {
      alert('Failed to toggle template');
    }
  };

  const handleStartBulkGeneration = async (id: number) => {
    try {
      await documentApi.startBulkGeneration(id);
      loadData();
      alert('Bulk generation started!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to start bulk generation');
    }
  };

  const toggleDocumentSelection = (documentId: number) => {
    setSelectedDocuments(prev => 
      prev.includes(documentId) 
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const selectAllDocuments = () => {
    setSelectedDocuments(
      selectedDocuments.length === documents.length 
        ? [] 
        : documents.map(doc => doc.id)
    );
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="document-management-page">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading document data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="document-management-page">
        <div className="page-header">
          <div>
            <h1>Document Management</h1>
            <p className="page-subtitle">Store, organize, and manage all your documents</p>
          </div>
          <div className="header-actions">
            <input
              type="file"
              id="document-upload"
              style={{ display: 'none' }}
              onChange={handleDocumentUpload}
              multiple
            />
            <button
              className="btn btn-secondary"
              onClick={() => document.getElementById('document-upload')?.click()}
            >
              <span>📤</span> Upload Documents
            </button>
            <button className="btn btn-primary">
              <span>➕</span> Create Template
            </button>
          </div>
        </div>

        <div className="document-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>📊</span> Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <span>📁</span> Documents
          </button>
          <button
            className={`tab-button ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <span>📝</span> Templates
          </button>
          <button
            className={`tab-button ${activeTab === 'signatures' ? 'active' : ''}`}
            onClick={() => setActiveTab('signatures')}
          >
            <span>✍️</span> Signatures
          </button>
          <button
            className={`tab-button ${activeTab === 'bulk' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulk')}
          >
            <span>📋</span> Bulk Generation
          </button>
          <button
            className={`tab-button ${activeTab === 'folders' ? 'active' : ''}`}
            onClick={() => setActiveTab('folders')}
          >
            <span>🗂️</span> Folders
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && stats && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📁</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.totalDocuments}</div>
                    <div className="stat-label">Total Documents</div>
                    <div className="stat-sublabel">{formatFileSize(stats.totalSize)}</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📝</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.activeTemplates}</div>
                    <div className="stat-label">Active Templates</div>
                    <div className="stat-sublabel">of {stats.totalTemplates} total</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✍️</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.pendingSignatures}</div>
                    <div className="stat-label">Pending Signatures</div>
                    <div className="stat-sublabel">Awaiting signature</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📤</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.recentUploads}</div>
                    <div className="stat-label">Recent Uploads</div>
                    <div className="stat-sublabel">Last 7 days</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📋</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.bulkGenerationsToday}</div>
                    <div className="stat-label">Bulk Generations</div>
                    <div className="stat-sublabel">Today</div>
                  </div>
                </div>
              </div>

              <div className="charts-grid">
                <div className="chart-card">
                  <h3>Documents by Type</h3>
                  <div className="chart-content">
                    {Object.entries(stats.documentsByType).map(([type, count]) => (
                      <div key={type} className="chart-item">
                        <span className="chart-label">
                          {getDocumentTypeIcon(type)} {type.replace('_', ' ')}
                        </span>
                        <span className="chart-value">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="chart-card">
                  <h3>Documents by Category</h3>
                  <div className="chart-content">
                    {Object.entries(stats.documentsByCategory).map(([category, count]) => (
                      <div key={category} className="chart-item">
                        <span className="chart-label">{category.replace('_', ' ')}</span>
                        <span className="chart-value">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="quick-actions-grid">
                <div className="quick-action-card">
                  <div className="quick-action-icon">📤</div>
                  <h3>Upload Documents</h3>
                  <p>Upload contracts, receipts, IDs, and other important documents</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => document.getElementById('document-upload')?.click()}
                  >
                    Upload Files
                  </button>
                </div>
                <div className="quick-action-card">
                  <div className="quick-action-icon">📝</div>
                  <h3>Create Template</h3>
                  <p>Design customizable templates for invoices and contracts</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveTab('templates')}
                  >
                    Manage Templates
                  </button>
                </div>
                <div className="quick-action-card">
                  <div className="quick-action-icon">✍️</div>
                  <h3>Digital Signatures</h3>
                  <p>Request and manage electronic signatures for documents</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveTab('signatures')}
                  >
                    Manage Signatures
                  </button>
                </div>
                <div className="quick-action-card">
                  <div className="quick-action-icon">📋</div>
                  <h3>Bulk Generation</h3>
                  <p>Generate multiple documents at once using templates</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveTab('bulk')}
                  >
                    Bulk Generate
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="documents-tab">
              <div className="tab-header">
                <div className="tab-header-left">
                  <h2>Documents</h2>
                  <div className="document-actions">
                    {selectedDocuments.length > 0 && (
                      <>
                        <button className="btn btn-secondary">
                          <span>📤</span> Download Selected ({selectedDocuments.length})
                        </button>
                        <button className="btn btn-danger">
                          <span>🗑️</span> Delete Selected
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="tab-header-right">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="Search documents..."
                      className="search-input"
                    />
                    <button className="search-button">🔍</button>
                  </div>
                  <select className="filter-select">
                    <option value="">All Types</option>
                    <option value="CONTRACT">Contracts</option>
                    <option value="INVOICE">Invoices</option>
                    <option value="RECEIPT">Receipts</option>
                    <option value="ID_DOCUMENT">ID Documents</option>
                  </select>
                </div>
              </div>

              <div className="documents-grid">
                <div className="documents-header">
                  <div className="select-all">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.length === documents.length && documents.length > 0}
                      onChange={selectAllDocuments}
                    />
                    <span>Select All</span>
                  </div>
                  <div className="view-options">
                    <button className="view-button active">📋</button>
                    <button className="view-button">🔲</button>
                  </div>
                </div>

                <div className="documents-list">
                  {documents.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-content">
                        <span className="empty-icon">📁</span>
                        <h3>No Documents</h3>
                        <p>Upload your first document to get started.</p>
                        <button
                          className="btn btn-primary"
                          onClick={() => document.getElementById('document-upload')?.click()}
                        >
                          Upload Document
                        </button>
                      </div>
                    </div>
                  ) : (
                    documents.map((document) => (
                      <div key={document.id} className="document-item">
                        <div className="document-select">
                          <input
                            type="checkbox"
                            checked={selectedDocuments.includes(document.id)}
                            onChange={() => toggleDocumentSelection(document.id)}
                          />
                        </div>
                        <div className="document-icon">
                          {getDocumentTypeIcon(document.documentType)}
                        </div>
                        <div className="document-info">
                          <div className="document-name">{document.name}</div>
                          <div className="document-meta">
                            <span className="document-type">{document.documentType}</span>
                            <span className="document-size">{formatFileSize(document.fileSize)}</span>
                            <span className="document-date">{formatDate(document.createdAt)}</span>
                          </div>
                          {document.tags.length > 0 && (
                            <div className="document-tags">
                              {document.tags.map((tag, index) => (
                                <span key={index} className="tag">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="document-status">
                          <span className={`status-badge ${getStatusBadgeClass(document.signatureStatus)}`}>
                            {document.signatureStatus.replace('_', ' ')}
                          </span>
                          {document.version > 1 && (
                            <span className="version-badge">v{document.version}</span>
                          )}
                        </div>
                        <div className="document-actions">
                          <button
                            className="btn-icon"
                            onClick={() => handleDownloadDocument(document)}
                            title="Download"
                          >
                            📥
                          </button>
                          <button className="btn-icon" title="Preview">
                            👁️
                          </button>
                          <button className="btn-icon" title="Share">
                            🔗
                          </button>
                          <button className="btn-icon" title="Edit">
                            ✏️
                          </button>
                          <button
                            className="btn-icon danger"
                            onClick={() => handleDeleteDocument(document.id)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="templates-tab">
              <div className="tab-header">
                <h2>Document Templates</h2>
                <button className="btn btn-primary">
                  <span>➕</span> Create Template
                </button>
              </div>
              
              <div className="templates-grid">
                {templates.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">📝</span>
                      <h3>No Templates</h3>
                      <p>Create your first document template to get started.</p>
                      <button className="btn btn-primary">
                        Create Template
                      </button>
                    </div>
                  </div>
                ) : (
                  templates.map((template) => (
                    <div key={template.id} className="template-card">
                      <div className="template-header">
                        <div className="template-info">
                          <h3>{template.name}</h3>
                          <span className={`status-badge ${template.templateType.toLowerCase()}`}>
                            {template.templateType}
                          </span>
                          {template.isDefault && (
                            <span className="status-badge default">Default</span>
                          )}
                        </div>
                        <div className="template-status">
                          <span className={`status-badge ${template.active ? 'success' : 'gray'}`}>
                            {template.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="template-content">
                        <div className="template-description">
                          {template.description || 'No description provided'}
                        </div>
                        {template.variables.length > 0 && (
                          <div className="template-variables">
                            <strong>Variables:</strong>
                            <div className="variables-list">
                              {template.variables.slice(0, 3).map((variable, index) => (
                                <span key={index} className="variable-tag">
                                  {variable}
                                </span>
                              ))}
                              {template.variables.length > 3 && (
                                <span className="variable-tag more">
                                  +{template.variables.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        <div className="template-meta">
                          <span>Created by {template.createdByName}</span>
                          <span>{formatDate(template.createdAt)}</span>
                        </div>
                      </div>

                      <div className="template-actions">
                        <button className="btn-icon" title="Preview">
                          👁️
                        </button>
                        <button className="btn-icon" title="Generate">
                          📄
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleToggleTemplate(template.id)}
                          title={template.active ? 'Deactivate' : 'Activate'}
                        >
                          {template.active ? '⏸️' : '▶️'}
                        </button>
                        <button className="btn-icon" title="Edit">
                          ✏️
                        </button>
                        <button className="btn-icon danger" title="Delete">
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'signatures' && (
            <div className="signatures-tab">
              <div className="tab-header">
                <h2>Digital Signatures</h2>
                <button className="btn btn-primary">
                  <span>✍️</span> Request Signature
                </button>
              </div>
              
              <div className="signatures-content">
                <div className="signature-stats">
                  <div className="stat-item">
                    <span className="stat-number">12</span>
                    <span className="stat-label">Pending</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">45</span>
                    <span className="stat-label">Completed</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">3</span>
                    <span className="stat-label">Rejected</span>
                  </div>
                </div>

                <div className="signatures-list">
                  <div className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">✍️</span>
                      <h3>No Signature Requests</h3>
                      <p>Create signature requests for your documents.</p>
                      <button className="btn btn-primary">
                        Request Signature
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bulk' && (
            <div className="bulk-tab">
              <div className="tab-header">
                <h2>Bulk Document Generation</h2>
                <button className="btn btn-primary">
                  <span>📋</span> Create Bulk Generation
                </button>
              </div>
              
              <div className="bulk-generations-list">
                {bulkGenerations.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">📋</span>
                      <h3>No Bulk Generations</h3>
                      <p>Create bulk document generations using templates.</p>
                      <button className="btn btn-primary">
                        Create Bulk Generation
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Template</th>
                          <th>Recipients</th>
                          <th>Status</th>
                          <th>Progress</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bulkGenerations.map((bulk) => (
                          <tr key={bulk.id}>
                            <td><strong>{bulk.name}</strong></td>
                            <td>{bulk.templateName}</td>
                            <td>
                              <div>
                                <span className="status-badge info">{bulk.recipientType}</span>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                  {bulk.totalDocuments} document(s)
                                </div>
                              </div>
                            </td>
                            <td>
                              <span className={`status-badge ${getStatusBadgeClass(bulk.status)}`}>
                                {bulk.status}
                              </span>
                            </td>
                            <td>
                              <div className="progress-info">
                                <div>{bulk.generatedCount}/{bulk.totalDocuments} generated</div>
                                {bulk.failedCount > 0 && (
                                  <div style={{ color: 'var(--danger)' }}>
                                    {bulk.failedCount} failed
                                  </div>
                                )}
                              </div>
                            </td>
                            <td>{formatDateTime(bulk.createdAt)}</td>
                            <td>
                              <div className="action-buttons">
                                {bulk.status === 'DRAFT' && (
                                  <button
                                    className="btn-icon"
                                    onClick={() => handleStartBulkGeneration(bulk.id)}
                                    title="Start Generation"
                                  >
                                    ▶️
                                  </button>
                                )}
                                {bulk.status === 'COMPLETED' && (
                                  <button className="btn-icon" title="Download">
                                    📥
                                  </button>
                                )}
                                <button className="btn-icon" title="View Details">
                                  👁️
                                </button>
                                <button className="btn-icon danger" title="Delete">
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'folders' && (
            <div className="folders-tab">
              <div className="tab-header">
                <h2>Document Folders</h2>
                <button className="btn btn-primary">
                  <span>📁</span> Create Folder
                </button>
              </div>
              
              <div className="folders-content">
                <div className="breadcrumb">
                  <button className="breadcrumb-item">📁 Root</button>
                </div>

                <div className="folders-grid">
                  {folders.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-content">
                        <span className="empty-icon">📁</span>
                        <h3>No Folders</h3>
                        <p>Create folders to organize your documents.</p>
                        <button className="btn btn-primary">
                          Create Folder
                        </button>
                      </div>
                    </div>
                  ) : (
                    folders.map((folder) => (
                      <div key={folder.id} className="folder-card">
                        <div className="folder-icon">📁</div>
                        <div className="folder-info">
                          <h4>{folder.name}</h4>
                          <p>{folder.description}</p>
                          <div className="folder-stats">
                            <span>{folder.documentCount} documents</span>
                            <span>{folder.subfolderCount} folders</span>
                          </div>
                        </div>
                        <div className="folder-actions">
                          <button className="btn-icon" title="Open">
                            📂
                          </button>
                          <button className="btn-icon" title="Edit">
                            ✏️
                          </button>
                          <button className="btn-icon danger" title="Delete">
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};