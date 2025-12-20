import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { communicationApi, EmailTemplateCreateData } from '../services/api/communicationApi';
import { EmailTemplate } from '../types';
import './EmailTemplatesPage.css';

export const EmailTemplatesPage: React.FC = () => {
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewData, setPreviewData] = useState<{ subject: string; body: string } | null>(null);
  const [formData, setFormData] = useState<EmailTemplateCreateData>({
    name: '',
    subject: '',
    body: '',
    templateType: 'CUSTOM',
    variables: [],
    isDefault: false,
    active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await communicationApi.getEmailTemplates();
      setEmailTemplates(data);
    } catch (error) {
      console.error('Failed to load email templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await communicationApi.updateEmailTemplate(editingTemplate.id, formData);
      } else {
        await communicationApi.createEmailTemplate(formData);
      }
      setShowModal(false);
      setEditingTemplate(null);
      resetForm();
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save email template');
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      body: template.body,
      templateType: template.templateType,
      variables: template.variables,
      isDefault: template.isDefault,
      active: template.active,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this email template?')) return;
    
    try {
      await communicationApi.deleteEmailTemplate(id);
      loadData();
    } catch (error) {
      alert('Failed to delete email template');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await communicationApi.toggleEmailTemplate(id);
      loadData();
    } catch (error) {
      alert('Failed to toggle email template');
    }
  };

  const handlePreview = async (template: EmailTemplate) => {
    try {
      const sampleVariables = template.variables.reduce((acc, variable) => {
        acc[variable] = getSampleValue(variable);
        return acc;
      }, {} as Record<string, any>);

      const preview = await communicationApi.previewEmailTemplate(template.id, sampleVariables);
      setPreviewData(preview);
      setPreviewMode(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to preview template');
    }
  };

  const getSampleValue = (variable: string): string => {
    const sampleValues: Record<string, string> = {
      'tenant_name': 'John Doe',
      'property_address': '123 Main Street, Apt 4B',
      'rent_amount': '$1,200.00',
      'due_date': 'March 15, 2024',
      'invoice_number': 'INV-2024-001',
      'contract_end_date': 'December 31, 2024',
      'landlord_name': 'Jane Smith',
      'company_name': 'RentMaster Properties',
      'payment_amount': '$1,200.00',
      'payment_date': 'March 10, 2024',
    };
    return sampleValues[variable] || `[${variable}]`;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      subject: '',
      body: '',
      templateType: 'CUSTOM',
      variables: [],
      isDefault: false,
      active: true,
    });
  };

  const addVariable = (variable: string) => {
    if (variable && !formData.variables.includes(variable)) {
      setFormData({
        ...formData,
        variables: [...formData.variables, variable]
      });
    }
  };

  const removeVariable = (variable: string) => {
    setFormData({
      ...formData,
      variables: formData.variables.filter(v => v !== variable)
    });
  };

  const insertVariableIntoBody = (variable: string) => {
    const textarea = document.getElementById('template-body') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end, text.length);
      const newText = before + `{{${variable}}}` + after;
      
      setFormData({
        ...formData,
        body: newText
      });
      
      // Set cursor position after the inserted variable
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length + 4, start + variable.length + 4);
      }, 0);
    }
  };

  const commonVariables = [
    'tenant_name', 'property_address', 'rent_amount', 'due_date',
    'invoice_number', 'contract_end_date', 'landlord_name', 'company_name',
    'payment_amount', 'payment_date'
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="email-templates-page">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading email templates...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="email-templates-page">
        <div className="page-header">
          <div>
            <h1>Email Templates</h1>
            <p className="page-subtitle">Create and manage customizable email templates</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setEditingTemplate(null);
              setShowModal(true);
            }}
          >
            <span>➕</span> Add Email Template
          </button>
        </div>

        <div className="templates-grid">
          {emailTemplates.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-content">
                <span className="empty-icon">📧</span>
                <h3>No Email Templates</h3>
                <p>Create your first email template to get started with automated communications.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    resetForm();
                    setEditingTemplate(null);
                    setShowModal(true);
                  }}
                >
                  Create First Template
                </button>
              </div>
            </div>
          ) : (
            emailTemplates.map((template) => (
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
                  <div className="template-subject">
                    <strong>Subject:</strong> {template.subject}
                  </div>
                  <div className="template-body-preview">
                    {template.body.length > 150 
                      ? `${template.body.substring(0, 150)}...`
                      : template.body
                    }
                  </div>
                  {template.variables.length > 0 && (
                    <div className="template-variables">
                      <strong>Variables:</strong>
                      <div className="variables-list">
                        {template.variables.map((variable, index) => (
                          <span key={index} className="variable-tag">
                            {variable}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="template-actions">
                  <button
                    className="btn-icon"
                    onClick={() => handlePreview(template)}
                    title="Preview"
                  >
                    👁️
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleToggle(template.id)}
                    title={template.active ? 'Deactivate' : 'Activate'}
                  >
                    {template.active ? '⏸️' : '▶️'}
                  </button>
                  <button
                    className="btn-icon"
                    onClick={() => handleEdit(template)}
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    className="btn-icon danger"
                    onClick={() => handleDelete(template.id)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Template Form Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingTemplate ? 'Edit' : 'Add'} Email Template</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              
              <form onSubmit={handleSubmit} className="template-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="template-name">Template Name *</label>
                    <input
                      id="template-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="e.g., Invoice Due Reminder"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="template-type">Template Type *</label>
                    <select
                      id="template-type"
                      value={formData.templateType}
                      onChange={(e) => setFormData({ ...formData, templateType: e.target.value as any })}
                      required
                    >
                      <option value="INVOICE_DUE">Invoice Due</option>
                      <option value="PAYMENT_RECEIVED">Payment Received</option>
                      <option value="CONTRACT_EXPIRING">Contract Expiring</option>
                      <option value="WELCOME">Welcome</option>
                      <option value="MAINTENANCE_REQUEST">Maintenance Request</option>
                      <option value="CUSTOM">Custom</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="template-subject">Email Subject *</label>
                  <input
                    id="template-subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    placeholder="e.g., Invoice Due - {{tenant_name}}"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="template-body">Email Body *</label>
                  <div className="editor-container">
                    <div className="variables-toolbar">
                      <span>Quick Insert:</span>
                      {commonVariables.map((variable) => (
                        <button
                          key={variable}
                          type="button"
                          className="variable-button"
                          onClick={() => insertVariableIntoBody(variable)}
                          title={`Insert {{${variable}}}`}
                        >
                          {variable}
                        </button>
                      ))}
                    </div>
                    <textarea
                      id="template-body"
                      value={formData.body}
                      onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                      required
                      rows={12}
                      placeholder="Dear {{tenant_name}},&#10;&#10;This is a reminder that your rent payment of {{rent_amount}} is due on {{due_date}}.&#10;&#10;Best regards,&#10;{{landlord_name}}"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.isDefault}
                          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        />
                        Set as default template for this type
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.active}
                          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        />
                        Template is active
                      </label>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingTemplate ? 'Update' : 'Create'} Template
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        {previewMode && previewData && (
          <div className="modal-overlay" onClick={() => setPreviewMode(false)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Email Template Preview</h2>
                <button className="modal-close" onClick={() => setPreviewMode(false)}>✕</button>
              </div>
              
              <div className="preview-content">
                <div className="preview-section">
                  <h3>Subject:</h3>
                  <div className="preview-subject">{previewData.subject}</div>
                </div>
                
                <div className="preview-section">
                  <h3>Body:</h3>
                  <div className="preview-body" dangerouslySetInnerHTML={{ __html: previewData.body.replace(/\n/g, '<br>') }} />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => setPreviewMode(false)}
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};