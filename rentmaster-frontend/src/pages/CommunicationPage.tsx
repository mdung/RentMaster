import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { communicationApi } from '../services/api/communicationApi';
import {
  EmailTemplate,
  SMSTemplate,
  NotificationChannel,
  CommunicationLog,
  BulkCommunication,
  NotificationPreference,
} from '../types';
import './CommunicationPage.css';

export const CommunicationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'templates' | 'channels' | 'logs' | 'bulk' | 'preferences'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [smsTemplates, setSmsTemplates] = useState<SMSTemplate[]>([]);
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([]);
  const [bulkCommunications, setBulkCommunications] = useState<BulkCommunication[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [
        statsData,
        emailTemplatesData,
        smsTemplatesData,
        channelsData,
        logsData,
        bulkData,
        preferencesData,
      ] = await Promise.all([
        communicationApi.getCommunicationStats(),
        communicationApi.getEmailTemplates(),
        communicationApi.getSMSTemplates(),
        communicationApi.getNotificationChannels(),
        communicationApi.getCommunicationLogs({ page: 0, size: 50 }),
        communicationApi.getBulkCommunications(),
        communicationApi.getNotificationPreferences(),
      ]);

      setStats(statsData);
      setEmailTemplates(emailTemplatesData);
      setSmsTemplates(smsTemplatesData);
      setChannels(channelsData);
      setCommunicationLogs(logsData.content);
      setBulkCommunications(bulkData);
      setPreferences(preferencesData);
    } catch (error) {
      console.error('Failed to load communication data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'EMAIL': return '📧';
      case 'SMS': return '📱';
      case 'PUSH': return '🔔';
      case 'WHATSAPP': return '💬';
      default: return '📢';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'SENT':
      case 'DELIVERED':
      case 'ACTIVE': return 'success';
      case 'PENDING':
      case 'SENDING': return 'warning';
      case 'FAILED': return 'danger';
      default: return 'gray';
    }
  };

  const handleToggleEmailTemplate = async (id: number) => {
    try {
      await communicationApi.toggleEmailTemplate(id);
      loadData();
    } catch (error) {
      console.error('Failed to toggle email template:', error);
    }
  };

  const handleToggleSMSTemplate = async (id: number) => {
    try {
      await communicationApi.toggleSMSTemplate(id);
      loadData();
    } catch (error) {
      console.error('Failed to toggle SMS template:', error);
    }
  };

  const handleToggleChannel = async (id: number) => {
    try {
      await communicationApi.toggleNotificationChannel(id);
      loadData();
    } catch (error) {
      console.error('Failed to toggle channel:', error);
    }
  };

  const handleTestChannel = async (id: number) => {
    try {
      await communicationApi.testNotificationChannel(id, {
        testMessage: 'This is a test message from RentMaster',
        recipient: 'test@example.com'
      });
      alert('Test message sent successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send test message');
    }
  };

  const handleRetryCommunication = async (id: number) => {
    try {
      await communicationApi.retryCommunication(id);
      loadData();
      alert('Communication retry initiated!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to retry communication');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="communication-page">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading communication data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="communication-page">
        <div className="page-header">
          <div>
            <h1>Communication & Notifications</h1>
            <p className="page-subtitle">Manage templates, channels, and communication preferences</p>
          </div>
        </div>

        <div className="communication-tabs">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>📊</span> Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <span>📝</span> Templates
          </button>
          <button
            className={`tab-button ${activeTab === 'channels' ? 'active' : ''}`}
            onClick={() => setActiveTab('channels')}
          >
            <span>📡</span> Channels
          </button>
          <button
            className={`tab-button ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <span>📋</span> Communication Logs
          </button>
          <button
            className={`tab-button ${activeTab === 'bulk' ? 'active' : ''}`}
            onClick={() => setActiveTab('bulk')}
          >
            <span>📢</span> Bulk Communications
          </button>
          <button
            className={`tab-button ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            <span>⚙️</span> Preferences
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && stats && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📧</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.activeEmailTemplates}</div>
                    <div className="stat-label">Active Email Templates</div>
                    <div className="stat-sublabel">of {stats.totalEmailTemplates} total</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📱</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.activeSMSTemplates}</div>
                    <div className="stat-label">Active SMS Templates</div>
                    <div className="stat-sublabel">of {stats.totalSMSTemplates} total</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📡</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.activeChannels}</div>
                    <div className="stat-label">Active Channels</div>
                    <div className="stat-sublabel">of {stats.totalChannels} total</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.communicationsToday}</div>
                    <div className="stat-label">Communications Today</div>
                    <div className="stat-sublabel">{stats.deliveryRate}% delivery rate</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.deliveryRate}%</div>
                    <div className="stat-label">Success Rate</div>
                    <div className="stat-sublabel">{stats.failureRate}% failure rate</div>
                  </div>
                </div>
              </div>

              <div className="quick-actions-grid">
                <div className="quick-action-card">
                  <div className="quick-action-icon">📝</div>
                  <h3>Email Templates</h3>
                  <p>Create and manage customizable email templates</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveTab('templates')}
                  >
                    Manage Templates
                  </button>
                </div>
                <div className="quick-action-card">
                  <div className="quick-action-icon">📡</div>
                  <h3>Communication Channels</h3>
                  <p>Configure SMS, WhatsApp, and push notification channels</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveTab('channels')}
                  >
                    Manage Channels
                  </button>
                </div>
                <div className="quick-action-card">
                  <div className="quick-action-icon">📢</div>
                  <h3>Bulk Communications</h3>
                  <p>Send messages to multiple recipients at once</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveTab('bulk')}
                  >
                    Send Bulk Messages
                  </button>
                </div>
                <div className="quick-action-card">
                  <div className="quick-action-icon">⚙️</div>
                  <h3>Notification Preferences</h3>
                  <p>Configure user notification preferences and settings</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveTab('preferences')}
                  >
                    Manage Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="templates-tab">
              <div className="templates-section">
                <div className="section-header">
                  <h2>Email Templates</h2>
                  <button className="btn btn-primary">
                    <span>➕</span> Add Email Template
                  </button>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Subject</th>
                        <th>Variables</th>
                        <th>Default</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {emailTemplates.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="empty-state">
                            <div className="empty-state-content">
                              <span className="empty-icon">📧</span>
                              <p>No email templates configured</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        emailTemplates.map((template) => (
                          <tr key={template.id}>
                            <td><strong>{template.name}</strong></td>
                            <td>
                              <span className="status-badge info">{template.templateType}</span>
                            </td>
                            <td>{template.subject}</td>
                            <td>{template.variables.length} variable(s)</td>
                            <td>
                              <span className={`status-badge ${template.isDefault ? 'success' : 'gray'}`}>
                                {template.isDefault ? 'Yes' : 'No'}
                              </span>
                            </td>
                            <td>
                              <span className={`status-badge ${getStatusBadgeClass(template.active ? 'ACTIVE' : 'INACTIVE')}`}>
                                {template.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="btn-icon"
                                  onClick={() => handleToggleEmailTemplate(template.id)}
                                  title={template.active ? 'Deactivate' : 'Activate'}
                                >
                                  {template.active ? '⏸️' : '▶️'}
                                </button>
                                <button className="btn-icon" title="Preview">
                                  👁️
                                </button>
                                <button className="btn-icon" title="Edit">
                                  ✏️
                                </button>
                                <button className="btn-icon danger" title="Delete">
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
              </div>

              <div className="templates-section">
                <div className="section-header">
                  <h2>SMS Templates</h2>
                  <button className="btn btn-primary">
                    <span>➕</span> Add SMS Template
                  </button>
                </div>
                <div className="table-container">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Message Preview</th>
                        <th>Variables</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {smsTemplates.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="empty-state">
                            <div className="empty-state-content">
                              <span className="empty-icon">📱</span>
                              <p>No SMS templates configured</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        smsTemplates.map((template) => (
                          <tr key={template.id}>
                            <td><strong>{template.name}</strong></td>
                            <td>
                              <span className="status-badge info">{template.templateType}</span>
                            </td>
                            <td>
                              <div className="message-preview">
                                {template.message.length > 50 
                                  ? `${template.message.substring(0, 50)}...`
                                  : template.message
                                }
                              </div>
                            </td>
                            <td>{template.variables.length} variable(s)</td>
                            <td>
                              <span className={`status-badge ${getStatusBadgeClass(template.active ? 'ACTIVE' : 'INACTIVE')}`}>
                                {template.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                  className="btn-icon"
                                  onClick={() => handleToggleSMSTemplate(template.id)}
                                  title={template.active ? 'Deactivate' : 'Activate'}
                                >
                                  {template.active ? '⏸️' : '▶️'}
                                </button>
                                <button className="btn-icon" title="Preview">
                                  👁️
                                </button>
                                <button className="btn-icon" title="Edit">
                                  ✏️
                                </button>
                                <button className="btn-icon danger" title="Delete">
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
              </div>
            </div>
          )}

          {activeTab === 'channels' && (
            <div className="channels-tab">
              <div className="tab-header">
                <h2>Communication Channels</h2>
                <button className="btn btn-primary">
                  <span>➕</span> Add Channel
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Configuration</th>
                      <th>Default</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {channels.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="empty-state">
                          <div className="empty-state-content">
                            <span className="empty-icon">📡</span>
                            <p>No communication channels configured</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      channels.map((channel) => (
                        <tr key={channel.id}>
                          <td>
                            <div className="channel-name">
                              {getChannelIcon(channel.type)} <strong>{channel.name}</strong>
                            </div>
                          </td>
                          <td>
                            <span className="status-badge info">{channel.type}</span>
                          </td>
                          <td>
                            <div className="config-summary">
                              {Object.keys(channel.configuration).length} setting(s)
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${channel.isDefault ? 'success' : 'gray'}`}>
                              {channel.isDefault ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${getStatusBadgeClass(channel.active ? 'ACTIVE' : 'INACTIVE')}`}>
                              {channel.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{formatDate(channel.createdAt)}</td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="btn-icon"
                                onClick={() => handleToggleChannel(channel.id)}
                                title={channel.active ? 'Deactivate' : 'Activate'}
                              >
                                {channel.active ? '⏸️' : '▶️'}
                              </button>
                              <button
                                className="btn-icon"
                                onClick={() => handleTestChannel(channel.id)}
                                title="Test Channel"
                              >
                                🧪
                              </button>
                              <button className="btn-icon" title="Edit">
                                ✏️
                              </button>
                              <button className="btn-icon danger" title="Delete">
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
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="logs-tab">
              <div className="tab-header">
                <h2>Communication Logs</h2>
                <div className="filters">
                  <select className="form-select">
                    <option value="">All Channels</option>
                    <option value="EMAIL">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="PUSH">Push</option>
                    <option value="WHATSAPP">WhatsApp</option>
                  </select>
                  <select className="form-select">
                    <option value="">All Status</option>
                    <option value="SENT">Sent</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="FAILED">Failed</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Recipient</th>
                      <th>Channel</th>
                      <th>Template</th>
                      <th>Subject/Message</th>
                      <th>Status</th>
                      <th>Sent At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {communicationLogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="empty-state">
                          <div className="empty-state-content">
                            <span className="empty-icon">📋</span>
                            <p>No communication logs found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      communicationLogs.map((log) => (
                        <tr key={log.id}>
                          <td>
                            <div>
                              <strong>{log.recipientName}</strong>
                              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                {log.recipientType}
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="channel-badge">
                              {getChannelIcon(log.channel)} {log.channel}
                            </span>
                          </td>
                          <td>{log.templateName || 'Custom'}</td>
                          <td>
                            <div className="message-preview">
                              {log.subject && <div><strong>{log.subject}</strong></div>}
                              <div>
                                {log.message.length > 50 
                                  ? `${log.message.substring(0, 50)}...`
                                  : log.message
                                }
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${getStatusBadgeClass(log.status)}`}>
                              {log.status}
                            </span>
                            {log.errorMessage && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--danger)' }}>
                                {log.errorMessage}
                              </div>
                            )}
                          </td>
                          <td>
                            {log.sentAt ? formatDateTime(log.sentAt) : 'Not sent'}
                            {log.deliveredAt && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Delivered: {formatDateTime(log.deliveredAt)}
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="action-buttons">
                              {log.status === 'FAILED' && (
                                <button
                                  className="btn-icon"
                                  onClick={() => handleRetryCommunication(log.id)}
                                  title="Retry"
                                >
                                  🔄
                                </button>
                              )}
                              <button className="btn-icon" title="View Details">
                                👁️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'bulk' && (
            <div className="bulk-tab">
              <div className="tab-header">
                <h2>Bulk Communications</h2>
                <button className="btn btn-primary">
                  <span>➕</span> Create Bulk Communication
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Recipients</th>
                      <th>Channels</th>
                      <th>Status</th>
                      <th>Progress</th>
                      <th>Scheduled</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkCommunications.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="empty-state">
                          <div className="empty-state-content">
                            <span className="empty-icon">📢</span>
                            <p>No bulk communications configured</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      bulkCommunications.map((bulk) => (
                        <tr key={bulk.id}>
                          <td><strong>{bulk.name}</strong></td>
                          <td>
                            <div>
                              <span className="status-badge info">{bulk.recipientType}</span>
                              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                {bulk.totalRecipients} recipient(s)
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="channels-list">
                              {bulk.channels.map((channel, index) => (
                                <span key={index} className="channel-badge">
                                  {getChannelIcon(channel)} {channel}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${getStatusBadgeClass(bulk.status)}`}>
                              {bulk.status}
                            </span>
                          </td>
                          <td>
                            <div className="progress-info">
                              <div>{bulk.sentCount}/{bulk.totalRecipients} sent</div>
                              {bulk.failedCount > 0 && (
                                <div style={{ color: 'var(--danger)' }}>
                                  {bulk.failedCount} failed
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            {bulk.scheduledAt 
                              ? formatDateTime(bulk.scheduledAt)
                              : 'Immediate'
                            }
                          </td>
                          <td>
                            <div className="action-buttons">
                              {bulk.status === 'DRAFT' && (
                                <button className="btn-icon" title="Send Now">
                                  ▶️
                                </button>
                              )}
                              <button className="btn-icon" title="View Details">
                                👁️
                              </button>
                              <button className="btn-icon" title="Edit">
                                ✏️
                              </button>
                              <button className="btn-icon danger" title="Delete">
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
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="preferences-tab">
              <div className="tab-header">
                <h2>Notification Preferences</h2>
                <button className="btn btn-primary">
                  <span>➕</span> Add Preference Rule
                </button>
              </div>
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Notification Type</th>
                      <th>Channels</th>
                      <th>Frequency</th>
                      <th>Quiet Hours</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preferences.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="empty-state">
                          <div className="empty-state-content">
                            <span className="empty-icon">⚙️</span>
                            <p>No notification preferences configured</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      preferences.map((pref) => (
                        <tr key={pref.id}>
                          <td>User #{pref.userId}</td>
                          <td>
                            <span className="status-badge info">{pref.notificationType}</span>
                          </td>
                          <td>
                            <div className="channels-list">
                              {pref.channels.map((channel, index) => (
                                <span key={index} className="channel-badge">
                                  {getChannelIcon(channel)} {channel}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td>
                            <span className="status-badge gray">{pref.frequency}</span>
                          </td>
                          <td>
                            {pref.quietHours.enabled ? (
                              <span className="quiet-hours">
                                {pref.quietHours.startTime} - {pref.quietHours.endTime}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>Disabled</span>
                            )}
                          </td>
                          <td>
                            <span className={`status-badge ${pref.enabled ? 'success' : 'gray'}`}>
                              {pref.enabled ? 'Enabled' : 'Disabled'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn-icon" title="Edit">
                                ✏️
                              </button>
                              <button className="btn-icon danger" title="Delete">
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
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};