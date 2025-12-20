import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { LineChart } from '../components/charts/LineChart';
import { DonutChart } from '../components/charts/DonutChart';
import { BarChart } from '../components/charts/BarChart';
import { financialApi } from '../services/api/financialApi';
import { FinancialForecast, ProfitLossReport, Currency } from '../types';
import './FinancialDashboardPage.css';

export const FinancialDashboardPage: React.FC = () => {
  const [forecast, setForecast] = useState<FinancialForecast[]>([]);
  const [profitLoss, setProfitLoss] = useState<ProfitLossReport | null>(null);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'3M' | '6M' | '12M'>('12M');

  useEffect(() => {
    loadFinancialData();
  }, [timeRange]);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      const months = timeRange === '3M' ? 3 : timeRange === '6M' ? 6 : 12;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - months);

      const [forecastData, profitLossData, currenciesData] = await Promise.all([
        financialApi.getForecast(months),
        financialApi.getProfitLossReport(
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        ),
        financialApi.getCurrencies(),
      ]);

      setForecast(forecastData);
      setProfitLoss(profitLossData);
      setCurrencies(currenciesData);
      
      const defaultCurrency = currenciesData.find(c => c.isDefault);
      if (defaultCurrency) {
        setSelectedCurrency(defaultCurrency.code);
      }
    } catch (error) {
      console.error('Failed to load financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number, currencyCode: string = selectedCurrency) => {
    const currency = currencies.find(c => c.code === currencyCode);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRevenueChartData = () => {
    return {
      labels: forecast.map(f => f.month),
      datasets: [
        {
          label: 'Projected Revenue',
          data: forecast.map(f => f.projectedRevenue),
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Actual Revenue',
          data: forecast.map(f => f.actualRevenue || 0),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
        },
      ],
    };
  };

  const getProfitChartData = () => {
    return {
      labels: forecast.map(f => f.month),
      datasets: [
        {
          label: 'Revenue',
          data: forecast.map(f => f.projectedRevenue),
          backgroundColor: '#10b981',
        },
        {
          label: 'Expenses',
          data: forecast.map(f => f.projectedExpenses),
          backgroundColor: '#ef4444',
        },
        {
          label: 'Profit',
          data: forecast.map(f => f.projectedProfit),
          backgroundColor: '#3b82f6',
        },
      ],
    };
  };

  const getExpenseBreakdownData = () => {
    if (!profitLoss) return { labels: [], datasets: [] };

    return {
      labels: ['Maintenance', 'Utilities', 'Administrative', 'Other'],
      datasets: [
        {
          data: [
            profitLoss.expenses.maintenanceExpenses,
            profitLoss.expenses.utilitiesExpenses,
            profitLoss.expenses.administrativeExpenses,
            profitLoss.expenses.otherExpenses,
          ],
          backgroundColor: ['#ef4444', '#f59e0b', '#8b5cf6', '#6b7280'],
        },
      ],
    };
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="financial-dashboard-loading">
          <div className="loading-spinner">⏳</div>
          <p>Loading financial data...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="financial-dashboard">
        <div className="page-header">
          <div>
            <h1>Financial Dashboard</h1>
            <p className="page-subtitle">Comprehensive financial overview and analytics</p>
          </div>
          <div className="dashboard-controls">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="currency-selector"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code}
                </option>
              ))}
            </select>
            <div className="time-range-selector">
              {(['3M', '6M', '12M'] as const).map(range => (
                <button
                  key={range}
                  className={`range-btn ${timeRange === range ? 'active' : ''}`}
                  onClick={() => setTimeRange(range)}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="financial-metrics">
          <div className="metric-card revenue">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h3>Total Revenue</h3>
              <div className="metric-value">
                {profitLoss ? formatCurrency(profitLoss.revenue.totalRevenue) : '-'}
              </div>
              <div className="metric-change positive">↗ +12.5%</div>
            </div>
          </div>

          <div className="metric-card expenses">
            <div className="metric-icon">📊</div>
            <div className="metric-content">
              <h3>Total Expenses</h3>
              <div className="metric-value">
                {profitLoss ? formatCurrency(profitLoss.expenses.totalExpenses) : '-'}
              </div>
              <div className="metric-change negative">↗ +8.3%</div>
            </div>
          </div>

          <div className="metric-card profit">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <h3>Net Profit</h3>
              <div className="metric-value">
                {profitLoss ? formatCurrency(profitLoss.netProfit) : '-'}
              </div>
              <div className="metric-change positive">↗ +15.2%</div>
            </div>
          </div>

          <div className="metric-card margin">
            <div className="metric-icon">🎯</div>
            <div className="metric-content">
              <h3>Profit Margin</h3>
              <div className="metric-value">
                {profitLoss ? `${profitLoss.profitMargin.toFixed(1)}%` : '-'}
              </div>
              <div className="metric-change positive">↗ +2.1%</div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          <div className="chart-card large">
            <div className="chart-header">
              <h3>Revenue Forecast vs Actual</h3>
              <p>Projected vs actual revenue over time</p>
            </div>
            <div className="chart-container">
              <LineChart data={getRevenueChartData()} />
            </div>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <h3>Expense Breakdown</h3>
              <p>Distribution of expenses by category</p>
            </div>
            <div className="chart-container">
              <DonutChart data={getExpenseBreakdownData()} />
            </div>
          </div>

          <div className="chart-card large">
            <div className="chart-header">
              <h3>Financial Performance</h3>
              <p>Revenue, expenses, and profit comparison</p>
            </div>
            <div className="chart-container">
              <BarChart data={getProfitChartData()} />
            </div>
          </div>
        </div>

        {/* Financial Summary */}
        {profitLoss && (
          <div className="financial-summary">
            <div className="summary-section">
              <h3>Revenue Breakdown</h3>
              <div className="summary-items">
                <div className="summary-item">
                  <span>Rent Revenue</span>
                  <span>{formatCurrency(profitLoss.revenue.rentRevenue)}</span>
                </div>
                <div className="summary-item">
                  <span>Service Revenue</span>
                  <span>{formatCurrency(profitLoss.revenue.serviceRevenue)}</span>
                </div>
                <div className="summary-item">
                  <span>Other Revenue</span>
                  <span>{formatCurrency(profitLoss.revenue.otherRevenue)}</span>
                </div>
                <div className="summary-item total">
                  <span>Total Revenue</span>
                  <span>{formatCurrency(profitLoss.revenue.totalRevenue)}</span>
                </div>
              </div>
            </div>

            <div className="summary-section">
              <h3>Expense Breakdown</h3>
              <div className="summary-items">
                <div className="summary-item">
                  <span>Maintenance</span>
                  <span>{formatCurrency(profitLoss.expenses.maintenanceExpenses)}</span>
                </div>
                <div className="summary-item">
                  <span>Utilities</span>
                  <span>{formatCurrency(profitLoss.expenses.utilitiesExpenses)}</span>
                </div>
                <div className="summary-item">
                  <span>Administrative</span>
                  <span>{formatCurrency(profitLoss.expenses.administrativeExpenses)}</span>
                </div>
                <div className="summary-item">
                  <span>Other</span>
                  <span>{formatCurrency(profitLoss.expenses.otherExpenses)}</span>
                </div>
                <div className="summary-item total">
                  <span>Total Expenses</span>
                  <span>{formatCurrency(profitLoss.expenses.totalExpenses)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="financial-actions">
          <button className="action-btn">
            <span>📊</span>
            <div>
              <h4>Generate P&L Report</h4>
              <p>Create detailed profit & loss statement</p>
            </div>
          </button>
          <button className="action-btn">
            <span>📈</span>
            <div>
              <h4>Update Forecast</h4>
              <p>Refresh financial projections</p>
            </div>
          </button>
          <button className="action-btn">
            <span>💱</span>
            <div>
              <h4>Manage Currencies</h4>
              <p>Update exchange rates and settings</p>
            </div>
          </button>
          <button className="action-btn">
            <span>🧾</span>
            <div>
              <h4>Tax Reports</h4>
              <p>Generate tax documentation</p>
            </div>
          </button>
        </div>
      </div>
    </MainLayout>
  );
};