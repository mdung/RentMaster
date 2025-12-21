import React, { useState } from 'react';
import { propertyManagementApi } from '../services/api/propertyManagementApi';

// Image Upload Modal
export const ImageUploadModal: React.FC<{
  propertyId: number;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ propertyId, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState('EXTERIOR');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      await propertyManagementApi.uploadImage(propertyId, file, category, description);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Upload Image</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
          <div className="form-group">
            <label>Image File *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <option value="EXTERIOR">Exterior</option>
              <option value="INTERIOR">Interior</option>
              <option value="KITCHEN">Kitchen</option>
              <option value="BATHROOM">Bathroom</option>
              <option value="BEDROOM">Bedroom</option>
              <option value="LIVING_ROOM">Living Room</option>
              <option value="AMENITY">Amenity</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Image description"
              rows={3}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Amenity Modal
export const AmenityModal: React.FC<{
  propertyId: number;
  amenity?: any;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ propertyId, amenity, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: amenity?.name || '',
    description: amenity?.description || '',
    category: amenity?.category || 'FITNESS',
    additionalCost: amenity?.additionalCost || 0,
    costFrequency: amenity?.costFrequency || 'MONTHLY',
    location: amenity?.location || '',
    operatingHours: amenity?.operatingHours || '',
    capacity: amenity?.capacity || '',
    bookingRequired: amenity?.bookingRequired || false,
    isAvailable: amenity?.isAvailable !== undefined ? amenity.isAvailable : true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (amenity) {
        await propertyManagementApi.updateAmenity(propertyId, amenity.id, formData);
      } else {
        await propertyManagementApi.createAmenity(propertyId, formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save amenity');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{amenity ? 'Edit' : 'Add'} Amenity</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="FITNESS">Fitness</option>
              <option value="RECREATION">Recreation</option>
              <option value="PARKING">Parking</option>
              <option value="SECURITY">Security</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Additional Cost</label>
            <input
              type="number"
              value={formData.additionalCost}
              onChange={(e) => setFormData({ ...formData, additionalCost: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Operating Hours</label>
            <input
              value={formData.operatingHours}
              onChange={(e) => setFormData({ ...formData, operatingHours: e.target.value })}
              placeholder="e.g., 24/7 or 6:00 AM - 10:00 PM"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Floor Plan Modal
export const FloorPlanModal: React.FC<{
  propertyId: number;
  floorPlan?: any;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ propertyId, floorPlan, onClose, onSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: floorPlan?.name || '',
    description: floorPlan?.description || '',
    floor: floorPlan?.floorNumber?.toString() || '',
    roomCount: floorPlan?.totalRooms || 0,
    totalArea: floorPlan?.totalArea || 0
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !floorPlan) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    setError('');

    try {
      if (floorPlan) {
        await propertyManagementApi.updateFloorPlan(propertyId, floorPlan.id, formData);
      } else if (file) {
        await propertyManagementApi.uploadFloorPlan(propertyId, file, formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save floor plan');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{floorPlan ? 'Edit' : 'Add'} Floor Plan</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          {!floorPlan && (
            <div className="form-group">
              <label>Floor Plan File *</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                required={!floorPlan}
              />
            </div>
          )}
          <div className="form-group">
            <label>Name *</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Floor Number</label>
            <input
              type="number"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Room Count</label>
            <input
              type="number"
              value={formData.roomCount}
              onChange={(e) => setFormData({ ...formData, roomCount: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>
          <div className="form-group">
            <label>Total Area (m²)</label>
            <input
              type="number"
              value={formData.totalArea}
              onChange={(e) => setFormData({ ...formData, totalArea: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={uploading}>
              {uploading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Schedule Modal
export const ScheduleModal: React.FC<{
  propertyId: number;
  schedule?: any;
  vendors: any[];
  onClose: () => void;
  onSuccess: () => void;
}> = ({ propertyId, schedule, vendors, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: schedule?.title || '',
    description: schedule?.description || '',
    maintenanceType: schedule?.maintenanceType || 'HVAC',
    frequency: schedule?.frequency || 'MONTHLY',
    nextDueDate: schedule?.nextDueDate || '',
    assignedVendor: schedule?.assignedVendor || '',
    estimatedCost: schedule?.estimatedCost || 0,
    priority: schedule?.priority || 'MEDIUM'
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (schedule) {
        await propertyManagementApi.updateMaintenanceSchedule(propertyId, schedule.id, formData);
      } else {
        await propertyManagementApi.createMaintenanceSchedule(propertyId, formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{schedule ? 'Edit' : 'Add'} Maintenance Schedule</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="form-group">
            <label>Type *</label>
            <select
              value={formData.maintenanceType}
              onChange={(e) => setFormData({ ...formData, maintenanceType: e.target.value })}
              required
            >
              <option value="HVAC">HVAC</option>
              <option value="ELEVATOR">Elevator</option>
              <option value="PLUMBING">Plumbing</option>
              <option value="ELECTRICAL">Electrical</option>
              <option value="SAFETY">Safety</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Frequency *</label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              required
            >
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="YEARLY">Yearly</option>
            </select>
          </div>
          <div className="form-group">
            <label>Next Due Date *</label>
            <input
              type="date"
              value={formData.nextDueDate}
              onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Assigned Vendor</label>
            <select
              value={formData.assignedVendor}
              onChange={(e) => setFormData({ ...formData, assignedVendor: e.target.value })}
            >
              <option value="">Select vendor</option>
              {vendors.map(v => (
                <option key={v.id} value={v.name}>{v.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Estimated Cost</label>
            <input
              type="number"
              value={formData.estimatedCost}
              onChange={(e) => setFormData({ ...formData, estimatedCost: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.01"
            />
          </div>
          <div className="form-group">
            <label>Priority *</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              required
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Vendor Modal
export const VendorModal: React.FC<{
  vendor?: any;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ vendor, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: vendor?.name || '',
    contactPerson: vendor?.contactPerson || '',
    phone: vendor?.phone || '',
    email: vendor?.email || '',
    address: vendor?.address || '',
    category: vendor?.serviceTypes?.[0] || 'HVAC',
    notes: vendor?.notes || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (vendor) {
        await propertyManagementApi.updateVendor(vendor.id, formData);
      } else {
        await propertyManagementApi.createVendor(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save vendor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{vendor ? 'Edit' : 'Add'} Vendor</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name *</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Contact Person *</label>
            <input
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={2}
            />
          </div>
          <div className="form-group">
            <label>Service Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            >
              <option value="HVAC">HVAC</option>
              <option value="PLUMBING">Plumbing</option>
              <option value="ELECTRICAL">Electrical</option>
              <option value="ELEVATOR">Elevator</option>
              <option value="FIRE_SAFETY">Fire Safety</option>
              <option value="SECURITY">Security</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

