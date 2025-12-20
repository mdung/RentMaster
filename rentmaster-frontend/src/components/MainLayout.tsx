import React, { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { useOrganization } from '../context/OrganizationContext';
import { SessionTimeoutWarning } from './SessionTimeoutWarning';
import { NotificationPanel } from './NotificationPanel';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { currentOrganization, organizations, switchOrganization } = useOrganization();
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOrgMenu, setShowOrgMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/login');
    }
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const isActive = (path: string) => location.pathname === path;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard Overview';
    if (path === '/profile') return 'Account Settings';
    if (path === '/properties') return 'Properties & Rooms Management';
    if (path === '/tenants') return 'Tenants';
    if (path === '/contracts') return 'Contracts';
    if (path === '/invoices') return 'Invoices';
    if (path === '/payments') return 'Payments';
    if (path === '/users') return 'User Management';
    if (path === '/services') return 'Service Management';
    if (path === '/automation') return 'Automation & Scheduling';
    if (path === '/automation/recurring-invoices') return 'Recurring Invoices';
    if (path === '/automation/scheduled-reports') return 'Scheduled Reports';
    if (path === '/financial') return 'Financial Dashboard';
    if (path === '/financial-management') return 'Financial Management';
    if (path === '/expenses') return 'Expense Management';
    if (path === '/currencies') return 'Currency Management';
    if (path === '/documents') return 'Document Management';
    if (path === '/communication') return 'Communication Center';
    if (path === '/messaging') return 'Messaging & Communication';
    if (path === '/email-templates') return 'Email Templates';
    if (path === '/tenant-portal') return 'Tenant Portal';
    if (path === '/analytics') return 'Advanced Analytics';
    if (path === '/property-management') return 'Property Management';
    if (path === '/community') return 'Tenant Community';
    if (path === '/integrations') return 'Integration & APIs';
    if (path === '/search') return 'Advanced Search & AI';
    if (path === '/localization') return 'Localization Management';
    return 'RentMaster';
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
    <div className="main-layout">
      <SessionTimeoutWarning />
      <NotificationPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
            R
          </div>
          <h2>RentMaster</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
            <span>📊</span> Dashboard
          </Link>
          <Link to="/properties" className={isActive('/properties') ? 'active' : ''}>
            <span>🏢</span> Properties & Rooms
          </Link>
          <Link to="/property-management" className={isActive('/property-management') ? 'active' : ''}>
            <span>🏗️</span> Property Mgmt
          </Link>
          <Link to="/tenants" className={isActive('/tenants') ? 'active' : ''}>
            <span>👥</span> Tenants
          </Link>
          <Link to="/tenant-portal" className={isActive('/tenant-portal') ? 'active' : ''}>
            <span>🏠</span> Tenant Portal
          </Link>
          <Link to="/contracts" className={isActive('/contracts') ? 'active' : ''}>
            <span>📄</span> Contracts
          </Link>
          <Link to="/invoices" className={isActive('/invoices') ? 'active' : ''}>
            <span>🧾</span> Invoices
          </Link>
          <Link to="/payments" className={isActive('/payments') ? 'active' : ''}>
            <span>💰</span> Payments
          </Link>
          <Link to="/financial-management" className={isActive('/financial-management') ? 'active' : ''}>
            <span>💼</span> Financial Mgmt
          </Link>
          <Link to="/analytics" className={isActive('/analytics') ? 'active' : ''}>
            <span>📈</span> Analytics
          </Link>
          <Link to="/documents" className={isActive('/documents') ? 'active' : ''}>
            <span>📁</span> Documents
          </Link>
          <Link to="/communication" className={isActive('/communication') ? 'active' : ''}>
            <span>💬</span> Communication
          </Link>
          <Link to="/messaging" className={isActive('/messaging') ? 'active' : ''}>
            <span>📧</span> Messaging
          </Link>
          <Link to="/community" className={isActive('/community') ? 'active' : ''}>
            <span>🤝</span> Community
          </Link>
          <Link to="/automation" className={isActive('/automation') ? 'active' : ''}>
            <span>⚙️</span> Automation
          </Link>
          <Link to="/integrations" className={isActive('/integrations') ? 'active' : ''}>
            <span>🔌</span> Integrations
          </Link>
          <Link to="/search" className={isActive('/search') ? 'active' : ''}>
            <span>🔍</span> Search & AI
          </Link>
          <Link to="/localization" className={isActive('/localization') ? 'active' : ''}>
            <span>🌐</span> Localization
          </Link>
          <Link to="/users" className={isActive('/users') ? 'active' : ''}>
            <span>👤</span> Users
          </Link>
          <Link to="/services" className={isActive('/services') ? 'active' : ''}>
            <span>🔧</span> Services
          </Link>
          <Link to="/organizations" className={isActive('/organizations') ? 'active' : ''}>
            <span>🏢</span> Organizations
          </Link>
        </nav>
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
          <div className="user-avatar" style={{ width: '40px', height: '40px', margin: '0 auto' }}>
            {getInitials(user?.fullName || user?.username || 'U')}
          </div>
        </div>
      </aside>
      <div className="main-content">
        <header className="top-header">
          <div className="header-content">
            <h1>{getPageTitle()}</h1>
            <div className="header-actions">
              <div className="search-bar-header">
                <input type="text" placeholder="Search properties, rooms..." />
              </div>
              {currentOrganization && (
                <div className="organization-selector">
                  <button 
                    className="org-selector-btn"
                    onClick={() => setShowOrgMenu(!showOrgMenu)}
                  >
                    <span>🏢</span> {currentOrganization.displayName || currentOrganization.name}
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  {showOrgMenu && (
                    <div className="org-dropdown">
                      {organizations.map(org => (
                        <button
                          key={org.id}
                          className={`org-option ${currentOrganization.id === org.id ? 'active' : ''}`}
                          onClick={() => {
                            switchOrganization(org.id);
                            setShowOrgMenu(false);
                          }}
                        >
                          {org.displayName || org.name}
                          {currentOrganization.id === org.id && <span>✓</span>}
                        </button>
                      ))}
                      <div className="dropdown-divider"></div>
                      <button className="org-option" onClick={() => { navigate('/organizations'); setShowOrgMenu(false); }}>
                        Manage Organizations
                      </button>
                    </div>
                  )}
                </div>
              )}
              <button 
                className="notification-btn"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                🔔
                {unreadCount > 0 && (
                  <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
              </button>
              <div className="user-menu">
                <div className="user-info" onClick={() => setShowUserMenu(!showUserMenu)}>
                  <div className="user-details">
                    <span className="user-name">{user?.fullName || user?.username}</span>
                    <span className="user-role">{user?.role || 'Admin'}</span>
                  </div>
                  <div className="user-avatar" style={{ width: '40px', height: '40px' }}>
                    {getInitials(user?.fullName || user?.username || 'U')}
                  </div>
                  <span className="dropdown-arrow">▼</span>
                </div>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      <span>👤</span> Profile Settings
                    </Link>
                    <Link to="/notifications" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                      <span>🔔</span> Notification Settings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-btn" onClick={handleLogout}>
                      <span>🚪</span> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

