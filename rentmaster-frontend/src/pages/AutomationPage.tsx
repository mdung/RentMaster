import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import {
  RecurringInvoice,
  ContractRenewalReminder,
  ScheduledReport,
  AutomationRule,
  AutomationExecution
} from '../types';
import './AutomationPage.css';

export const AutomationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'recurring-invoices' | 'contract-renewals' | 'scheduled-reports' | 'automation-rules' | 'executions'>('overview');
  const [loading, setLoading] = useState(false);
  
  // State for different automation types
  const [recurringInvoices, setRecurringInvoices] = useState<RecurringInvoice[]>([]);
  const [contractRenewals, setContractRenewals] = useState<ContractRenewalReminder[]>([]);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([]);
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [automationStats, setAutomationStats] = useState<any>(null);

  useEffect(() => {
    loadAutomationData();
  }, [activeTab]);

  const loadAutomationData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'overview':
          await loadAutomationStats();
          break;
        case 'recurring-invoices':
          await loadRecurringInvoices();
          break;
        case 'contract-renewals':
          await loadContractRenewals();
          break;
        case 'scheduled-reports':
          await loadScheduledReports();
          break;
        case 'automation-rules':
          await loadAutomationRules();
          break;
        case 'executions':
          await loadExecutions();
          break;
      }
    } catch (error) {
      console.error('Error loading automation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAutomationStats = async () => {
    // Mock stats - replace with actual API call
    setAutomationStats({
      totalRules: 12,
      activeRules: 9,
      executionsToday: 24,
      successRate: 96.8,
      recurringInvoices: 8,
      scheduledReports: 5,
      contractReminders: 15,
      avgExecutionTime: 2.3
    });
  };

  const loadRecurringInvoices = async () => {
    // Mock data - replace with actual API call
    const mockInvoices: RecurringInvoice[] = [
      {
        id: 1,
        contractId: 1,
        contractCode: 'CON-2024-001',
        tenantName: 'John Doe',
        roomCode: 'A101',
        frequency: 'MONTHLY',
        nextGenerationDate: '2024-12-01',
        lastGeneratedDate: '2024-11-01',
        active: true,
        autoSend: true,
        template: {
          includeRent: true,
          includeServices: false,
          serviceIds: [],
          customItems: [],
          daysUntilDue: 30,
          notes: 'Monthly rent invoice'
        },
        createdAt: '2024-01-01T00:00:00'
      },
      {
        id: 2,
        contractId: 2,
        contractCode: 'CON-2024-002',
        tenantName: 'Jane Smith',
        roomCode: 'B205',
        frequency: 'MONTHLY',
        nextGenerationDate: '2024-12-01',
        lastGeneratedDate: '2024-11-01',
        active: true,
        autoSend: false,
        template: {
          includeRent: true,
          includeServices: true,
          serviceIds: [1, 2],
          customItems: [],
          daysUntilDue: 30
        },
        createdAt: '2024-02-01T00:00:00'
      }
    ];
    setRecurringInvoices(mockInvoices);
  };

  const loadContractRenewals = async () => {
    // Mock data - replace with actual API call
    const mockRenewals: ContractRenewalReminder[] = [
      {
        id: 1,
        contractId: 1,
        contractCode: 'CON-2024-001',
        tenantName: 'John Doe',
        contractEndDate: '2024-12-31',
        reminderDate: '2024-12-01',
        daysBefore: 30,
        reminderType: 'EMAIL',
        sent: false,
        autoRenewal: false,
        active: true,
        createdAt: '2024-01-01T00:00:00'
      },
      {
        id: 2,
        contractId: 3,
        contractCode: 'CON-2024-003',
        tenantName: 'Bob Johnson',
        contractEndDate: '2025-01-15',
        reminderDate: '2024-12-16',
        daysBefore: 30,
        reminderType: 'ALL',
        sent: false,
        autoRenewal: true,
        renewalTerms: {
          extensionMonths: 12,
          newRentAmount: 1400,
          rentIncrease: 100,
          rentIncreaseType: 'FIXED',
          requireTenantApproval: true,
          approvalDeadlineDays: 15
        },
        active: true,
        createdAt: '2024-03-01T00:00:00'
      }
    ];
    setContractRenewals(mockRenewals);
  };

  const loadScheduledReports = async () => {
    // Mock data - replace with actual API call
    const mockReports: ScheduledReport[] = [
      {
        id: 1,
        name: 'Monthly Revenue Report',
        reportType: 'REVENUE',
        frequency: 'MONTHLY',
        dayOfMonth: 1,
        time: '09:00',
        recipients: ['admin@rentmaster.com', 'manager@rentmaster.com'],
        format: 'PDF',
        filters: { propertyId: null },
        nextRunDate: '2024-12-01',
        lastRunDate: '2024-11-01',
        active: true,
        createdAt: '2024-01-01T00:00:00'
      },
      {
        id: 2,
        name: 'Weekly Occupancy Summary',
        reportType: 'OCCUPANCY',
        frequency: 'WEEKLY',
        dayOfWeek: 1,
        time: '08:00',
        recipients: ['operations@rentmaster.com'],
        format: 'EXCEL',
        filters: {},
        nextRunDate: '2024-11-25',
        lastRunDate: '2024-11-18',
        active: true,
        createdAt: '2024-01-15T00:00:00'
      }
    ];
    setScheduledReports(mockReports);
  };

  const loadAutomationRules = async () => {
    // Mock data - replace with actual API call
    const mockRules: AutomationRule[] = [
      {
        id: 1,
        name: 'Overdue Payment Reminder',
        description: 'Send reminder when payment is 3 days overdue',
        triggerType: 'INVOICE_OVERDUE',
        triggerConditions: { daysOverdue: 3 },
        actions: [
          {
            type: 'SEND_EMAIL',
            parameters: { templateId: 1, recipientType: 'TENANT' },
            order: 1
          }
        ],
        active: true,
        lastExecuted: '2024-11-20T10:30:00',
        executionCount: 45,
        createdAt: '2024-01-01T00:00:00'
      },
      {
        id: 2,
        name: 'Contract Expiry Notification',
        description: 'Notify when contract expires in 30 days',
        triggerType: 'CONTRACT_EXPIRING',
        triggerConditions: { daysBefore: 30 },
        actions: [
          {
            type: 'SEND_EMAIL',
            parameters: { templateId: 2, recipientType: 'TENANT' },
            order: 1
          },
          {
            type: 'CREATE_NOTIFICATION',
            parameters: { type: 'CONTRACT_EXPIRING', priority: 'HIGH' },
            order: 2
          }
        ],
        active: true,
        lastExecuted: '2024-11-19T09:00:00',
        executionCount: 12,
        createdAt: '2024-01-15T00:00:00'
      }
    ];
    setAutomationRules(mockRules);
  };

  const loadExecutions = async () => {
    // Mock data - replace with actual API call
    const mockExecutions: AutomationExecution[] = [
      {
        id: 1,
        ruleId: 1,
        ruleName: 'Overdue Payment Reminder',
        triggerData: { invoiceId: 123, tenantId: 1, daysOverdue: 3 },
        status: 'SUCCESS',
        executedAt: '2024-11-20T10:30:00',
        executionTime: 1.2,
        results: [
          {
            actionType: 'SEND_EMAIL',
            status: 'SUCCESS',
            message: 'Email sent successfully to john.doe@email.com'
          }
        ]
      },
      {
        id: 2,
        ruleId: 2,
        ruleName: 'Contract Expiry Notification',
        triggerData: { contractId: 3, tenantId: 3, daysUntilExpiry: 30 },
        status: 'PARTIAL',
        executedAt: '2024-11-19T09:00:00',
        executionTime: 2.8,
        results: [
          {
            actionType: 'SEND_EMAIL',
            status: 'SUCCESS',
            message: 'Email sent successfully'
          },
          {
            actionType: 'CREATE_NOTIFICATION',
            status: 'FAILED',
            message: 'Failed to create notification: Database connection error'
          }
        ]
      }
    ];
    setExecutions(mockExecutions);
  };

  return (
    <MainLayout>
      <div className="automation-page">
        <div className="automation-header">
          <h1>Automation & Scheduling</h1>
          <p>Streamline operations with intelligent automation</p>
        </div>

        <div className="automation-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-tachometer-alt"></i>
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'recurring-invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('recurring-invoices')}
          >
            <i className="fas fa-redo"></i>
            Recurring Invoices
          </button>
          <button
            className={`tab-button ${activeTab === 'contract-renewals' ? 'active' : ''}`}
            onClick={() => setActiveTab('contract-renewals')}
          >
            <i className="fas fa-file-contract"></i>
            Contract Renewals
          </button>
          <button
            className={`tab-button ${activeTab === 'scheduled-reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('scheduled-reports')}
          >
            <i className="fas fa-calendar-alt"></i>
            Scheduled Reports
          </button>
          <button
            className={`tab-button ${activeTab === 'automation-rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('automation-rules')}
          >
            <i className="fas fa-cogs"></i>
            Automation Rules
          </button>
          <button
            className={`tab-button ${activeTab === 'executions' ? 'active' : ''}`}
            onClick={() => setActiveTab('executions')}
          >
            <i className="fas fa-history"></i>
            Execution History
          </button>
        </div>

        <div className="automation-content">
          {loading ? (
            <div className="automation-loading">
              <div className="loading-spinner"></div>
              <p>Loading automation data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'overview' && (
                <AutomationOverviewTab stats={automationStats} />
              )}
              {activeTab === 'recurring-invoices' && (
                <RecurringInvoicesTab invoices={recurringInvoices} onRefresh={loadRecurringInvoices} />
              )}
              {activeTab === 'contract-renewals' && (
                <ContractRenewalsTab renewals={contractRenewals} onRefresh={loadContractRenewals} />
              )}
              {activeTab === 'scheduled-reports' && (
                <ScheduledReportsTab reports={scheduledReports} onRefresh={loadScheduledReports} />
              )}
              {activeTab === 'automation-rules' && (
                <AutomationRulesTab rules={automationRules} onRefresh={loadAutomationRules} />
              )}
              {activeTab === 'executions' && (
                <ExecutionHistoryTab executions={executions} onRefresh={loadExecutions} />
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

// Overview Tab Component
const AutomationOverviewTab: React.FC<{ stats: any }> = ({ stats }) => {
  if (!stats) return <div>Loading statistics...</div>;

  return (
    <div className="automation-overview-tab">
      <div className="overview-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-cogs"></i>
          </div>
          <div className="stat-content">
            <h3>Active Rules</h3>
            <p className="stat-value">{stats.activeRules}/{stats.totalRules}</p>
            <span className="stat-label">Automation Rules</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-play"></i>
          </div>
          <div className="stat-content">
            <h3>Executions Today</h3>
            <p className="stat-value">{stats.executionsToday}</p>
            <span className="stat-label">Automated Actions</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>Success Rate</h3>
            <p className="stat-value">{stats.successRate}%</p>
            <span className="stat-label">Last 30 Days</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>Avg Execution Time</h3>
            <p className="stat-value">{stats.avgExecutionTime}s</p>
            <span className="stat-label">Performance</span>
          </div>
        </div>
      </div>

      <div className="overview-sections">
        <div className="section">
          <h3>Automation Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Recurring Invoices</span>
              <span className="summary-value">{stats.recurringInvoices} active</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Scheduled Reports</span>
              <span className="summary-value">{stats.scheduledReports} active</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Contract Reminders</span>
              <span className="summary-value">{stats.contractReminders} pending</span>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon success">
                <i className="fas fa-check"></i>
              </div>
              <div className="activity-details">
                <p>Monthly invoices generated successfully</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon info">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="activity-details">
                <p>Contract renewal reminders sent</p>
                <span className="activity-time">4 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon warning">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className="activity-details">
                <p>Payment reminder failed for 2 tenants</p>
                <span className="activity-time">6 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recurring Invoices Tab
const RecurringInvoicesTab: React.FC<{ invoices: RecurringInvoice[]; onRefresh: () => void }> = ({ invoices, onRefresh }) => {
  return (
    <div className="recurring-invoices-tab">
      <div className="tab-header">
        <h3>Recurring Invoices</h3>
        <button className="add-button">
          <i className="fas fa-plus"></i>
          Add Recurring Invoice
        </button>
      </div>

      <div className="invoices-list">
        {invoices.map(invoice => (
          <div key={invoice.id} className="invoice-card">
            <div className="invoice-header">
              <h4>{invoice.tenantName} - {invoice.roomCode}</h4>
              <div className={`status-badge ${invoice.active ? 'active' : 'inactive'}`}>
                {invoice.active ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className="invoice-details">
              <p><strong>Contract:</strong> {invoice.contractCode}</p>
              <p><strong>Frequency:</strong> {invoice.frequency}</p>
              <p><strong>Next Generation:</strong> {new Date(invoice.nextGenerationDate).toLocaleDateString()}</p>
              <p><strong>Last Generated:</strong> {invoice.lastGeneratedDate ? new Date(invoice.lastGeneratedDate).toLocaleDateString() : 'Never'}</p>
              <p><strong>Auto Send:</strong> {invoice.autoSend ? 'Yes' : 'No'}</p>
            </div>
            <div className="invoice-actions">
              <button className="action-button primary">Generate Now</button>
              <button className="action-button secondary">Edit</button>
              <button className="action-button danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Contract Renewals Tab
const ContractRenewalsTab: React.FC<{ renewals: ContractRenewalReminder[]; onRefresh: () => void }> = ({ renewals, onRefresh }) => {
  return (
    <div className="contract-renewals-tab">
      <div className="tab-header">
        <h3>Contract Renewal Reminders</h3>
        <button className="add-button">
          <i className="fas fa-plus"></i>
          Add Reminder
        </button>
      </div>

      <div className="renewals-list">
        {renewals.map(renewal => (
          <div key={renewal.id} className="renewal-card">
            <div className="renewal-header">
              <h4>{renewal.tenantName}</h4>
              <div className={`status-badge ${renewal.sent ? 'sent' : 'pending'}`}>
                {renewal.sent ? 'Sent' : 'Pending'}
              </div>
            </div>
            <div className="renewal-details">
              <p><strong>Contract:</strong> {renewal.contractCode}</p>
              <p><strong>Contract Ends:</strong> {new Date(renewal.contractEndDate).toLocaleDateString()}</p>
              <p><strong>Reminder Date:</strong> {new Date(renewal.reminderDate).toLocaleDateString()}</p>
              <p><strong>Days Before:</strong> {renewal.daysBefore}</p>
              <p><strong>Reminder Type:</strong> {renewal.reminderType}</p>
              <p><strong>Auto Renewal:</strong> {renewal.autoRenewal ? 'Yes' : 'No'}</p>
            </div>
            {renewal.renewalTerms && (
              <div className="renewal-terms">
                <h5>Renewal Terms:</h5>
                <p>Extension: {renewal.renewalTerms.extensionMonths} months</p>
                <p>New Rent: ${renewal.renewalTerms.newRentAmount?.toLocaleString()}</p>
                <p>Increase: ${renewal.renewalTerms.rentIncrease} ({renewal.renewalTerms.rentIncreaseType})</p>
              </div>
            )}
            <div className="renewal-actions">
              <button className="action-button primary">Send Now</button>
              <button className="action-button secondary">Edit</button>
              <button className="action-button danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Scheduled Reports Tab
const ScheduledReportsTab: React.FC<{ reports: ScheduledReport[]; onRefresh: () => void }> = ({ reports, onRefresh }) => {
  return (
    <div className="scheduled-reports-tab">
      <div className="tab-header">
        <h3>Scheduled Reports</h3>
        <button className="add-button">
          <i className="fas fa-plus"></i>
          Add Scheduled Report
        </button>
      </div>

      <div className="reports-list">
        {reports.map(report => (
          <div key={report.id} className="report-card">
            <div className="report-header">
              <h4>{report.name}</h4>
              <div className={`status-badge ${report.active ? 'active' : 'inactive'}`}>
                {report.active ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className="report-details">
              <p><strong>Type:</strong> {report.reportType}</p>
              <p><strong>Frequency:</strong> {report.frequency}</p>
              <p><strong>Time:</strong> {report.time}</p>
              <p><strong>Format:</strong> {report.format}</p>
              <p><strong>Recipients:</strong> {report.recipients.length} recipients</p>
              <p><strong>Next Run:</strong> {new Date(report.nextRunDate).toLocaleDateString()}</p>
              <p><strong>Last Run:</strong> {report.lastRunDate ? new Date(report.lastRunDate).toLocaleDateString() : 'Never'}</p>
            </div>
            <div className="report-actions">
              <button className="action-button primary">Run Now</button>
              <button className="action-button secondary">Edit</button>
              <button className="action-button danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Automation Rules Tab
const AutomationRulesTab: React.FC<{ rules: AutomationRule[]; onRefresh: () => void }> = ({ rules, onRefresh }) => {
  return (
    <div className="automation-rules-tab">
      <div className="tab-header">
        <h3>Automation Rules</h3>
        <button className="add-button">
          <i className="fas fa-plus"></i>
          Create Rule
        </button>
      </div>

      <div className="rules-list">
        {rules.map(rule => (
          <div key={rule.id} className="rule-card">
            <div className="rule-header">
              <h4>{rule.name}</h4>
              <div className={`status-badge ${rule.active ? 'active' : 'inactive'}`}>
                {rule.active ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className="rule-details">
              <p className="rule-description">{rule.description}</p>
              <p><strong>Trigger:</strong> {rule.triggerType}</p>
              <p><strong>Actions:</strong> {rule.actions.length} configured</p>
              <p><strong>Executions:</strong> {rule.executionCount}</p>
              <p><strong>Last Executed:</strong> {rule.lastExecuted ? new Date(rule.lastExecuted).toLocaleDateString() : 'Never'}</p>
            </div>
            <div className="rule-actions">
              <button className="action-button primary">Execute</button>
              <button className="action-button secondary">Edit</button>
              <button className="action-button warning">Toggle</button>
              <button className="action-button danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Execution History Tab
const ExecutionHistoryTab: React.FC<{ executions: AutomationExecution[]; onRefresh: () => void }> = ({ executions, onRefresh }) => {
  return (
    <div className="execution-history-tab">
      <div className="tab-header">
        <h3>Execution History</h3>
        <div className="history-filters">
          <select className="filter-select">
            <option value="">All Rules</option>
            <option value="SUCCESS">Success Only</option>
            <option value="FAILED">Failed Only</option>
          </select>
          <input type="date" className="filter-date" />
        </div>
      </div>

      <div className="executions-list">
        {executions.map(execution => (
          <div key={execution.id} className="execution-card">
            <div className="execution-header">
              <h4>{execution.ruleName}</h4>
              <div className={`status-badge ${execution.status.toLowerCase()}`}>
                {execution.status}
              </div>
            </div>
            <div className="execution-details">
              <p><strong>Executed:</strong> {new Date(execution.executedAt).toLocaleString()}</p>
              <p><strong>Duration:</strong> {execution.executionTime}s</p>
              <p><strong>Results:</strong> {execution.results.length} actions</p>
            </div>
            <div className="execution-results">
              {execution.results.map((result, index) => (
                <div key={index} className={`result-item ${result.status.toLowerCase()}`}>
                  <span className="result-action">{result.actionType}</span>
                  <span className="result-message">{result.message}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};