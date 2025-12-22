import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { tenantPortalApi, TenantDashboard, TenantInvoice, MaintenanceRequest, TenantDocument, TenantNotification, PaymentHistory } from '../services/api/tenantPortalApi';
import './TenantPortalPage.css';

export const TenantPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile' | 'contract' | 'invoices' | 'payments' | 'maintenance' | 'documents' | 'notifications'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [dashboard, setDashboard] = useState<TenantDashboard | null>(null);
  const [invoices, setInvoices] = useState<TenantInvoice[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [documents, setDocuments] = useState<TenantDocument[]>([]);
  const [notifications, setNotifications] = useState<TenantNotification[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceFormData, setMaintenanceFormData] = useState<any>({
    title: '',
    description: '',
    category: 'GENERAL',
    priority: 'MEDIUM',
    location: '',
    preferredTime: '',
    allowEntry: true
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'invoices') {
      loadInvoices();
    } else if (activeTab === 'maintenance') {
      loadMaintenanceRequests();
    } else if (activeTab === 'documents') {
      loadDocuments();
    } else if (activeTab === 'notifications') {
      loadNotifications();
    } else if (activeTab === 'payments') {
      loadPaymentHistory();
    }
  }, [activeTab]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await tenantPortalApi.getDashboard();
      setDashboard(data);
      setInvoices(data.upcomingPayments || []);
      setMaintenanceRequests(data.maintenanceRequests || []);
      setDocuments(data.documents || []);
      setNotifications(data.notifications || []);
      setPaymentHistory(data.recentPayments || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadInvoices = async () => {
    try {
      const data = await tenantPortalApi.getInvoices(undefined, 'ALL', 50);
      setInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    }
  };

  const loadMaintenanceRequests = async () => {
    try {
      const data = await tenantPortalApi.getMaintenanceRequests(undefined, 50);
      setMaintenanceRequests(data);
    } catch (error) {
      console.error('Failed to load maintenance requests:', error);
    }
  };

  const loadDocuments = async () => {
    try {
      const data = await tenantPortalApi.getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const data = await tenantPortalApi.getNotifications(undefined, false, 50);
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const loadPaymentHistory = async () => {
    try {
      const data = await tenantPortalApi.getPaymentHistory(undefined, 50);
      setPaymentHistory(data);
    } catch (error) {
      console.error('Failed to load payment history:', error);
    }
  };

  const handleSubmitMaintenanceRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tenantPortalApi.submitMaintenanceRequest(undefined, maintenanceFormData);
      setShowMaintenanceModal(false);
      setMaintenanceFormData({
        title: '',
        description: '',
        category: 'GENERAL',
        priority: 'MEDIUM',
        location: '',
        preferredTime: '',
        allowEntry: true
      });
      loadMaintenanceRequests();
      if (dashboard) {
        loadDashboard();
      }
    } catch (error) {
      alert('Failed to submit maintenance request');
    }
  };

  const handleMarkNotificationAsRead = async (notificationId: number) => {
    try {
      await tenantPortalApi.markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('pending') || statusLower.includes('submitted')) return 'pending';
    if (statusLower.includes('completed') || statusLower.includes('paid')) return 'completed';
    if (statusLower.includes('progress') || statusLower.includes('active')) return 'active';
    if (statusLower.includes('cancelled') || statusLower.includes('failed')) return 'cancelled';
    return 'default';
  };

  if (loading && !dashboard) {
    return (
      <MainLayout>
        <div className="tenant-portal-page">
          <div className="loading-state">Loading...</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="tenant-portal-page">
        <div className="page-header">
          <div>
            <h1>Tenant Portal</h1>
            <p className="page-subtitle">Manage your rental information, payments, and requests</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="portal-tabs">
          <button
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span>📊</span> Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span>👤</span> Profile
          </button>
          <button
            className={`tab-button ${activeTab === 'contract' ? 'active' : ''}`}
            onClick={() => setActiveTab('contract')}
          >
            <span>📄</span> Contract
          </button>
          <button
            className={`tab-button ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            <span>🧾</span> Invoices
          </button>
          <button
            className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <span>💰</span> Payments
          </button>
          <button
            className={`tab-button ${activeTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => setActiveTab('maintenance')}
          >
            <span>🔧</span> Maintenance
          </button>
          <button
            className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <span>📁</span> Documents
          </button>
          <button
            className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('notifications')}
          >
            <span>🔔</span> Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="portal-content">
          {activeTab === 'dashboard' && dashboard && (
            <DashboardTab dashboard={dashboard} formatCurrency={formatCurrency} formatDate={formatDate} getStatusBadgeClass={getStatusBadgeClass} />
          )}

          {activeTab === 'profile' && dashboard && (
            <ProfileTab profile={dashboard.profile} />
          )}

          {activeTab === 'contract' && dashboard && (
            <ContractTab contract={dashboard.currentContract} formatCurrency={formatCurrency} formatDate={formatDate} />
          )}

          {activeTab === 'invoices' && (
            <InvoicesTab 
              invoices={invoices} 
              formatCurrency={formatCurrency} 
              formatDate={formatDate}
              getStatusBadgeClass={getStatusBadgeClass}
            />
          )}

          {activeTab === 'payments' && (
            <PaymentsTab 
              payments={paymentHistory} 
              formatCurrency={formatCurrency} 
              formatDate={formatDate}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenanceTab 
              requests={maintenanceRequests}
              onAdd={() => setShowMaintenanceModal(true)}
              formatDate={formatDate}
              getStatusBadgeClass={getStatusBadgeClass}
            />
          )}

          {activeTab === 'documents' && (
            <DocumentsTab 
              documents={documents}
              formatDate={formatDate}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab 
              notifications={notifications}
              formatDate={formatDate}
              onMarkAsRead={handleMarkNotificationAsRead}
            />
          )}
        </div>

        {/* Maintenance Request Modal */}
        {showMaintenanceModal && (
          <div className="modal-overlay" onClick={() => setShowMaintenanceModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Submit Maintenance Request</h2>
                <button className="modal-close" onClick={() => setShowMaintenanceModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmitMaintenanceRequest}>
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={maintenanceFormData.title}
                    onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, title: e.target.value })}
                    required
                    placeholder="e.g., Leaky faucet in kitchen"
                  />
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={maintenanceFormData.description}
                    onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, description: e.target.value })}
                    required
                    rows={4}
                    placeholder="Describe the issue in detail..."
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={maintenanceFormData.category}
                    onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, category: e.target.value })}
                    required
                  >
                    <option value="GENERAL">General</option>
                    <option value="PLUMBING">Plumbing</option>
                    <option value="HVAC">HVAC</option>
                    <option value="ELECTRICAL">Electrical</option>
                    <option value="APPLIANCE">Appliance</option>
                    <option value="FLOORING">Flooring</option>
                    <option value="PAINTING">Painting</option>
                    <option value="ROOFING">Roofing</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority *</label>
                  <select
                    value={maintenanceFormData.priority}
                    onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, priority: e.target.value })}
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
                  <label>Location</label>
                  <input
                    type="text"
                    value={maintenanceFormData.location}
                    onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, location: e.target.value })}
                    placeholder="e.g., Kitchen, Bedroom, etc."
                  />
                </div>
                <div className="form-group">
                  <label>Preferred Time</label>
                  <input
                    type="text"
                    value={maintenanceFormData.preferredTime}
                    onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, preferredTime: e.target.value })}
                    placeholder="e.g., Morning, Afternoon, Evening"
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={maintenanceFormData.allowEntry}
                      onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, allowEntry: e.target.checked })}
                    />
                    Allow entry when I'm not home
                  </label>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Submit Request</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowMaintenanceModal(false)}>
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

// Dashboard Tab Component
const DashboardTab: React.FC<{ dashboard: TenantDashboard; formatCurrency: (amount: number) => string; formatDate: (date: string) => string; getStatusBadgeClass: (status: string) => string }> = ({ dashboard, formatCurrency, formatDate, getStatusBadgeClass }) => {
  const stats = dashboard.stats;
  const unreadNotifications = dashboard.notifications.filter(n => !n.read).length;

  return (
    <div className="dashboard-tab">
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Total Outstanding</div>
            <div className="stat-value">{formatCurrency(stats.totalOutstanding)}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-label">On-Time Payments</div>
            <div className="stat-value">{stats.onTimePayments}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔧</div>
          <div className="stat-content">
            <div className="stat-label">Active Requests</div>
            <div className="stat-value">{dashboard.maintenanceRequests.filter(r => r.status !== 'COMPLETED').length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-content">
            <div className="stat-label">Unread Notifications</div>
            <div className="stat-value">{unreadNotifications}</div>
          </div>
        </div>
      </div>

      {/* Current Contract Summary */}
      {dashboard.currentContract && (
        <div className="dashboard-section">
          <h3>Current Contract</h3>
          <div className="contract-summary-card">
            <div className="contract-info">
              <div><strong>Property:</strong> {dashboard.currentContract.property.name}</div>
              <div><strong>Room:</strong> {dashboard.currentContract.room.code} ({dashboard.currentContract.room.type})</div>
              <div><strong>Monthly Rent:</strong> {formatCurrency(dashboard.currentContract.monthlyRent)}</div>
              <div><strong>Status:</strong> <span className={`status-badge ${dashboard.currentContract.status.toLowerCase()}`}>{dashboard.currentContract.status}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Payments */}
      {dashboard.upcomingPayments && dashboard.upcomingPayments.length > 0 && (
        <div className="dashboard-section">
          <h3>Upcoming Payments</h3>
          <div className="payments-list">
            {dashboard.upcomingPayments.map((invoice) => (
              <div key={invoice.id} className="payment-item">
                <div className="payment-info">
                  <div className="payment-title">{invoice.invoiceNumber}</div>
                  <div className="payment-details">
                    Due: {formatDate(invoice.dueDate)} • {formatCurrency(invoice.remainingAmount)}
                  </div>
                </div>
                <div className={`status-badge ${getStatusBadgeClass(invoice.status)}`}>
                  {invoice.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Maintenance Requests */}
      {dashboard.maintenanceRequests && dashboard.maintenanceRequests.length > 0 && (
        <div className="dashboard-section">
          <h3>Recent Maintenance Requests</h3>
          <div className="maintenance-list">
            {dashboard.maintenanceRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="maintenance-item">
                <div className="maintenance-info">
                  <div className="maintenance-title">{request.title}</div>
                  <div className="maintenance-details">
                    {request.category} • {formatDate(request.submittedAt)}
                  </div>
                </div>
                <div className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                  {request.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Profile Tab Component
const ProfileTab: React.FC<{ profile: any }> = ({ profile }) => {
  return (
    <div className="profile-tab">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {profile.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
          </div>
          <div className="profile-info">
            <h2>{profile.fullName}</h2>
            <p>{profile.email}</p>
          </div>
        </div>
        <div className="profile-details">
          <div className="detail-row">
            <strong>Phone:</strong> {profile.phone || '-'}
          </div>
          <div className="detail-row">
            <strong>ID Number:</strong> {profile.idNumber || '-'}
          </div>
          <div className="detail-row">
            <strong>Address:</strong> {profile.address || '-'}
          </div>
          {profile.emergencyContactName && (
            <div className="detail-row">
              <strong>Emergency Contact:</strong> {profile.emergencyContactName} ({profile.emergencyContactPhone})
            </div>
          )}
          {profile.occupation && (
            <div className="detail-row">
              <strong>Occupation:</strong> {profile.occupation} {profile.employer && `at ${profile.employer}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Contract Tab Component
const ContractTab: React.FC<{ contract: any; formatCurrency: (amount: number) => string; formatDate: (date: string) => string }> = ({ contract, formatCurrency, formatDate }) => {
  return (
    <div className="contract-tab">
      <div className="contract-card">
        <div className="contract-header">
          <h3>Contract Details</h3>
          <span className={`status-badge ${contract.status.toLowerCase()}`}>{contract.status}</span>
        </div>
        <div className="contract-details-grid">
          <div className="detail-item">
            <label>Contract Code</label>
            <div>{contract.contractCode}</div>
          </div>
          <div className="detail-item">
            <label>Property</label>
            <div>{contract.property.name}</div>
            <div className="detail-subtext">{contract.property.address}</div>
          </div>
          <div className="detail-item">
            <label>Room</label>
            <div>{contract.room.code} - {contract.room.type}</div>
            <div className="detail-subtext">Floor {contract.room.floor}</div>
          </div>
          <div className="detail-item">
            <label>Start Date</label>
            <div>{formatDate(contract.startDate)}</div>
          </div>
          <div className="detail-item">
            <label>End Date</label>
            <div>{formatDate(contract.endDate)}</div>
            {contract.daysUntilExpiry && (
              <div className="detail-subtext">{contract.daysUntilExpiry} days remaining</div>
            )}
          </div>
          <div className="detail-item">
            <label>Monthly Rent</label>
            <div className="amount-value">{formatCurrency(contract.monthlyRent)}</div>
          </div>
          <div className="detail-item">
            <label>Security Deposit</label>
            <div className="amount-value">{formatCurrency(contract.securityDeposit)}</div>
          </div>
          <div className="detail-item">
            <label>Total Paid</label>
            <div className="amount-value">{formatCurrency(contract.totalPaid)}</div>
          </div>
          <div className="detail-item">
            <label>Total Outstanding</label>
            <div className="amount-value outstanding">{formatCurrency(contract.totalOutstanding)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Invoices Tab Component
const InvoicesTab: React.FC<{ invoices: TenantInvoice[]; formatCurrency: (amount: number) => string; formatDate: (date: string) => string; getStatusBadgeClass: (status: string) => string }> = ({ invoices, formatCurrency, formatDate, getStatusBadgeClass }) => {
  return (
    <div className="invoices-tab">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Remaining</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  <div className="empty-state-content">
                    <span className="empty-icon">🧾</span>
                    <p>No invoices found</p>
                  </div>
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{formatDate(invoice.issueDate)}</td>
                  <td>{formatDate(invoice.dueDate)}</td>
                  <td>{formatCurrency(invoice.totalAmount)}</td>
                  <td>{formatCurrency(invoice.paidAmount)}</td>
                  <td>{formatCurrency(invoice.remainingAmount)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Payments Tab Component
const PaymentsTab: React.FC<{ payments: PaymentHistory[]; formatCurrency: (amount: number) => string; formatDate: (date: string) => string }> = ({ payments, formatCurrency, formatDate }) => {
  return (
    <div className="payments-tab">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice #</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  <div className="empty-state-content">
                    <span className="empty-icon">💰</span>
                    <p>No payment history found</p>
                  </div>
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{formatDate(payment.paymentDate)}</td>
                  <td>{payment.invoiceNumber || '-'}</td>
                  <td>{formatCurrency(payment.amount)}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>
                    <span className={`status-badge ${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Maintenance Tab Component
const MaintenanceTab: React.FC<{ requests: MaintenanceRequest[]; onAdd: () => void; formatDate: (date: string) => string; getStatusBadgeClass: (status: string) => string }> = ({ requests, onAdd, formatDate, getStatusBadgeClass }) => {
  return (
    <div className="maintenance-tab">
      <div className="section-header">
        <h3>Maintenance Requests</h3>
        <button className="btn btn-primary" onClick={onAdd}>
          <span>➕</span> New Request
        </button>
      </div>
      <div className="requests-list">
        {requests.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">🔧</span>
              <p>No maintenance requests found</p>
            </div>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div>
                  <h4>{request.title}</h4>
                  <div className="request-meta">
                    {request.category} • {formatDate(request.submittedAt)}
                  </div>
                </div>
                <div className={`status-badge ${getStatusBadgeClass(request.status)}`}>
                  {request.status}
                </div>
              </div>
              <div className="request-description">{request.description}</div>
              {request.assignedTechnician && (
                <div className="request-assigned">
                  Assigned to: {request.assignedTechnician} {request.technicianPhone && `(${request.technicianPhone})`}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Documents Tab Component
const DocumentsTab: React.FC<{ documents: TenantDocument[]; formatDate: (date: string) => string }> = ({ documents, formatDate }) => {
  const handleDownload = async (document: TenantDocument) => {
    try {
      const blob = await tenantPortalApi.downloadDocument(document.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Failed to download document');
    }
  };

  return (
    <div className="documents-tab">
      <div className="documents-grid">
        {documents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">📁</span>
              <p>No documents found</p>
            </div>
          </div>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="document-card">
              <div className="document-icon">📄</div>
              <div className="document-info">
                <h4>{doc.name}</h4>
                <div className="document-meta">
                  {formatDate(doc.uploadDate)} • {(doc.fileSize / 1024).toFixed(1)} KB
                </div>
              </div>
              <button className="btn btn-secondary" onClick={() => handleDownload(doc)}>
                Download
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Notifications Tab Component
const NotificationsTab: React.FC<{ notifications: TenantNotification[]; formatDate: (date: string) => string; onMarkAsRead: (id: number) => void }> = ({ notifications, formatDate, onMarkAsRead }) => {
  return (
    <div className="notifications-tab">
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">🔔</span>
              <p>No notifications found</p>
            </div>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={() => !notification.read && onMarkAsRead(notification.id)}
            >
              <div className="notification-icon">
                {notification.type === 'INVOICE' ? '🧾' : notification.type === 'MAINTENANCE' ? '🔧' : '📢'}
              </div>
              <div className="notification-content">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-message">{notification.message}</div>
                <div className="notification-time">{formatDate(notification.createdAt)}</div>
              </div>
              {notification.actionRequired && notification.actionUrl && (
                <button className="btn btn-primary btn-sm">
                  {notification.actionText || 'View'}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

