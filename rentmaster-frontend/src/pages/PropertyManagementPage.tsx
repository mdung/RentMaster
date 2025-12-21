import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { Property, Room } from '../types';
import { propertyApi, roomApi } from '../services/api/propertyApi';
import { propertyManagementApi, PropertyAmenity as ApiPropertyAmenity, PropertyImage as ApiPropertyImage, FloorPlan as ApiFloorPlan, MaintenanceSchedule as ApiMaintenanceSchedule, Vendor as ApiVendor } from '../services/api/propertyManagementApi';
import { ImageUploadModal, AmenityModal, FloorPlanModal, ScheduleModal, VendorModal } from './PropertyManagementPageModals';
import './PropertyManagementPage.css';

interface PropertyAmenity {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  isAvailable: boolean;
  additionalCost: number;
  costFrequency: string;
  location: string;
  operatingHours: string;
  capacity?: number;
  bookingRequired: boolean;
}

interface PropertyImage {
  id: number;
  propertyId: number;
  imageUrl: string;
  imageType: string;
  caption: string;
  displayOrder: number;
  isMain: boolean;
}

interface FloorPlan {
  id: number;
  propertyId: number;
  name: string;
  description: string;
  floorNumber: number;
  totalRooms: number;
  totalArea: number;
  imageUrl: string;
  isActive: boolean;
}

interface MaintenanceSchedule {
  id: number;
  propertyId: number;
  title: string;
  description: string;
  maintenanceType: string;
  frequency: string;
  nextDueDate: string;
  lastCompletedDate?: string;
  assignedVendor?: string;
  estimatedCost: number;
  priority: string;
  isActive: boolean;
}

interface Vendor {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  serviceTypes: string[];
  rating: number;
  isActive: boolean;
  notes?: string;
}

export const PropertyManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'amenities' | 'images' | 'floor-plans' | 'maintenance' | 'vendors'>('overview');
  const [loading, setLoading] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<number>(1);
  
  // State for different property data
  const [properties, setProperties] = useState<Property[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [amenities, setAmenities] = useState<PropertyAmenity[]>([]);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  
  // Modal states
  const [showAmenityModal, setShowAmenityModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadPropertyData();
  }, [activeTab, selectedProperty]);

  const loadPropertyData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadProperties(),
        loadRooms(),
        loadAmenities(),
        loadImages(),
        loadFloorPlans(),
        loadMaintenanceSchedules(),
        loadVendors()
      ]);
    } catch (error) {
      console.error('Error loading property data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProperties = async () => {
    try {
      const props = await propertyApi.getAll();
      setProperties(props);
      if (props.length > 0 && !props.find(p => p.id === selectedProperty)) {
        setSelectedProperty(props[0].id);
      }
    } catch (error) {
      console.error('Failed to load properties:', error);
      setProperties([]);
    }
  };

  const loadRooms = async () => {
    try {
      const roomsData = await propertyManagementApi.getRoomsByProperty(selectedProperty);
      setRooms(roomsData);
    } catch (error) {
      console.error('Failed to load rooms:', error);
      setRooms([]);
    }
  };

  const loadAmenities = async () => {
    try {
      const amenitiesData = await propertyManagementApi.getAmenities(selectedProperty);
      // Map API response to component interface
      const mappedAmenities: PropertyAmenity[] = amenitiesData.map(a => ({
        id: a.id,
        name: a.name,
        description: a.description || '',
        category: a.category,
        icon: `fas fa-${a.category.toLowerCase()}`,
        isAvailable: a.available,
        additionalCost: a.cost || 0,
        costFrequency: 'MONTHLY',
        location: '',
        operatingHours: '',
        capacity: undefined,
        bookingRequired: false
      }));
      setAmenities(mappedAmenities);
    } catch (error) {
      console.error('Failed to load amenities:', error);
      setAmenities([]);
    }
  };

  const loadImages = async () => {
    try {
      const imagesData = await propertyManagementApi.getImages(selectedProperty);
      // Map API response to component interface
      const mappedImages: PropertyImage[] = imagesData.map(img => {
        let imageUrl = img.filePath;
        // If it's not already a full URL, construct it
        if (!imageUrl.startsWith('http')) {
          const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';
          imageUrl = imageUrl.startsWith('/') 
            ? `${apiBaseUrl}${imageUrl}`
            : `${apiBaseUrl}/api/files/${imageUrl}`;
        }
        return {
          id: img.id,
          propertyId: selectedProperty,
          imageUrl: imageUrl,
          imageType: img.category || 'OTHER',
          caption: img.description || img.fileName,
          displayOrder: 0,
          isMain: img.isPrimary || false
        };
      });
      setImages(mappedImages);
    } catch (error) {
      console.error('Failed to load images:', error);
      setImages([]);
    }
  };

  const loadFloorPlans = async () => {
    try {
      const floorPlansData = await propertyManagementApi.getFloorPlans(selectedProperty);
      // Map API response to component interface
      const mappedFloorPlans: FloorPlan[] = floorPlansData.map(fp => {
        let imageUrl = fp.filePath;
        // If it's not already a full URL, construct it
        if (!imageUrl.startsWith('http')) {
          const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8080';
          imageUrl = imageUrl.startsWith('/') 
            ? `${apiBaseUrl}${imageUrl}`
            : `${apiBaseUrl}/api/files/${imageUrl}`;
        }
        return {
          id: fp.id,
          propertyId: selectedProperty,
          name: fp.name,
          description: fp.description || '',
          floorNumber: parseInt(fp.floor) || 0,
          totalRooms: fp.roomCount || 0,
          totalArea: fp.totalArea || 0,
          imageUrl: imageUrl,
          isActive: true
        };
      });
      setFloorPlans(mappedFloorPlans);
    } catch (error) {
      console.error('Failed to load floor plans:', error);
      setFloorPlans([]);
    }
  };

  const loadMaintenanceSchedules = async () => {
    try {
      const schedulesData = await propertyManagementApi.getMaintenanceSchedules(selectedProperty);
      // Map API response to component interface
      const mappedSchedules: MaintenanceSchedule[] = schedulesData.map(s => ({
        id: s.id,
        propertyId: selectedProperty,
        title: s.title,
        description: s.description,
        maintenanceType: s.category,
        frequency: s.frequency,
        nextDueDate: s.nextDueDate,
        lastCompletedDate: s.lastCompletedDate,
        assignedVendor: s.assignedVendor,
        estimatedCost: s.estimatedCost || 0,
        priority: s.priority,
        isActive: s.status === 'ACTIVE'
      }));
      setMaintenanceSchedules(mappedSchedules);
    } catch (error) {
      console.error('Failed to load maintenance schedules:', error);
      setMaintenanceSchedules([]);
    }
  };

  const loadVendors = async () => {
    try {
      const vendorsData = await propertyManagementApi.getVendors();
      // Map API response to component interface
      const mappedVendors: Vendor[] = vendorsData.map(v => ({
        id: v.id,
        name: v.name,
        contactPerson: v.contactPerson,
        phone: v.phone,
        email: v.email,
        address: v.address || '',
        serviceTypes: [v.category],
        rating: v.rating,
        isActive: v.active,
        notes: ''
      }));
      setVendors(mappedVendors);
    } catch (error) {
      console.error('Failed to load vendors:', error);
      setVendors([]);
    }
  };

  return (
    <MainLayout>
      <div className="property-management">
        <div className="property-management-header">
          <div className="header-content">
            <h1>Property Management</h1>
            <p>Comprehensive property and facility management</p>
          </div>
          
          <div className="property-selector">
            <label htmlFor="property-select">
              Property:
            </label>
            <div className="property-select-wrapper">
              <select 
                id="property-select"
                value={selectedProperty} 
                onChange={(e) => setSelectedProperty(Number(e.target.value))}
                className="property-select"
              >
                {properties.length === 0 ? (
                  <option value="">No properties available</option>
                ) : (
                  properties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="property-management-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-building"></i>
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'amenities' ? 'active' : ''}`}
            onClick={() => setActiveTab('amenities')}
          >
            <i className="fas fa-swimming-pool"></i>
            Amenities
          </button>
          <button
            className={`tab-button ${activeTab === 'images' ? 'active' : ''}`}
            onClick={() => setActiveTab('images')}
          >
            <i className="fas fa-images"></i>
            Images
          </button>
          <button
            className={`tab-button ${activeTab === 'floor-plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('floor-plans')}
          >
            <i className="fas fa-map"></i>
            Floor Plans
          </button>
          <button
            className={`tab-button ${activeTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => setActiveTab('maintenance')}
          >
            <i className="fas fa-tools"></i>
            Maintenance
          </button>
          <button
            className={`tab-button ${activeTab === 'vendors' ? 'active' : ''}`}
            onClick={() => setActiveTab('vendors')}
          >
            <i className="fas fa-handshake"></i>
            Vendors
          </button>
        </div>

        <div className="property-management-content">
          {loading ? (
            <div className="property-loading">
              <div className="loading-spinner"></div>
              <p>Loading property data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <PropertyOverviewTab 
                  property={properties.find(p => p.id === selectedProperty)} 
                  rooms={rooms}
                />
              )}
              {activeTab === 'amenities' && (
                <AmenitiesTab 
                  amenities={amenities} 
                  onRefresh={loadAmenities}
                  onAdd={() => { setEditingItem(null); setFormData({}); setShowAmenityModal(true); }}
                  propertyId={selectedProperty}
                />
              )}
              {activeTab === 'images' && (
                <ImagesTab 
                  images={images} 
                  onRefresh={loadImages}
                  onUpload={() => { setShowImageUploadModal(true); }}
                  propertyId={selectedProperty}
                />
              )}
              {activeTab === 'floor-plans' && (
                <FloorPlansTab 
                  floorPlans={floorPlans} 
                  onRefresh={loadFloorPlans}
                  onAdd={() => { setEditingItem(null); setFormData({}); setShowFloorPlanModal(true); }}
                  propertyId={selectedProperty}
                />
              )}
              {activeTab === 'maintenance' && (
                <MaintenanceTab 
                  schedules={maintenanceSchedules} 
                  onRefresh={loadMaintenanceSchedules}
                  onAdd={() => { setEditingItem(null); setFormData({}); setShowScheduleModal(true); }}
                  propertyId={selectedProperty}
                />
              )}
              {activeTab === 'vendors' && (
                <VendorsTab 
                  vendors={vendors} 
                  onRefresh={loadVendors}
                  onAdd={() => { setEditingItem(null); setFormData({}); setShowVendorModal(true); }}
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Image Upload Modal */}
      {showImageUploadModal && (
        <ImageUploadModal
          propertyId={selectedProperty}
          onClose={() => setShowImageUploadModal(false)}
          onSuccess={() => {
            setShowImageUploadModal(false);
            loadImages();
          }}
        />
      )}

      {/* Add Amenity Modal */}
      {showAmenityModal && (
        <AmenityModal
          propertyId={selectedProperty}
          amenity={editingItem}
          onClose={() => {
            setShowAmenityModal(false);
            setEditingItem(null);
            setFormData({});
          }}
          onSuccess={() => {
            setShowAmenityModal(false);
            setEditingItem(null);
            setFormData({});
            loadAmenities();
          }}
        />
      )}

      {/* Add Floor Plan Modal */}
      {showFloorPlanModal && (
        <FloorPlanModal
          propertyId={selectedProperty}
          floorPlan={editingItem}
          onClose={() => {
            setShowFloorPlanModal(false);
            setEditingItem(null);
            setFormData({});
          }}
          onSuccess={() => {
            setShowFloorPlanModal(false);
            setEditingItem(null);
            setFormData({});
            loadFloorPlans();
          }}
        />
      )}

      {/* Add Schedule Modal */}
      {showScheduleModal && (
        <ScheduleModal
          propertyId={selectedProperty}
          schedule={editingItem}
          vendors={vendors}
          onClose={() => {
            setShowScheduleModal(false);
            setEditingItem(null);
            setFormData({});
          }}
          onSuccess={() => {
            setShowScheduleModal(false);
            setEditingItem(null);
            setFormData({});
            loadMaintenanceSchedules();
          }}
        />
      )}

      {/* Add Vendor Modal */}
      {showVendorModal && (
        <VendorModal
          vendor={editingItem}
          onClose={() => {
            setShowVendorModal(false);
            setEditingItem(null);
            setFormData({});
          }}
          onSuccess={() => {
            setShowVendorModal(false);
            setEditingItem(null);
            setFormData({});
            loadVendors();
          }}
        />
      )}
    </MainLayout>
  );
};

// Overview Tab Component
const PropertyOverviewTab: React.FC<{ property?: Property; rooms: Room[] }> = ({ property, rooms }) => {
  if (!property) return <div>Select a property to view details</div>;

  const roomStats = {
    total: rooms.length,
    occupied: rooms.filter(r => r.status === 'OCCUPIED').length,
    available: rooms.filter(r => r.status === 'AVAILABLE').length,
    maintenance: rooms.filter(r => r.status === 'MAINTENANCE').length
  };

  const occupancyRate = roomStats.total > 0 ? (roomStats.occupied / roomStats.total) * 100 : 0;
  const averageRent = rooms.length > 0 ? rooms.reduce((sum, room) => sum + room.baseRent, 0) / rooms.length : 0;

  return (
    <div className="property-overview-tab">
      <div className="property-info-card">
        <h3>{property.name}</h3>
        <p className="property-address">{property.address}</p>
        <p className="property-description">{property.description}</p>
      </div>

      <div className="property-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-home"></i>
          </div>
          <div className="stat-content">
            <h4>Total Units</h4>
            <p className="stat-value">{roomStats.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-percentage"></i>
          </div>
          <div className="stat-content">
            <h4>Occupancy Rate</h4>
            <p className="stat-value">{occupancyRate.toFixed(1)}%</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h4>Average Rent</h4>
            <p className="stat-value">${averageRent.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-tools"></i>
          </div>
          <div className="stat-content">
            <h4>Maintenance</h4>
            <p className="stat-value">{roomStats.maintenance}</p>
          </div>
        </div>
      </div>

      <div className="rooms-overview">
        <h3>Units Overview</h3>
        <div className="rooms-grid">
          {rooms.map(room => (
            <div key={room.id} className={`room-card ${room.status.toLowerCase()}`}>
              <div className="room-header">
                <h4>{room.code}</h4>
                <span className={`room-status ${room.status.toLowerCase()}`}>
                  {room.status}
                </span>
              </div>
              <div className="room-details">
                <p><strong>Type:</strong> {room.type}</p>
                <p><strong>Floor:</strong> {room.floor}</p>
                <p><strong>Size:</strong> {room.sizeM2}m²</p>
                <p><strong>Rent:</strong> ${room.baseRent.toLocaleString()}</p>
                <p><strong>Capacity:</strong> {room.capacity} people</p>
              </div>
              {room.notes && (
                <p className="room-notes">{room.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Amenities Tab Component
const AmenitiesTab: React.FC<{ amenities: PropertyAmenity[]; onRefresh: () => void; onAdd: () => void; propertyId: number }> = ({ amenities, onRefresh, onAdd, propertyId }) => {
  return (
    <div className="amenities-tab">
      <div className="amenities-header">
        <h3>Property Amenities</h3>
        <button className="add-amenity-button" onClick={onAdd}>
          <i className="fas fa-plus"></i>
          Add Amenity
        </button>
      </div>

      <div className="amenities-grid">
        {amenities.map(amenity => (
          <div key={amenity.id} className="amenity-card">
            <div className="amenity-icon">
              <i className={amenity.icon}></i>
            </div>
            <div className="amenity-content">
              <h4>{amenity.name}</h4>
              <p className="amenity-description">{amenity.description}</p>
              <div className="amenity-details">
                <p><strong>Category:</strong> {amenity.category}</p>
                <p><strong>Location:</strong> {amenity.location}</p>
                <p><strong>Hours:</strong> {amenity.operatingHours}</p>
                {amenity.capacity && (
                  <p><strong>Capacity:</strong> {amenity.capacity} people</p>
                )}
                {amenity.additionalCost > 0 && (
                  <p><strong>Cost:</strong> ${amenity.additionalCost}/{amenity.costFrequency.toLowerCase()}</p>
                )}
                <p><strong>Booking Required:</strong> {amenity.bookingRequired ? 'Yes' : 'No'}</p>
              </div>
              <div className={`amenity-status ${amenity.isAvailable ? 'available' : 'unavailable'}`}>
                {amenity.isAvailable ? 'Available' : 'Unavailable'}
              </div>
            </div>
            <div className="amenity-actions">
              <button className="edit-button">Edit</button>
              <button className="toggle-button">
                {amenity.isAvailable ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Images Tab Component
const ImagesTab: React.FC<{ images: PropertyImage[]; onRefresh: () => void; onUpload: () => void; propertyId: number }> = ({ images, onRefresh, onUpload, propertyId }) => {
  return (
    <div className="images-tab">
      <div className="images-header">
        <h3>Property Images</h3>
        <button className="upload-image-button" onClick={onUpload}>
          <i className="fas fa-upload"></i>
          Upload Images
        </button>
      </div>

      <div className="images-grid">
        {images.map(image => (
          <div key={image.id} className="image-card">
            <div className="image-container">
              <img src={image.imageUrl} alt={image.caption} />
              {image.isMain && (
                <div className="main-image-badge">Main</div>
              )}
            </div>
            <div className="image-info">
              <h4>{image.caption}</h4>
              <p><strong>Type:</strong> {image.imageType}</p>
              <p><strong>Order:</strong> {image.displayOrder}</p>
            </div>
            <div className="image-actions">
              <button className="edit-button">Edit</button>
              <button className="set-main-button">Set as Main</button>
              <button className="delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Floor Plans Tab Component
const FloorPlansTab: React.FC<{ floorPlans: FloorPlan[]; onRefresh: () => void; onAdd: () => void; propertyId: number }> = ({ floorPlans, onRefresh, onAdd, propertyId }) => {
  return (
    <div className="floor-plans-tab">
      <div className="floor-plans-header">
        <h3>Floor Plans</h3>
        <button className="add-floor-plan-button" onClick={onAdd}>
          <i className="fas fa-plus"></i>
          Add Floor Plan
        </button>
      </div>

      <div className="floor-plans-list">
        {floorPlans.map(plan => (
          <div key={plan.id} className="floor-plan-card">
            <div className="floor-plan-image">
              <img src={plan.imageUrl} alt={plan.name} />
            </div>
            <div className="floor-plan-info">
              <h4>{plan.name}</h4>
              <p className="floor-plan-description">{plan.description}</p>
              <div className="floor-plan-details">
                <p><strong>Floor Number:</strong> {plan.floorNumber}</p>
                <p><strong>Total Rooms:</strong> {plan.totalRooms}</p>
                <p><strong>Total Area:</strong> {plan.totalArea}m²</p>
                <p><strong>Status:</strong> {plan.isActive ? 'Active' : 'Inactive'}</p>
              </div>
            </div>
            <div className="floor-plan-actions">
              <button className="view-button">View Full</button>
              <button className="edit-button">Edit</button>
              <button className="toggle-button">
                {plan.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Maintenance Tab Component
const MaintenanceTab: React.FC<{ schedules: MaintenanceSchedule[]; onRefresh: () => void; onAdd: () => void; propertyId: number }> = ({ schedules, onRefresh, onAdd, propertyId }) => {
  return (
    <div className="maintenance-tab">
      <div className="maintenance-header">
        <h3>Maintenance Schedules</h3>
        <button className="add-schedule-button" onClick={onAdd}>
          <i className="fas fa-plus"></i>
          Add Schedule
        </button>
      </div>

      <div className="schedules-list">
        {schedules.map(schedule => (
          <div key={schedule.id} className="schedule-card">
            <div className="schedule-header">
              <h4>{schedule.title}</h4>
              <div className={`priority-badge ${schedule.priority.toLowerCase()}`}>
                {schedule.priority}
              </div>
            </div>
            <div className="schedule-details">
              <p className="schedule-description">{schedule.description}</p>
              <div className="schedule-info">
                <p><strong>Type:</strong> {schedule.maintenanceType}</p>
                <p><strong>Frequency:</strong> {schedule.frequency}</p>
                <p><strong>Next Due:</strong> {new Date(schedule.nextDueDate).toLocaleDateString()}</p>
                <p><strong>Last Completed:</strong> {schedule.lastCompletedDate ? new Date(schedule.lastCompletedDate).toLocaleDateString() : 'Never'}</p>
                <p><strong>Assigned Vendor:</strong> {schedule.assignedVendor || 'Not assigned'}</p>
                <p><strong>Estimated Cost:</strong> ${schedule.estimatedCost.toLocaleString()}</p>
              </div>
            </div>
            <div className="schedule-actions">
              <button className="complete-button">Mark Complete</button>
              <button className="edit-button">Edit</button>
              <button className="toggle-button">
                {schedule.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Vendors Tab Component
const VendorsTab: React.FC<{ vendors: Vendor[]; onRefresh: () => void; onAdd: () => void }> = ({ vendors, onRefresh, onAdd }) => {
  return (
    <div className="vendors-tab">
      <div className="vendors-header">
        <h3>Vendors & Service Providers</h3>
        <button className="add-vendor-button" onClick={onAdd}>
          <i className="fas fa-plus"></i>
          Add Vendor
        </button>
      </div>

      <div className="vendors-grid">
        {vendors.map(vendor => (
          <div key={vendor.id} className="vendor-card">
            <div className="vendor-header">
              <h4>{vendor.name}</h4>
              <div className="vendor-rating">
                <span className="rating-stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <i 
                      key={i} 
                      className={`fas fa-star ${i < Math.floor(vendor.rating) ? 'filled' : ''}`}
                    ></i>
                  ))}
                </span>
                <span className="rating-value">{vendor.rating}</span>
              </div>
            </div>
            <div className="vendor-details">
              <p><strong>Contact:</strong> {vendor.contactPerson}</p>
              <p><strong>Phone:</strong> {vendor.phone}</p>
              <p><strong>Email:</strong> {vendor.email}</p>
              <p><strong>Address:</strong> {vendor.address}</p>
              <div className="service-types">
                <strong>Services:</strong>
                <div className="service-tags">
                  {vendor.serviceTypes.map((service, index) => (
                    <span key={index} className="service-tag">{service}</span>
                  ))}
                </div>
              </div>
              {vendor.notes && (
                <p className="vendor-notes"><strong>Notes:</strong> {vendor.notes}</p>
              )}
            </div>
            <div className="vendor-actions">
              <button className="contact-button">Contact</button>
              <button className="edit-button">Edit</button>
              <button className="toggle-button">
                {vendor.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};