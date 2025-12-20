import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { serviceApi, ServiceCreateData } from '../services/api/serviceApi';
import { Service } from '../types';
import './ServicesPage.css';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<ServiceCreateData>({
    name: '',
    type: 'OTHER',
    pricingModel: 'FIXED',
    unitPrice: 0,
    unitName: '',
    active: true,
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [error, setError] = useState('');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await serviceApi.getAll();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.name.trim()) {
      setError('Service name is required');
      return;
    }
    
    if (formData.pricingModel === 'PER_UNIT' && (!formData.unitPrice || formData.unitPrice <= 0)) {
      setError('Unit price is required for per-unit pricing');
      return;
    }
    
    if (formData.pricingModel === 'PER_UNIT' && !formData.unitName?.trim()) {
      setError('Unit name is required for per-unit pricing');
      return;
    }

    try {
      if (editingService) {
        await serviceApi.update(editingService.id, formData);
      } else {
        await serviceApi.create(formData);
      }
      setShowModal(false);
      setEditingService(null);
      setFormData({ name: '', type: 'OTHER', pricingModel: 'FIXED', unitPrice: 0, unitName: '', active: true });
      loadServices();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this service? This action cannot be undone if the service is used in contracts.')) return;
    try {
      await serviceApi.delete(id);
      loadServices();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await serviceApi.toggleActive(id);
      loadServices();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to toggle service status');
    }
  };

  const getServiceTypeIcon = (type: string) => {
    switch (type) {
      case 'RENT':
        return '🏠';
      case 'ELECTRICITY':
        return '⚡';
      case 'WATER':
        return '💧';
      case 'INTERNET':
        return '🌐';
      case 'PARKING':
        return '🚗';
      default:
        return '🔧';
    }
  };

  const getPricingModelLabel = (model: string) => {
    return model === 'FIXED' ? 'Fixed Price' : 'Per Unit';
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase()) ||
                         service.type.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'ALL' ||
                         (filter === 'ACTIVE' && service.active) ||
                         (filter === 'INACTIVE' && !service.active);
    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number | undefined) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <MainLayout>
      <div className="services-page">
        <div className="page-header">
          <div>
            <h1>Service Management</h1>
            <p className="page-subtitle">Configure billing services and utilities</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingService(null);
              setFormData({ name: '', type: 'OTHER', pricingModel: 'FIXED', unitPrice: 0, unitName: '', active: true });
              setError('');
              setShowModal(true);
            }}
          >
            <span>➕</span> Add Service
          </button>
        </div>

        <div className="search-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search services by name or type..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            All Services
          </button>
          <button
            className={`filter-btn ${filter === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => setFilter('ACTIVE')}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === 'INACTIVE' ? 'active' : ''}`}
            onClick={() => setFilter('INACTIVE')}
          >
            Inactive
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Type</th>
                <th>Pricing Model</th>
                <th>Unit Price</th>
                <th>Unit Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">🔧</span>
                      <p>No services found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="service-cell">
                        <span className="service-icon">{getServiceTypeIcon(service.type)}</span>
                        <strong>{service.name}</strong>
                      </div>
                    </td>
                    <td>
                      <span className="status-badge info">{service.type}</span>
                    </td>
                    <td>
                      <span className="status-badge gray">{getPricingModelLabel(service.pricingModel)}</span>
                    </td>
                    <td>
                      {service.unitPrice !== null && service.unitPrice !== undefined
                        ? formatCurrency(service.unitPrice)
                        : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                    </td>
                    <td>{service.unitName || <span style={{ color: 'var(--text-muted)' }}>-</span>}</td>
                    <td>
                      <span className={`status-badge ${service.active ? 'success' : 'error'}`}>
                        {service.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => {
                            setEditingService(service);
                            setFormData({
                              name: service.name,
                              type: service.type,
                              pricingModel: service.pricingModel,
                              unitPrice: service.unitPrice,
                              unitName: service.unitName || '',
                              active: service.active,
                            });
                            setError('');
                            setShowModal(true);
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleToggleActive(service.id)}
                          title={service.active ? 'Deactivate' : 'Activate'}
                        >
                          {service.active ? '🔒' : '🔓'}
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => handleDelete(service.id)}
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
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingService ? 'Edit' : 'Add'} Service</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              {error && <div className="error-message">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Service Name *</label>
                  <input
                    placeholder="Enter service name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Service Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    required
                  >
                    <option value="RENT">Rent</option>
                    <option value="ELECTRICITY">Electricity</option>
                    <option value="WATER">Water</option>
                    <option value="INTERNET">Internet</option>
                    <option value="PARKING">Parking</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Pricing Model *</label>
                  <select
                    value={formData.pricingModel}
                    onChange={(e) => {
                      const newModel = e.target.value;
                      setFormData({
                        ...formData,
                        pricingModel: newModel,
                        unitPrice: newModel === 'FIXED' ? formData.unitPrice : formData.unitPrice,
                        unitName: newModel === 'FIXED' ? '' : formData.unitName,
                      });
                    }}
                    required
                  >
                    <option value="FIXED">Fixed Price</option>
                    <option value="PER_UNIT">Per Unit</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>
                    {formData.pricingModel === 'FIXED' ? 'Price (VND)' : 'Unit Price (VND)'} *
                  </label>
                  <input
                    type="number"
                    placeholder={formData.pricingModel === 'FIXED' ? 'Enter fixed price' : 'Enter price per unit'}
                    value={formData.unitPrice || ''}
                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                {formData.pricingModel === 'PER_UNIT' && (
                  <div className="form-group">
                    <label>Unit Name *</label>
                    <input
                      placeholder="e.g., kWh, m³, hour"
                      value={formData.unitName || ''}
                      onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                      required={formData.pricingModel === 'PER_UNIT'}
                    />
                  </div>
                )}
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                    <span>Active</span>
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingService ? 'Update' : 'Create'} Service
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingService(null);
                      setError('');
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



