import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { maintenanceApi, MaintenanceRequest, WorkOrder, Asset, Vendor, MaintenanceSchedule } from '../services/api/maintenanceApi';
import { propertyApi } from '../services/api/propertyApi';
import { 
  Wrench, 
  ClipboardList, 
  Users, 
  History, 
  Package,
  Plus,
  Edit,
  Trash2,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import './MaintenanceOperationsPage.css';
import './shared-styles.css';

interface ModalState {
  show: boolean;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  details?: string;
  onConfirm?: () => void;
  confirmText?: string;
}

export const MaintenanceOperationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'work-orders' | 'vendors' | 'history' | 'assets'>('requests');
  const [loading, setLoading] = useState(false);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState<MaintenanceSchedule[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'request' | 'work-order' | 'vendor' | 'asset'>('request');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  
  // Notification modal
  const [notificationModal, setNotificationModal] = useState<ModalState>({ 
    show: false, 
    title: '', 
    message: '', 
    type: 'info' 
  });
  
  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterProperty, setFilterProperty] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const showNotification = (
    title: string, 
    message: string, 
    type: 'info' | 'success' | 'warning' | 'error' = 'info', 
    details?: string,
    onConfirm?: () => void,
    confirmText?: string
  ) => {
    setNotificationModal({ show: true, title, message, type, details, onConfirm, confirmText });
  };

  const hideNotification = () => {
    setNotificationModal({ show: false, title: '', message: '', type: 'info' });
  };

  useEffect(() => {
    loadProperties();
    loadData();
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [filterStatus, filterProperty]);

  const loadProperties = async () => {
    try {
      const data = await propertyApi.getAll();
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (filterStatus) params.status = filterStatus;
      if (filterProperty) params.propertyId = filterProperty;

      switch (activeTab) {
        case 'requests':
          const requests = await maintenanceApi.getMaintenanceRequests(params);
          setMaintenanceRequests(requests || []);
          break;
        case 'work-orders':
          const orders = await maintenanceApi.getWorkOrders(params);
          setWorkOrders(orders || []);
          break;
        case 'vendors':
          const vendorsData = await maintenanceApi.getVendors();
          setVendors(vendorsData || []);
          break;
        case 'history':
          const history = await maintenanceApi.getMaintenanceHistory(filterProperty || undefined);
          setMaintenanceHistory(history || []);
          break;
        case 'assets':
          const assetsData = await maintenanceApi.getAssets(params);
          setAssets(assetsData || []);
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type: 'request' | 'work-order' | 'vendor' | 'asset', item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        propertyId: filterProperty || (properties.length > 0 ? properties[0].id : null),
        status: type === 'request' ? 'SUBMITTED' : type === 'work-order' ? 'PENDING' : type === 'asset' ? 'ACTIVE' : undefined,
        priority: 'MEDIUM',
        category: '',
        allowEntry: false
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (modalType === 'request') {
        if (editingItem) {
          await maintenanceApi.updateMaintenanceRequest(editingItem.id!, formData);
          showNotification('Success', 'Maintenance request updated successfully!', 'success');
        } else {
          await maintenanceApi.createMaintenanceRequest(formData);
          showNotification('Success', 'Maintenance request created successfully!', 'success');
        }
      } else if (modalType === 'work-order') {
        if (editingItem) {
          await maintenanceApi.updateWorkOrder(editingItem.id!, formData);
          showNotification('Success', 'Work order updated successfully!', 'success');
        } else {
          await maintenanceApi.createWorkOrder(formData);
          showNotification('Success', 'Work order created successfully!', 'success');
        }
      } else if (modalType === 'asset') {
        if (editingItem) {
          await maintenanceApi.updateAsset(editingItem.id!, formData);
          showNotification('Success', 'Asset updated successfully!', 'success');
        } else {
          await maintenanceApi.createAsset(formData);
          showNotification('Success', 'Asset created successfully!', 'success');
        }
      }
      handleCloseModal();
      loadData();
    } catch (error: any) {
      console.error('Error saving:', error);
      showNotification(
        'Error', 
        'Failed to save. Please try again.', 
        'error',
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: string, id: number) => {
    const itemName = type === 'request' ? 'maintenance request' : type === 'work-order' ? 'work order' : 'asset';
    showNotification(
      'Confirm Delete',
      `Are you sure you want to delete this ${itemName}? This action cannot be undone.`,
      'warning',
      undefined,
      async () => {
        try {
          setLoading(true);
          if (type === 'request') {
            await maintenanceApi.deleteMaintenanceRequest(id);
          } else if (type === 'work-order') {
            await maintenanceApi.deleteWorkOrder(id);
          } else if (type === 'asset') {
            await maintenanceApi.deleteAsset(id);
          }
          hideNotification();
          showNotification('Success', `${itemName.charAt(0).toUpperCase() + itemName.slice(1)} deleted successfully!`, 'success');
          loadData();
        } catch (error: any) {
          console.error('Error deleting:', error);
          showNotification(
            'Error',
            'Failed to delete. Please try again.',
            'error',
            error.response?.data?.message || error.message
          );
        } finally {
          setLoading(false);
        }
      },
      'Delete'
    );
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
      case 'ACTIVE':
        return '#10b981';
      case 'IN_PROGRESS':
      case 'ASSIGNED':
        return '#3b82f6';
      case 'PENDING':
      case 'SUBMITTED':
      case 'SCHEDULED':
        return '#f59e0b';
      case 'CANCELLED':
      case 'INACTIVE':
        return '#ef4444';
      case 'URGENT':
      case 'EMERGENCY':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'URGENT':
      case 'EMERGENCY':
        return '#dc2626';
      case 'HIGH':
        return '#f59e0b';
      case 'MEDIUM':
        return '#3b82f6';
      case 'LOW':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const filteredRequests = maintenanceRequests.filter(r => 
    !searchTerm || 
    r.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWorkOrders = workOrders.filter(wo => 
    !searchTerm || 
    wo.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wo.workOrderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wo.workType?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAssets = assets.filter(a => 
    !searchTerm || 
    a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.assetCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredHistory = maintenanceHistory.filter(h => 
    !searchTerm || 
    h.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="maintenance-operations-page">
        <div className="page-header">
          <div>
            <h1>Maintenance & Operations</h1>
            <p className="page-subtitle">Track maintenance requests, work orders, vendors, history, and assets</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="maintenance-tabs">
          <button
            className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <Wrench className="tab-icon" />
            Maintenance Requests
          </button>
          <button
            className={`tab-button ${activeTab === 'work-orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('work-orders')}
          >
            <ClipboardList className="tab-icon" />
            Work Orders
          </button>
          <button
            className={`tab-button ${activeTab === 'vendors' ? 'active' : ''}`}
            onClick={() => setActiveTab('vendors')}
          >
            <Users className="tab-icon" />
            Vendors
          </button>
          <button
            className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <History className="tab-icon" />
            Maintenance History
          </button>
          <button
            className={`tab-button ${activeTab === 'assets' ? 'active' : ''}`}
            onClick={() => setActiveTab('assets')}
          >
            <Package className="tab-icon" />
            Assets
          </button>
        </div>

        {/* Filters and Actions */}
        <div className="maintenance-filters">
          <div className="filter-group">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-group">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              {activeTab === 'requests' && (
                <>
                  <option value="SUBMITTED">Submitted</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </>
              )}
              {activeTab === 'work-orders' && (
                <>
                  <option value="PENDING">Pending</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </>
              )}
              {activeTab === 'assets' && (
                <>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="REPAIR">Repair</option>
                  <option value="RETIRED">Retired</option>
                </>
              )}
            </select>
          </div>
          <div className="filter-group">
            <select
              value={filterProperty || ''}
              onChange={(e) => setFilterProperty(e.target.value ? Number(e.target.value) : null)}
              className="filter-select"
            >
              <option value="">All Properties</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              if (activeTab === 'requests') handleOpenModal('request');
              else if (activeTab === 'work-orders') handleOpenModal('work-order');
              else if (activeTab === 'assets') handleOpenModal('asset');
            }}
          >
            <Plus />
            {activeTab === 'requests' && 'New Request'}
            {activeTab === 'work-orders' && 'New Work Order'}
            {activeTab === 'assets' && 'New Asset'}
            {activeTab === 'vendors' && 'New Vendor'}
            {activeTab === 'history' && 'View History'}
          </button>
        </div>

        {/* Tab Content */}
        <div className="maintenance-content">
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="data-table-container">
              {filteredRequests.length === 0 ? (
                <div className="empty-state">
                  <Wrench size={48} />
                  <p>No maintenance requests found</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Location</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((request) => (
                      <tr key={request.id}>
                        <td>#{request.id}</td>
                        <td>
                          <div className="cell-title">{request.title}</div>
                          {request.description && (
                            <div className="cell-subtitle">{request.description.substring(0, 50)}...</div>
                          )}
                        </td>
                        <td><span className="badge">{request.category}</span></td>
                        <td>
                          <span className="badge" style={{ backgroundColor: getPriorityColor(request.priority) }}>
                            {request.priority}
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={{ backgroundColor: getStatusColor(request.status) }}>
                            {request.status}
                          </span>
                        </td>
                        <td>{request.location || 'N/A'}</td>
                        <td>{request.submittedAt ? new Date(request.submittedAt).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon"
                              onClick={() => handleOpenModal('request', request)}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="btn-icon danger"
                              onClick={() => handleDelete('request', request.id!)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'work-orders' && (
            <div className="data-table-container">
              {filteredWorkOrders.length === 0 ? (
                <div className="empty-state">
                  <ClipboardList size={48} />
                  <p>No work orders found</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Work Order #</th>
                      <th>Title</th>
                      <th>Work Type</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Scheduled</th>
                      <th>Cost</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredWorkOrders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.workOrderNumber}</td>
                        <td>
                          <div className="cell-title">{order.title}</div>
                          {order.description && (
                            <div className="cell-subtitle">{order.description.substring(0, 50)}...</div>
                          )}
                        </td>
                        <td><span className="badge">{order.workType}</span></td>
                        <td>
                          <span className="badge" style={{ backgroundColor: getPriorityColor(order.priority) }}>
                            {order.priority}
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                            {order.status}
                          </span>
                        </td>
                        <td>{order.scheduledDate ? new Date(order.scheduledDate).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          {order.actualCost ? (
                            <span>${order.actualCost.toFixed(2)}</span>
                          ) : order.estimatedCost ? (
                            <span>~${order.estimatedCost.toFixed(2)}</span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon"
                              onClick={() => handleOpenModal('work-order', order)}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="btn-icon danger"
                              onClick={() => handleDelete('work-order', order.id!)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'vendors' && (
            <div className="vendors-grid">
              {vendors.length === 0 ? (
                <div className="empty-state">
                  <Users size={48} />
                  <p>No vendors found</p>
                </div>
              ) : (
                vendors.map((vendor) => (
                  <div key={vendor.id} className="vendor-card">
                    <div className="vendor-header">
                      <h3>{vendor.name}</h3>
                      {vendor.isPreferred && <span className="badge preferred">Preferred</span>}
                      {!vendor.isActive && <span className="badge inactive">Inactive</span>}
                    </div>
                    {vendor.companyName && <p className="vendor-company">{vendor.companyName}</p>}
                    <div className="vendor-details">
                      {vendor.phone && <p><strong>Phone:</strong> {vendor.phone}</p>}
                      {vendor.email && <p><strong>Email:</strong> {vendor.email}</p>}
                      {vendor.rating && (
                        <p><strong>Rating:</strong> {vendor.rating.toFixed(1)}/5.0</p>
                      )}
                      {vendor.totalJobs !== undefined && (
                        <p><strong>Total Jobs:</strong> {vendor.totalJobs}</p>
                      )}
                      {vendor.specialties && vendor.specialties.length > 0 && (
                        <div className="vendor-specialties">
                          <strong>Specialties:</strong>
                          <div className="specialty-tags">
                            {vendor.specialties.map((s, i) => (
                              <span key={i} className="specialty-tag">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="data-table-container">
              {filteredHistory.length === 0 ? (
                <div className="empty-state">
                  <History size={48} />
                  <p>No maintenance history found</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Scheduled</th>
                      <th>Completed</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHistory.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="cell-title">{item.title}</div>
                          {item.description && (
                            <div className="cell-subtitle">{item.description.substring(0, 50)}...</div>
                          )}
                        </td>
                        <td><span className="badge">{item.maintenanceType || 'N/A'}</span></td>
                        <td>
                          <span className="badge" style={{ backgroundColor: getPriorityColor(item.priority || '') }}>
                            {item.priority || 'N/A'}
                          </span>
                        </td>
                        <td>
                          <span className="badge" style={{ backgroundColor: getStatusColor(item.status || '') }}>
                            {item.status || 'N/A'}
                          </span>
                        </td>
                        <td>{item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : 'N/A'}</td>
                        <td>{item.completedDate ? new Date(item.completedDate).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          {item.actualCost ? (
                            <span>${item.actualCost.toFixed(2)}</span>
                          ) : item.estimatedCost ? (
                            <span>~${item.estimatedCost.toFixed(2)}</span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="data-table-container">
              {filteredAssets.length === 0 ? (
                <div className="empty-state">
                  <Package size={48} />
                  <p>No assets found</p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Asset Code</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Brand/Model</th>
                      <th>Status</th>
                      <th>Condition</th>
                      <th>Purchase Date</th>
                      <th>Value</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map((asset) => (
                      <tr key={asset.id}>
                        <td><strong>{asset.assetCode}</strong></td>
                        <td>
                          <div className="cell-title">{asset.name}</div>
                          {asset.location && (
                            <div className="cell-subtitle">{asset.location}</div>
                          )}
                        </td>
                        <td><span className="badge">{asset.category}</span></td>
                        <td>
                          {asset.brand && asset.model ? (
                            `${asset.brand} ${asset.model}`
                          ) : asset.brand ? (
                            asset.brand
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>
                          <span className="badge" style={{ backgroundColor: getStatusColor(asset.status) }}>
                            {asset.status}
                          </span>
                        </td>
                        <td>
                          <span className="badge">{asset.condition || 'N/A'}</span>
                        </td>
                        <td>{asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          {asset.currentValue ? (
                            <span>${asset.currentValue.toFixed(2)}</span>
                          ) : asset.purchasePrice ? (
                            <span>${asset.purchasePrice.toFixed(2)}</span>
                          ) : (
                            'N/A'
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-icon"
                              onClick={() => handleOpenModal('asset', asset)}
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className="btn-icon danger"
                              onClick={() => handleDelete('asset', asset.id!)}
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {editingItem ? 'Edit' : 'Add'} {
                    modalType === 'request' ? 'Maintenance Request' :
                    modalType === 'work-order' ? 'Work Order' :
                    modalType === 'asset' ? 'Asset' : 'Vendor'
                  }
                </h2>
                <button className="modal-close" onClick={handleCloseModal}>✕</button>
              </div>

              <div className="modal-body">
                {modalType === 'request' && (
                  <>
                    <div className="form-group">
                      <label>Property *</label>
                      <select
                        value={formData.propertyId || ''}
                        onChange={(e) => setFormData({ ...formData, propertyId: Number(e.target.value) })}
                        required
                      >
                        <option value="">Select Property</option>
                        {properties.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="PLUMBING">Plumbing</option>
                        <option value="HVAC">HVAC</option>
                        <option value="ELECTRICAL">Electrical</option>
                        <option value="APPLIANCE">Appliance</option>
                        <option value="GENERAL">General</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Priority *</label>
                      <select
                        value={formData.priority || 'MEDIUM'}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        required
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                        <option value="EMERGENCY">Emergency</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Status *</label>
                      <select
                        value={formData.status || 'SUBMITTED'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        required
                      >
                        <option value="SUBMITTED">Submitted</option>
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.allowEntry || false}
                          onChange={(e) => setFormData({ ...formData, allowEntry: e.target.checked })}
                        />
                        Allow Entry
                      </label>
                    </div>
                  </>
                )}

                {modalType === 'work-order' && (
                  <>
                    <div className="form-group">
                      <label>Property *</label>
                      <select
                        value={formData.propertyId || ''}
                        onChange={(e) => setFormData({ ...formData, propertyId: Number(e.target.value) })}
                        required
                      >
                        <option value="">Select Property</option>
                        {properties.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Title *</label>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                      />
                    </div>
                    <div className="form-group">
                      <label>Work Type *</label>
                      <select
                        value={formData.workType || ''}
                        onChange={(e) => setFormData({ ...formData, workType: e.target.value })}
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="REPAIR">Repair</option>
                        <option value="INSPECTION">Inspection</option>
                        <option value="INSTALLATION">Installation</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Priority *</label>
                      <select
                        value={formData.priority || 'MEDIUM'}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        required
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                        <option value="EMERGENCY">Emergency</option>
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
                        <option value="ASSIGNED">Assigned</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Vendor</label>
                      <select
                        value={formData.vendorId || ''}
                        onChange={(e) => setFormData({ ...formData, vendorId: e.target.value ? Number(e.target.value) : null })}
                      >
                        <option value="">Select Vendor</option>
                        {vendors.map(v => (
                          <option key={v.id} value={v.id}>{v.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Scheduled Date</label>
                      <input
                        type="datetime-local"
                        value={formData.scheduledDate ? new Date(formData.scheduledDate).toISOString().slice(0, 16) : ''}
                        onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Estimated Cost</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.estimatedCost || ''}
                        onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value ? Number(e.target.value) : null })}
                      />
                    </div>
                  </>
                )}

                {modalType === 'asset' && (
                  <>
                    <div className="form-group">
                      <label>Property *</label>
                      <select
                        value={formData.propertyId || ''}
                        onChange={(e) => setFormData({ ...formData, propertyId: Number(e.target.value) })}
                        required
                      >
                        <option value="">Select Property</option>
                        {properties.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Asset Code *</label>
                      <input
                        type="text"
                        value={formData.assetCode || ''}
                        onChange={(e) => setFormData({ ...formData, assetCode: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="APPLIANCE">Appliance</option>
                        <option value="FURNITURE">Furniture</option>
                        <option value="HVAC">HVAC</option>
                        <option value="PLUMBING">Plumbing</option>
                        <option value="ELECTRICAL">Electrical</option>
                        <option value="SECURITY">Security</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Brand</label>
                      <input
                        type="text"
                        value={formData.brand || ''}
                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Model</label>
                      <input
                        type="text"
                        value={formData.model || ''}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Serial Number</label>
                      <input
                        type="text"
                        value={formData.serialNumber || ''}
                        onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Status *</label>
                      <select
                        value={formData.status || 'ACTIVE'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        required
                      >
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="MAINTENANCE">Maintenance</option>
                        <option value="REPAIR">Repair</option>
                        <option value="RETIRED">Retired</option>
                        <option value="DISPOSED">Disposed</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Condition</label>
                      <select
                        value={formData.condition || 'GOOD'}
                        onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                      >
                        <option value="EXCELLENT">Excellent</option>
                        <option value="GOOD">Good</option>
                        <option value="FAIR">Fair</option>
                        <option value="POOR">Poor</option>
                        <option value="NEEDS_REPAIR">Needs Repair</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Purchase Date</label>
                      <input
                        type="date"
                        value={formData.purchaseDate || ''}
                        onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Purchase Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.purchasePrice || ''}
                        onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value ? Number(e.target.value) : null })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={formData.location || ''}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modern Notification Modal */}
        {notificationModal.show && (
          <div className="modal-overlay" onClick={hideNotification}>
            <div className="modal-content notification-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-icon-wrapper">
                  {notificationModal.type === 'success' && <div className="modal-icon success-icon">✓</div>}
                  {notificationModal.type === 'error' && <div className="modal-icon error-icon">✕</div>}
                  {notificationModal.type === 'warning' && <div className="modal-icon warning-icon">⚠</div>}
                  {notificationModal.type === 'info' && <div className="modal-icon info-icon">ℹ</div>}
                </div>
                <h2>{notificationModal.title}</h2>
                <button className="modal-close" onClick={hideNotification}>✕</button>
              </div>
              <div className="modal-body">
                <p className="modal-message">{notificationModal.message}</p>
                {notificationModal.details && (
                  <div className="modal-details">
                    <pre>{notificationModal.details}</pre>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                {notificationModal.onConfirm ? (
                  <>
                    <button className="btn btn-secondary" onClick={hideNotification}>
                      Cancel
                    </button>
                    <button 
                      className={`btn ${notificationModal.type === 'warning' || notificationModal.type === 'error' ? 'btn-danger' : 'btn-primary'}`}
                      onClick={() => {
                        if (notificationModal.onConfirm) {
                          notificationModal.onConfirm();
                        }
                      }}
                    >
                      {notificationModal.confirmText || 'Confirm'}
                    </button>
                  </>
                ) : (
                  <button className="btn btn-primary" onClick={hideNotification}>
                    OK
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

