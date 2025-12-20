import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/MainLayout';
import { useNotifications } from '../context/NotificationContext';
import { notificationApi } from '../services/api/notificationApi';
import './NotificationSettingsPage.css';

export const NotificationSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useNotifications();
  const [formData, setFormData] = useState({
    emailNotifications: true,
    smsNotifications: false,
    inAppNotifications: true,
    invoiceDueReminders: true,
    paymentReceivedNotifications: true,
    contractExpiringReminders: true,
    maintenanceRequestNotifications: true,
    reminderDaysBefore: 3,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        emailNotifications: settings.emailNotifications,
        smsNotifications: settings.smsNotifications,
        inAppNotifications: settings.inAppNotifications,
        invoiceDueReminders: settings.invoiceDueReminders,
        paymentReceivedNotifications: settings.paymentReceivedNotifications,
        contractExpiringReminders: settings.contractExpiringReminders,
        maintenanceRequestNotifications: settings.maintenanceRequestNotifications,
        reminderDaysBefore: settings.reminderDaysBefore,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateSettings(formData);
      setMessage({ type: 'success', text: 'Notification settings updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleTestNotification = async (type: string) => {
    try {
      await notificationApi.testNotification(type);
      setMessage({ type: 'success', text: `Test ${type.toLowerCase()} notification sent!` });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send test notification.' });
    }
  };

  const handleToggle = (field: keyof typeof formData) => {
    setFormData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <MainLayout>
      <div className="notification-settings-page">
        <div className="page-header">
          <div>
            <h1>Notification Settings</h1>
            <p className="page-subtitle">Manage how and when you receive notifications</p>
          </div>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="settings-container">
          <form onSubmit={handleSubmit} className="settings-form">
            <div className="settings-section">
              <h2>Notification Channels</h2>
              <p className="section-description">Choose how you want to receive notifications</p>
              
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">📧</div>
                  <div>
                    <h3>Email Notifications</h3>
                    <p>Receive notifications via email</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">📱</div>
                  <div>
                    <h3>SMS Notifications</h3>
                    <p>Receive notifications via SMS (coming soon)</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.smsNotifications}
                    onChange={() => handleToggle('smsNotifications')}
                    disabled
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">🔔</div>
                  <div>
                    <h3>In-App Notifications</h3>
                    <p>Show notifications in the application</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={formData.inAppNotifications}
                    onChange={() => handleToggle('inAppNotifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h2>Notification Types</h2>
              <p className="section-description">Choose which events trigger notifications</p>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">🧾</div>
                  <div>
                    <h3>Invoice Due Reminders</h3>
                    <p>Get notified when invoices are due or overdue</p>
                  </div>
                </div>
                <div className="setting-actions">
                  <button
                    type="button"
                    className="test-btn"
                    onClick={() => handleTestNotification('INVOICE_DUE')}
                  >
                    Test
                  </button>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.invoiceDueReminders}
                      onChange={() => handleToggle('invoiceDueReminders')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">💰</div>
                  <div>
                    <h3>Payment Received</h3>
                    <p>Get notified when payments are received</p>
                  </div>
                </div>
                <div className="setting-actions">
                  <button
                    type="button"
                    className="test-btn"
                    onClick={() => handleTestNotification('PAYMENT_RECEIVED')}
                  >
                    Test
                  </button>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.paymentReceivedNotifications}
                      onChange={() => handleToggle('paymentReceivedNotifications')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">📄</div>
                  <div>
                    <h3>Contract Expiring</h3>
                    <p>Get notified when contracts are about to expire</p>
                  </div>
                </div>
                <div className="setting-actions">
                  <button
                    type="button"
                    className="test-btn"
                    onClick={() => handleTestNotification('CONTRACT_EXPIRING')}
                  >
                    Test
                  </button>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.contractExpiringReminders}
                      onChange={() => handleToggle('contractExpiringReminders')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">🔧</div>
                  <div>
                    <h3>Maintenance Requests</h3>
                    <p>Get notified about maintenance requests</p>
                  </div>
                </div>
                <div className="setting-actions">
                  <button
                    type="button"
                    className="test-btn"
                    onClick={() => handleTestNotification('MAINTENANCE_REQUEST')}
                  >
                    Test
                  </button>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={formData.maintenanceRequestNotifications}
                      onChange={() => handleToggle('maintenanceRequestNotifications')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="settings-section">
              <h2>Reminder Settings</h2>
              <p className="section-description">Configure when to send reminder notifications</p>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">⏰</div>
                  <div>
                    <h3>Reminder Timing</h3>
                    <p>How many days before due date to send reminders</p>
                  </div>
                </div>
                <div className="reminder-input">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={formData.reminderDaysBefore}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      reminderDaysBefore: parseInt(e.target.value) || 1
                    }))}
                  />
                  <span>days before</span>
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};