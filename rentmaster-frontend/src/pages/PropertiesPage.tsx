import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { propertyApi, roomApi } from '../services/api/propertyApi';
import { Property, Room } from '../types';
import './PropertiesPage.css';

export const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedProperty) {
      loadRooms(selectedProperty);
    }
  }, [selectedProperty]);

  const loadData = async () => {
    try {
      const props = await propertyApi.getAll();
      setProperties(props);
    } catch (error) {
      console.error('Failed to load properties:', error);
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
      loadData();
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
          <h1>Properties & Rooms</h1>
          <button onClick={() => { setEditingProperty(null); setFormData({}); setShowPropertyModal(true); }}>
            Add Property
          </button>
        </div>

        <div className="properties-grid">
          {properties.map((prop) => (
            <div key={prop.id} className="property-card">
              <div className="property-header">
                <h3>{prop.name}</h3>
                <div className="property-actions">
                  <button onClick={() => { setEditingProperty(prop); setFormData(prop); setShowPropertyModal(true); }}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteProperty(prop.id)}>Delete</button>
                </div>
              </div>
              <p>{prop.address}</p>
              <button onClick={() => setSelectedProperty(prop.id)} className="view-rooms-btn">
                View Rooms
              </button>
            </div>
          ))}
        </div>

        {selectedProperty && (
          <div className="rooms-section">
            <div className="rooms-header">
              <h2>Rooms</h2>
              <button onClick={() => { setEditingRoom(null); setFormData({ status: 'AVAILABLE' }); setShowRoomModal(true); }}>
                Add Room
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
                    <td>{room.status}</td>
                    <td>{room.baseRent.toLocaleString()} VND</td>
                    <td>
                      <button onClick={() => { setEditingRoom(room); setFormData(room); setShowRoomModal(true); }}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteRoom(room.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showPropertyModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingProperty ? 'Edit' : 'Add'} Property</h2>
              <form onSubmit={handlePropertySubmit}>
                <input
                  placeholder="Name"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                <input
                  placeholder="Address"
                  value={formData.address || ''}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
                <textarea
                  placeholder="Description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <div className="modal-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => { setShowPropertyModal(false); setEditingProperty(null); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showRoomModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>{editingRoom ? 'Edit' : 'Add'} Room</h2>
              <form onSubmit={handleRoomSubmit}>
                <input
                  placeholder="Code"
                  value={formData.code || ''}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
                <input
                  placeholder="Floor"
                  value={formData.floor || ''}
                  onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                />
                <input
                  placeholder="Type"
                  value={formData.type || ''}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
                <select
                  value={formData.status || 'AVAILABLE'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  required
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="MAINTENANCE">Maintenance</option>
                </select>
                <input
                  type="number"
                  placeholder="Base Rent"
                  value={formData.baseRent || ''}
                  onChange={(e) => setFormData({ ...formData, baseRent: parseFloat(e.target.value) })}
                  required
                />
                <input
                  type="number"
                  placeholder="Capacity"
                  value={formData.capacity || ''}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                />
                <div className="modal-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => { setShowRoomModal(false); setEditingRoom(null); }}>
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

