import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { financialApi, CreateExpenseRequest, CreatePaymentPlanRequest, RefundDepositRequest } from '../services/api/financialApi';
import { propertyApi } from '../services/api/propertyApi';
import { invoiceApi } from '../services/api/invoiceApi';
import {
  Expense,
  Currency,
  Deposit,
  PaymentPlan,
  ProfitLossReport,
  FinancialForecast,
  TaxReport,
  Property,
  Invoice
} from '../types';
import './FinancialManagementPage.css';
import './shared-styles.css';

export const FinancialManagementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'reports' | 'forecasts' | 'deposits' | 'payment-plans' | 'currencies'>('overview');
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [financialStats, setFinancialStats] = useState<any>(null);

  useEffect(() => {
    loadFinancialData();
  }, [activeTab]);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      // Load data based on active tab
      switch (activeTab) {
        case 'overview':
          await loadFinancialStats();
          break;
        case 'expenses':
          await loadExpenses();
          break;
        case 'deposits':
          await loadDeposits();
          break;
        case 'payment-plans':
          await loadPaymentPlans();
          break;
        case 'currencies':
          await loadCurrencies();
          break;
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFinancialStats = async () => {
    // Mock data - replace with actual API call
    setFinancialStats({
      totalRevenue: 225600.0,
      totalExpenses: 63600.0,
      netProfit: 162000.0,
      profitMargin: 71.8,
      averageMonthlyRevenue: 18800.0,
      averageMonthlyExpenses: 5300.0,
      cashFlow: 2250.0,
      outstandingDeposits: 3700.0,
      activePaymentPlans: 2,
      totalPaymentPlanAmount: 2400.0
    });
  };

  const loadExpenses = async (filters?: { category?: string; date?: string }) => {
    try {
      const expenseFilters: any = {};
      if (filters?.category) expenseFilters.category = filters.category;
      if (filters?.date) {
        expenseFilters.startDate = filters.date;
        expenseFilters.endDate = filters.date;
      }
      const data = await financialApi.getExpenses(expenseFilters);
      setExpenses(data || []);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setExpenses([]);
    }
  };

  const loadDeposits = async () => {
    try {
      const data = await financialApi.getDeposits();
      setDeposits(data || []);
    } catch (error) {
      console.error('Error loading deposits:', error);
      setDeposits([]);
    }
  };

  const loadPaymentPlans = async () => {
    try {
      const data = await financialApi.getPaymentPlans();
      setPaymentPlans(data || []);
    } catch (error) {
      console.error('Error loading payment plans:', error);
      setPaymentPlans([]);
    }
  };

  const loadCurrencies = async () => {
    try {
      const data = await financialApi.getCurrencies();
      setCurrencies(data || []);
    } catch (error) {
      console.error('Error loading currencies:', error);
      setCurrencies([]);
    }
  };

  return (
    <MainLayout>
      <div className="financial-management">
        <div className="financial-management-header">
          <h1>Financial Management</h1>
          <p>Comprehensive financial tracking and reporting</p>
        </div>

        <div className="financial-management-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-chart-line"></i>
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'expenses' ? 'active' : ''}`}
            onClick={() => setActiveTab('expenses')}
          >
            <i className="fas fa-receipt"></i>
            Expenses
          </button>
          <button
            className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <i className="fas fa-file-alt"></i>
            Reports
          </button>
          <button
            className={`tab-button ${activeTab === 'forecasts' ? 'active' : ''}`}
            onClick={() => setActiveTab('forecasts')}
          >
            <i className="fas fa-crystal-ball"></i>
            Forecasts
          </button>
          <button
            className={`tab-button ${activeTab === 'deposits' ? 'active' : ''}`}
            onClick={() => setActiveTab('deposits')}
          >
            <i className="fas fa-piggy-bank"></i>
            Deposits
          </button>
          <button
            className={`tab-button ${activeTab === 'payment-plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment-plans')}
          >
            <i className="fas fa-calendar-alt"></i>
            Payment Plans
          </button>
          <button
            className={`tab-button ${activeTab === 'currencies' ? 'active' : ''}`}
            onClick={() => setActiveTab('currencies')}
          >
            <i className="fas fa-coins"></i>
            Currencies
          </button>
        </div>

        <div className="financial-management-content">
          {loading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading financial data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <FinancialOverviewTab stats={financialStats} />
              )}
              {activeTab === 'expenses' && (
                <ExpensesTab expenses={expenses} onRefresh={loadExpenses} />
              )}
              {activeTab === 'reports' && (
                <ReportsTab />
              )}
              {activeTab === 'forecasts' && (
                <ForecastsTab />
              )}
              {activeTab === 'deposits' && (
                <DepositsTab deposits={deposits} onRefresh={loadDeposits} />
              )}
              {activeTab === 'payment-plans' && (
                <PaymentPlansTab paymentPlans={paymentPlans} onRefresh={loadPaymentPlans} />
              )}
              {activeTab === 'currencies' && (
                <CurrenciesTab currencies={currencies} onRefresh={loadCurrencies} />
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

// Overview Tab Component
const FinancialOverviewTab: React.FC<{ stats: any }> = ({ stats }) => {
  if (!stats) return <div>Loading statistics...</div>;

  return (
    <div className="financial-overview-tab">
      <div className="stats-cards">
        <div className="stat-card revenue">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">${stats.totalRevenue.toLocaleString()}</p>
            <span className="stat-period">This Year</span>
          </div>
        </div>

        <div className="stat-card expenses">
          <div className="stat-icon">
            <i className="fas fa-receipt"></i>
          </div>
          <div className="stat-content">
            <h3>Total Expenses</h3>
            <p className="stat-value">${stats.totalExpenses.toLocaleString()}</p>
            <span className="stat-period">This Year</span>
          </div>
        </div>

        <div className="stat-card profit">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>Net Profit</h3>
            <p className="stat-value">${stats.netProfit.toLocaleString()}</p>
            <span className="stat-period">{stats.profitMargin}% Margin</span>
          </div>
        </div>

        <div className="stat-card cash-flow">
          <div className="stat-icon">
            <i className="fas fa-exchange-alt"></i>
          </div>
          <div className="stat-content">
            <h3>Cash Flow</h3>
            <p className="stat-value">${stats.cashFlow.toLocaleString()}</p>
            <span className="stat-period">This Month</span>
          </div>
        </div>
      </div>

      <div className="overview-sections">
        <div className="section">
          <h3>Monthly Averages</h3>
          <div className="average-stats">
            <div className="average-item">
              <span className="label">Revenue</span>
              <span className="value">${stats.averageMonthlyRevenue.toLocaleString()}</span>
            </div>
            <div className="average-item">
              <span className="label">Expenses</span>
              <span className="value">${stats.averageMonthlyExpenses.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Outstanding Items</h3>
          <div className="outstanding-stats">
            <div className="outstanding-item">
              <span className="label">Security Deposits</span>
              <span className="value">${stats.outstandingDeposits.toLocaleString()}</span>
            </div>
            <div className="outstanding-item">
              <span className="label">Payment Plans</span>
              <span className="value">{stats.activePaymentPlans} active (${stats.totalPaymentPlanAmount.toLocaleString()})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Expenses Tab Component
const ExpensesTab: React.FC<{ expenses: Expense[]; onRefresh: (filters?: { category?: string; date?: string }) => void }> = ({ expenses, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState<CreateExpenseRequest>({
    category: '',
    description: '',
    amount: 0,
    currency: 'USD',
    expenseDate: new Date().toISOString().split('T')[0],
    vendor: '',
    receiptNumber: '',
    notes: ''
  });
  const [filterCategory, setFilterCategory] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propertyApi.getAll();
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
    }
  };

  const handleOpenModal = (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        currency: expense.currency || 'USD',
        expenseDate: expense.expenseDate,
        vendor: expense.vendor || '',
        receiptNumber: expense.receiptNumber || '',
        notes: expense.notes || '',
        propertyId: expense.propertyId
      });
    } else {
      setEditingExpense(null);
      setFormData({
        category: '',
        description: '',
        amount: 0,
        currency: 'USD',
        expenseDate: new Date().toISOString().split('T')[0],
        vendor: '',
        receiptNumber: '',
        notes: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExpense(null);
    setFormData({
      category: '',
      description: '',
      amount: 0,
      currency: 'USD',
      expenseDate: new Date().toISOString().split('T')[0],
      vendor: '',
      receiptNumber: '',
      notes: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingExpense?.id) {
        await financialApi.updateExpense(editingExpense.id, formData);
      } else {
        await financialApi.createExpense(formData);
      }
      handleCloseModal();
      onRefresh({ category: filterCategory || undefined, date: filterDate || undefined });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      await financialApi.deleteExpense(id);
      onRefresh({ category: filterCategory || undefined, date: filterDate || undefined });
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete expense');
    }
  };

  const handleFilter = () => {
    onRefresh({ category: filterCategory || undefined, date: filterDate || undefined });
  };

  return (
    <div className="expenses-tab">
      <div className="expenses-header">
        <h3>Expense Management</h3>
        <button 
          className="btn btn-primary add-expense-button"
          onClick={() => handleOpenModal()}
        >
          <span>➕</span> Add Expense
        </button>
      </div>

      <div className="expenses-filters">
        <select 
          className="filter-select form-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Utilities">Utilities</option>
          <option value="Insurance">Insurance</option>
          <option value="Repairs">Repairs</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Legal">Legal</option>
          <option value="Marketing">Marketing</option>
          <option value="Other">Other</option>
        </select>
        <input 
          type="date" 
          className="filter-date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <button 
          className="btn btn-secondary filter-button"
          onClick={handleFilter}
        >
          Filter
        </button>
        {(filterCategory || filterDate) && (
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setFilterCategory('');
              setFilterDate('');
              onRefresh();
            }}
            style={{ marginLeft: '0.5rem' }}
          >
            Clear
          </button>
        )}
      </div>

      <div className="expenses-list">
        {expenses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">📋</span>
              <p>No expenses found</p>
            </div>
          </div>
        ) : (
          expenses.map(expense => (
            <div key={expense.id} className="expense-card">
              <div className="expense-header">
                <h4>{expense.description}</h4>
                <span className="expense-amount">${expense.amount.toLocaleString()}</span>
              </div>
              <div className="expense-details">
                <p><strong>Category:</strong> {expense.category}</p>
                {expense.propertyName && (
                  <p><strong>Property:</strong> {expense.propertyName}</p>
                )}
                {expense.vendor && (
                  <p><strong>Vendor:</strong> {expense.vendor}</p>
                )}
                <p><strong>Date:</strong> {new Date(expense.expenseDate).toLocaleDateString()}</p>
                {expense.receiptNumber && (
                  <p><strong>Receipt:</strong> {expense.receiptNumber}</p>
                )}
              </div>
              {expense.notes && (
                <p className="expense-notes">{expense.notes}</p>
              )}
              <div className="expense-actions">
                <button 
                  className="btn btn-secondary edit-button"
                  onClick={() => handleOpenModal(expense)}
                >
                  Edit
                </button>
                <button 
                  className="btn btn-danger delete-button"
                  onClick={() => handleDelete(expense.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Expense Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingExpense ? 'Edit' : 'Add'} Expense</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Insurance">Insurance</option>
                    <option value="Repairs">Repairs</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Legal">Legal</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description *</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., HVAC Repair"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Currency *</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    required
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="VND">VND (₫)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Expense Date *</label>
                  <input
                    type="date"
                    value={formData.expenseDate}
                    onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Property</label>
                  <select
                    value={formData.propertyId || ''}
                    onChange={(e) => setFormData({ ...formData, propertyId: e.target.value ? parseInt(e.target.value) : undefined })}
                  >
                    <option value="">Select Property (Optional)</option>
                    {properties.map(prop => (
                      <option key={prop.id} value={prop.id}>{prop.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Vendor</label>
                  <input
                    type="text"
                    value={formData.vendor || ''}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    placeholder="e.g., ABC Repair Co"
                  />
                </div>
                <div className="form-group">
                  <label>Receipt Number</label>
                  <input
                    type="text"
                    value={formData.receiptNumber || ''}
                    onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                    placeholder="e.g., RCP-1001"
                  />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    placeholder="Additional notes about this expense"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Reports Tab Component
const ReportsTab: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [reportType, setReportType] = useState<'profit-loss' | 'cash-flow' | 'tax' | null>(null);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0], // Start of year
    endDate: new Date().toISOString().split('T')[0] // Today
  });
  const [taxYear, setTaxYear] = useState(new Date().getFullYear().toString());
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | undefined>(undefined);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propertyApi.getAll();
      setProperties(data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
    }
  };

  const handleGenerateReport = async (type: 'profit-loss' | 'cash-flow' | 'tax') => {
    setReportType(type);
    setShowModal(true);
    setReportData(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setReportType(null);
    setReportData(null);
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      let data;
      
      switch (reportType) {
        case 'profit-loss':
          data = await financialApi.getProfitLossReport(
            dateRange.startDate,
            dateRange.endDate,
            selectedPropertyId
          );
          break;
        case 'cash-flow':
          data = await financialApi.getCashFlowReport(
            dateRange.startDate,
            dateRange.endDate,
            selectedPropertyId
          );
          break;
        case 'tax':
          data = await financialApi.generateTaxReport(
            parseInt(taxYear),
            selectedPropertyId
          );
          break;
      }
      
      setReportData(data);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-tab">
      <div className="section-header">
        <h3>Financial Reports</h3>
      </div>
      
      <div className="reports-grid">
        <div className="report-card">
          <div className="report-icon">📊</div>
          <h4>Profit & Loss Report</h4>
          <p>Comprehensive income and expense analysis</p>
          <button 
            className="btn btn-primary generate-report-button"
            onClick={() => handleGenerateReport('profit-loss')}
          >
            Generate Report
          </button>
        </div>
        <div className="report-card">
          <div className="report-icon">💰</div>
          <h4>Cash Flow Report</h4>
          <p>Track cash inflows and outflows</p>
          <button 
            className="btn btn-primary generate-report-button"
            onClick={() => handleGenerateReport('cash-flow')}
          >
            Generate Report
          </button>
        </div>
        <div className="report-card">
          <div className="report-icon">📋</div>
          <h4>Tax Report</h4>
          <p>Annual tax preparation summary</p>
          <button 
            className="btn btn-primary generate-report-button"
            onClick={() => handleGenerateReport('tax')}
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Generation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2>
                {reportType === 'profit-loss' && 'Profit & Loss Report'}
                {reportType === 'cash-flow' && 'Cash Flow Report'}
                {reportType === 'tax' && 'Tax Report'}
              </h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            {!reportData ? (
              <form onSubmit={(e) => { e.preventDefault(); handleGenerate(); }}>
                <div className="modal-body">
                  {reportType === 'tax' ? (
                    <>
                      <div className="form-group">
                        <label>Tax Year *</label>
                        <input
                          type="number"
                          value={taxYear}
                          onChange={(e) => setTaxYear(e.target.value)}
                          min="2020"
                          max={new Date().getFullYear() + 1}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group">
                        <label>Start Date *</label>
                        <input
                          type="date"
                          value={dateRange.startDate}
                          onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>End Date *</label>
                        <input
                          type="date"
                          value={dateRange.endDate}
                          onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                          required
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="form-group">
                    <label>Property (Optional)</label>
                    <select
                      value={selectedPropertyId || ''}
                      onChange={(e) => setSelectedPropertyId(e.target.value ? parseInt(e.target.value) : undefined)}
                    >
                      <option value="">All Properties</option>
                      {properties.map(prop => (
                        <option key={prop.id} value={prop.id}>{prop.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="modal-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? 'Generating...' : 'Generate Report'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="modal-body">
                <div className="report-actions" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      const printWindow = window.open('', '_blank');
                      if (printWindow) {
                        printWindow.document.write(`
                          <html>
                            <head><title>${reportType === 'profit-loss' ? 'Profit & Loss' : reportType === 'cash-flow' ? 'Cash Flow' : 'Tax'} Report</title></head>
                            <body>
                              <h1>${reportType === 'profit-loss' ? 'Profit & Loss' : reportType === 'cash-flow' ? 'Cash Flow' : 'Tax'} Report</h1>
                              <pre>${JSON.stringify(reportData, null, 2)}</pre>
                            </body>
                          </html>
                        `);
                        printWindow.document.close();
                        printWindow.print();
                      }
                    }}
                  >
                    📄 Print
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      const dataStr = JSON.stringify(reportData, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${reportType}-report-${new Date().toISOString().split('T')[0]}.json`;
                      link.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    💾 Export JSON
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setReportData(null);
                    }}
                  >
                    🔄 Generate New
                  </button>
                </div>

                <div className="report-content">
                  {reportType === 'profit-loss' && (
                    <ProfitLossReportView data={reportData} />
                  )}
                  {reportType === 'cash-flow' && (
                    <CashFlowReportView data={reportData} />
                  )}
                  {reportType === 'tax' && (
                    <TaxReportView data={reportData} />
                  )}
                </div>

                <div className="modal-actions" style={{ marginTop: '1rem' }}>
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Profit & Loss Report View Component
const ProfitLossReportView: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return <div>No data available</div>;

  return (
    <div className="report-view">
      <div className="report-summary">
        <div className="summary-card revenue">
          <h4>Total Revenue</h4>
          <p className="amount">${(data.totalRevenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="summary-card expenses">
          <h4>Total Expenses</h4>
          <p className="amount">${(data.totalExpenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="summary-card profit">
          <h4>Net Profit</h4>
          <p className="amount">${(data.netProfit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="summary-card margin">
          <h4>Profit Margin</h4>
          <p className="amount">{(data.profitMargin || 0).toFixed(2)}%</p>
        </div>
      </div>

      {data.revenueByCategory && Object.keys(data.revenueByCategory).length > 0 && (
        <div className="report-section">
          <h4>Revenue by Category</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.revenueByCategory).map(([category, amount]: [string, any]) => (
                <tr key={category}>
                  <td>{category}</td>
                  <td>${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.expensesByCategory && Object.keys(data.expensesByCategory).length > 0 && (
        <div className="report-section">
          <h4>Expenses by Category</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.expensesByCategory).map(([category, amount]: [string, any]) => (
                <tr key={category}>
                  <td>{category}</td>
                  <td>${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.monthlyData && data.monthlyData.length > 0 && (
        <div className="report-section">
          <h4>Monthly Breakdown</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Profit</th>
              </tr>
            </thead>
            <tbody>
              {data.monthlyData.map((month: any, index: number) => (
                <tr key={index}>
                  <td>{month.month || `Month ${index + 1}`}</td>
                  <td>${(month.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>${(month.expenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>${(month.profit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Cash Flow Report View Component
const CashFlowReportView: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return <div>No data available</div>;

  return (
    <div className="report-view">
      <div className="report-summary">
        <div className="summary-card inflow">
          <h4>Total Inflow</h4>
          <p className="amount">${(data.totalInflow || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="summary-card outflow">
          <h4>Total Outflow</h4>
          <p className="amount">${(data.totalOutflow || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="summary-card net">
          <h4>Net Cash Flow</h4>
          <p className="amount">${(data.netCashFlow || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="summary-card balance">
          <h4>Ending Balance</h4>
          <p className="amount">${(data.endingBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {data.inflows && data.inflows.length > 0 && (
        <div className="report-section">
          <h4>Cash Inflows</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.inflows.map((inflow: any, index: number) => (
                <tr key={index}>
                  <td>{inflow.source || 'N/A'}</td>
                  <td>${(inflow.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>{inflow.date ? new Date(inflow.date).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.outflows && data.outflows.length > 0 && (
        <div className="report-section">
          <h4>Cash Outflows</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.outflows.map((outflow: any, index: number) => (
                <tr key={index}>
                  <td>{outflow.category || 'N/A'}</td>
                  <td>${(outflow.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>{outflow.date ? new Date(outflow.date).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.monthlyCashFlow && data.monthlyCashFlow.length > 0 && (
        <div className="report-section">
          <h4>Monthly Cash Flow</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Inflow</th>
                <th>Outflow</th>
                <th>Net Flow</th>
              </tr>
            </thead>
            <tbody>
              {data.monthlyCashFlow.map((month: any, index: number) => (
                <tr key={index}>
                  <td>{month.month || `Month ${index + 1}`}</td>
                  <td>${(month.inflow || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>${(month.outflow || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>${(month.netFlow || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Tax Report View Component
const TaxReportView: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return <div>No data available</div>;

  return (
    <div className="report-view">
      <div className="report-summary">
        <div className="summary-card taxable">
          <h4>Taxable Income</h4>
          <p className="amount">${(data.taxableIncome || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="summary-card deductions">
          <h4>Total Deductions</h4>
          <p className="amount">${(data.totalDeductions || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="summary-card tax">
          <h4>Tax Owed</h4>
          <p className="amount">${(data.taxOwed || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="summary-card rate">
          <h4>Effective Tax Rate</h4>
          <p className="amount">{(data.effectiveTaxRate || 0).toFixed(2)}%</p>
        </div>
      </div>

      {data.incomeBreakdown && Object.keys(data.incomeBreakdown).length > 0 && (
        <div className="report-section">
          <h4>Income Breakdown</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Source</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.incomeBreakdown).map(([source, amount]: [string, any]) => (
                <tr key={source}>
                  <td>{source}</td>
                  <td>${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.deductions && data.deductions.length > 0 && (
        <div className="report-section">
          <h4>Deductions</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.deductions.map((deduction: any, index: number) => (
                <tr key={index}>
                  <td>{deduction.category || 'N/A'}</td>
                  <td>{deduction.description || 'N/A'}</td>
                  <td>${(deduction.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data.quarterlyData && data.quarterlyData.length > 0 && (
        <div className="report-section">
          <h4>Quarterly Breakdown</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Quarter</th>
                <th>Income</th>
                <th>Expenses</th>
                <th>Taxable</th>
              </tr>
            </thead>
            <tbody>
              {data.quarterlyData.map((quarter: any, index: number) => (
                <tr key={index}>
                  <td>Q{quarter.quarter || index + 1}</td>
                  <td>${(quarter.income || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>${(quarter.expenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>${(quarter.taxable || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Forecasts Tab Component
const ForecastsTab: React.FC = () => {
  const [months, setMonths] = useState(12);
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateForecast = async () => {
    try {
      setLoading(true);
      const data = await financialApi.generateForecast(months);
      setForecastData(data || []);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate forecast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forecasts-tab">
      <div className="section-header">
        <h3>Financial Forecasts</h3>
        <p>Predictive financial analysis and projections</p>
      </div>
      <div className="forecast-controls">
        <select 
          className="form-select forecast-period"
          value={months}
          onChange={(e) => setMonths(parseInt(e.target.value))}
        >
          <option value="6">6 Months</option>
          <option value="12">12 Months</option>
          <option value="24">24 Months</option>
        </select>
        <button 
          className="btn btn-primary generate-forecast-button"
          onClick={handleGenerateForecast}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Forecast'}
        </button>
      </div>

      {forecastData.length > 0 && (
        <div className="forecast-results" style={{ marginTop: '2rem' }}>
          <h4>Forecast Results</h4>
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Projected Revenue</th>
                <th>Projected Expenses</th>
                <th>Projected Profit</th>
              </tr>
            </thead>
            <tbody>
              {forecastData.map((forecast, index) => (
                <tr key={index}>
                  <td>{forecast.month || `Month ${index + 1}`}</td>
                  <td>${(forecast.revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>${(forecast.expenses || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td>${(forecast.profit || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Deposits Tab Component
const DepositsTab: React.FC<{ deposits: Deposit[]; onRefresh: () => void }> = ({ deposits, onRefresh }) => {
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
  const [refundData, setRefundData] = useState<RefundDepositRequest>({
    refundAmount: 0,
    deductions: [],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [newDeduction, setNewDeduction] = useState({ description: '', amount: 0, category: '' });

  const handleOpenRefundModal = (deposit: Deposit) => {
    setSelectedDeposit(deposit);
    setRefundData({
      refundAmount: deposit.amount,
      deductions: [],
      notes: ''
    });
    setShowRefundModal(true);
  };

  const handleCloseRefundModal = () => {
    setShowRefundModal(false);
    setSelectedDeposit(null);
    setRefundData({
      refundAmount: 0,
      deductions: [],
      notes: ''
    });
    setNewDeduction({ description: '', amount: 0, category: '' });
  };

  const handleAddDeduction = () => {
    if (newDeduction.description && newDeduction.amount > 0) {
      const deduction = { description: newDeduction.description, amount: newDeduction.amount, category: newDeduction.category };
      setRefundData({
        ...refundData,
        deductions: [...refundData.deductions, deduction],
        refundAmount: selectedDeposit ? selectedDeposit.amount - [...refundData.deductions, deduction].reduce((sum, d) => sum + d.amount, 0) : 0
      });
      setNewDeduction({ description: '', amount: 0, category: '' });
    }
  };

  const handleRemoveDeduction = (index: number) => {
    const updated = refundData.deductions.filter((_, i) => i !== index);
    setRefundData({
      ...refundData,
      deductions: updated,
      refundAmount: selectedDeposit ? selectedDeposit.amount - updated.reduce((sum, d) => sum + d.amount, 0) : 0
    });
  };

  const handleProcessRefund = async () => {
    if (!selectedDeposit) return;
    try {
      setLoading(true);
      await financialApi.refundDeposit(selectedDeposit.id, refundData);
      handleCloseRefundModal();
      onRefresh();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to process refund');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deposits-tab">
      <div className="deposits-header">
        <h3>Security Deposits</h3>
        <div className="deposits-summary">
          <span>Total Held: ${deposits.filter(d => d.status === 'HELD').reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</span>
        </div>
      </div>

      <div className="deposits-list">
        {deposits.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">💰</span>
              <p>No deposits found</p>
            </div>
          </div>
        ) : (
          deposits.map(deposit => (
            <div key={deposit.id} className="deposit-card">
              <div className="deposit-header">
                <h4>{deposit.tenantName}</h4>
                <div className={`status-badge ${deposit.status.toLowerCase()}`}>
                  {deposit.status}
                </div>
              </div>
              <div className="deposit-details">
                <p><strong>Contract:</strong> {deposit.contractCode}</p>
                <p><strong>Amount:</strong> ${deposit.amount.toLocaleString()}</p>
                <p><strong>Date:</strong> {new Date(deposit.depositDate).toLocaleDateString()}</p>
                {deposit.refundDate && (
                  <p><strong>Refunded:</strong> {new Date(deposit.refundDate).toLocaleDateString()}</p>
                )}
                {deposit.refundAmount && (
                  <p><strong>Refund Amount:</strong> ${deposit.refundAmount.toLocaleString()}</p>
                )}
              </div>
              {deposit.deductions && deposit.deductions.length > 0 && (
                <div className="deposit-deductions">
                  <h5>Deductions:</h5>
                  {deposit.deductions.map(deduction => (
                    <div key={deduction.id} className="deduction-item">
                      <span>{deduction.description}</span>
                      <span>${deduction.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="deposit-actions">
                {deposit.status === 'HELD' && (
                  <button 
                    className="btn btn-success refund-button"
                    onClick={() => handleOpenRefundModal(deposit)}
                  >
                    Process Refund
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Process Refund Modal */}
      {showRefundModal && selectedDeposit && (
        <div className="modal-overlay" onClick={handleCloseRefundModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Process Refund - {selectedDeposit.tenantName}</h2>
              <button className="modal-close" onClick={handleCloseRefundModal}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Original Deposit Amount</label>
                <input type="text" value={`$${selectedDeposit.amount.toLocaleString()}`} disabled />
              </div>
              
              <div className="form-group">
                <label>Deductions</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Description"
                    value={newDeduction.description}
                    onChange={(e) => setNewDeduction({ ...newDeduction, description: e.target.value })}
                    style={{ flex: 2 }}
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    step="0.01"
                    min="0"
                    value={newDeduction.amount}
                    onChange={(e) => setNewDeduction({ ...newDeduction, amount: parseFloat(e.target.value) || 0 })}
                    style={{ flex: 1 }}
                  />
                  <input
                    type="text"
                    placeholder="Category"
                    value={newDeduction.category}
                    onChange={(e) => setNewDeduction({ ...newDeduction, category: e.target.value })}
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="btn btn-secondary" onClick={handleAddDeduction}>
                    Add
                  </button>
                </div>
                {refundData.deductions.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    {refundData.deductions.map((deduction, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--background-color)', marginBottom: '0.5rem', borderRadius: '4px' }}>
                        <span>{deduction.description} - ${deduction.amount.toLocaleString()}</span>
                        <button type="button" className="btn btn-danger" onClick={() => handleRemoveDeduction(index)} style={{ padding: '0.25rem 0.5rem' }}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Refund Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={refundData.refundAmount}
                  onChange={(e) => setRefundData({ ...refundData, refundAmount: parseFloat(e.target.value) || 0 })}
                  required
                />
                <small>Calculated: ${selectedDeposit.amount} - ${refundData.deductions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()} = ${(selectedDeposit.amount - refundData.deductions.reduce((sum, d) => sum + d.amount, 0)).toLocaleString()}</small>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={refundData.notes || ''}
                  onChange={(e) => setRefundData({ ...refundData, notes: e.target.value })}
                  rows={3}
                  placeholder="Additional notes about the refund"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-primary" onClick={handleProcessRefund} disabled={loading}>
                {loading ? 'Processing...' : 'Process Refund'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleCloseRefundModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Payment Plans Tab Component
const PaymentPlansTab: React.FC<{ paymentPlans: PaymentPlan[]; onRefresh: () => void }> = ({ paymentPlans, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PaymentPlan | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [formData, setFormData] = useState<CreatePaymentPlanRequest>({
    invoiceId: 0,
    installments: 4,
    frequency: 'MONTHLY',
    startDate: new Date().toISOString().split('T')[0]
  });
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const data = await invoiceApi.getAll('PENDING');
      setInvoices(data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setInvoices([]);
    }
  };

  const handleOpenModal = (plan?: PaymentPlan) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        invoiceId: plan.invoiceId,
        installments: plan.installments,
        frequency: plan.frequency,
        startDate: plan.startDate
      });
    } else {
      setEditingPlan(null);
      setFormData({
        invoiceId: 0,
        installments: 4,
        frequency: 'MONTHLY',
        startDate: new Date().toISOString().split('T')[0]
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPlan(null);
    setFormData({
      invoiceId: 0,
      installments: 4,
      frequency: 'MONTHLY',
      startDate: new Date().toISOString().split('T')[0]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingPlan?.id) {
        await financialApi.updatePaymentPlan(editingPlan.id, formData);
      } else {
        await financialApi.createPaymentPlan(formData);
      }
      handleCloseModal();
      onRefresh();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save payment plan');
    } finally {
      setLoading(false);
    }
  };

  const handleViewSchedule = (plan: PaymentPlan) => {
    setSelectedPlan(plan);
    setShowScheduleModal(true);
  };

  const handleCloseScheduleModal = () => {
    setShowScheduleModal(false);
    setSelectedPlan(null);
  };

  return (
    <div className="payment-plans-tab">
      <div className="payment-plans-header">
        <h3>Payment Plans</h3>
        <button 
          className="btn btn-primary create-plan-button"
          onClick={() => handleOpenModal()}
        >
          <span>➕</span> Create Plan
        </button>
      </div>

      <div className="payment-plans-list">
        {paymentPlans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">📅</span>
              <p>No payment plans found</p>
            </div>
          </div>
        ) : (
          paymentPlans.map(plan => (
            <div key={plan.id} className="payment-plan-card">
              <div className="plan-header">
                <h4>{plan.tenantName}</h4>
                <div className={`status-badge ${plan.status.toLowerCase()}`}>
                  {plan.status}
                </div>
              </div>
              <div className="plan-details">
                <p><strong>Invoice:</strong> {plan.invoiceNumber}</p>
                <p><strong>Total Amount:</strong> ${plan.totalAmount.toLocaleString()}</p>
                <p><strong>Installments:</strong> {plan.installments} × ${plan.installmentAmount.toLocaleString()}</p>
                <p><strong>Frequency:</strong> {plan.frequency}</p>
                <p><strong>Progress:</strong> {plan.paidInstallments}/{plan.installments} paid</p>
                <p><strong>Remaining:</strong> ${plan.remainingAmount.toLocaleString()}</p>
              </div>
              <div className="plan-actions">
                <button 
                  className="btn btn-secondary view-schedule-button"
                  onClick={() => handleViewSchedule(plan)}
                >
                  View Schedule
                </button>
                <button 
                  className="btn btn-secondary edit-plan-button"
                  onClick={() => handleOpenModal(plan)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Payment Plan Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingPlan ? 'Edit' : 'Create'} Payment Plan</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Invoice *</label>
                  <select
                    value={formData.invoiceId}
                    onChange={(e) => setFormData({ ...formData, invoiceId: parseInt(e.target.value) })}
                    required
                    disabled={!!editingPlan}
                  >
                    <option value="0">Select Invoice</option>
                    {invoices.map(inv => (
                      <option key={inv.id} value={inv.id}>
                        INV-{inv.id} - ${inv.totalAmount?.toLocaleString() || 0} - {inv.tenantName || 'Unknown'}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Installments *</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    value={formData.installments}
                    onChange={(e) => setFormData({ ...formData, installments: parseInt(e.target.value) || 1 })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Frequency *</label>
                  <select
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                    required
                  >
                    <option value="WEEKLY">Weekly</option>
                    <option value="BIWEEKLY">Biweekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Schedule Modal */}
      {showScheduleModal && selectedPlan && (
        <div className="modal-overlay" onClick={handleCloseScheduleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Payment Schedule - {selectedPlan.tenantName}</h2>
              <button className="modal-close" onClick={handleCloseScheduleModal}>✕</button>
            </div>
            <div className="modal-body">
              {selectedPlan.schedule && selectedPlan.schedule.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Due Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      {selectedPlan.schedule.some(s => s.paidDate) && <th>Paid Date</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPlan.schedule.map(installment => (
                      <tr key={installment.id}>
                        <td>{installment.installmentNumber}</td>
                        <td>{new Date(installment.dueDate).toLocaleDateString()}</td>
                        <td>${installment.amount.toLocaleString()}</td>
                        <td>
                          <span className={`status-badge ${installment.status.toLowerCase()}`}>
                            {installment.status}
                          </span>
                        </td>
                        {selectedPlan.schedule?.some(s => s.paidDate) && (
                          <td>{installment.paidDate ? new Date(installment.paidDate).toLocaleDateString() : '-'}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No schedule available</p>
              )}
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCloseScheduleModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Currencies Tab Component
const CurrenciesTab: React.FC<{ currencies: Currency[]; onRefresh: () => void }> = ({ currencies, onRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [formData, setFormData] = useState<Partial<Currency>>({
    code: '',
    name: '',
    symbol: '',
    exchangeRate: 1.0,
    active: true,
    isDefault: false
  });
  const [loading, setLoading] = useState(false);

  const handleOpenModal = (currency?: Currency) => {
    if (currency) {
      setEditingCurrency(currency);
      setFormData({
        code: currency.code,
        name: currency.name,
        symbol: currency.symbol,
        exchangeRate: currency.exchangeRate,
        active: currency.active,
        isDefault: currency.isDefault
      });
    } else {
      setEditingCurrency(null);
      setFormData({
        code: '',
        name: '',
        symbol: '',
        exchangeRate: 1.0,
        active: true,
        isDefault: false
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCurrency(null);
    setFormData({
      code: '',
      name: '',
      symbol: '',
      exchangeRate: 1.0,
      active: true,
      isDefault: false
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingCurrency?.id) {
        await financialApi.updateCurrency(editingCurrency.id, formData);
      } else {
        await financialApi.createCurrency(formData as Omit<Currency, 'id'>);
      }
      handleCloseModal();
      onRefresh();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save currency');
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await financialApi.setDefaultCurrency(id);
      onRefresh();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to set default currency');
    }
  };

  return (
    <div className="currencies-tab">
      <div className="currencies-header">
        <h3>Currency Management</h3>
        <button 
          className="btn btn-primary add-currency-button"
          onClick={() => handleOpenModal()}
        >
          <span>➕</span> Add Currency
        </button>
      </div>

      <div className="currencies-list">
        {currencies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">💱</span>
              <p>No currencies found</p>
            </div>
          </div>
        ) : (
          currencies.map(currency => (
            <div key={currency.id} className="currency-card">
              <div className="currency-header">
                <h4>{currency.name} ({currency.code})</h4>
                <span className="currency-symbol">{currency.symbol}</span>
              </div>
              <div className="currency-details">
                <p><strong>Exchange Rate:</strong> {currency.exchangeRate}</p>
                <p><strong>Status:</strong> {currency.active ? 'Active' : 'Inactive'}</p>
                {currency.isDefault && (
                  <span className="default-badge">Default</span>
                )}
              </div>
              <div className="currency-actions">
                <button 
                  className="btn btn-secondary edit-currency-button"
                  onClick={() => handleOpenModal(currency)}
                >
                  Edit
                </button>
                {!currency.isDefault && (
                  <button 
                    className="btn btn-success set-default-button"
                    onClick={() => handleSetDefault(currency.id)}
                  >
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Currency Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCurrency ? 'Edit' : 'Add'} Currency</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Code *</label>
                  <input
                    type="text"
                    value={formData.code || ''}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., USD"
                    maxLength={3}
                    required
                    disabled={!!editingCurrency}
                  />
                </div>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., US Dollar"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Symbol *</label>
                  <input
                    type="text"
                    value={formData.symbol || ''}
                    onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                    placeholder="e.g., $"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Exchange Rate *</label>
                  <input
                    type="number"
                    step="0.0001"
                    min="0"
                    value={formData.exchangeRate || 1.0}
                    onChange={(e) => setFormData({ ...formData, exchangeRate: parseFloat(e.target.value) || 1.0 })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.active ?? true}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                    Active
                  </label>
                </div>
                {!editingCurrency && (
                  <div className="form-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={formData.isDefault ?? false}
                        onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                      />
                      Set as Default
                    </label>
                  </div>
                )}
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};