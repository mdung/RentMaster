import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { automationApi, ScheduledReportCreateData } from '../services/api/automationApi';
import { ScheduledReport } from '../types';
import './ScheduledReportsPage.css';

export const ScheduledReportsPage: React.FC = () => {
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReport, setEditingReport] = useState<ScheduledReport | null>(null);
  const [formData, setFormData] = useState<ScheduledReportCreateData>({
    name: '',
    reportType: 'REVENUE',
    frequency: 'MONTHLY',
    time: '09:00',
    recipients: [],
    format: 'PDF',
    filters: {},
    active: true,
  });
  const [recipientInput, setRecipientInput] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await automationApi.getScheduledReports();
      setScheduledReports(data);
    } catch (error) {
      console.error('Failed to load scheduled reports:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReport) {
        await automationApi.updateScheduledReport(editingReport.id, formData);
      } else {
        await automationApi.createScheduledReport(formData);
      }
      setShowModal(false);
      setEditingReport(null);
      resetForm();
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save scheduled report');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this scheduled report?')) return;
    try {
      await automationApi.deleteScheduledReport(id);
      loadData();
    } catch (error) {
      alert('Failed to delete scheduled report');
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await automationApi.toggleScheduledReport(id);
      loadData();
    } catch (error) {
      alert('Failed to toggle scheduled report');
    }
  };

  const handleRunNow = async (id: number) => {
    if (!confirm('Run this report now? It will be sent to all recipients.')) return;
    try {
      await automationApi.runScheduledReportNow(id);
      alert('Report is being generated and will be sent shortly!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to run report');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      reportType: 'REVENUE',
      frequency: 'MONTHLY',
      time: '09:00',
      recipients: [],
      format: 'PDF',
      filters: {},
      active: true,
    });
    setRecipientInput('');
  };

  const addRecipient = () => {
    if (recipientInput.trim() && !formData.recipients.includes(recipientInput.trim())) {
      setFormData({
        ...formData,
        recipients: [...formData.recipients, recipientInput.trim()],
      });
      setRecipientInput('');
    }
  };

  const removeRecipient = (email: string) => {
    setFormData({
      ...formData,
      recipients: formData.recipients.filter(r => r !== email),
    });
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'REVENUE': return '💰';
      case 'OCCUPANCY': return '🏠';
      case 'PAYMENTS': return '💳';
      case 'EXPENSES': return '📊';
      case 'FINANCIAL_SUMMARY': return '📈';
      case 'CUSTOM': return '📋';
      default: return '📄';
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case 'DAILY': return '📅';
      case 'WEEKLY': return '📆';
      case 'MONTHLY': return '🗓️';
      case 'QUARTERLY': return '📊';
      case 'YEARLY': return '🎯';
      default: return '⏰';
    }
  };

  const getStatusBadgeClass = (active: boolean) => {
    return active ? 'success' : 'gray';
  };

  return (
    <MainLayout>
      <div className="scheduled-reports-page">
        <div className="page-header">
          <div>
            <h1>Scheduled Reports</h1>
            <p className="page-subtitle">Automate report generation and delivery</p>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingReport(null);
              resetForm();
              setShowModal(true);
            }}
          >
            <span>➕</span> Add Scheduled Report
          </button>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Frequency</th>
                <th>Recipients</th>
                <th>Format</th>
                <th>Next Run</th>
                <th>Last Run</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {scheduledReports.length === 0 ? (
                <tr>
                  <td colSpan={9} className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">📈</span>
                      <p>No scheduled reports configured</p>
                      <button
                        className="btn btn-primary"
                        onClick={() => {
                          setEditingReport(null);
                          resetForm();
                          setShowModal(true);
                        }}
                      >
                        Create First Scheduled Report
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                scheduledReports.map((report) => (
                  <tr key={report.id}>
                    <td><strong>{report.name}</strong></td>
                    <td>
                      <span className="report-type-badge">
                        {getReportTypeIcon(report.reportType)} {report.reportType}
                      </span>
                    </td>
                    <td>
                      <span className="frequency-badge">
                        {getFrequencyIcon(report.frequency)} {report.frequency}
                      </span>
                    </td>
                    <td>{report.recipients.length} recipient(s)</td>
                    <td>
                      <span className="format-badge">{report.format}</span>
                    </td>
                    <td>{formatDateTime(report.nextRunDate)}</td>
                    <td>
                      {report.lastRunDate 
                        ? formatDateTime(report.lastRunDate)
                        : <span style={{ color: 'var(--text-muted)' }}>Never</span>
                      }
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(report.active)}`}>
                        {report.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => handleRunNow(report.id)}
                          title="Run Now"
                        >
                          ▶️
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => handleToggle(report.id)}
                          title={report.active ? 'Deactivate' : 'Activate'}
                        >
                          {report.active ? '⏸️' : '▶️'}
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => {
                            setEditingReport(report);
                            setFormData({
                              name: report.name,
                              reportType: report.reportType,
                              frequency: report.frequency,
                              dayOfWeek: report.dayOfWeek,
                              dayOfMonth: report.dayOfMonth,
                              time: report.time,
                              recipients: report.recipients,
                              format: report.format,
                              filters: report.filters,
                              active: report.active,
                            });
                            setShowModal(true);
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => handleDelete(report.id)}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingReport ? 'Edit' : 'Add'} Scheduled Report</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <h3>Basic Information</h3>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Report Name *</label>
                      <input
                        type="text"
                        placeholder="Enter report name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Report Type *</label>
                      <select
                        value={formData.reportType}
                        onChange={(e) => setFormData({ ...formData, reportType: e.target.value as any })}
                        required
                      >
                        <option value="REVENUE">Revenue Report</option>
                        <option value="OCCUPANCY">Occupancy Report</option>
                        <option value="PAYMENTS">Payments Report</option>
                        <option value="EXPENSES">Expenses Report</option>
                        <option value="FINANCIAL_SUMMARY">Financial Summary</option>
                        <option value="CUSTOM">Custom Report</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label>Frequency *</label>
                      <select
                        value={formData.frequency}
                        onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
                        required
                      >
                        <option value="DAILY">Daily</option>
                        <option value="WEEKLY">Weekly</option>
                        <option value="MONTHLY">Monthly</option>
                        <option value="QUARTERLY">Quarterly</option>
                        <option value="YEARLY">Yearly</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Time *</label>
                      <input
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {formData.frequency === 'WEEKLY' && (
                    <div className="form-group">
                      <label>Day of Week</label>
                      <select
                        value={formData.dayOfWeek || 1}
                        onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
                      >
                        <option value={1}>Monday</option>
                        <option value={2}>Tuesday</option>
                        <option value={3}>Wednesday</option>
                        <option value={4}>Thursday</option>
                        <option value={5}>Friday</option>
                        <option value={6}>Saturday</option>
                        <option value={0}>Sunday</option>
                      </select>
                    </div>
                  )}

                  {(formData.frequency === 'MONTHLY' || formData.frequency === 'QUARTERLY' || formData.frequency === 'YEARLY') && (
                    <div className="form-group">
                      <label>Day of Month</label>
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={formData.dayOfMonth || 1}
                        onChange={(e) => setFormData({ ...formData, dayOfMonth: parseInt(e.target.value) })}
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label>Format *</label>
                    <select
                      value={formData.format}
                      onChange={(e) => setFormData({ ...formData, format: e.target.value as any })}
                      required
                    >
                      <option value="PDF">PDF</option>
                      <option value="EXCEL">Excel</option>
                      <option value="CSV">CSV</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      />
                      <span>Active</span>
                    </label>
                  </div>
                </div>

                <div className="form-section">
                  <h3>Recipients</h3>
                  <div className="recipients-section">
                    <div className="recipient-input">
                      <input
                        type="email"
                        placeholder="Enter email address"
                        value={recipientInput}
                        onChange={(e) => setRecipientInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addRecipient();
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-outline"
                        onClick={addRecipient}
                      >
                        Add
                      </button>
                    </div>
                    <div className="recipients-list">
                      {formData.recipients.map((email, index) => (
                        <div key={index} className="recipient-tag">
                          <span>{email}</span>
                          <button
                            type="button"
                            className="remove-recipient"
                            onClick={() => removeRecipient(email)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    {formData.recipients.length === 0 && (
                      <p className="no-recipients">No recipients added. Add at least one email address.</p>
                    )}
                  </div>
                </div>

                <div className="modal-actions">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={formData.recipients.length === 0}
                  >
                    {editingReport ? 'Update' : 'Create'} Scheduled Report
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setEditingReport(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};