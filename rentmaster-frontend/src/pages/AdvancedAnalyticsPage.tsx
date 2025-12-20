import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import {
  RevenueData,
  OccupancyData,
  PaymentMethodData,
  ChartDataPoint,
  DashboardStats
} from '../types';
import './AdvancedAnalyticsPage.css';

export const AdvancedAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'occupancy' | 'payments' | 'trends' | 'forecasts'>('overview');
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('12months');
  const [selectedProperty, setSelectedProperty] = useState<string>('all');
  
  // Analytics data state
  const [overviewStats, setOverviewStats] = useState<DashboardStats | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [occupancyData, setOccupancyData] = useState<OccupancyData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentMethodData | null>(null);

  useEffect(() => {
    loadAnalyticsData();
  }, [activeTab, dateRange, selectedProperty]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      // Load comprehensive analytics data
      await Promise.all([
        loadOverviewStats(),
        loadRevenueAnalytics(),
        loadOccupancyAnalytics(),
        loadPaymentAnalytics()
      ]);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOverviewStats = async () => {
    // Mock comprehensive stats - replace with actual API call
    setOverviewStats({
      totalRooms: 156,
      occupiedRooms: 142,
      availableRooms: 14,
      maintenanceRooms: 3,
      activeContracts: 138,
      totalOutstanding: 24500.00,
      monthlyRevenue: 187600.00,
      totalTenants: 142,
      newTenantsThisMonth: 8,
      averageRent: 1320.00,
      collectionRate: 94.2
    });
  };

  const loadRevenueAnalytics = async () => {
    // Mock revenue data with trends
    const monthlyRevenue: ChartDataPoint[] = [];
    const yearlyRevenue: ChartDataPoint[] = [];
    
    // Generate 12 months of data
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const baseRevenue = 180000 + (Math.random() * 20000);
      
      monthlyRevenue.push({
        label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        value: baseRevenue,
        date: date.toISOString(),
        percentage: i === 0 ? 8.5 : undefined
      });
    }

    // Generate 3 years of data
    for (let i = 2; i >= 0; i--) {
      const year = new Date().getFullYear() - i;
      yearlyRevenue.push({
        label: year.toString(),
        value: 2100000 + (i * 150000) + (Math.random() * 100000),
        percentage: i === 0 ? 12.3 : undefined
      });
    }

    setRevenueData({
      monthly: monthlyRevenue,
      yearly: yearlyRevenue,
      comparison: {
        currentMonth: 187600,
        previousMonth: 172800,
        growth: 8.5
      }
    });
  };

  const loadOccupancyAnalytics = async () => {
    // Mock occupancy data
    const monthlyOccupancy: ChartDataPoint[] = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const occupancyRate = 88 + (Math.random() * 8);
      
      monthlyOccupancy.push({
        label: date.toLocaleDateString('en-US', { month: 'short' }),
        value: occupancyRate,
        date: date.toISOString(),
        percentage: occupancyRate
      });
    }

    const byPropertyType: ChartDataPoint[] = [
      { label: 'Studio', value: 45, percentage: 28.8 },
      { label: '1 Bedroom', value: 62, percentage: 39.7 },
      { label: '2 Bedroom', value: 38, percentage: 24.4 },
      { label: '3 Bedroom', value: 11, percentage: 7.1 }
    ];

    setOccupancyData({
      monthly: monthlyOccupancy,
      byPropertyType,
      trends: {
        currentRate: 91.0,
        previousRate: 88.5,
        change: 2.5
      }
    });
  };

  const loadPaymentAnalytics = async () => {
    // Mock payment method data
    const methods: ChartDataPoint[] = [
      { label: 'Credit Card', value: 65, percentage: 45.8 },
      { label: 'Bank Transfer', value: 42, percentage: 29.6 },
      { label: 'Cash', value: 25, percentage: 17.6 },
      { label: 'Check', value: 10, percentage: 7.0 }
    ];

    const trends: ChartDataPoint[] = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      trends.push({
        label: date.toLocaleDateString('en-US', { month: 'short' }),
        value: 92 + (Math.random() * 6),
        date: date.toISOString()
      });
    }

    setPaymentData({
      methods,
      trends
    });
  };

  return (
    <MainLayout>
      <div className="advanced-analytics">
        <div className="analytics-header">
          <div className="header-content">
            <h1>Advanced Analytics</h1>
            <p>Comprehensive insights and performance metrics</p>
          </div>
          
          <div className="analytics-controls">
            <select 
              value={selectedProperty} 
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="property-selector"
            >
              <option value="all">All Properties</option>
              <option value="1">Sunset Apartments</option>
              <option value="2">Downtown Lofts</option>
              <option value="3">Garden View Complex</option>
            </select>
            
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="date-range-selector"
            >
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="24months">Last 24 Months</option>
            </select>
          </div>
        </div>

        <div className="analytics-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-chart-pie"></i>
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'revenue' ? 'active' : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            <i className="fas fa-dollar-sign"></i>
            Revenue
          </button>
          <button
            className={`tab-button ${activeTab === 'occupancy' ? 'active' : ''}`}
            onClick={() => setActiveTab('occupancy')}
          >
            <i className="fas fa-home"></i>
            Occupancy
          </button>
          <button
            className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <i className="fas fa-credit-card"></i>
            Payments
          </button>
          <button
            className={`tab-button ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            <i className="fas fa-chart-line"></i>
            Trends
          </button>
          <button
            className={`tab-button ${activeTab === 'forecasts' ? 'active' : ''}`}
            onClick={() => setActiveTab('forecasts')}
          >
            <i className="fas fa-crystal-ball"></i>
            Forecasts
          </button>
        </div>

        <div className="analytics-content">
          {loading ? (
            <div className="analytics-loading">
              <div className="loading-spinner"></div>
              <p>Loading analytics data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <AnalyticsOverviewTab stats={overviewStats} />
              )}
              {activeTab === 'revenue' && (
                <RevenueAnalyticsTab data={revenueData} />
              )}
              {activeTab === 'occupancy' && (
                <OccupancyAnalyticsTab data={occupancyData} />
              )}
              {activeTab === 'payments' && (
                <PaymentAnalyticsTab data={paymentData} />
              )}
              {activeTab === 'trends' && (
                <TrendsAnalyticsTab />
              )}
              {activeTab === 'forecasts' && (
                <ForecastsAnalyticsTab />
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

// Overview Tab Component
const AnalyticsOverviewTab: React.FC<{ stats: DashboardStats | null }> = ({ stats }) => {
  if (!stats) return <div>Loading overview...</div>;

  return (
    <div className="analytics-overview-tab">
      <div className="overview-metrics">
        <div className="metric-card primary">
          <div className="metric-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="metric-content">
            <h3>Monthly Revenue</h3>
            <p className="metric-value">${stats.monthlyRevenue.toLocaleString()}</p>
            <span className="metric-change positive">+8.5% vs last month</span>
          </div>
        </div>

        <div className="metric-card success">
          <div className="metric-icon">
            <i className="fas fa-percentage"></i>
          </div>
          <div className="metric-content">
            <h3>Collection Rate</h3>
            <p className="metric-value">{stats.collectionRate}%</p>
            <span className="metric-change positive">+2.1% vs last month</span>
          </div>
        </div>

        <div className="metric-card info">
          <div className="metric-icon">
            <i className="fas fa-home"></i>
          </div>
          <div className="metric-content">
            <h3>Occupancy Rate</h3>
            <p className="metric-value">{((stats.occupiedRooms / stats.totalRooms) * 100).toFixed(1)}%</p>
            <span className="metric-change positive">+1.8% vs last month</span>
          </div>
        </div>

        <div className="metric-card warning">
          <div className="metric-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="metric-content">
            <h3>Outstanding</h3>
            <p className="metric-value">${stats.totalOutstanding.toLocaleString()}</p>
            <span className="metric-change negative">-12.3% vs last month</span>
          </div>
        </div>
      </div>

      <div className="overview-charts">
        <div className="chart-section">
          <h3>Revenue Trend (12 Months)</h3>
          <div className="chart-placeholder">
            <div className="chart-bars">
              {Array.from({ length: 12 }, (_, i) => (
                <div 
                  key={i} 
                  className="chart-bar" 
                  style={{ height: `${60 + Math.random() * 40}%` }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="chart-section">
          <h3>Occupancy Distribution</h3>
          <div className="donut-chart">
            <div className="donut-center">
              <span className="donut-value">91.0%</span>
              <span className="donut-label">Occupied</span>
            </div>
          </div>
          <div className="donut-legend">
            <div className="legend-item">
              <span className="legend-color occupied"></span>
              <span>Occupied (142)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color available"></span>
              <span>Available (14)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color maintenance"></span>
              <span>Maintenance (3)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overview-insights">
        <div className="insight-card">
          <h4>Key Insights</h4>
          <ul>
            <li>Revenue increased by 8.5% compared to last month</li>
            <li>Collection rate improved to 94.2%, above industry average</li>
            <li>Occupancy rate reached 91%, highest in 6 months</li>
            <li>Outstanding payments decreased by 12.3%</li>
          </ul>
        </div>

        <div className="insight-card">
          <h4>Recommendations</h4>
          <ul>
            <li>Consider rent increase for high-demand units</li>
            <li>Focus on filling remaining 14 available units</li>
            <li>Implement automated payment reminders</li>
            <li>Schedule maintenance for 3 units in queue</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Revenue Analytics Tab
const RevenueAnalyticsTab: React.FC<{ data: RevenueData | null }> = ({ data }) => {
  if (!data) return <div>Loading revenue data...</div>;

  return (
    <div className="revenue-analytics-tab">
      <div className="revenue-summary">
        <div className="summary-card">
          <h3>Current Month</h3>
          <p className="summary-value">${data.comparison.currentMonth.toLocaleString()}</p>
          <span className="summary-change positive">+{data.comparison.growth}%</span>
        </div>
        <div className="summary-card">
          <h3>Previous Month</h3>
          <p className="summary-value">${data.comparison.previousMonth.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Growth</h3>
          <p className="summary-value">${(data.comparison.currentMonth - data.comparison.previousMonth).toLocaleString()}</p>
          <span className="summary-change positive">+{data.comparison.growth}%</span>
        </div>
      </div>

      <div className="revenue-charts">
        <div className="chart-container">
          <h3>Monthly Revenue Trend</h3>
          <div className="line-chart">
            {data.monthly.map((point, index) => (
              <div key={index} className="chart-point" style={{ left: `${(index / (data.monthly.length - 1)) * 100}%` }}>
                <div className="point-marker"></div>
                <div className="point-label">{point.label}</div>
                <div className="point-value">${(point.value / 1000).toFixed(0)}k</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>Yearly Comparison</h3>
          <div className="bar-chart">
            {data.yearly.map((point, index) => (
              <div key={index} className="bar-item">
                <div className="bar" style={{ height: `${(point.value / Math.max(...data.yearly.map(p => p.value))) * 100}%` }}></div>
                <div className="bar-label">{point.label}</div>
                <div className="bar-value">${(point.value / 1000000).toFixed(1)}M</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Occupancy Analytics Tab
const OccupancyAnalyticsTab: React.FC<{ data: OccupancyData | null }> = ({ data }) => {
  if (!data) return <div>Loading occupancy data...</div>;

  return (
    <div className="occupancy-analytics-tab">
      <div className="occupancy-summary">
        <div className="summary-metric">
          <h3>Current Occupancy</h3>
          <p className="metric-large">{data.trends.currentRate}%</p>
          <span className="metric-change positive">+{data.trends.change}%</span>
        </div>
      </div>

      <div className="occupancy-charts">
        <div className="chart-container">
          <h3>Occupancy Trend (12 Months)</h3>
          <div className="area-chart">
            {data.monthly.map((point, index) => (
              <div key={index} className="area-point" style={{ 
                left: `${(index / (data.monthly.length - 1)) * 100}%`,
                bottom: `${point.percentage}%`
              }}>
                <div className="area-marker"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3>By Property Type</h3>
          <div className="horizontal-bars">
            {data.byPropertyType.map((type, index) => (
              <div key={index} className="bar-row">
                <div className="bar-label">{type.label}</div>
                <div className="bar-container">
                  <div className="bar-fill" style={{ width: `${type.percentage}%` }}></div>
                </div>
                <div className="bar-value">{type.value} units ({type.percentage}%)</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Payment Analytics Tab
const PaymentAnalyticsTab: React.FC<{ data: PaymentMethodData | null }> = ({ data }) => {
  if (!data) return <div>Loading payment data...</div>;

  return (
    <div className="payment-analytics-tab">
      <div className="payment-methods">
        <h3>Payment Methods Distribution</h3>
        <div className="pie-chart-container">
          <div className="pie-chart">
            {data.methods.map((method, index) => (
              <div key={index} className={`pie-slice slice-${index}`}></div>
            ))}
          </div>
          <div className="pie-legend">
            {data.methods.map((method, index) => (
              <div key={index} className="legend-item">
                <span className={`legend-color color-${index}`}></span>
                <span>{method.label}: {method.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="payment-trends">
        <h3>Collection Rate Trend</h3>
        <div className="trend-chart">
          {data.trends.map((point, index) => (
            <div key={index} className="trend-point" style={{ 
              left: `${(index / (data.trends.length - 1)) * 100}%`,
              bottom: `${point.value - 85}%`
            }}>
              <div className="trend-marker"></div>
              <div className="trend-label">{point.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Trends Analytics Tab
const TrendsAnalyticsTab: React.FC = () => {
  return (
    <div className="trends-analytics-tab">
      <div className="trends-grid">
        <div className="trend-card">
          <h3>Revenue Growth</h3>
          <div className="trend-value positive">+12.5%</div>
          <p>Year over year growth</p>
        </div>
        <div className="trend-card">
          <h3>Tenant Retention</h3>
          <div className="trend-value positive">87.3%</div>
          <p>12-month retention rate</p>
        </div>
        <div className="trend-card">
          <h3>Average Rent</h3>
          <div className="trend-value positive">+5.8%</div>
          <p>Increase from last year</p>
        </div>
        <div className="trend-card">
          <h3>Maintenance Costs</h3>
          <div className="trend-value negative">+3.2%</div>
          <p>Increase in maintenance spending</p>
        </div>
      </div>
    </div>
  );
};

// Forecasts Analytics Tab
const ForecastsAnalyticsTab: React.FC = () => {
  return (
    <div className="forecasts-analytics-tab">
      <div className="forecast-section">
        <h3>Revenue Forecast (Next 6 Months)</h3>
        <div className="forecast-chart">
          <p>Projected revenue growth of 8-12% based on current trends</p>
        </div>
      </div>
      
      <div className="forecast-section">
        <h3>Occupancy Forecast</h3>
        <div className="forecast-chart">
          <p>Expected occupancy rate to maintain 90-95% range</p>
        </div>
      </div>
    </div>
  );
};