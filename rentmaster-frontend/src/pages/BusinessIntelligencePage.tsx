import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/MainLayout';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Database, 
  Brain,
  RefreshCw,
  Download,
  Settings,
  Calendar,
  Filter
} from 'lucide-react';
import { analyticsApi } from '../services/api/analyticsApi';
import { propertyApi } from '../services/api/propertyApi';
import './BusinessIntelligencePage.css';
import './shared-styles.css';

interface KPIMetric {
  id: string;
  name: string;
  value: number;
  target?: number;
  unit: string;
  trend?: number;
  status: 'good' | 'warning' | 'critical';
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

interface ForecastData {
  metric: string;
  current: number;
  forecast: number[];
  confidence: number;
  period: string[];
}

export const BusinessIntelligencePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'kpis' | 'realtime' | 'warehouse' | 'predictive'>('dashboard');
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);
  const [dateRange, setDateRange] = useState(12); // months
  
  // Dashboard data
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  // KPIs
  const [customKPIs, setCustomKPIs] = useState<KPIMetric[]>([]);
  const [showKPIModal, setShowKPIModal] = useState(false);
  const [editingKPI, setEditingKPI] = useState<KPIMetric | null>(null);
  const [kpiFormData, setKpiFormData] = useState<any>({});
  
  // Real-time Analytics
  const [realtimeData, setRealtimeData] = useState<any>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  
  // Data Warehousing
  const [warehouseData, setWarehouseData] = useState<any>(null);
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');
  const [historicalPeriod, setHistoricalPeriod] = useState<string>('24months');
  
  // Predictive Modeling
  const [forecastData, setForecastData] = useState<ForecastData[]>([]);
  const [forecastPeriod, setForecastPeriod] = useState(12);

  useEffect(() => {
    loadProperties();
    loadData();
  }, [activeTab, selectedProperty, dateRange]);

  useEffect(() => {
    if (autoRefresh && activeTab === 'realtime') {
      const interval = setInterval(() => {
        loadRealtimeAnalytics();
      }, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh, activeTab]);

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
      switch (activeTab) {
        case 'dashboard':
          await loadDashboardData();
          break;
        case 'kpis':
          await loadKPIData();
          break;
        case 'realtime':
          await loadRealtimeAnalytics();
          break;
        case 'warehouse':
          await loadWarehouseData();
          break;
        case 'predictive':
          await loadPredictiveData();
          break;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const data = await analyticsApi.getDashboardAnalytics(dateRange, selectedProperty || undefined);
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const loadKPIData = async () => {
    try {
      const data = await analyticsApi.getKPIMetrics(selectedProperty || undefined, 'current_month');
      // Transform API data to KPI format
      const kpis: KPIMetric[] = [
        {
          id: 'revenue',
          name: 'Total Revenue',
          value: data.totalRevenue || 0,
          target: data.revenueTarget || 0,
          unit: 'VND',
          trend: data.revenueTrend || 0,
          status: (data.revenueTrend || 0) >= 0 ? 'good' : 'warning'
        },
        {
          id: 'occupancy',
          name: 'Occupancy Rate',
          value: data.occupancyRate || 0,
          target: 90,
          unit: '%',
          trend: data.occupancyTrend || 0,
          status: (data.occupancyRate || 0) >= 85 ? 'good' : (data.occupancyRate || 0) >= 70 ? 'warning' : 'critical'
        },
        {
          id: 'expenses',
          name: 'Total Expenses',
          value: data.totalExpenses || 0,
          target: data.expenseTarget || 0,
          unit: 'VND',
          trend: data.expenseTrend || 0,
          status: (data.expenseTrend || 0) <= 0 ? 'good' : 'warning'
        },
        {
          id: 'profit',
          name: 'Net Profit',
          value: data.netProfit || 0,
          target: data.profitTarget || 0,
          unit: 'VND',
          trend: data.profitTrend || 0,
          status: (data.netProfit || 0) > 0 ? 'good' : 'critical'
        }
      ];
      setCustomKPIs(kpis);
    } catch (error) {
      console.error('Error loading KPI data:', error);
    }
  };

  const loadRealtimeAnalytics = async () => {
    try {
      // Use dashboard analytics for real-time data (last month)
      const data = await analyticsApi.getDashboardAnalytics(1, selectedProperty || undefined);
      setRealtimeData(data);
    } catch (error) {
      console.error('Error loading realtime analytics:', error);
    }
  };

  const loadWarehouseData = async () => {
    try {
      const months = historicalPeriod === '12months' ? 12 : historicalPeriod === '24months' ? 24 : 36;
      const data = await analyticsApi.getTrendAnalysis(selectedMetric, months, selectedProperty || undefined);
      setWarehouseData(data);
    } catch (error) {
      console.error('Error loading warehouse data:', error);
    }
  };

  const loadPredictiveData = async () => {
    try {
      const data = await analyticsApi.getForecasting(forecastPeriod, selectedProperty || undefined, 'revenue,occupancy,expenses');
      // Transform to ForecastData format
      const forecasts: ForecastData[] = [
        {
          metric: 'Revenue',
          current: data.currentRevenue || 0,
          forecast: data.revenueForecast || [],
          confidence: data.revenueConfidence || 0.85,
          period: data.periods || []
        },
        {
          metric: 'Occupancy',
          current: data.currentOccupancy || 0,
          forecast: data.occupancyForecast || [],
          confidence: data.occupancyConfidence || 0.80,
          period: data.periods || []
        },
        {
          metric: 'Expenses',
          current: data.currentExpenses || 0,
          forecast: data.expenseForecast || [],
          confidence: data.expenseConfidence || 0.75,
          period: data.periods || []
        }
      ];
      setForecastData(forecasts);
    } catch (error) {
      console.error('Error loading predictive data:', error);
    }
  };

  const handleCreateKPI = () => {
    setEditingKPI(null);
    setKpiFormData({ name: '', target: 0, unit: '', metric: '' });
    setShowKPIModal(true);
  };

  const handleEditKPI = (kpi: KPIMetric) => {
    setEditingKPI(kpi);
    setKpiFormData({ name: kpi.name, target: kpi.target || 0, unit: kpi.unit, metric: kpi.id });
    setShowKPIModal(true);
  };

  const handleSaveKPI = () => {
    if (editingKPI) {
      setCustomKPIs(customKPIs.map(k => k.id === editingKPI.id ? { ...k, ...kpiFormData } : k));
    } else {
      const newKPI: KPIMetric = {
        id: kpiFormData.metric || `kpi-${Date.now()}`,
        name: kpiFormData.name,
        value: 0,
        target: kpiFormData.target,
        unit: kpiFormData.unit,
        status: 'good'
      };
      setCustomKPIs([...customKPIs, newKPI]);
    }
    setShowKPIModal(false);
  };

  const handleDeleteKPI = (id: string) => {
    setCustomKPIs(customKPIs.filter(k => k.id !== id));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  return (
    <MainLayout>
      <div className="business-intelligence-page">
        <div className="page-header">
          <div>
            <h1>Business Intelligence</h1>
            <p className="page-subtitle">Advanced analytics, KPIs, real-time insights, and predictive modeling</p>
          </div>
          <div className="action-buttons">
            <select
              value={selectedProperty || ''}
              onChange={(e) => setSelectedProperty(e.target.value ? Number(e.target.value) : null)}
              className="filter-select"
            >
              <option value="">All Properties</option>
              {properties.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
            <button className="btn btn-secondary" onClick={loadData} disabled={loading}>
              <RefreshCw className={loading ? 'spinning' : ''} />
              Refresh
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bi-tabs">
          <button
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <BarChart3 className="tab-icon" />
            BI Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === 'kpis' ? 'active' : ''}`}
            onClick={() => setActiveTab('kpis')}
          >
            <Target className="tab-icon" />
            Custom KPIs
          </button>
          <button
            className={`tab-button ${activeTab === 'realtime' ? 'active' : ''}`}
            onClick={() => setActiveTab('realtime')}
          >
            <TrendingUp className="tab-icon" />
            Real-time Analytics
          </button>
          <button
            className={`tab-button ${activeTab === 'warehouse' ? 'active' : ''}`}
            onClick={() => setActiveTab('warehouse')}
          >
            <Database className="tab-icon" />
            Data Warehousing
          </button>
          <button
            className={`tab-button ${activeTab === 'predictive' ? 'active' : ''}`}
            onClick={() => setActiveTab('predictive')}
          >
            <Brain className="tab-icon" />
            Predictive Modeling
          </button>
        </div>

        {/* Tab Content */}
        <div className="bi-content">
          {loading && (
            <div className="loading-spinner">
              <div className="spinner"></div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="dashboard-tab">
              {dashboardData ? (
                <>
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-label">Total Revenue</div>
                      <div className="stat-value">{formatCurrency(dashboardData.totalRevenue || 0)}</div>
                      <div className="stat-change positive">+{dashboardData.revenueGrowth || 0}%</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Occupancy Rate</div>
                      <div className="stat-value">{dashboardData.occupancyRate || 0}%</div>
                      <div className="stat-change positive">+{dashboardData.occupancyChange || 0}%</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Total Expenses</div>
                      <div className="stat-value">{formatCurrency(dashboardData.totalExpenses || 0)}</div>
                      <div className="stat-change negative">+{dashboardData.expenseGrowth || 0}%</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-label">Net Profit</div>
                      <div className="stat-value">{formatCurrency(dashboardData.netProfit || 0)}</div>
                      <div className="stat-change positive">+{dashboardData.profitGrowth || 0}%</div>
                    </div>
                  </div>
                  <div className="charts-grid">
                    <div className="chart-card">
                      <h3>Revenue Trend</h3>
                      <div className="chart-placeholder">
                        <BarChart3 size={48} />
                        <p>Revenue chart visualization</p>
                      </div>
                    </div>
                    <div className="chart-card">
                      <h3>Occupancy Trend</h3>
                      <div className="chart-placeholder">
                        <TrendingUp size={48} />
                        <p>Occupancy chart visualization</p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="empty-state">
                  <BarChart3 size={48} />
                  <p>No dashboard data available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'kpis' && (
            <div className="kpis-tab">
              <div className="section-header">
                <h2>Key Performance Indicators</h2>
                <button className="btn btn-primary" onClick={handleCreateKPI}>
                  <Target />
                  Create Custom KPI
                </button>
              </div>
              <div className="kpis-grid">
                {customKPIs.map((kpi) => (
                  <div key={kpi.id} className="kpi-card">
                    <div className="kpi-header">
                      <h3>{kpi.name}</h3>
                      <div className="kpi-actions">
                        <button className="btn-icon" onClick={() => handleEditKPI(kpi)}>
                          <Settings size={16} />
                        </button>
                        <button className="btn-icon danger" onClick={() => handleDeleteKPI(kpi.id)}>
                          ×
                        </button>
                      </div>
                    </div>
                    <div className="kpi-value">
                      {kpi.unit === 'VND' ? formatCurrency(kpi.value) : `${formatNumber(kpi.value)}${kpi.unit}`}
                    </div>
                    {kpi.target && (
                      <div className="kpi-progress">
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${Math.min((kpi.value / kpi.target) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="progress-label">
                          Target: {kpi.unit === 'VND' ? formatCurrency(kpi.target) : `${formatNumber(kpi.target)}${kpi.unit}`}
                        </div>
                      </div>
                    )}
                    {kpi.trend !== undefined && (
                      <div className={`kpi-trend ${kpi.trend >= 0 ? 'positive' : 'negative'}`}>
                        {kpi.trend >= 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}%
                      </div>
                    )}
                    <div className={`kpi-status ${kpi.status}`}>
                      {kpi.status === 'good' ? '✓ On Track' : kpi.status === 'warning' ? '⚠ Attention' : '✕ Critical'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'realtime' && (
            <div className="realtime-tab">
              <div className="section-header">
                <h2>Real-time Analytics</h2>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                  />
                  <span>Auto Refresh (30s)</span>
                </label>
              </div>
              {realtimeData ? (
                <div className="realtime-grid">
                  <div className="realtime-card">
                    <div className="realtime-label">Active Contracts</div>
                    <div className="realtime-value">{realtimeData.activeContracts || 0}</div>
                    <div className="realtime-timestamp">Updated: {new Date().toLocaleTimeString()}</div>
                  </div>
                  <div className="realtime-card">
                    <div className="realtime-label">Pending Payments</div>
                    <div className="realtime-value">{formatCurrency(realtimeData.pendingPayments || 0)}</div>
                    <div className="realtime-timestamp">Updated: {new Date().toLocaleTimeString()}</div>
                  </div>
                  <div className="realtime-card">
                    <div className="realtime-label">Maintenance Requests</div>
                    <div className="realtime-value">{realtimeData.activeMaintenanceRequests || 0}</div>
                    <div className="realtime-timestamp">Updated: {new Date().toLocaleTimeString()}</div>
                  </div>
                  <div className="realtime-card">
                    <div className="realtime-label">Vacant Units</div>
                    <div className="realtime-value">{realtimeData.vacantUnits || 0}</div>
                    <div className="realtime-timestamp">Updated: {new Date().toLocaleTimeString()}</div>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <TrendingUp size={48} />
                  <p>No real-time data available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'warehouse' && (
            <div className="warehouse-tab">
              <div className="section-header">
                <h2>Historical Data Analysis</h2>
                <div className="filter-group">
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="filter-select"
                  >
                    <option value="revenue">Revenue</option>
                    <option value="occupancy">Occupancy</option>
                    <option value="expenses">Expenses</option>
                    <option value="profit">Profit</option>
                  </select>
                  <select
                    value={historicalPeriod}
                    onChange={(e) => setHistoricalPeriod(e.target.value)}
                    className="filter-select"
                  >
                    <option value="12months">Last 12 Months</option>
                    <option value="24months">Last 24 Months</option>
                    <option value="36months">Last 36 Months</option>
                  </select>
                </div>
              </div>
              {warehouseData ? (
                <div className="warehouse-content">
                  <div className="chart-card">
                    <h3>{selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} Trend</h3>
                    <div className="chart-placeholder">
                      <Database size={48} />
                      <p>Historical data visualization</p>
                    </div>
                  </div>
                  <div className="warehouse-stats">
                    <div className="stat-item">
                      <span className="stat-label">Average:</span>
                      <span className="stat-value">{formatCurrency(warehouseData.average || 0)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Peak:</span>
                      <span className="stat-value">{formatCurrency(warehouseData.peak || 0)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Lowest:</span>
                      <span className="stat-value">{formatCurrency(warehouseData.lowest || 0)}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Growth Rate:</span>
                      <span className="stat-value">{warehouseData.growthRate || 0}%</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <Database size={48} />
                  <p>No historical data available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'predictive' && (
            <div className="predictive-tab">
              <div className="section-header">
                <h2>Predictive Modeling & Forecasting</h2>
                <select
                  value={forecastPeriod}
                  onChange={(e) => setForecastPeriod(Number(e.target.value))}
                  className="filter-select"
                >
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months</option>
                  <option value={24}>24 Months</option>
                </select>
              </div>
              {forecastData.length > 0 ? (
                <div className="forecast-grid">
                  {forecastData.map((forecast, idx) => (
                    <div key={idx} className="forecast-card">
                      <h3>{forecast.metric} Forecast</h3>
                      <div className="forecast-current">
                        Current: {forecast.metric === 'Revenue' || forecast.metric === 'Expenses' 
                          ? formatCurrency(forecast.current) 
                          : `${forecast.current}%`}
                      </div>
                      <div className="forecast-confidence">
                        Confidence: {(forecast.confidence * 100).toFixed(0)}%
                      </div>
                      <div className="chart-placeholder">
                        <Brain size={48} />
                        <p>Forecast visualization for {forecast.metric}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Brain size={48} />
                  <p>No forecast data available</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* KPI Modal */}
        {showKPIModal && (
          <div className="modal-overlay" onClick={() => setShowKPIModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingKPI ? 'Edit' : 'Create'} Custom KPI</h2>
                <button className="modal-close" onClick={() => setShowKPIModal(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>KPI Name *</label>
                  <input
                    type="text"
                    value={kpiFormData.name || ''}
                    onChange={(e) => setKpiFormData({ ...kpiFormData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Metric *</label>
                  <select
                    value={kpiFormData.metric || ''}
                    onChange={(e) => setKpiFormData({ ...kpiFormData, metric: e.target.value })}
                    required
                  >
                    <option value="">Select Metric</option>
                    <option value="revenue">Revenue</option>
                    <option value="occupancy">Occupancy</option>
                    <option value="expenses">Expenses</option>
                    <option value="profit">Profit</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Target Value *</label>
                  <input
                    type="number"
                    value={kpiFormData.target || ''}
                    onChange={(e) => setKpiFormData({ ...kpiFormData, target: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unit *</label>
                  <select
                    value={kpiFormData.unit || ''}
                    onChange={(e) => setKpiFormData({ ...kpiFormData, unit: e.target.value })}
                    required
                  >
                    <option value="">Select Unit</option>
                    <option value="VND">VND</option>
                    <option value="%">%</option>
                    <option value="">Count</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowKPIModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSaveKPI}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

