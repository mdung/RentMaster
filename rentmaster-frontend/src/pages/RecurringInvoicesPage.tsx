import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { automationApi, RecurringInvoiceCreateData } from '../services/api/automationApi';
import { contractApi } from '../services/api/contractApi';
import { serviceApi } from '../services/api/serviceApi';
import { RecurringInvoice, Contract, Service } from '../types';
import './RecurringInvoicesPage.css';

export const RecurringInvoicesPage: React.FC = () => {
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<RecurringInvoice | null>(null);
  const [formData, setFormData] = useState<RecurringInvoiceCreateData>({
    contractId: 0,
    frequency: 'MONTHLY',
    nextGenerationDate: '',
    active: true,
    autoSend: false,
    template: {
      includeRent: true,
      includeServices: true,
      serviceIds: [],
      customItems: [],
      daysUntilDue: 7,
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [recurringData, contractsData, servicesData] = await Promise.all([
        automationApi.getRecurringInvoices(),
        contractApi.getAll('ACTIVE'),
        serviceApi.getAll(),
      ]);
      setRecurringInvoices(recurringData);
      setContracts(contractsData);
      setServices(servicesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingInvoice) {
        await automationApi.updateRecurringInvoice(editingInvoice.id, formData);
      } else {
        await automationApi.createRecurringInvoice(formData);
      }
      setShowModal(false);
      setEditingInvoice(null);
      resetForm();
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save recurring invoice');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this recurring invoice?')) return;
    try {
      await automationApi.deleteRecurringInvoice(id);
      loadData();
    } catch (error) {
      alert('Failed to delete recurring invoice');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await automationApi.toggleRecurringInvoice(id);
      loadData();
    } catch (error) {
      alert('Failed to toggle recurring invoice');
    }
  };

  const handleGenerateNow = async (id: number) => {
    if (!confirm('Generate invoice now? This will create an invoice immediately.')) return;
    try {
      await automationApi.generateNowRecurringInvoice(id);
      alert('Invoice generated successfully!');
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate invoice');
    }
  };

  const resetForm = () => {
    setFormData({
      contractId: 0,
      frequency: 'MONTHLY',
      nextGenerationDate: '',
      active: true,
      autoSend: false,
      template: {
        includeRent: true,
        includeServices: true,
        serviceIds: [],
        customItems: [],
        daysUntilDue: 7,
      },
    });
  };

  const addCustomItem = () => {
    setFormData({
      ...formData,
      template: {
        ...formData.template,
        customItems: [
          ...formData.template.customItems,
          { description: '', quantity: 1, unitPrice: 0, amount: 0 },
        ],
      },
    });
  };

  const updateCustomItem = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.template.customItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Auto-calculate amount for quantity and unitPrice changes
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].amount = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }

    setFormData({
      ...formData,
      template: {
        ...formData.template,
        customItems: updatedItems,
      },
    });
  };

  const removeCustomItem = (index: number) => {
    const updatedItems = formData.template.customItems.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      template: {
        ...formData.template,
        customItems: updatedItems,
      },
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'WEEKLY': return '📆';
      case 'MONTHLY': return '🗓️';
      case 'QUARTERLY': return '📊';
      case 'YEARLY': return '🎯';
      default: return '⏰';
    }
  };

  const getStatusBadgeClass = (active: boolean) => {
    return active ? 'success' : 'gray';
  };

  return (
    <MainLayout>
      <div className="recurring-invoices-page">
        <div className="page-header">
          <div>
            <h1>Recurring Invoices</h1>
            <p className="page-subtitle">Automate invoice generation on a schedule</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingInvoice(null);
              resetForm();
              setShowModal(true);
            }}
          >
            <span>➕</span> Add Recurring Invoice
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Contract</th>
                <th>Tenant</th>
                <th>Room</th>
                <th>Frequency</th>
                <th>Next Generation</th>
                <th>Last Generated</th>
                <th>Auto Send</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recurringInvoices.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">🔄</span>
                      <p>No recurring invoices configured</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setEditingInvoice(null);
                          resetForm();
                          setShowModal(true);
                        }}
                      >
                        Create First Recurring Invoice
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                recurringInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td><strong>{invoice.contractCode}</strong></td>
                    <td>{invoice.tenantName}</td>
                    <td>{invoice.roomCode}</td>
                    <td>
                      <span className="frequency-badge">
                        {getFrequencyIcon(invoice.frequency)} {invoice.frequency}
                      </span>
                    </td>
                    <td>{formatDate(invoice.nextGenerationDate)}</td>
                    <td>
                      {invoice.lastGeneratedDate 
                        ? formatDate(invoice.lastGeneratedDate)
                        : <span style={{ color: 'var(--text-muted)' }}>Never</span>
                      }
                    </td>
                    <td>
                      <span className={`status-badge ${invoice.autoSend ? 'success' : 'gray'}`}>
                        {invoice.autoSend ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(invoice.active)}`}>
                        {invoice.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => handleGenerateNow(invoice.id)}
                          title="Generate Now"
                        >
                          ⚡
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleToggle(invoice.id)}
                          title={invoice.active ? 'Deactivate' : 'Activate'}
                        >
                          {invoice.active ? '⏸️' : '▶️'}
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => {
                            setEditingInvoice(invoice);
                            setFormData({
                              contractId: invoice.contractId,
                              frequency: invoice.frequency,
                              dayOfMonth: invoice.dayOfMonth,
                              dayOfWeek: invoice.dayOfWeek,
                              nextGenerationDate: invoice.nextGenerationDate,
                              active: invoice.active,
                              autoSend: invoice.autoSend,
                              template: invoice.template,
                            });
                            setShowModal(true);
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => handleDelete(invoice.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingInvoice ? 'Edit' : 'Add'} Recurring Invoice</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <h3>Basic Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Contract *</label>
                      <select
                        value={formData.contractId}
                        onChange={(e) => setFormData({ ...formData, contractId: parseInt(e.target.value) })}
                        required
                        disabled={!!editingInvoice}
                      >
                        <option value={0}>Select Contract</option>
                        {contracts.map((contract) => (
                          <option key={contract.id} value={contract.id}>
                            {contract.code} - {contract.primaryTenantName} ({contract.roomCode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Frequency *</label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                        required
                      >
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                        <option value="YEARLY">Yearly</option>
                      </select>
                    </div>
                  </div>

                  {formData.frequency === 'WEEKLY' && (
                    <div className="form-group">
                      <label>Day of Week</label>
                      <select
                        value={formData.dayOfWeek || 1}
                        onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                      >
                        <option value={1}>Monday</option>
                        <option value={2}>Tuesday</option>
                        <option value={3}>Wednesday</option>
                        <option value={4}>Thursday</option>
                        <option value={5}>Friday</option>
                        <option value={6}>Saturday</option>
                        <option value={0}>Sunday</option>
                      </select>
                    </div>
                  )}

                  {(formData.frequency === 'MONTHLY' || formData.frequency === 'QUARTERLY' || formData.frequency === 'YEARLY') && (
                    <div className="form-group">
                      <label>Day of Month</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={formData.dayOfMonth || 1}
                        onChange={(e) => setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) })}
                      />
                    </div>
                  )}

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Next Generation Date *</label>
                      <input
                        type="date"
                        value={formData.nextGenerationDate}
                        onChange={(e) => setFormData({ ...formData, nextGenerationDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Days Until Due</label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={formData.template.daysUntilDue}
                        onChange={(e) => setFormData({
                          ...formData,
                          template: { ...formData.template, daysUntilDue: parseInt(e.target.value) }
                        })}
                      />
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
                        <span>Active</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.autoSend}
                          onChange={(e) => setFormData({ ...formData, autoSend: e.target.checked })}
                        />
                        <span>Auto Send (Email invoice to tenant)</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Invoice Template</h3>
                  <div className="form-group">
                    <div className="checkbox-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.template.includeRent}
                          onChange={(e) => setFormData({
                            ...formData,
                            template: { ...formData.template, includeRent: e.target.checked }
                          })}
                        />
                        <span>Include Rent</span>
                      </label>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.template.includeServices}
                          onChange={(e) => setFormData({
                            ...formData,
                            template: { ...formData.template, includeServices: e.target.checked }
                          })}
                        />
                        <span>Include Services</span>
                      </label>
                    </div>
                  </div>

                  {formData.template.includeServices && (
                    <div className="form-group">
                      <label>Services to Include</label>
                      <div className="services-grid">
                        {services.map((service) => (
                          <label key={service.id} className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={formData.template.serviceIds.includes(service.id)}
                              onChange={(e) => {
                                const serviceIds = e.target.checked
                                  ? [...formData.template.serviceIds, service.id]
                                  : formData.template.serviceIds.filter(id => id !== service.id);
                                setFormData({
                                  ...formData,
                                  template: { ...formData.template, serviceIds }
                                });
                              }}
                            />
                            <span>{service.name} ({service.type})</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <div className="custom-items-header">
                      <label>Custom Items</label>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={addCustomItem}
                      >
                        <span>➕</span> Add Item
                      </button>
                    </div>
                    {formData.template.customItems.map((item, index) => (
                      <div key={index} className="custom-item-row">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateCustomItem(index, 'description', e.target.value)}
                        />
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateCustomItem(index, 'quantity', parseFloat(e.target.value) || 1)}
                        />
                        <input
                          type="number"
                          placeholder="Unit Price"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateCustomItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        />
                        <input
                          type="number"
                          placeholder="Amount"
                          value={item.amount}
                          disabled
                        />
                        <button
                          type="button"
                          className="btn-icon danger"
                          onClick={() => removeCustomItem(index)}
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label>Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Optional notes to include in the invoice"
                      value={formData.template.notes || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        template: { ...formData.template, notes: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingInvoice ? 'Update' : 'Create'} Recurring Invoice
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingInvoice(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};