import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { Property, Room } from '../types';
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
    // Mock data - replace with actual API call
    const mockProperties: Property[] = [
      {
        id: 1,
        name: 'Sunset Apartments',
        address: '456 Oak Street, Downtown, City 12345',
        description: 'Modern apartment complex with premium amenities',
        createdAt: '2024-01-01T00:00:00'
      },
      {
        id: 2,
        name: 'Downtown Lofts',
        address: '789 Main Street, Downtown, City 12345',
        description: 'Luxury loft-style apartments in the heart of downtown',
        createdAt: '2024-02-01T00:00:00'
      }
    ];
    setProperties(mockProperties);
  };

  const loadRooms = async () => {
    // Mock data - replace with actual API call
    const mockRooms: Room[] = [
      {
        id: 1,
        propertyId: selectedProperty,
        propertyName: 'Sunset Apartments',
        code: 'A101',
        floor: '1st Floor',
        type: 'Studio',
        sizeM2: 45,
        status: 'OCCUPIED',
        baseRent: 1200,
        capacity: 2,
        notes: 'Recently renovated'
      },
      {
        id: 2,
        propertyId: selectedProperty,
        propertyName: 'Sunset Apartments',
        code: 'A102',
        floor: '1st Floor',
        type: '1 Bedroom',
        sizeM2: 65,
        status: 'AVAILABLE',
        baseRent: 1500,
        capacity: 3
      },
      {
        id: 3,
        propertyId: selectedProperty,
        propertyName: 'Sunset Apartments',
        code: 'B201',
        floor: '2nd Floor',
        type: '2 Bedroom',
        sizeM2: 85,
        status: 'MAINTENANCE',
        baseRent: 1800,
        capacity: 4,
        notes: 'HVAC repair in progress'
      }
    ];
    setRooms(mockRooms);
  };

  const loadAmenities = async () => {
    // Mock data - replace with actual API call
    const mockAmenities: PropertyAmenity[] = [
      {
        id: 1,
        name: 'Swimming Pool',
        description: 'Olympic-size heated swimming pool',
        category: 'RECREATION',
        icon: 'fas fa-swimming-pool',
        isAvailable: true,
        additionalCost: 0,
        costFrequency: 'MONTHLY',
        location: 'Rooftop',
        operatingHours: '6:00 AM - 10:00 PM',
        capacity: 50,
        bookingRequired: false
      },
      {
        id: 2,
        name: 'Fitness Center',
        description: 'Fully equipped gym with modern equipment',
        category: 'FITNESS',
        icon: 'fas fa-dumbbell',
        isAvailable: true,
        additionalCost: 25,
        costFrequency: 'MONTHLY',
        location: 'Ground Floor',
        operatingHours: '24/7',
        capacity: 20,
        bookingRequired: false
      },
      {
        id: 3,
        name: 'Parking Garage',
        description: 'Secure underground parking',
        category: 'PARKING',
        icon: 'fas fa-car',
        isAvailable: true,
        additionalCost: 100,
        costFrequency: 'MONTHLY',
        location: 'Underground',
        operatingHours: '24/7',
        bookingRequired: true
      }
    ];
    setAmenities(mockAmenities);
  };

  const loadImages = async () => {
    // Mock data - replace with actual API call
    const mockImages: PropertyImage[] = [
      {
        id: 1,
        propertyId: selectedProperty,
        imageUrl: '/images/property-exterior.jpg',
        imageType: 'EXTERIOR',
        caption: 'Building exterior view',
        displayOrder: 1,
        isMain: true
      },
      {
        id: 2,
        propertyId: selectedProperty,
        imageUrl: '/images/property-lobby.jpg',
        imageType: 'INTERIOR',
        caption: 'Modern lobby area',
        displayOrder: 2,
        isMain: false
      },
      {
        id: 3,
        propertyId: selectedProperty,
        imageUrl: '/images/property-pool.jpg',
        imageType: 'AMENITY',
        caption: 'Rooftop swimming pool',
        displayOrder: 3,
        isMain: false
      }
    ];
    setImages(mockImages);
  };

  const loadFloorPlans = async () => {
    // Mock data - replace with actual API call
    const mockFloorPlans: FloorPlan[] = [
      {
        id: 1,
        propertyId: selectedProperty,
        name: 'Ground Floor',
        description: 'Lobby, amenities, and commercial spaces',
        floorNumber: 0,
        totalRooms: 0,
        totalArea: 500,
        imageUrl: '/images/floor-plan-ground.jpg',
        isActive: true
      },
      {
        id: 2,
        propertyId: selectedProperty,
        name: 'Floor 1-5',
        description: 'Residential units - Studios and 1BR',
        floorNumber: 1,
        totalRooms: 20,
        totalArea: 1200,
        imageUrl: '/images/floor-plan-residential.jpg',
        isActive: true
      },
      {
        id: 3,
        propertyId: selectedProperty,
        name: 'Floor 6-10',
        description: 'Residential units - 2BR and 3BR',
        floorNumber: 6,
        totalRooms: 15,
        totalArea: 1500,
        imageUrl: '/images/floor-plan-premium.jpg',
        isActive: true
      }
    ];
    setFloorPlans(mockFloorPlans);
  };

  const loadMaintenanceSchedules = async () => {
    // Mock data - replace with actual API call
    const mockSchedules: MaintenanceSchedule[] = [
      {
        id: 1,
        propertyId: selectedProperty,
        title: 'HVAC System Inspection',
        description: 'Quarterly inspection and maintenance of HVAC systems',
        maintenanceType: 'HVAC',
        frequency: 'QUARTERLY',
        nextDueDate: '2024-12-15',
        lastCompletedDate: '2024-09-15',
        assignedVendor: 'ABC HVAC Services',
        estimatedCost: 2500,
        priority: 'HIGH',
        isActive: true
      },
      {
        id: 2,
        propertyId: selectedProperty,
        title: 'Elevator Maintenance',
        description: 'Monthly elevator inspection and servicing',
        maintenanceType: 'ELEVATOR',
        frequency: 'MONTHLY',
        nextDueDate: '2024-12-01',
        lastCompletedDate: '2024-11-01',
        assignedVendor: 'Elevator Tech Co',
        estimatedCost: 800,
        priority: 'MEDIUM',
        isActive: true
      },
      {
        id: 3,
        propertyId: selectedProperty,
        title: 'Fire Safety System Check',
        description: 'Annual fire safety system inspection',
        maintenanceType: 'SAFETY',
        frequency: 'YEARLY',
        nextDueDate: '2025-03-01',
        lastCompletedDate: '2024-03-01',
        assignedVendor: 'Fire Safety Pro',
        estimatedCost: 1200,
        priority: 'HIGH',
        isActive: true
      }
    ];
    setMaintenanceSchedules(mockSchedules);
  };

  const loadVendors = async () => {
    // Mock data - replace with actual API call
    const mockVendors: Vendor[] = [
      {
        id: 1,
        name: 'ABC HVAC Services',
        contactPerson: 'John Smith',
        phone: '+1-555-0123',
        email: 'john@abchvac.com',
        address: '123 Industrial Ave, City 12345',
        serviceTypes: ['HVAC', 'PLUMBING', 'ELECTRICAL'],
        rating: 4.8,
        isActive: true,
        notes: 'Reliable service, quick response time'
      },
      {
        id: 2,
        name: 'Elevator Tech Co',
        contactPerson: 'Sarah Johnson',
        phone: '+1-555-0124',
        email: 'sarah@elevatortech.com',
        address: '456 Tech Street, City 12345',
        serviceTypes: ['ELEVATOR', 'MECHANICAL'],
        rating: 4.6,
        isActive: true
      },
      {
        id: 3,
        name: 'Fire Safety Pro',
        contactPerson: 'Mike Wilson',
        phone: '+1-555-0125',
        email: 'mike@firesafetypro.com',
        address: '789 Safety Blvd, City 12345',
        serviceTypes: ['FIRE_SAFETY', 'SECURITY'],
        rating: 4.9,
        isActive: true,
        notes: 'Certified fire safety specialists'
      }
    ];
    setVendors(mockVendors);
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
            <select 
              value={selectedProperty} 
              onChange={(e) => setSelectedProperty(Number(e.target.value))}
              className="property-select"
            >
              {properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.name}
                </option>
              ))}
            </select>
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
                <AmenitiesTab amenities={amenities} onRefresh={loadAmenities} />
              )}
              {activeTab === 'images' && (
                <ImagesTab images={images} onRefresh={loadImages} />
              )}
              {activeTab === 'floor-plans' && (
                <FloorPlansTab floorPlans={floorPlans} onRefresh={loadFloorPlans} />
              )}
              {activeTab === 'maintenance' && (
                <MaintenanceTab schedules={maintenanceSchedules} onRefresh={loadMaintenanceSchedules} />
              )}
              {activeTab === 'vendors' && (
                <VendorsTab vendors={vendors} onRefresh={loadVendors} />
              )}
            </>
          )}
        </div>
      </div>
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
const AmenitiesTab: React.FC<{ amenities: PropertyAmenity[]; onRefresh: () => void }> = ({ amenities, onRefresh }) => {
  return (
    <div className="amenities-tab">
      <div className="amenities-header">
        <h3>Property Amenities</h3>
        <button className="add-amenity-button">
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
const ImagesTab: React.FC<{ images: PropertyImage[]; onRefresh: () => void }> = ({ images, onRefresh }) => {
  return (
    <div className="images-tab">
      <div className="images-header">
        <h3>Property Images</h3>
        <button className="upload-image-button">
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
const FloorPlansTab: React.FC<{ floorPlans: FloorPlan[]; onRefresh: () => void }> = ({ floorPlans, onRefresh }) => {
  return (
    <div className="floor-plans-tab">
      <div className="floor-plans-header">
        <h3>Floor Plans</h3>
        <button className="add-floor-plan-button">
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
const MaintenanceTab: React.FC<{ schedules: MaintenanceSchedule[]; onRefresh: () => void }> = ({ schedules, onRefresh }) => {
  return (
    <div className="maintenance-tab">
      <div className="maintenance-header">
        <h3>Maintenance Schedules</h3>
        <button className="add-schedule-button">
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
const VendorsTab: React.FC<{ vendors: Vendor[]; onRefresh: () => void }> = ({ vendors, onRefresh }) => {
  return (
    <div className="vendors-tab">
      <div className="vendors-header">
        <h3>Vendors & Service Providers</h3>
        <button className="add-vendor-button">
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