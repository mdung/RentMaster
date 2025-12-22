import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { communicationApi, EmailTemplateCreateData, SMSTemplateCreateData, NotificationChannelCreateData, BulkCommunicationCreateData, NotificationPreferenceCreateData } from '../services/api/communicationApi';
import {
  EmailTemplate,
  SMSTemplate,
  NotificationChannel,
  CommunicationLog,
  BulkCommunication,
  NotificationPreference,
} from '../types';
import './CommunicationPage.css';
import './shared-styles.css';

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
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'emailTemplate' | 'smsTemplate' | 'channel' | 'bulk' | 'preference' | 'preview' | 'details'>('emailTemplate');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [previewData, setPreviewData] = useState<any>(null);
  const [detailsData, setDetailsData] = useState<any>(null);
  
  // Filter states
  const [logChannelFilter, setLogChannelFilter] = useState('');
  const [logStatusFilter, setLogStatusFilter] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') {
      loadLogs();
    }
  }, [logChannelFilter, logStatusFilter]);

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

  const loadLogs = async () => {
    try {
      const logsData = await communicationApi.getCommunicationLogs({
        page: 0,
        size: 50,
        channel: logChannelFilter || undefined,
        status: logStatusFilter || undefined,
      });
      setCommunicationLogs(logsData.content);
    } catch (error) {
      console.error('Failed to load logs:', error);
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

  const handleOpenModal = (type: 'emailTemplate' | 'smsTemplate' | 'channel' | 'bulk' | 'preference' | 'preview' | 'details', item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    if (item) {
      setFormData(item);
    } else {
      // Set default form data
      switch (type) {
        case 'emailTemplate':
          setFormData({ active: true, isDefault: false, variables: [], templateType: 'CUSTOM' });
          break;
        case 'smsTemplate':
          setFormData({ active: true, variables: [], templateType: 'CUSTOM' });
          break;
        case 'channel':
          setFormData({ active: true, isDefault: false, type: 'EMAIL', configuration: {} });
          break;
        case 'bulk':
          setFormData({ recipientType: 'ALL_TENANTS', channels: ['EMAIL'], recipientIds: [] });
          break;
        case 'preference':
          setFormData({ enabled: true, frequency: 'IMMEDIATE', channels: ['EMAIL'], quietHours: { enabled: false, startTime: '22:00', endTime: '08:00' } });
          break;
      }
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
    setPreviewData(null);
    setDetailsData(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      switch (modalType) {
        case 'emailTemplate':
          if (editingItem?.id) {
            await communicationApi.updateEmailTemplate(editingItem.id, formData);
          } else {
            await communicationApi.createEmailTemplate(formData as EmailTemplateCreateData);
          }
          break;
        case 'smsTemplate':
          if (editingItem?.id) {
            await communicationApi.updateSMSTemplate(editingItem.id, formData);
          } else {
            await communicationApi.createSMSTemplate(formData as SMSTemplateCreateData);
          }
          break;
        case 'channel':
          if (editingItem?.id) {
            await communicationApi.updateNotificationChannel(editingItem.id, formData);
          } else {
            await communicationApi.createNotificationChannel(formData as NotificationChannelCreateData);
          }
          break;
        case 'bulk':
          if (editingItem?.id) {
            await communicationApi.updateBulkCommunication(editingItem.id, formData);
          } else {
            await communicationApi.createBulkCommunication(formData as BulkCommunicationCreateData);
          }
          break;
        case 'preference':
          if (editingItem?.id) {
            await communicationApi.updateNotificationPreference(editingItem.id, formData);
          } else {
            await communicationApi.createNotificationPreference(formData as NotificationPreferenceCreateData);
          }
          break;
      }
      handleCloseModal();
      await loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to save ${modalType}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      switch (type) {
        case 'emailTemplate':
          await communicationApi.deleteEmailTemplate(id);
          break;
        case 'smsTemplate':
          await communicationApi.deleteSMSTemplate(id);
          break;
        case 'channel':
          await communicationApi.deleteNotificationChannel(id);
          break;
        case 'bulk':
          await communicationApi.deleteBulkCommunication(id);
          break;
      }
      await loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to delete ${type}`);
    }
  };

  const handlePreview = async (type: 'email' | 'sms', id: number) => {
    try {
      if (type === 'email') {
        const preview = await communicationApi.previewEmailTemplate(id, {});
        setPreviewData(preview);
        handleOpenModal('preview');
      } else {
        // SMS preview - just show the template
        const template = smsTemplates.find(t => t.id === id);
        if (template) {
          setPreviewData({ message: template.message });
          handleOpenModal('preview');
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to preview template');
    }
  };

  const handleSendBulk = async (id: number) => {
    if (!confirm('Are you sure you want to send this bulk communication now?')) return;
    try {
      await communicationApi.sendBulkCommunication(id);
      alert('Bulk communication sent successfully!');
      await loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send bulk communication');
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

  if (loading && !stats) {
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
                    <div className="stat-value">{stats.activeEmailTemplates || 0}</div>
                    <div className="stat-label">Active Email Templates</div>
                    <div className="stat-sublabel">of {stats.totalEmailTemplates || 0} total</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📱</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.activeSMSTemplates || 0}</div>
                    <div className="stat-label">Active SMS Templates</div>
                    <div className="stat-sublabel">of {stats.totalSMSTemplates || 0} total</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📡</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.activeChannels || 0}</div>
                    <div className="stat-label">Active Channels</div>
                    <div className="stat-sublabel">of {stats.totalChannels || 0} total</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.communicationsToday || 0}</div>
                    <div className="stat-label">Communications Today</div>
                    <div className="stat-sublabel">{stats.deliveryRate || 0}% delivery rate</div>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🎯</div>
                  <div className="stat-content">
                    <div className="stat-value">{stats.deliveryRate || 0}%</div>
                    <div className="stat-label">Success Rate</div>
                    <div className="stat-sublabel">{stats.failureRate || 0}% failure rate</div>
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
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleOpenModal('emailTemplate')}
                  >
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
                            <td>{template.variables?.length || 0} variable(s)</td>
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
                                <button 
                                  className="btn-icon" 
                                  title="Preview"
                                  onClick={() => handlePreview('email', template.id)}
                                >
                                  👁️
                                </button>
                                <button 
                                  className="btn-icon" 
                                  title="Edit"
                                  onClick={() => handleOpenModal('emailTemplate', template)}
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="btn-icon danger" 
                                  title="Delete"
                                  onClick={() => handleDelete('emailTemplate', template.id)}
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
              </div>

              <div className="templates-section">
                <div className="section-header">
                  <h2>SMS Templates</h2>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleOpenModal('smsTemplate')}
                  >
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
                                {template.message?.length > 50 
                                  ? `${template.message.substring(0, 50)}...`
                                  : template.message
                                }
                              </div>
                            </td>
                            <td>{template.variables?.length || 0} variable(s)</td>
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
                                <button 
                                  className="btn-icon" 
                                  title="Preview"
                                  onClick={() => handlePreview('sms', template.id)}
                                >
                                  👁️
                                </button>
                                <button 
                                  className="btn-icon" 
                                  title="Edit"
                                  onClick={() => handleOpenModal('smsTemplate', template)}
                                >
                                  ✏️
                                </button>
                                <button 
                                  className="btn-icon danger" 
                                  title="Delete"
                                  onClick={() => handleDelete('smsTemplate', template.id)}
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
              </div>
            </div>
          )}

          {activeTab === 'channels' && (
            <div className="channels-tab">
              <div className="tab-header">
                <h2>Communication Channels</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleOpenModal('channel')}
                >
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
                              {Object.keys(channel.configuration || {}).length} setting(s)
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
                              <button 
                                className="btn-icon" 
                                title="Edit"
                                onClick={() => handleOpenModal('channel', channel)}
                              >
                                ✏️
                              </button>
                              <button 
                                className="btn-icon danger" 
                                title="Delete"
                                onClick={() => handleDelete('channel', channel.id)}
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
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="logs-tab">
              <div className="tab-header">
                <h2>Communication Logs</h2>
                <div className="filters">
                  <select 
                    className="form-select"
                    value={logChannelFilter}
                    onChange={(e) => setLogChannelFilter(e.target.value)}
                  >
                    <option value="">All Channels</option>
                    <option value="EMAIL">Email</option>
                    <option value="SMS">SMS</option>
                    <option value="PUSH">Push</option>
                    <option value="WHATSAPP">WhatsApp</option>
                  </select>
                  <select 
                    className="form-select"
                    value={logStatusFilter}
                    onChange={(e) => setLogStatusFilter(e.target.value)}
                  >
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
                                {log.message?.length > 50 
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
                              <button 
                                className="btn-icon" 
                                title="View Details"
                                onClick={() => {
                                  setDetailsData(log);
                                  handleOpenModal('details');
                                }}
                              >
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
                <button 
                  className="btn btn-primary"
                  onClick={() => handleOpenModal('bulk')}
                >
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
                              {bulk.channels?.map((channel, index) => (
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
                                <button 
                                  className="btn-icon" 
                                  title="Send Now"
                                  onClick={() => handleSendBulk(bulk.id)}
                                >
                                  ▶️
                                </button>
                              )}
                              <button 
                                className="btn-icon" 
                                title="View Details"
                                onClick={() => {
                                  setDetailsData(bulk);
                                  handleOpenModal('details');
                                }}
                              >
                                👁️
                              </button>
                              <button 
                                className="btn-icon" 
                                title="Edit"
                                onClick={() => handleOpenModal('bulk', bulk)}
                              >
                                ✏️
                              </button>
                              <button 
                                className="btn-icon danger" 
                                title="Delete"
                                onClick={() => handleDelete('bulk', bulk.id)}
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
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="preferences-tab">
              <div className="tab-header">
                <h2>Notification Preferences</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => handleOpenModal('preference')}
                >
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
                              {pref.channels?.map((channel, index) => (
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
                            {pref.quietHours?.enabled ? (
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
                              <button 
                                className="btn-icon" 
                                title="Edit"
                                onClick={() => handleOpenModal('preference', pref)}
                              >
                                ✏️
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

        {/* Modals */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {modalType === 'preview' && 'Preview'}
                  {modalType === 'details' && 'Details'}
                  {modalType === 'emailTemplate' && (editingItem ? 'Edit' : 'Add') + ' Email Template'}
                  {modalType === 'smsTemplate' && (editingItem ? 'Edit' : 'Add') + ' SMS Template'}
                  {modalType === 'channel' && (editingItem ? 'Edit' : 'Add') + ' Channel'}
                  {modalType === 'bulk' && (editingItem ? 'Edit' : 'Create') + ' Bulk Communication'}
                  {modalType === 'preference' && (editingItem ? 'Edit' : 'Add') + ' Preference'}
                </h2>
                <button className="modal-close" onClick={handleCloseModal}>✕</button>
              </div>

              {modalType === 'preview' && previewData && (
                <div className="modal-body">
                  {previewData.subject && <div><strong>Subject:</strong> {previewData.subject}</div>}
                  <div><strong>Message:</strong></div>
                  <div style={{ whiteSpace: 'pre-wrap', padding: '1rem', background: 'var(--bg-tertiary)', borderRadius: '8px', marginTop: '0.5rem' }}>
                    {previewData.body || previewData.message}
                  </div>
                </div>
              )}

              {modalType === 'details' && detailsData && (
                <div className="modal-body">
                  <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                    {JSON.stringify(detailsData, null, 2)}
                  </pre>
                </div>
              )}

              {(modalType === 'emailTemplate' || modalType === 'smsTemplate' || modalType === 'channel' || modalType === 'bulk' || modalType === 'preference') && (
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {/* Email Template Form */}
                    {modalType === 'emailTemplate' && (
                      <>
                        <div className="form-group">
                          <label>Name *</label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Template Type *</label>
                          <select
                            value={formData.templateType || 'CUSTOM'}
                            onChange={(e) => setFormData({ ...formData, templateType: e.target.value })}
                            required
                          >
                            <option value="INVOICE_DUE">Invoice Due</option>
                            <option value="PAYMENT_RECEIVED">Payment Received</option>
                            <option value="CONTRACT_EXPIRING">Contract Expiring</option>
                            <option value="WELCOME">Welcome</option>
                            <option value="MAINTENANCE_REQUEST">Maintenance Request</option>
                            <option value="CUSTOM">Custom</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Subject *</label>
                          <input
                            type="text"
                            value={formData.subject || ''}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Body *</label>
                          <textarea
                            value={formData.body || ''}
                            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                            rows={8}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={formData.active !== false}
                              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            />
                            Active
                          </label>
                        </div>
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={formData.isDefault || false}
                              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                            />
                            Default Template
                          </label>
                        </div>
                      </>
                    )}

                    {/* SMS Template Form */}
                    {modalType === 'smsTemplate' && (
                      <>
                        <div className="form-group">
                          <label>Name *</label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Template Type *</label>
                          <select
                            value={formData.templateType || 'CUSTOM'}
                            onChange={(e) => setFormData({ ...formData, templateType: e.target.value })}
                            required
                          >
                            <option value="INVOICE_DUE">Invoice Due</option>
                            <option value="PAYMENT_RECEIVED">Payment Received</option>
                            <option value="CONTRACT_EXPIRING">Contract Expiring</option>
                            <option value="REMINDER">Reminder</option>
                            <option value="CUSTOM">Custom</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Message *</label>
                          <textarea
                            value={formData.message || ''}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={4}
                            maxLength={1600}
                            required
                          />
                          <small>{formData.message?.length || 0}/1600 characters</small>
                        </div>
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={formData.active !== false}
                              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            />
                            Active
                          </label>
                        </div>
                      </>
                    )}

                    {/* Channel Form */}
                    {modalType === 'channel' && (
                      <>
                        <div className="form-group">
                          <label>Name *</label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Type *</label>
                          <select
                            value={formData.type || 'EMAIL'}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            required
                          >
                            <option value="EMAIL">Email</option>
                            <option value="SMS">SMS</option>
                            <option value="PUSH">Push Notification</option>
                            <option value="WHATSAPP">WhatsApp</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Configuration (JSON)</label>
                          <textarea
                            value={JSON.stringify(formData.configuration || {}, null, 2)}
                            onChange={(e) => {
                              try {
                                setFormData({ ...formData, configuration: JSON.parse(e.target.value) });
                              } catch (err) {
                                // Invalid JSON, keep as is
                              }
                            }}
                            rows={6}
                          />
                        </div>
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={formData.active !== false}
                              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            />
                            Active
                          </label>
                        </div>
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={formData.isDefault || false}
                              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                            />
                            Default Channel
                          </label>
                        </div>
                      </>
                    )}

                    {/* Bulk Communication Form */}
                    {modalType === 'bulk' && (
                      <>
                        <div className="form-group">
                          <label>Name *</label>
                          <input
                            type="text"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Recipient Type *</label>
                          <select
                            value={formData.recipientType || 'ALL_TENANTS'}
                            onChange={(e) => setFormData({ ...formData, recipientType: e.target.value })}
                            required
                          >
                            <option value="ALL_TENANTS">All Tenants</option>
                            <option value="ACTIVE_TENANTS">Active Tenants</option>
                            <option value="OVERDUE_TENANTS">Overdue Tenants</option>
                            <option value="EXPIRING_CONTRACTS">Expiring Contracts</option>
                            <option value="CUSTOM">Custom</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Channels *</label>
                          <div>
                            {['EMAIL', 'SMS', 'PUSH', 'WHATSAPP'].map(channel => (
                              <label key={channel} style={{ display: 'block', marginBottom: '0.5rem' }}>
                                <input
                                  type="checkbox"
                                  checked={(formData.channels || []).includes(channel)}
                                  onChange={(e) => {
                                    const channels = formData.channels || [];
                                    if (e.target.checked) {
                                      setFormData({ ...formData, channels: [...channels, channel] });
                                    } else {
                                      setFormData({ ...formData, channels: channels.filter((c: string) => c !== channel) });
                                    }
                                  }}
                                />
                                {channel}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Message *</label>
                          <textarea
                            value={formData.message || ''}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            rows={6}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Subject (for Email)</label>
                          <input
                            type="text"
                            value={formData.subject || ''}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label>Scheduled At (optional)</label>
                          <input
                            type="datetime-local"
                            value={formData.scheduledAt || ''}
                            onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                          />
                        </div>
                      </>
                    )}

                    {/* Preference Form */}
                    {modalType === 'preference' && (
                      <>
                        <div className="form-group">
                          <label>User ID *</label>
                          <input
                            type="number"
                            value={formData.userId || ''}
                            onChange={(e) => setFormData({ ...formData, userId: parseInt(e.target.value) })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Notification Type *</label>
                          <select
                            value={formData.notificationType || 'INVOICE_DUE'}
                            onChange={(e) => setFormData({ ...formData, notificationType: e.target.value })}
                            required
                          >
                            <option value="INVOICE_DUE">Invoice Due</option>
                            <option value="PAYMENT_RECEIVED">Payment Received</option>
                            <option value="CONTRACT_EXPIRING">Contract Expiring</option>
                            <option value="MAINTENANCE_REQUEST">Maintenance Request</option>
                            <option value="SYSTEM">System</option>
                            <option value="MARKETING">Marketing</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Channels *</label>
                          <div>
                            {['EMAIL', 'SMS', 'PUSH', 'WHATSAPP', 'IN_APP'].map(channel => (
                              <label key={channel} style={{ display: 'block', marginBottom: '0.5rem' }}>
                                <input
                                  type="checkbox"
                                  checked={(formData.channels || []).includes(channel)}
                                  onChange={(e) => {
                                    const channels = formData.channels || [];
                                    if (e.target.checked) {
                                      setFormData({ ...formData, channels: [...channels, channel] });
                                    } else {
                                      setFormData({ ...formData, channels: channels.filter((c: string) => c !== channel) });
                                    }
                                  }}
                                />
                                {channel}
                              </label>
                            ))}
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Frequency *</label>
                          <select
                            value={formData.frequency || 'IMMEDIATE'}
                            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            required
                          >
                            <option value="IMMEDIATE">Immediate</option>
                            <option value="DAILY_DIGEST">Daily Digest</option>
                            <option value="WEEKLY_DIGEST">Weekly Digest</option>
                            <option value="NEVER">Never</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={formData.enabled !== false}
                              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                            />
                            Enabled
                          </label>
                        </div>
                        <div className="form-group">
                          <label>
                            <input
                              type="checkbox"
                              checked={formData.quietHours?.enabled || false}
                              onChange={(e) => setFormData({ 
                                ...formData, 
                                quietHours: { 
                                  ...formData.quietHours, 
                                  enabled: e.target.checked 
                                } 
                              })}
                            />
                            Enable Quiet Hours
                          </label>
                        </div>
                        {formData.quietHours?.enabled && (
                          <>
                            <div className="form-group">
                              <label>Start Time</label>
                              <input
                                type="time"
                                value={formData.quietHours?.startTime || '22:00'}
                                onChange={(e) => setFormData({ 
                                  ...formData, 
                                  quietHours: { 
                                    ...formData.quietHours, 
                                    startTime: e.target.value 
                                  } 
                                })}
                              />
                            </div>
                            <div className="form-group">
                              <label>End Time</label>
                              <input
                                type="time"
                                value={formData.quietHours?.endTime || '08:00'}
                                onChange={(e) => setFormData({ 
                                  ...formData, 
                                  quietHours: { 
                                    ...formData.quietHours, 
                                    endTime: e.target.value 
                                  } 
                                })}
                              />
                            </div>
                          </>
                        )}
                      </>
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
              )}

              {(modalType === 'preview' || modalType === 'details') && (
                <div className="modal-actions">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
