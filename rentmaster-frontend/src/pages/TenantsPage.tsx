import React, { useEffect, useState, useMemo } from 'react';
import { MainLayout } from '../components/MainLayout';
import { tenantApi } from '../services/api/tenantApi';
import { Tenant } from '../types';
import './TenantsPage.css';

type SortField = 'fullName' | 'phone' | 'email' | 'idNumber' | 'address';
type SortDirection = 'asc' | 'desc';

export const TenantsPage: React.FC = () => {
  const [allTenants, setAllTenants] = useState<Tenant[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>('fullName');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  useEffect(() => {
    loadTenants();
  }, [search]);

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search changes
  }, [search]);

  const loadTenants = async () => {
    try {
      const data = await tenantApi.getAll(search || undefined);
      setAllTenants(data);
    } catch (error) {
      console.error('Failed to load tenants:', error);
    }
  };

  // Filter and sort tenants
  const filteredAndSortedTenants = useMemo(() => {
    let filtered = [...allTenants];

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(tenant =>
        tenant.fullName?.toLowerCase().includes(searchLower) ||
        tenant.phone?.toLowerCase().includes(searchLower) ||
        tenant.email?.toLowerCase().includes(searchLower) ||
        tenant.idNumber?.toLowerCase().includes(searchLower) ||
        tenant.address?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string = '';
      let bValue: string = '';

      switch (sortField) {
        case 'fullName':
          aValue = (a.fullName || '').toLowerCase();
          bValue = (b.fullName || '').toLowerCase();
          break;
        case 'phone':
          aValue = (a.phone || '').toLowerCase();
          bValue = (b.phone || '').toLowerCase();
          break;
        case 'email':
          aValue = (a.email || '').toLowerCase();
          bValue = (b.email || '').toLowerCase();
          break;
        case 'idNumber':
          aValue = (a.idNumber || '').toLowerCase();
          bValue = (b.idNumber || '').toLowerCase();
          break;
        case 'address':
          aValue = (a.address || '').toLowerCase();
          bValue = (b.address || '').toLowerCase();
          break;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allTenants, search, sortField, sortDirection]);

  // Paginate tenants
  const paginatedTenants = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredAndSortedTenants.slice(startIndex, endIndex);
  }, [filteredAndSortedTenants, currentPage, pageSize]);

  const totalTenants = filteredAndSortedTenants.length;
  const totalPages = Math.max(1, Math.ceil(totalTenants / pageSize));

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
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
                <th 
                  className="sortable" 
                  onClick={() => handleSort('fullName')}
                >
                  Tenant {getSortIcon('fullName')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('phone')}
                >
                  Phone {getSortIcon('phone')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('email')}
                >
                  Email {getSortIcon('email')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('idNumber')}
                >
                  ID Number {getSortIcon('idNumber')}
                </th>
                <th 
                  className="sortable" 
                  onClick={() => handleSort('address')}
                >
                  Address {getSortIcon('address')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTenants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">👥</span>
                      <p>No tenants found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTenants.map((tenant) => (
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

          {/* Pagination footer */}
          {totalTenants > 0 && (
            <div className="table-footer">
              <div className="table-footer-left">
                <span>Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span>
                  {totalTenants === 0
                    ? '0–0 of 0'
                    : `${(currentPage - 1) * pageSize + 1}–${Math.min(
                        currentPage * pageSize,
                        totalTenants
                      )} of ${totalTenants}`}
                </span>
              </div>
              <div className="table-footer-right">
                <button
                  className="btn-icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  title="Previous page"
                >
                  ◀
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn-icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  title="Next page"
                >
                  ▶
                </button>
              </div>
            </div>
          )}
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

