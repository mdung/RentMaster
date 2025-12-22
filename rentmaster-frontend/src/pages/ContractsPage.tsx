import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { contractApi } from '../services/api/contractApi';
import { propertyApi } from '../services/api/propertyApi';
import { roomApi } from '../services/api/propertyApi';
import { tenantApi } from '../services/api/tenantApi';
import { serviceApi } from '../services/api/serviceApi';
import { contractServiceApi, ContractService, ContractServiceCreateData } from '../services/api/contractServiceApi';
import { Contract, Property, Room, Tenant, Service } from '../types';
import './ContractsPage.css';

export const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [contractServices, setContractServices] = useState<ContractService[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<number | null>(null);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [editingContractService, setEditingContractService] = useState<ContractService | null>(null);
  const [formData, setFormData] = useState<any>({ status: 'PENDING', billingCycle: 'MONTHLY' });
  const [serviceFormData, setServiceFormData] = useState<ContractServiceCreateData>({
    contractId: 0,
    serviceId: 0,
    customPrice: undefined,
    active: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.propertyId) {
      loadRooms(formData.propertyId);
    }
  }, [formData.propertyId]);

  const loadData = async () => {
    try {
      const [contractsData, propertiesData, tenantsData, servicesData] = await Promise.all([
        contractApi.getAll(),
        propertyApi.getAll(),
        tenantApi.getAll(),
        serviceApi.getAll(),
      ]);
      console.log('Loaded contracts:', contractsData);
      console.log('Contracts count:', contractsData.length);
      setContracts(contractsData);
      setProperties(propertiesData);
      setTenants(tenantsData);
      setServices(servicesData);
    } catch (error) {
      console.error('Failed to load data:', error);
      console.error('Error details:', error);
    }
  };

  const loadContractServices = async (contractId: number) => {
    try {
      const data = await contractServiceApi.getByContractId(contractId);
      setContractServices(data);
    } catch (error) {
      console.error('Failed to load contract services:', error);
    }
  };

  const loadRooms = async (propertyId: number) => {
    try {
      const roomsData = await roomApi.getByPropertyId(propertyId);
      setRooms(roomsData);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContract) {
        await contractApi.update(editingContract.id, formData);
      } else {
        await contractApi.create(formData);
      }
      setShowModal(false);
      setEditingContract(null);
      setFormData({ status: 'PENDING', billingCycle: 'MONTHLY' });
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save contract');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await contractApi.delete(id);
      loadData();
    } catch (error) {
      alert('Failed to delete contract');
    }
  };

  const handleOpenServicesModal = async (contractId: number) => {
    setSelectedContractId(contractId);
    await loadContractServices(contractId);
    setShowServicesModal(true);
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContractService) {
        await contractServiceApi.update(editingContractService.id, serviceFormData);
      } else {
        await contractServiceApi.create(serviceFormData);
      }
      if (selectedContractId) {
        await loadContractServices(selectedContractId);
      }
      setEditingContractService(null);
      setServiceFormData({ contractId: selectedContractId || 0, serviceId: 0, customPrice: undefined, active: true });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save service');
    }
  };

  const handleDeleteContractService = async (id: number) => {
    if (!confirm('Are you sure you want to remove this service from the contract?')) return;
    try {
      await contractServiceApi.delete(id);
      if (selectedContractId) {
        await loadContractServices(selectedContractId);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete service');
    }
  };

  const handleToggleContractServiceActive = async (id: number) => {
    try {
      await contractServiceApi.toggleActive(id);
      if (selectedContractId) {
        await loadContractServices(selectedContractId);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to toggle service status');
    }
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'TERMINATED':
        return 'gray';
      case 'EXPIRED':
        return 'error';
      default:
        return 'gray';
    }
  };

  return (
    <MainLayout>
      <div className="contracts-page">
        <div className="page-header">
          <div>
            <h1>Contracts</h1>
            <p className="page-subtitle">Manage rental contracts and agreements</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingContract(null); setFormData({ status: 'PENDING', billingCycle: 'MONTHLY' }); setShowModal(true); }}>
            <span>➕</span> Add Contract
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Room</th>
                <th>Property</th>
                <th>Tenant</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Rent Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">📄</span>
                      <p>No contracts found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                contracts.map((contract) => (
                  <tr key={contract.id}>
                    <td><strong>{contract.code}</strong></td>
                    <td>{contract.roomCode}</td>
                    <td>{contract.propertyName}</td>
                    <td>{contract.primaryTenantName}</td>
                    <td>{formatDate(contract.startDate)}</td>
                    <td>{contract.endDate ? formatDate(contract.endDate) : <span style={{ color: 'var(--text-muted)' }}>Open-ended</span>}</td>
                    <td>{formatCurrency(contract.rentAmount)}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => { setEditingContract(contract); setFormData(contract); setShowModal(true); }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleOpenServicesModal(contract.id)}
                          title="Manage Services"
                        >
                          🔧
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => handleDelete(contract.id)}
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
                <h2>{editingContract ? 'Edit' : 'Add'} Contract</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Contract Code *</label>
                  <input
                    placeholder="Enter contract code"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Property *</label>
                  <select
                    value={formData.propertyId || ''}
                    onChange={(e) => setFormData({ ...formData, propertyId: parseInt(e.target.value), roomId: null })}
                    required
                  >
                    <option value="">Select Property</option>
                    {properties.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Room *</label>
                  <select
                    value={formData.roomId || ''}
                    onChange={(e) => setFormData({ ...formData, roomId: parseInt(e.target.value) })}
                    required
                    disabled={!formData.propertyId}
                  >
                    <option value="">Select Room</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>{r.code} - {r.type || 'Room'}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Primary Tenant *</label>
                  <select
                    value={formData.primaryTenantId || ''}
                    onChange={(e) => setFormData({ ...formData, primaryTenantId: parseInt(e.target.value) })}
                    required
                  >
                    <option value="">Select Primary Tenant</option>
                    {tenants.map((t) => (
                      <option key={t.id} value={t.id}>{t.fullName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Rent Amount (VND) *</label>
                  <input
                    type="number"
                    placeholder="Enter rent amount"
                    value={formData.rentAmount || ''}
                    onChange={(e) => setFormData({ ...formData, rentAmount: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Deposit Amount (VND)</label>
                  <input
                    type="number"
                    placeholder="Enter deposit amount"
                    value={formData.depositAmount || ''}
                    onChange={(e) => setFormData({ ...formData, depositAmount: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Billing Cycle *</label>
                  <select
                    value={formData.billingCycle || 'MONTHLY'}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                    required
                  >
                    <option value="MONTHLY">Monthly</option>
                    <option value="QUARTERLY">Quarterly</option>
                    <option value="YEARLY">Yearly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={formData.status || 'PENDING'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACTIVE">Active</option>
                    <option value="TERMINATED">Terminated</option>
                    <option value="EXPIRED">Expired</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); setEditingContract(null); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showServicesModal && selectedContractId && (
          <div className="modal-overlay" onClick={() => { setShowServicesModal(false); setSelectedContractId(null); }}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Manage Contract Services</h2>
                <button className="modal-close" onClick={() => { setShowServicesModal(false); setSelectedContractId(null); }}>✕</button>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    Contract: <strong style={{ color: 'var(--text-primary)' }}>
                      {contracts.find(c => c.id === selectedContractId)?.code}
                    </strong>
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setEditingContractService(null);
                      setServiceFormData({ contractId: selectedContractId, serviceId: 0, customPrice: undefined, active: true });
                    }}
                  >
                    <span>➕</span> Add Service
                  </button>
                </div>

                {contractServices.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">🔧</span>
                      <p>No services added to this contract</p>
                    </div>
                  </div>
                ) : (
                  <div className="table-container" style={{ marginBottom: '1.5rem' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Service</th>
                          <th>Type</th>
                          <th>Default Price</th>
                          <th>Custom Price</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contractServices.map((cs) => (
                          <tr key={cs.id}>
                            <td>
                              <div className="service-cell">
                                <span className="service-icon">
                                  {cs.serviceType === 'RENT' ? '🏠' :
                                   cs.serviceType === 'ELECTRICITY' ? '⚡' :
                                   cs.serviceType === 'WATER' ? '💧' :
                                   cs.serviceType === 'INTERNET' ? '🌐' :
                                   cs.serviceType === 'PARKING' ? '🚗' : '🔧'}
                                </span>
                                <strong>{cs.serviceName}</strong>
                              </div>
                            </td>
                            <td>
                              <span className="status-badge info">{cs.serviceType}</span>
                            </td>
                            <td>
                              {cs.defaultUnitPrice !== null && cs.defaultUnitPrice !== undefined
                                ? formatCurrency(cs.defaultUnitPrice)
                                : <span style={{ color: 'var(--text-muted)' }}>-</span>}
                            </td>
                            <td>
                              {cs.customPrice !== null && cs.customPrice !== undefined
                                ? (
                                  <span style={{ color: 'var(--primary)', fontWeight: '600' }}>
                                    {formatCurrency(cs.customPrice)}
                                  </span>
                                )
                                : <span style={{ color: 'var(--text-muted)' }}>Use default</span>}
                            </td>
                            <td>
                              <span className={`status-badge ${cs.active ? 'success' : 'error'}`}>
                                {cs.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="btn-icon"
                                  onClick={() => {
                                    setEditingContractService(cs);
                                    setServiceFormData({
                                      contractId: cs.contractId,
                                      serviceId: cs.serviceId,
                                      customPrice: cs.customPrice,
                                      active: cs.active,
                                    });
                                  }}
                                  title="Edit"
                                >
                                  ✏️
                                </button>
                                <button
                                  className="btn-icon"
                                  onClick={() => handleToggleContractServiceActive(cs.id)}
                                  title={cs.active ? 'Deactivate' : 'Activate'}
                                >
                                  {cs.active ? '🔒' : '🔓'}
                                </button>
                                <button
                                  className="btn-icon danger"
                                  onClick={() => handleDeleteContractService(cs.id)}
                                  title="Remove"
                                >
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

                {(editingContractService || serviceFormData.serviceId === 0) && (
                  <div style={{ padding: '1.5rem', background: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius)', marginTop: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                      {editingContractService ? 'Edit Service' : 'Add Service'}
                    </h3>
                    <form onSubmit={handleAddService}>
                      <div className="form-group">
                        <label>Service *</label>
                        <select
                          value={serviceFormData.serviceId}
                          onChange={(e) => {
                            const serviceId = parseInt(e.target.value);
                            const service = services.find(s => s.id === serviceId);
                            setServiceFormData({
                              ...serviceFormData,
                              serviceId,
                              customPrice: service?.unitPrice,
                            });
                          }}
                          required
                          disabled={!!editingContractService}
                        >
                          <option value="0">Select Service</option>
                          {services
                            .filter(s => {
                              if (editingContractService) return s.id === editingContractService.serviceId;
                              return !contractServices.some(cs => cs.serviceId === s.id && cs.active);
                            })
                            .map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.name} ({service.type}) - {service.pricingModel === 'FIXED' ? 'Fixed' : 'Per Unit'}
                              </option>
                            ))}
                        </select>
                      </div>
                      {serviceFormData.serviceId > 0 && (
                        <>
                          {services.find(s => s.id === serviceFormData.serviceId)?.pricingModel === 'PER_UNIT' && (
                            <div className="form-group">
                              <label>Custom Price (VND) - Leave empty to use default</label>
                              <input
                                type="number"
                                placeholder={`Default: ${formatCurrency(services.find(s => s.id === serviceFormData.serviceId)?.unitPrice || 0)}`}
                                value={serviceFormData.customPrice || ''}
                                onChange={(e) => setServiceFormData({ ...serviceFormData, customPrice: parseFloat(e.target.value) || undefined })}
                                min="0"
                                step="0.01"
                              />
                            </div>
                          )}
                          {services.find(s => s.id === serviceFormData.serviceId)?.pricingModel === 'FIXED' && (
                            <div className="form-group">
                              <label>Custom Price (VND) - Leave empty to use default</label>
                              <input
                                type="number"
                                placeholder={`Default: ${formatCurrency(services.find(s => s.id === serviceFormData.serviceId)?.unitPrice || 0)}`}
                                value={serviceFormData.customPrice || ''}
                                onChange={(e) => setServiceFormData({ ...serviceFormData, customPrice: parseFloat(e.target.value) || undefined })}
                                min="0"
                                step="0.01"
                              />
                            </div>
                          )}
                          <div className="form-group">
                            <label className="checkbox-label">
                              <input
                                type="checkbox"
                                checked={serviceFormData.active}
                                onChange={(e) => setServiceFormData({ ...serviceFormData, active: e.target.checked })}
                              />
                              <span>Active</span>
                            </label>
                          </div>
                        </>
                      )}
                      <div className="modal-actions">
                        <button type="submit" className="btn btn-primary">
                          {editingContractService ? 'Update' : 'Add'} Service
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            setEditingContractService(null);
                            setServiceFormData({ contractId: selectedContractId || 0, serviceId: 0, customPrice: undefined, active: true });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

