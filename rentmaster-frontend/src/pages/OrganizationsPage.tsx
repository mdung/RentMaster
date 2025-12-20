import React, { useState, useEffect } from 'react';
import { organizationApi, Organization, OrganizationCreateDTO } from '../services/api/organizationApi';
import { useOrganization } from '../context/OrganizationContext';
import './OrganizationsPage.css';

export const OrganizationsPage: React.FC = () => {
  const { organizations, loadOrganizations, currentOrganization, switchOrganization } = useOrganization();
  const [localOrganizations, setLocalOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<OrganizationCreateDTO>({
    code: '',
    name: '',
    displayName: '',
    description: '',
    type: 'INDIVIDUAL_LANDLORD',
    contactEmail: '',
    contactPhone: '',
    websiteUrl: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    subscriptionPlan: 'BASIC',
    logoUrl: '',
    primaryColor: '#3b82f6',
    secondaryColor: '#60a5fa',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await loadOrganizations();
      const orgs = await organizationApi.getAll();
      setLocalOrganizations(orgs);
    } catch (error) {
      console.error('Failed to load organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingOrg) {
        await organizationApi.update(editingOrg.id, formData);
      } else {
        await organizationApi.create(formData);
      }
      await loadData();
      setShowModal(false);
      resetForm();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save organization');
    }
  };

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setFormData({
      code: org.code,
      name: org.name,
      displayName: org.displayName || '',
      description: org.description || '',
      type: org.type,
      contactEmail: org.contactEmail || '',
      contactPhone: org.contactPhone || '',
      websiteUrl: org.websiteUrl || '',
      address: org.address || '',
      city: org.city || '',
      state: org.state || '',
      postalCode: org.postalCode || '',
      country: org.country || '',
      subscriptionPlan: org.subscriptionPlan || 'BASIC',
      logoUrl: org.logoUrl || '',
      primaryColor: org.primaryColor || '#3b82f6',
      secondaryColor: org.secondaryColor || '#60a5fa',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this organization?')) return;
    try {
      await organizationApi.delete(id);
      await loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete organization');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await organizationApi.toggleStatus(id);
      await loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to toggle status');
    }
  };

  const handleSwitch = async (orgId: number) => {
    try {
      await switchOrganization(orgId);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to switch organization');
    }
  };

  const resetForm = () => {
    setEditingOrg(null);
    setFormData({
      code: '',
      name: '',
      displayName: '',
      description: '',
      type: 'INDIVIDUAL_LANDLORD',
      contactEmail: '',
      contactPhone: '',
      websiteUrl: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      subscriptionPlan: 'BASIC',
      logoUrl: '',
      primaryColor: '#3b82f6',
      secondaryColor: '#60a5fa',
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; class: string }> = {
      ACTIVE: { label: 'Active', class: 'status-active' },
      INACTIVE: { label: 'Inactive', class: 'status-inactive' },
      SUSPENDED: { label: 'Suspended', class: 'status-suspended' },
      TRIAL: { label: 'Trial', class: 'status-trial' },
    };
    const statusInfo = statusMap[status] || { label: status, class: 'status-default' };
    return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  if (loading) {
    return <div className="page-container">Loading...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Organizations</h1>
          <p className="page-subtitle">Manage multiple organizations and switch between them</p>
        </div>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
          + Add Organization
        </button>
      </div>

      <div className="organizations-grid">
        {localOrganizations.map((org) => (
          <div key={org.id} className={`organization-card ${currentOrganization?.id === org.id ? 'current' : ''}`}>
            <div className="organization-header">
              {org.logoUrl && <img src={org.logoUrl} alt={org.name} className="org-logo" />}
              <div>
                <h3>{org.displayName || org.name}</h3>
                <p className="org-code">{org.code}</p>
              </div>
            </div>
            <div className="organization-body">
              <p className="org-description">{org.description || 'No description'}</p>
              <div className="org-details">
                <div><strong>Type:</strong> {org.type.replace(/_/g, ' ')}</div>
                <div><strong>Plan:</strong> {org.subscriptionPlan || 'N/A'}</div>
                {org.contactEmail && <div><strong>Email:</strong> {org.contactEmail}</div>}
              </div>
              <div className="org-status">{getStatusBadge(org.status)}</div>
            </div>
            <div className="organization-actions">
              {currentOrganization?.id === org.id ? (
                <span className="current-badge">Current</span>
              ) : (
                <button className="btn btn-sm btn-primary" onClick={() => handleSwitch(org.id)}>
                  Switch
                </button>
              )}
              <button className="btn btn-sm btn-secondary" onClick={() => handleEdit(org)}>
                Edit
              </button>
              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(org.id)}>
                Delete
              </button>
              <button className="btn btn-sm" onClick={() => handleToggleStatus(org.id)}>
                {org.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingOrg ? 'Edit Organization' : 'Create Organization'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  disabled={!!editingOrg}
                />
              </div>
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Type *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  <option value="INDIVIDUAL_LANDLORD">Individual Landlord</option>
                  <option value="PROPERTY_MANAGEMENT_COMPANY">Property Management Company</option>
                  <option value="REAL_ESTATE_AGENCY">Real Estate Agency</option>
                  <option value="ENTERPRISE">Enterprise</option>
                  <option value="GOVERNMENT_HOUSING">Government Housing</option>
                  <option value="NON_PROFIT">Non-Profit</option>
                </select>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Logo URL</label>
                <input
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Primary Color</label>
                  <input
                    type="color"
                    value={formData.primaryColor}
                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Secondary Color</label>
                  <input
                    type="color"
                    value={formData.secondaryColor}
                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingOrg ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

