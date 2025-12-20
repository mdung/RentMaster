import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import {
  Expense,
  Currency,
  Deposit,
  PaymentPlan,
  ProfitLossReport,
  FinancialForecast,
  TaxReport
} from '../types';
import './FinancialManagementPage.css';

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

  const loadExpenses = async () => {
    // Mock data - replace with actual API call
    const mockExpenses: Expense[] = [
      {
        id: 1,
        propertyId: 1,
        propertyName: 'Sunset Apartments',
        category: 'Maintenance',
        description: 'HVAC Repair',
        amount: 850.0,
        currency: 'USD',
        expenseDate: '2024-11-15',
        vendor: 'ABC Repair Co',
        receiptNumber: 'RCP-1001',
        notes: 'Emergency repair for unit A101',
        createdAt: '2024-11-15T10:30:00'
      },
      {
        id: 2,
        propertyId: 1,
        propertyName: 'Sunset Apartments',
        category: 'Utilities',
        description: 'Electricity Bill',
        amount: 320.0,
        currency: 'USD',
        expenseDate: '2024-11-10',
        vendor: 'City Electric',
        receiptNumber: 'RCP-1002',
        notes: 'Monthly electricity bill',
        createdAt: '2024-11-10T14:20:00'
      }
    ];
    setExpenses(mockExpenses);
  };

  const loadDeposits = async () => {
    // Mock data - replace with actual API call
    const mockDeposits: Deposit[] = [
      {
        id: 1,
        contractId: 1,
        contractCode: 'CON-2024-001',
        tenantName: 'John Doe',
        amount: 1200.0,
        currency: 'USD',
        depositDate: '2024-01-01',
        status: 'HELD',
        notes: 'Security deposit for lease agreement'
      },
      {
        id: 2,
        contractId: 2,
        contractCode: 'CON-2024-002',
        tenantName: 'Jane Smith',
        amount: 1500.0,
        currency: 'USD',
        depositDate: '2024-02-01',
        status: 'REFUNDED',
        refundDate: '2024-11-01',
        refundAmount: 1400.0,
        deductions: [
          {
            id: 1,
            description: 'Carpet cleaning',
            amount: 100.0,
            category: 'Cleaning'
          }
        ],
        notes: 'Deposit refunded after lease termination'
      }
    ];
    setDeposits(mockDeposits);
  };

  const loadPaymentPlans = async () => {
    // Mock data - replace with actual API call
    const mockPaymentPlans: PaymentPlan[] = [
      {
        id: 1,
        invoiceId: 1,
        invoiceNumber: 'INV-2024-001',
        tenantName: 'John Doe',
        totalAmount: 1200.0,
        installments: 4,
        installmentAmount: 300.0,
        frequency: 'MONTHLY',
        startDate: '2024-11-01',
        status: 'ACTIVE',
        paidInstallments: 1,
        remainingAmount: 900.0,
        schedule: [
          {
            id: 1,
            installmentNumber: 1,
            dueDate: '2024-11-01',
            amount: 300.0,
            status: 'PAID',
            paidDate: '2024-11-01',
            paidAmount: 300.0
          },
          {
            id: 2,
            installmentNumber: 2,
            dueDate: '2024-12-01',
            amount: 300.0,
            status: 'PENDING'
          }
        ]
      }
    ];
    setPaymentPlans(mockPaymentPlans);
  };

  const loadCurrencies = async () => {
    // Mock data - replace with actual API call
    const mockCurrencies: Currency[] = [
      {
        id: 1,
        code: 'USD',
        name: 'US Dollar',
        symbol: '$',
        exchangeRate: 1.0,
        isDefault: true,
        active: true
      },
      {
        id: 2,
        code: 'EUR',
        name: 'Euro',
        symbol: '€',
        exchangeRate: 0.85,
        isDefault: false,
        active: true
      }
    ];
    setCurrencies(mockCurrencies);
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
const ExpensesTab: React.FC<{ expenses: Expense[]; onRefresh: () => void }> = ({ expenses, onRefresh }) => {
  return (
    <div className="expenses-tab">
      <div className="expenses-header">
        <h3>Expense Management</h3>
        <button className="add-expense-button">
          <i className="fas fa-plus"></i>
          Add Expense
        </button>
      </div>

      <div className="expenses-filters">
        <select className="filter-select">
          <option value="">All Categories</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Utilities">Utilities</option>
          <option value="Insurance">Insurance</option>
        </select>
        <input type="date" className="filter-date" />
        <button className="filter-button">Filter</button>
      </div>

      <div className="expenses-list">
        {expenses.map(expense => (
          <div key={expense.id} className="expense-card">
            <div className="expense-header">
              <h4>{expense.description}</h4>
              <span className="expense-amount">${expense.amount.toLocaleString()}</span>
            </div>
            <div className="expense-details">
              <p><strong>Category:</strong> {expense.category}</p>
              <p><strong>Property:</strong> {expense.propertyName}</p>
              <p><strong>Vendor:</strong> {expense.vendor}</p>
              <p><strong>Date:</strong> {new Date(expense.expenseDate).toLocaleDateString()}</p>
              {expense.receiptNumber && (
                <p><strong>Receipt:</strong> {expense.receiptNumber}</p>
              )}
            </div>
            {expense.notes && (
              <p className="expense-notes">{expense.notes}</p>
            )}
            <div className="expense-actions">
              <button className="edit-button">Edit</button>
              <button className="delete-button">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Reports Tab Component
const ReportsTab: React.FC = () => {
  return (
    <div className="reports-tab">
      <h3>Financial Reports</h3>
      <div className="reports-grid">
        <div className="report-card">
          <h4>Profit & Loss Report</h4>
          <p>Comprehensive income and expense analysis</p>
          <button className="generate-report-button">Generate Report</button>
        </div>
        <div className="report-card">
          <h4>Cash Flow Report</h4>
          <p>Track cash inflows and outflows</p>
          <button className="generate-report-button">Generate Report</button>
        </div>
        <div className="report-card">
          <h4>Tax Report</h4>
          <p>Annual tax preparation summary</p>
          <button className="generate-report-button">Generate Report</button>
        </div>
      </div>
    </div>
  );
};

// Forecasts Tab Component
const ForecastsTab: React.FC = () => {
  return (
    <div className="forecasts-tab">
      <h3>Financial Forecasts</h3>
      <p>Predictive financial analysis and projections</p>
      <div className="forecast-controls">
        <select className="forecast-period">
          <option value="6">6 Months</option>
          <option value="12">12 Months</option>
          <option value="24">24 Months</option>
        </select>
        <button className="generate-forecast-button">Generate Forecast</button>
      </div>
    </div>
  );
};

// Deposits Tab Component
const DepositsTab: React.FC<{ deposits: Deposit[]; onRefresh: () => void }> = ({ deposits, onRefresh }) => {
  return (
    <div className="deposits-tab">
      <div className="deposits-header">
        <h3>Security Deposits</h3>
        <div className="deposits-summary">
          <span>Total Held: ${deposits.filter(d => d.status === 'HELD').reduce((sum, d) => sum + d.amount, 0).toLocaleString()}</span>
        </div>
      </div>

      <div className="deposits-list">
        {deposits.map(deposit => (
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
                <button className="refund-button">Process Refund</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Payment Plans Tab Component
const PaymentPlansTab: React.FC<{ paymentPlans: PaymentPlan[]; onRefresh: () => void }> = ({ paymentPlans, onRefresh }) => {
  return (
    <div className="payment-plans-tab">
      <div className="payment-plans-header">
        <h3>Payment Plans</h3>
        <button className="create-plan-button">
          <i className="fas fa-plus"></i>
          Create Plan
        </button>
      </div>

      <div className="payment-plans-list">
        {paymentPlans.map(plan => (
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
              <button className="view-schedule-button">View Schedule</button>
              <button className="edit-plan-button">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Currencies Tab Component
const CurrenciesTab: React.FC<{ currencies: Currency[]; onRefresh: () => void }> = ({ currencies, onRefresh }) => {
  return (
    <div className="currencies-tab">
      <div className="currencies-header">
        <h3>Currency Management</h3>
        <button className="add-currency-button">
          <i className="fas fa-plus"></i>
          Add Currency
        </button>
      </div>

      <div className="currencies-list">
        {currencies.map(currency => (
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
              <button className="edit-currency-button">Edit</button>
              {!currency.isDefault && (
                <button className="set-default-button">Set Default</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};