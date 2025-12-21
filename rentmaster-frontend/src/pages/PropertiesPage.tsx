import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '../components/MainLayout';
import { propertyApi, roomApi } from '../services/api/propertyApi';
import { Property, Room } from '../types';
import './PropertiesPage.css';

export const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'fully-leased' | 'has-vacancy'>('all');

  useEffect(() => {
    loadData();
    // Check if action=new is in URL params
    if (searchParams.get('action') === 'new') {
      setShowPropertyModal(true);
      // Remove the query parameter from URL
      searchParams.delete('action');
      setSearchParams(searchParams, { replace: true });
    }
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      loadRooms(selectedProperty);
    }
  }, [selectedProperty]);

  const loadData = async () => {
    try {
      const [props, allRoomsData] = await Promise.all([
        propertyApi.getAll(),
        roomApi.getAll()
      ]);
      setProperties(props);
      setAllRooms(allRoomsData);
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

  // Calculate properties created this month
  const getPropertiesThisMonth = () => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return properties.filter(prop => {
      const createdAt = new Date(prop.createdAt);
      return createdAt >= firstDayOfMonth;
    }).length;
  };

  // Calculate properties created last month
  const getPropertiesLastMonth = () => {
    const now = new Date();
    const firstDayOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return properties.filter(prop => {
      const createdAt = new Date(prop.createdAt);
      return createdAt >= firstDayOfLastMonth && createdAt < firstDayOfThisMonth;
    }).length;
  };

  const handlePropertySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProperty) {
        await propertyApi.update(editingProperty.id, formData);
      } else {
        await propertyApi.create(formData);
      }
      setShowPropertyModal(false);
      setEditingProperty(null);
      setFormData({});
      await loadData();
    } catch (error) {
      alert('Failed to save property');
    }
  };

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await roomApi.update(editingRoom.id, formData);
      } else {
        await roomApi.create({ ...formData, propertyId: selectedProperty });
      }
      setShowRoomModal(false);
      setEditingRoom(null);
      setFormData({});
      if (selectedProperty) loadRooms(selectedProperty);
    } catch (error) {
      alert('Failed to save room');
    }
  };

  const handleDeleteProperty = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await propertyApi.delete(id);
      loadData();
    } catch (error) {
      alert('Failed to delete property');
    }
  };

  const handleDeleteRoom = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await roomApi.delete(id);
      if (selectedProperty) loadRooms(selectedProperty);
    } catch (error) {
      alert('Failed to delete room');
    }
  };

  return (
    <MainLayout>
      <div className="properties-page">
        <div className="page-header">
          <div>
            <h1>Properties & Rooms Management</h1>
            <p className="page-subtitle">Manage your properties and room inventory</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingProperty(null); setFormData({}); setShowPropertyModal(true); }}>
            <span>➕</span> Add Property
          </button>
        </div>

        <div className="overview-cards">
          <div className="overview-card">
            <div className="overview-card-header">
              <h3 className="overview-card-title">Properties</h3>
              <div className="overview-card-icon">🏢</div>
            </div>
            <p className="overview-card-value">{properties.length}</p>
            <div className="overview-card-trend">
              {(() => {
                const thisMonth = getPropertiesThisMonth();
                const lastMonth = getPropertiesLastMonth();
                const diff = thisMonth - lastMonth;
                if (diff > 0) {
                  return `↑ +${diff} this month`;
                } else if (diff < 0) {
                  return `↓ ${diff} this month`;
                } else {
                  return `→ No change this month`;
                }
              })()}
            </div>
          </div>
          <div className="overview-card">
            <div className="overview-card-header">
              <h3 className="overview-card-title">Occupancy</h3>
              <div className="overview-card-icon">📊</div>
            </div>
            <p className="overview-card-value">
              {allRooms.length > 0 
                ? Math.round((allRooms.filter(r => r.status === 'OCCUPIED').length / allRooms.length) * 100)
                : 0}%
            </p>
            <div className="overview-card-trend">
              {allRooms.filter(r => r.status === 'OCCUPIED').length}/{allRooms.length} Rooms
            </div>
          </div>
        </div>

        <div className="search-bar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search properties, rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Properties
          </button>
          <button 
            className={`filter-btn ${filterType === 'fully-leased' ? 'active' : ''}`}
            onClick={() => setFilterType('fully-leased')}
          >
            Fully Leased
          </button>
          <button 
            className={`filter-btn ${filterType === 'has-vacancy' ? 'active' : ''}`}
            onClick={() => setFilterType('has-vacancy')}
          >
            Has Vacancy
          </button>
        </div>

        <div className="properties-grid">
          {properties
            .filter((prop) => {
              // Apply search filter
              if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                const matchesName = prop.name?.toLowerCase().includes(query);
                const matchesAddress = prop.address?.toLowerCase().includes(query);
                const propRooms = allRooms.filter(r => r.propertyId === prop.id);
                const matchesRoom = propRooms.some(r => 
                  r.code?.toLowerCase().includes(query) || 
                  r.type?.toLowerCase().includes(query)
                );
                if (!matchesName && !matchesAddress && !matchesRoom) {
                  return false;
                }
              }
              
              // Apply status filter
              const propRooms = allRooms.filter(r => r.propertyId === prop.id);
              const occupiedCount = propRooms.filter(r => r.status === 'OCCUPIED').length;
              const totalCount = propRooms.length;
              const isFullyLeased = totalCount > 0 && occupiedCount === totalCount;
              const hasVacancy = totalCount > 0 && occupiedCount < totalCount;
              
              if (filterType === 'fully-leased') {
                return isFullyLeased;
              } else if (filterType === 'has-vacancy') {
                return hasVacancy;
              }
              return true; // 'all' filter
            })
            .map((prop) => {
            const propRooms = allRooms.filter(r => r.propertyId === prop.id);
            const occupiedCount = propRooms.filter(r => r.status === 'OCCUPIED').length;
            const totalCount = propRooms.length;
            const hasVacancy = occupiedCount < totalCount;
            const isFullyLeased = totalCount > 0 && occupiedCount === totalCount;
            const hasMaintenance = propRooms.some(r => r.status === 'MAINTENANCE');
            
            let statusBadge = null;
            let statusClass = '';
            if (hasMaintenance) {
              statusBadge = 'Maintenance';
              statusClass = 'maintenance';
            } else if (isFullyLeased) {
              statusBadge = 'Fully Leased';
              statusClass = 'fully-leased';
            } else if (hasVacancy) {
              statusBadge = `${totalCount - occupiedCount} Vacancy`;
              statusClass = 'vacancy';
            }

            const totalRevenue = propRooms
              .filter(r => r.status === 'OCCUPIED')
              .reduce((sum, r) => sum + r.baseRent, 0);

            return (
              <div key={prop.id} className="property-card">
                <div className="property-image">
                  🏢
                  {statusBadge && (
                    <span className={`property-status-badge ${statusClass}`}>
                      {statusBadge}
                    </span>
                  )}
                </div>
                <div className="property-content">
                  <h3 className="property-name">{prop.name}</h3>
                  <p className="property-address">{prop.address || 'No address'}</p>
                  <div className="property-stats">
                    <div className="property-stat">
                      <span className="property-stat-label">Units</span>
                      <span className="property-stat-value">{occupiedCount}/{totalCount}</span>
                    </div>
                    <div className="property-stat">
                      <span className="property-stat-label">Revenue</span>
                      <span className="property-stat-value">
                        {totalRevenue > 0 ? `${(totalRevenue / 1000).toFixed(1)}k` : '-'}
                      </span>
                    </div>
                  </div>
                  <div className="property-actions">
                    <button
                      className="view-rooms-btn"
                      onClick={() => setSelectedProperty(prop.id)}
                    >
                      Manage →
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedProperty && (
          <div className="rooms-section">
            <div className="rooms-header">
              <h2>Rooms</h2>
              <button className="btn btn-primary" onClick={() => { setEditingRoom(null); setFormData({ status: 'AVAILABLE' }); setShowRoomModal(true); }}>
                <span>➕</span> Add Room
              </button>
            </div>
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Floor</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Base Rent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.code}</td>
                    <td>{room.floor || '-'}</td>
                    <td>{room.type || '-'}</td>
                    <td>
                      <div className="room-status">
                        <span className={`room-status-dot ${room.status.toLowerCase()}`}></span>
                        <span className={`status-badge ${room.status === 'OCCUPIED' ? 'info' : room.status === 'AVAILABLE' ? 'success' : 'warning'}`}>
                          {room.status}
                        </span>
                      </div>
                    </td>
                    <td>{room.baseRent.toLocaleString()} VND</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon" onClick={() => { setEditingRoom(room); setFormData(room); setShowRoomModal(true); }} title="Edit">
                          ✏️
                        </button>
                        <button className="btn-icon danger" onClick={() => handleDeleteRoom(room.id)} title="Delete">
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

        {showPropertyModal && (
          <div className="modal-overlay" onClick={() => setShowPropertyModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingProperty ? 'Edit' : 'Add'} Property</h2>
                <button className="modal-close" onClick={() => setShowPropertyModal(false)}>✕</button>
              </div>
              <form onSubmit={handlePropertySubmit}>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    placeholder="Property name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    placeholder="Property address"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Property description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowPropertyModal(false); setEditingProperty(null); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showRoomModal && (
          <div className="modal-overlay" onClick={() => setShowRoomModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingRoom ? 'Edit' : 'Add'} Room</h2>
                <button className="modal-close" onClick={() => setShowRoomModal(false)}>✕</button>
              </div>
              <form onSubmit={handleRoomSubmit}>
                <div className="form-group">
                  <label>Code *</label>
                  <input
                    placeholder="Room code"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Floor</label>
                  <input
                    placeholder="Floor number"
                    value={formData.floor || ''}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <input
                    placeholder="Room type (e.g., Studio, 1 Bedroom)"
                    value={formData.type || ''}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={formData.status || 'AVAILABLE'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Base Rent (VND) *</label>
                  <input
                    type="number"
                    placeholder="Base rent amount"
                    value={formData.baseRent || ''}
                    onChange={(e) => setFormData({ ...formData, baseRent: parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    type="number"
                    placeholder="Maximum capacity"
                    value={formData.capacity || ''}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => { setShowRoomModal(false); setEditingRoom(null); }}>
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

