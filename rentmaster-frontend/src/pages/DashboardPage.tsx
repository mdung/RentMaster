import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { reportApi } from '../services/api/reportApi';
import { DashboardStats } from '../types';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await reportApi.getDashboard();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div>Loading...</div>
      </MainLayout>
    );
  }

  if (!stats) {
    return (
      <MainLayout>
        <div>Failed to load dashboard data</div>
      </MainLayout>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <MainLayout>
      <div className="dashboard">
        <h1>Dashboard</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Rooms</h3>
            <p className="stat-value">{stats.totalRooms}</p>
          </div>
          <div className="stat-card">
            <h3>Occupied</h3>
            <p className="stat-value">{stats.occupiedRooms}</p>
          </div>
          <div className="stat-card">
            <h3>Available</h3>
            <p className="stat-value">{stats.availableRooms}</p>
          </div>
          <div className="stat-card">
            <h3>Maintenance</h3>
            <p className="stat-value">{stats.maintenanceRooms}</p>
          </div>
          <div className="stat-card">
            <h3>Active Contracts</h3>
            <p className="stat-value">{stats.activeContracts}</p>
          </div>
          <div className="stat-card">
            <h3>Monthly Revenue</h3>
            <p className="stat-value">{formatCurrency(stats.monthlyRevenue)}</p>
          </div>
          <div className="stat-card highlight">
            <h3>Total Outstanding</h3>
            <p className="stat-value">{formatCurrency(stats.totalOutstanding)}</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

