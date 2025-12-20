import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { tenantApi } from '../services/api/tenantApi';
import { Tenant } from '../types';
import './TenantsPage.css';

export const TenantsPage: React.FC = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadTenants();
  }, [search]);

  const loadTenants = async () => {
    try {
      const data = await tenantApi.getAll(search || undefined);
      setTenants(data);
    } catch (error) {
      console.error('Failed to load tenants:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTenant) {
        await tenantApi.update(editingTenant.id, formData);
      } else {
        await tenantApi.create(formData);
      }
      setShowModal(false);
      setEditingTenant(null);
      setFormData({});
      loadTenants();
    } catch (error) {
      alert('Failed to save tenant');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await tenantApi.delete(id);
      loadTenants();
    } catch (error) {
      alert('Failed to delete tenant');
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <MainLayout>
      <div className="tenants-page">
        <div className="page-header">
          <div>
            <h1>Tenants</h1>
            <p className="page-subtitle">Manage tenant information and contacts</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingTenant(null); setFormData({}); setShowModal(true); }}>
            <span>➕</span> Add Tenant
          </button>
        </div>

        <div className="search-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search tenants by name, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tenant</th>
                <th>Phone</th>
                <th>Email</th>
                <th>ID Number</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">👥</span>
                      <p>No tenants found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-small">
                          {getInitials(tenant.fullName)}
                        </div>
                        <span className="username">{tenant.fullName}</span>
                      </div>
                    </td>
                    <td>{tenant.phone || <span style={{ color: 'var(--text-muted)' }}>-</span>}</td>
                    <td>{tenant.email || <span style={{ color: 'var(--text-muted)' }}>-</span>}</td>
                    <td>{tenant.idNumber || <span style={{ color: 'var(--text-muted)' }}>-</span>}</td>
                    <td>{tenant.address || <span style={{ color: 'var(--text-muted)' }}>-</span>}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => { setEditingTenant(tenant); setFormData(tenant); setShowModal(true); }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => handleDelete(tenant.id)}
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
                <h2>{editingTenant ? 'Edit' : 'Add'} Tenant</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    placeholder="Enter full name"
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    placeholder="Enter phone number"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>ID Number</label>
                  <input
                    placeholder="Enter ID number"
                    value={formData.idNumber || ''}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    placeholder="Enter address"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Emergency Contact</label>
                  <input
                    placeholder="Enter emergency contact"
                    value={formData.emergencyContact || ''}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingTenant(null); }}>
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

