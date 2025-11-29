import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { contractApi } from '../services/api/contractApi';
import { propertyApi } from '../services/api/propertyApi';
import { roomApi } from '../services/api/roomApi';
import { tenantApi } from '../services/api/tenantApi';
import { Contract, Property, Room, Tenant } from '../types';
import './ContractsPage.css';

export const ContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [formData, setFormData] = useState<any>({ status: 'PENDING', billingCycle: 'MONTHLY' });

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
      const [contractsData, propertiesData, tenantsData] = await Promise.all([
        contractApi.getAll(),
        propertyApi.getAll(),
        tenantApi.getAll(),
      ]);
      setContracts(contractsData);
      setProperties(propertiesData);
      setTenants(tenantsData);
    } catch (error) {
      console.error('Failed to load data:', error);
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <MainLayout>
      <div className="contracts-page">
        <div className="page-header">
          <h1>Contracts</h1>
          <button onClick={() => { setEditingContract(null); setFormData({ status: 'PENDING', billingCycle: 'MONTHLY' }); setShowModal(true); }}>
            Add Contract
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Room</th>
              <th>Tenant</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Rent Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((contract) => (
              <tr key={contract.id}>
                <td>{contract.code}</td>
                <td>{contract.roomCode}</td>
                <td>{contract.primaryTenantName}</td>
                <td>{formatDate(contract.startDate)}</td>
                <td>{contract.endDate ? formatDate(contract.endDate) : '-'}</td>
                <td>{contract.rentAmount.toLocaleString()} VND</td>
                <td>{contract.status}</td>
                <td>
                  <button onClick={() => { setEditingContract(contract); setFormData(contract); setShowModal(true); }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(contract.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal">
            <div className="modal-content large">
              <h2>{editingContract ? 'Edit' : 'Add'} Contract</h2>
              <form onSubmit={handleSubmit}>
                <input
                  placeholder="Contract Code *"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
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
                <select
                  value={formData.roomId || ''}
                  onChange={(e) => setFormData({ ...formData, roomId: parseInt(e.target.value) })}
                  required
                  disabled={!formData.propertyId}
                >
                  <option value="">Select Room</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>{r.code}</option>
                  ))}
                </select>
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
                <input
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
                <input
                  type="date"
                  value={formData.endDate || ''}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Rent Amount *"
                  value={formData.rentAmount || ''}
                  onChange={(e) => setFormData({ ...formData, rentAmount: parseFloat(e.target.value) })}
                  required
                />
                <input
                  type="number"
                  placeholder="Deposit Amount"
                  value={formData.depositAmount || ''}
                  onChange={(e) => setFormData({ ...formData, depositAmount: parseFloat(e.target.value) })}
                />
                <select
                  value={formData.billingCycle || 'MONTHLY'}
                  onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                  required
                >
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="YEARLY">Yearly</option>
                </select>
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
                <div className="modal-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => { setShowModal(false); setEditingContract(null); }}>
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

