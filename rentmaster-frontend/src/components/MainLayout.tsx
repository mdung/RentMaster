import React, { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="main-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>RentMaster</h2>
        </div>
        <nav className="sidebar-nav">
          <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>
            Dashboard
          </Link>
          <Link to="/properties" className={isActive('/properties') ? 'active' : ''}>
            Properties & Rooms
          </Link>
          <Link to="/tenants" className={isActive('/tenants') ? 'active' : ''}>
            Tenants
          </Link>
          <Link to="/contracts" className={isActive('/contracts') ? 'active' : ''}>
            Contracts
          </Link>
          <Link to="/invoices" className={isActive('/invoices') ? 'active' : ''}>
            Invoices
          </Link>
          <Link to="/payments" className={isActive('/payments') ? 'active' : ''}>
            Payments
          </Link>
        </nav>
      </aside>
      <div className="main-content">
        <header className="top-header">
          <div className="header-content">
            <h1>RentMaster</h1>
            <div className="user-info">
              <span>{user?.fullName || user?.username}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </div>
        </header>
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
};

