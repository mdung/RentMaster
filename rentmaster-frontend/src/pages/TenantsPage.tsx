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

  return (
    <MainLayout>
      <div className="tenants-page">
        <div className="page-header">
          <h1>Tenants</h1>
          <button onClick={() => { setEditingTenant(null); setFormData({}); setShowModal(true); }}>
            Add Tenant
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search tenants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>ID Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => (
              <tr key={tenant.id}>
                <td>{tenant.fullName}</td>
                <td>{tenant.phone || '-'}</td>
                <td>{tenant.email || '-'}</td>
                <td>{tenant.idNumber || '-'}</td>
                <td>
                  <button onClick={() => { setEditingTenant(tenant); setFormData(tenant); setShowModal(true); }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(tenant.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingTenant ? 'Edit' : 'Add'} Tenant</h2>
              <form onSubmit={handleSubmit}>
                <input
                  placeholder="Full Name *"
                  value={formData.fullName || ''}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
                <input
                  placeholder="Phone"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  placeholder="ID Number"
                  value={formData.idNumber || ''}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                />
                <input
                  placeholder="Address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <input
                  placeholder="Emergency Contact"
                  value={formData.emergencyContact || ''}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
                <div className="modal-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => { setShowModal(false); setEditingTenant(null); }}>
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

