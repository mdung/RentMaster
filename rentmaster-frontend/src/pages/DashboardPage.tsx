import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { LineChart } from '../components/charts/LineChart';
import { DonutChart } from '../components/charts/DonutChart';
import { BarChart } from '../components/charts/BarChart';
import { ActivityFeed } from '../components/ActivityFeed';
import { DueDatesWidget } from '../components/DueDatesWidget';
import { QuickActionsWidget } from '../components/QuickActionsWidget';
import { reportApi } from '../services/api/reportApi';
import { 
  DashboardStats, 
  RevenueData, 
  OccupancyData, 
  PaymentMethodData,
  ActivityItem,
  UpcomingDueDate,
  QuickAction
} from '../types';
import './DashboardPage.css';

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [occupancyData, setOccupancyData] = useState<OccupancyData | null>(null);
  const [paymentMethodData, setPaymentMethodData] = useState<PaymentMethodData | null>(null);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [dueDates, setDueDates] = useState<UpcomingDueDate[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly');

  useEffect(() => {
    loadDashboard();
  }, [selectedPeriod]);

  const loadDashboard = async () => {
    try {
      const [
        statsData,
        revenueResponse,
        occupancyResponse,
        paymentMethodResponse,
        activitiesData,
        dueDatesData,
        quickActionsData
      ] = await Promise.all([
        reportApi.getDashboard(),
        reportApi.getRevenueData(selectedPeriod),
        reportApi.getOccupancyData(selectedPeriod),
        reportApi.getPaymentMethodData(),
        reportApi.getRecentActivities(15),
        reportApi.getUpcomingDueDates(30),
        reportApi.getQuickActions()
      ]);

      setStats(statsData);
      setRevenueData(revenueResponse);
      setOccupancyData(occupancyResponse);
      setPaymentMethodData(paymentMethodResponse);
      setActivities(activitiesData);
      setDueDates(dueDatesData);
      setQuickActions(quickActionsData);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      // Load mock data for development
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    // Mock stats data
    setStats({
      totalRooms: 150,
      occupiedRooms: 142,
      availableRooms: 8,
      maintenanceRooms: 3,
      activeContracts: 138,
      totalOutstanding: 45000000,
      monthlyRevenue: 285000000,
      totalTenants: 156,
      newTenantsThisMonth: 8,
      averageRent: 2000000,
      collectionRate: 94.5
    });

    // Mock revenue data
    setRevenueData({
      monthly: [
        { label: 'Jan', value: 250000000 },
        { label: 'Feb', value: 265000000 },
        { label: 'Mar', value: 280000000 },
        { label: 'Apr', value: 275000000 },
        { label: 'May', value: 290000000 },
        { label: 'Jun', value: 285000000 }
      ],
      yearly: [
        { label: '2020', value: 2800000000 },
        { label: '2021', value: 3100000000 },
        { label: '2022', value: 3350000000 },
        { label: '2023', value: 3420000000 }
      ],
      comparison: {
        currentMonth: 285000000,
        previousMonth: 290000000,
        growth: -1.7
      }
    });

    // Mock occupancy data
    setOccupancyData({
      monthly: [
        { label: 'Jan', value: 92 },
        { label: 'Feb', value: 94 },
        { label: 'Mar', value: 96 },
        { label: 'Apr', value: 93 },
        { label: 'May', value: 95 },
        { label: 'Jun', value: 94.7 }
      ],
      byPropertyType: [
        { label: 'Studio', value: 45, percentage: 30 },
        { label: '1BR', value: 65, percentage: 43 },
        { label: '2BR', value: 32, percentage: 21 },
        { label: '3BR', value: 8, percentage: 6 }
      ],
      trends: {
        currentRate: 94.7,
        previousRate: 95.0,
        change: -0.3
      }
    });

    // Mock payment method data
    setPaymentMethodData({
      methods: [
        { label: 'Bank Transfer', value: 65, percentage: 65 },
        { label: 'Cash', value: 20, percentage: 20 },
        { label: 'Credit Card', value: 10, percentage: 10 },
        { label: 'Mobile Wallet', value: 5, percentage: 5 }
      ],
      trends: [
        { label: 'Jan', value: 60 },
        { label: 'Feb', value: 62 },
        { label: 'Mar', value: 65 },
        { label: 'Apr', value: 63 },
        { label: 'May', value: 67 },
        { label: 'Jun', value: 65 }
      ]
    });

    // Mock activities
    setActivities([
      {
        id: 1,
        type: 'PAYMENT',
        title: 'Payment Received',
        description: 'Rent payment of ₫2,000,000 received from John Doe (Unit 4B)',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        priority: 'MEDIUM',
        icon: '💰',
        color: 'var(--success)'
      },
      {
        id: 2,
        type: 'MAINTENANCE',
        title: 'Maintenance Request',
        description: 'Water leak reported in Unit 12A - Urgent repair needed',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        priority: 'HIGH',
        icon: '🔧',
        color: 'var(--warning)'
      },
      {
        id: 3,
        type: 'TENANT',
        title: 'New Tenant Onboarded',
        description: 'Sarah Connor has been added to Unit 3A with 12-month contract',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        priority: 'MEDIUM',
        icon: '👤',
        color: 'var(--primary)'
      },
      {
        id: 4,
        type: 'CONTRACT',
        title: 'Contract Renewal',
        description: 'Contract for Unit 7C has been renewed for another year',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'LOW',
        icon: '📄',
        color: 'var(--info)'
      },
      {
        id: 5,
        type: 'INVOICE',
        title: 'Invoice Generated',
        description: 'Monthly invoice #INV-2024-001 generated for Unit 5B',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'MEDIUM',
        icon: '🧾',
        color: 'var(--error)'
      }
    ]);

    // Mock due dates
    setDueDates([
      {
        id: 1,
        type: 'INVOICE',
        title: 'Rent Payment Due',
        description: 'Unit 4B - John Doe - Monthly rent payment',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 2000000,
        priority: 'HIGH',
        status: 'DUE_TODAY',
        relatedEntityId: 123,
        relatedEntityType: 'INVOICE'
      },
      {
        id: 2,
        type: 'CONTRACT',
        title: 'Contract Expiring',
        description: 'Unit 7A - Contract expires in 3 days',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'MEDIUM',
        status: 'UPCOMING',
        relatedEntityId: 456,
        relatedEntityType: 'CONTRACT'
      },
      {
        id: 3,
        type: 'MAINTENANCE',
        title: 'Scheduled Inspection',
        description: 'Annual safety inspection for Building A',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'MEDIUM',
        status: 'UPCOMING',
        relatedEntityId: 789,
        relatedEntityType: 'MAINTENANCE'
      },
      {
        id: 4,
        type: 'INVOICE',
        title: 'Overdue Payment',
        description: 'Unit 2C - Payment overdue by 5 days',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 1800000,
        priority: 'URGENT',
        status: 'OVERDUE',
        relatedEntityId: 321,
        relatedEntityType: 'INVOICE'
      }
    ]);

    // Mock quick actions
    setQuickActions([
      {
        id: 'add-tenant',
        title: 'Add New Tenant',
        description: 'Onboard a new tenant to the system',
        icon: '👤',
        color: 'var(--primary)',
        action: '/tenants/new',
        enabled: true
      },
      {
        id: 'generate-invoice',
        title: 'Generate Invoice',
        description: 'Create invoices for monthly rent',
        icon: '🧾',
        color: 'var(--error)',
        action: '/invoices/generate',
        enabled: true,
        count: 12
      },
      {
        id: 'record-payment',
        title: 'Record Payment',
        description: 'Log a new payment received',
        icon: '💰',
        color: 'var(--success)',
        action: '/payments/new',
        enabled: true
      },
      {
        id: 'maintenance-request',
        title: 'Maintenance Request',
        description: 'Create a new maintenance request',
        icon: '🔧',
        color: 'var(--warning)',
        action: '/maintenance/new',
        enabled: true,
        count: 3
      },
      {
        id: 'add-property',
        title: 'Add Property',
        description: 'Register a new property',
        icon: '🏢',
        color: 'var(--info)',
        action: '/properties/new',
        enabled: true
      },
      {
        id: 'reports',
        title: 'Generate Report',
        description: 'Create financial and occupancy reports',
        icon: '📊',
        color: '#8B5CF6',
        action: '/reports',
        enabled: true
      }
    ]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatCompactCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `₫${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `₫${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₫${(amount / 1000).toFixed(1)}K`;
    }
    return formatCurrency(amount);
  };

  const getCurrentDate = () => {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="dashboard-loading">
          <div className="loading-spinner">⏳</div>
          <p>Loading dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  if (!stats) {
    return (
      <MainLayout>
        <div className="dashboard-error">
          <div className="error-icon">⚠️</div>
          <p>Failed to load dashboard data</p>
          <button className="btn btn-primary" onClick={loadDashboard}>
            Retry
          </button>
        </div>
      </MainLayout>
    );
  }

  const occupancyRate = stats.totalRooms > 0 
    ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) 
    : 0;

  return (
    <MainLayout>
      <div className="dashboard">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="greeting">
            <div className="greeting-date">{getCurrentDate()}</div>
            <div className="greeting-text">Hello, Admin 👋</div>
          </div>
          
          <div className="dashboard-controls">
            <div className="period-selector">
              <button 
                className={`period-btn ${selectedPeriod === 'monthly' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('monthly')}
              >
                Monthly
              </button>
              <button 
                className={`period-btn ${selectedPeriod === 'yearly' ? 'active' : ''}`}
                onClick={() => setSelectedPeriod('yearly')}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <QuickActionsWidget 
          actions={quickActions}
          onActionClick={(action) => {
            // Handle navigation based on action
            console.log('Quick action clicked:', action);
          }}
        />

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card highlight">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Monthly Revenue</h3>
              <div className="stat-card-icon">📊</div>
            </div>
            <p className="stat-value">{formatCompactCurrency(stats.monthlyRevenue)}</p>
            <div className="stat-trend up">
              <span>↑ {revenueData?.comparison.growth || 12}%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Occupancy Rate</h3>
              <div className="stat-card-icon">📈</div>
            </div>
            <p className="stat-value">{occupancyRate}%</p>
            <div className="stat-trend up">
              <span>↑ {occupancyData?.trends.change || 5}%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Outstanding Rent</h3>
              <div className="stat-card-icon">⚠️</div>
            </div>
            <p className="stat-value">{formatCompactCurrency(stats.totalOutstanding)}</p>
            <div className="stat-trend">
              <span className="status-badge error">Alert</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Total Units</h3>
              <div className="stat-card-icon">🏢</div>
            </div>
            <p className="stat-value">{stats.totalRooms}</p>
            <div className="stat-detail">
              <span>{stats.occupiedRooms} occupied</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Active Contracts</h3>
              <div className="stat-card-icon">📄</div>
            </div>
            <p className="stat-value">{stats.activeContracts}</p>
            <div className="stat-detail">
              <span>+{stats.newTenantsThisMonth} this month</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Collection Rate</h3>
              <div className="stat-card-icon">💰</div>
            </div>
            <p className="stat-value">{stats.collectionRate}%</p>
            <div className="stat-trend up">
              <span>↑ Excellent</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Total Tenants</h3>
              <div className="stat-card-icon">👥</div>
            </div>
            <p className="stat-value">{stats.totalTenants}</p>
            <div className="stat-detail">
              <span>Avg rent: {formatCompactCurrency(stats.averageRent)}</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <h3 className="stat-card-title">Maintenance</h3>
              <div className="stat-card-icon">🔧</div>
            </div>
            <p className="stat-value">{stats.maintenanceRooms}</p>
            <div className="stat-detail">
              <span>Units under maintenance</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-card large">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Revenue Trends</h3>
                <p className="chart-subtitle">
                  {selectedPeriod === 'monthly' ? 'Last 6 Months' : 'Last 4 Years'}
                </p>
              </div>
            </div>
            {revenueData && (
              <LineChart
                data={selectedPeriod === 'monthly' ? revenueData.monthly : revenueData.yearly}
                height={300}
                color="var(--primary)"
                formatValue={formatCompactCurrency}
              />
            )}
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Occupancy by Type</h3>
                <p className="chart-subtitle">Room Distribution</p>
              </div>
            </div>
            {occupancyData && (
              <DonutChart
                data={occupancyData.byPropertyType}
                size={200}
                showLegend={true}
                showValues={true}
              />
            )}
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Payment Methods</h3>
                <p className="chart-subtitle">Distribution</p>
              </div>
            </div>
            {paymentMethodData && (
              <DonutChart
                data={paymentMethodData.methods}
                size={200}
                showLegend={true}
                showValues={false}
              />
            )}
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Occupancy Trends</h3>
                <p className="chart-subtitle">Monthly %</p>
              </div>
            </div>
            {occupancyData && (
              <BarChart
                data={occupancyData.monthly}
                height={250}
                color="var(--success)"
                formatValue={(value) => `${value}%`}
              />
            )}
          </div>
        </div>

        {/* Widgets Section */}
        <div className="widgets-section">
          <div className="widget-column">
            <ActivityFeed 
              activities={activities}
              maxItems={8}
              onActivityClick={(activity) => {
                // Handle navigation to related entity
                console.log('Activity clicked:', activity);
              }}
            />
          </div>
          
          <div className="widget-column">
            <DueDatesWidget 
              dueDates={dueDates}
              maxItems={6}
              onItemClick={(item) => {
                // Handle navigation to related entity
                console.log('Due date clicked:', item);
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

