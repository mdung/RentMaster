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
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set());

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
  
  const isPathInMenu = (paths: string[]) => paths.some(path => location.pathname.startsWith(path));

  const toggleMenu = (menuKey: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuKey)) {
        newSet.delete(menuKey);
      } else {
        newSet.add(menuKey);
      }
      return newSet;
    });
  };

  // Auto-expand menu if current path is in its submenu
  useEffect(() => {
    const menuGroups = [
      { key: 'properties', paths: ['/properties', '/property-management'] },
      { key: 'tenants', paths: ['/tenants', '/tenant-portal'] },
      { key: 'billing', paths: ['/contracts', '/invoices', '/payments', '/financial-management'] },
      { key: 'communication', paths: ['/communication', '/messaging', '/community'] },
      { key: 'administration', paths: ['/users', '/services', '/organizations'] },
    ];

    menuGroups.forEach(group => {
      if (isPathInMenu(group.paths)) {
        setExpandedMenus(prev => new Set(prev).add(group.key));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
          {/* Dashboard - Standalone */}
          <Link to="/dashboard" className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}>
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
          </Link>

          {/* Properties - Menu Group */}
          <div className={`nav-group ${isPathInMenu(['/properties', '/property-management']) ? 'active-group' : ''}`}>
            <div className="nav-group-header" onClick={() => toggleMenu('properties')}>
              <span className="nav-icon">🏢</span>
              <span className="nav-label">Properties</span>
              <span className={`nav-arrow ${expandedMenus.has('properties') ? 'expanded' : ''}`}>▼</span>
            </div>
            {expandedMenus.has('properties') && (
              <div className="nav-submenu">
                <Link to="/properties" className={`nav-subitem ${isActive('/properties') ? 'active' : ''}`}>
                  <span>Properties & Rooms</span>
                </Link>
                <Link to="/property-management" className={`nav-subitem ${isActive('/property-management') ? 'active' : ''}`}>
                  <span>Property Management</span>
                </Link>
              </div>
            )}
          </div>

          {/* Tenants - Menu Group */}
          <div className={`nav-group ${isPathInMenu(['/tenants', '/tenant-portal']) ? 'active-group' : ''}`}>
            <div className="nav-group-header" onClick={() => toggleMenu('tenants')}>
              <span className="nav-icon">👥</span>
              <span className="nav-label">Tenants</span>
              <span className={`nav-arrow ${expandedMenus.has('tenants') ? 'expanded' : ''}`}>▼</span>
            </div>
            {expandedMenus.has('tenants') && (
              <div className="nav-submenu">
                <Link to="/tenants" className={`nav-subitem ${isActive('/tenants') ? 'active' : ''}`}>
                  <span>Tenant Management</span>
                </Link>
                <Link to="/tenant-portal" className={`nav-subitem ${isActive('/tenant-portal') ? 'active' : ''}`}>
                  <span>Tenant Portal</span>
                </Link>
              </div>
            )}
          </div>

          {/* Billing & Finance - Menu Group */}
          <div className={`nav-group ${isPathInMenu(['/contracts', '/invoices', '/payments', '/financial-management']) ? 'active-group' : ''}`}>
            <div className="nav-group-header" onClick={() => toggleMenu('billing')}>
              <span className="nav-icon">💰</span>
              <span className="nav-label">Billing & Finance</span>
              <span className={`nav-arrow ${expandedMenus.has('billing') ? 'expanded' : ''}`}>▼</span>
            </div>
            {expandedMenus.has('billing') && (
              <div className="nav-submenu">
                <Link to="/contracts" className={`nav-subitem ${isActive('/contracts') ? 'active' : ''}`}>
                  <span>Contracts</span>
                </Link>
                <Link to="/invoices" className={`nav-subitem ${isActive('/invoices') ? 'active' : ''}`}>
                  <span>Invoices</span>
                </Link>
                <Link to="/payments" className={`nav-subitem ${isActive('/payments') ? 'active' : ''}`}>
                  <span>Payments</span>
                </Link>
                <Link to="/financial-management" className={`nav-subitem ${isActive('/financial-management') ? 'active' : ''}`}>
                  <span>Financial Management</span>
                </Link>
              </div>
            )}
          </div>

          {/* Communication - Menu Group */}
          <div className={`nav-group ${isPathInMenu(['/communication', '/messaging', '/community']) ? 'active-group' : ''}`}>
            <div className="nav-group-header" onClick={() => toggleMenu('communication')}>
              <span className="nav-icon">💬</span>
              <span className="nav-label">Communication</span>
              <span className={`nav-arrow ${expandedMenus.has('communication') ? 'expanded' : ''}`}>▼</span>
            </div>
            {expandedMenus.has('communication') && (
              <div className="nav-submenu">
                <Link to="/communication" className={`nav-subitem ${isActive('/communication') ? 'active' : ''}`}>
                  <span>Communication Center</span>
                </Link>
                <Link to="/messaging" className={`nav-subitem ${isActive('/messaging') ? 'active' : ''}`}>
                  <span>Messaging</span>
                </Link>
                <Link to="/community" className={`nav-subitem ${isActive('/community') ? 'active' : ''}`}>
                  <span>Community</span>
                </Link>
              </div>
            )}
          </div>

          {/* Documents - Standalone */}
          <Link to="/documents" className={`nav-item ${isActive('/documents') ? 'active' : ''}`}>
            <span className="nav-icon">📁</span>
            <span className="nav-label">Documents</span>
          </Link>

          {/* Analytics - Standalone */}
          <Link to="/analytics" className={`nav-item ${isActive('/analytics') ? 'active' : ''}`}>
            <span className="nav-icon">📈</span>
            <span className="nav-label">Analytics</span>
          </Link>

          {/* Automation - Standalone */}
          <Link to="/automation" className={`nav-item ${isActive('/automation') ? 'active' : ''}`}>
            <span className="nav-icon">⚙️</span>
            <span className="nav-label">Automation</span>
          </Link>

          {/* Integrations - Standalone */}
          <Link to="/integrations" className={`nav-item ${isActive('/integrations') ? 'active' : ''}`}>
            <span className="nav-icon">🔌</span>
            <span className="nav-label">Integrations</span>
          </Link>

          {/* Search & AI - Standalone */}
          <Link to="/search" className={`nav-item ${isActive('/search') ? 'active' : ''}`}>
            <span className="nav-icon">🔍</span>
            <span className="nav-label">Search & AI</span>
          </Link>

          {/* Localization - Standalone */}
          <Link to="/localization" className={`nav-item ${isActive('/localization') ? 'active' : ''}`}>
            <span className="nav-icon">🌐</span>
            <span className="nav-label">Localization</span>
          </Link>

          {/* Administration - Menu Group */}
          <div className={`nav-group ${isPathInMenu(['/users', '/services', '/organizations']) ? 'active-group' : ''}`}>
            <div className="nav-group-header" onClick={() => toggleMenu('administration')}>
              <span className="nav-icon">⚙️</span>
              <span className="nav-label">Administration</span>
              <span className={`nav-arrow ${expandedMenus.has('administration') ? 'expanded' : ''}`}>▼</span>
            </div>
            {expandedMenus.has('administration') && (
              <div className="nav-submenu">
                <Link to="/users" className={`nav-subitem ${isActive('/users') ? 'active' : ''}`}>
                  <span>Users</span>
                </Link>
                <Link to="/services" className={`nav-subitem ${isActive('/services') ? 'active' : ''}`}>
                  <span>Services</span>
                </Link>
                <Link to="/organizations" className={`nav-subitem ${isActive('/organizations') ? 'active' : ''}`}>
                  <span>Organizations</span>
                </Link>
              </div>
            )}
          </div>
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

