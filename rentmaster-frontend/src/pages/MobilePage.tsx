import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/MainLayout';
import { mobileApi, MobileDevice } from '../services/api/mobileApi';
import './MobilePage.css';

export const MobilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [devices, setDevices] = useState<MobileDevice[]>([]);
  const [analytics, setAnalytics] = useState<any>({});
  const [qrCode, setQrCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrAction, setQrAction] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load mobile data (simulated)
      const mockDevices: MobileDevice[] = [
        {
          id: 1,
          userId: 1,
          deviceToken: 'device_token_123',
          platform: 'IOS',
          deviceModel: 'iPhone 14 Pro',
          deviceOsVersion: '17.0',
          appVersion: '1.2.0',
          isActive: true,
          pushNotificationsEnabled: true,
          lastActiveAt: '2024-01-10T10:30:00',
          registeredAt: '2024-01-01T09:00:00',
          updatedAt: '2024-01-10T10:30:00',
          supportsBiometric: true,
          supportsNfc: true,
          supportsCamera: true,
          supportsLocation: true,
          notificationSound: 'default',
          notificationVibration: true,
          quietHoursEnabled: true,
          quietHoursStart: '22:00',
          quietHoursEnd: '08:00'
        },
        {
          id: 2,
          userId: 2,
          deviceToken: 'device_token_456',
          platform: 'ANDROID',
          deviceModel: 'Samsung Galaxy S23',
          deviceOsVersion: '14.0',
          appVersion: '1.2.0',
          isActive: true,
          pushNotificationsEnabled: true,
          lastActiveAt: '2024-01-10T11:15:00',
          registeredAt: '2024-01-02T14:30:00',
          updatedAt: '2024-01-10T11:15:00',
          supportsBiometric: true,
          supportsNfc: true,
          supportsCamera: true,
          supportsLocation: true,
          notificationSound: 'default',
          notificationVibration: true,
          quietHoursEnabled: false,
          quietHoursStart: '22:00',
          quietHoursEnd: '08:00'
        }
      ];

      setDevices(mockDevices);
      setAnalytics({
        totalDevices: mockDevices.length,
        activeDevices: mockDevices.filter(d => d.isActive).length,
        iosDevices: mockDevices.filter(d => d.platform === 'IOS').length,
        androidDevices: mockDevices.filter(d => d.platform === 'ANDROID').length,
        totalSessions: 1250,
        averageSessionDuration: '4m 32s',
        crashRate: 0.02,
        appStoreRating: 4.8
      });
    } catch (error) {
      console.error('Error loading mobile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQR = async (action: string) => {
    try {
      const qrData = await mobileApi.generateQRCode({
        action: action,
        id: '123',
        timestamp: Date.now()
      });
      
      if (qrData.success && qrData.qrCode) {
        setQrCode(qrData.qrCode);
        setQrAction(action);
        setShowQRModal(true);
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const renderOverviewTab = () => (
    <div className="overview-tab">
      <div className="mobile-stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📱</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.totalDevices}</div>
            <div className="stat-label">Total Devices</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.activeDevices}</div>
            <div className="stat-label">Active Devices</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🍎</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.iosDevices}</div>
            <div className="stat-label">iOS Devices</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🤖</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.androidDevices}</div>
            <div className="stat-label">Android Devices</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.totalSessions}</div>
            <div className="stat-label">Total Sessions</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.averageSessionDuration}</div>
            <div className="stat-label">Avg Session</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <div className="stat-value">{analytics.appStoreRating}</div>
            <div className="stat-label">App Rating</div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🚫</div>
          <div className="stat-content">
            <div className="stat-value">{(analytics.crashRate * 100).toFixed(1)}%</div>
            <div className="stat-label">Crash Rate</div>
          </div>
        </div>
      </div>

      <div className="mobile-features-grid">
        <div className="feature-card">
          <div className="feature-header">
            <h3>📱 Mobile Dashboard</h3>
            <span className="feature-status active">Active</span>
          </div>
          <p>Mobile-optimized dashboard with real-time data and quick actions</p>
          <ul>
            <li>✅ Responsive design</li>
            <li>✅ Touch-friendly interface</li>
            <li>✅ Offline support</li>
            <li>✅ Push notifications</li>
          </ul>
        </div>

        <div className="feature-card">
          <div className="feature-header">
            <h3>💰 Mobile Payments</h3>
            <span className="feature-status active">Active</span>
          </div>
          <p>Secure payment processing with multiple payment methods</p>
          <ul>
            <li>✅ Apple Pay integration</li>
            <li>✅ Google Pay support</li>
            <li>✅ Credit card processing</li>
            <li>✅ Payment history</li>
          </ul>
        </div>

        <div className="feature-card">
          <div className="feature-header">
            <h3>📷 QR Code Scanner</h3>
            <span className="feature-status active">Active</span>
          </div>
          <p>Quick actions through QR code scanning</p>
          <ul>
            <li>✅ Property check-in</li>
            <li>✅ Maintenance updates</li>
            <li>✅ Document access</li>
            <li>✅ Payment processing</li>
          </ul>
        </div>

        <div className="feature-card">
          <div className="feature-header">
            <h3>📴 Offline Mode</h3>
            <span className="feature-status active">Active</span>
          </div>
          <p>Work offline and sync when connection is restored</p>
          <ul>
            <li>✅ Offline data storage</li>
            <li>✅ Action queuing</li>
            <li>✅ Auto-sync</li>
            <li>✅ Conflict resolution</li>
          </ul>
        </div>
      </div>
    </div>
  );

  const renderDevicesTab = () => (
    <div className="devices-tab">
      <div className="tab-header">
        <h3>Registered Mobile Devices</h3>
        <div className="device-filters">
          <select>
            <option value="">All Platforms</option>
            <option value="IOS">iOS</option>
            <option value="ANDROID">Android</option>
          </select>
          <select>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="devices-table">
        <table>
          <thead>
            <tr>
              <th>Device</th>
              <th>Platform</th>
              <th>App Version</th>
              <th>Last Active</th>
              <th>Notifications</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.map(device => (
              <tr key={device.id}>
                <td>
                  <div className="device-info">
                    <div className="device-icon">
                      {device.platform === 'IOS' ? '📱' : '🤖'}
                    </div>
                    <div>
                      <div className="device-model">{device.deviceModel}</div>
                      <div className="device-os">OS {device.deviceOsVersion}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`platform-badge ${device.platform.toLowerCase()}`}>
                    {device.platform}
                  </span>
                </td>
                <td>{device.appVersion}</td>
                <td>
                  {device.lastActiveAt 
                    ? new Date(device.lastActiveAt).toLocaleDateString()
                    : 'Never'
                  }
                </td>
                <td>
                  <span className={`notification-status ${device.pushNotificationsEnabled ? 'enabled' : 'disabled'}`}>
                    {device.pushNotificationsEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${device.isActive ? 'active' : 'inactive'}`}>
                    {device.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="device-actions">
                    <button className="btn btn-sm btn-secondary">View</button>
                    <button className="btn btn-sm btn-outline">Test Push</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderQRCodesTab = () => (
    <div className="qr-codes-tab">
      <div className="tab-header">
        <h3>QR Code Management</h3>
        <p>Generate QR codes for quick mobile actions</p>
      </div>

      <div className="qr-actions-grid">
        <div className="qr-action-card" onClick={() => handleGenerateQR('PROPERTY_CHECKIN')}>
          <div className="qr-action-icon">🏢</div>
          <h4>Property Check-in</h4>
          <p>Generate QR code for property check-in</p>
          <button className="btn btn-primary">Generate QR</button>
        </div>

        <div className="qr-action-card" onClick={() => handleGenerateQR('MAINTENANCE_UPDATE')}>
          <div className="qr-action-icon">🔧</div>
          <h4>Maintenance Update</h4>
          <p>QR code for maintenance status updates</p>
          <button className="btn btn-primary">Generate QR</button>
        </div>

        <div className="qr-action-card" onClick={() => handleGenerateQR('PAYMENT')}>
          <div className="qr-action-icon">💰</div>
          <h4>Quick Payment</h4>
          <p>QR code for payment processing</p>
          <button className="btn btn-primary">Generate QR</button>
        </div>

        <div className="qr-action-card" onClick={() => handleGenerateQR('DOCUMENT_ACCESS')}>
          <div className="qr-action-icon">📄</div>
          <h4>Document Access</h4>
          <p>QR code for document viewing</p>
          <button className="btn btn-primary">Generate QR</button>
        </div>

        <div className="qr-action-card" onClick={() => handleGenerateQR('EMERGENCY_CONTACT')}>
          <div className="qr-action-icon">🚨</div>
          <h4>Emergency Contact</h4>
          <p>QR code with emergency information</p>
          <button className="btn btn-primary">Generate QR</button>
        </div>

        <div className="qr-action-card" onClick={() => handleGenerateQR('WIFI_ACCESS')}>
          <div className="qr-action-icon">📶</div>
          <h4>WiFi Access</h4>
          <p>QR code for WiFi connection</p>
          <button className="btn btn-primary">Generate QR</button>
        </div>
      </div>

      <div className="qr-usage-stats">
        <h4>QR Code Usage Statistics</h4>
        <div className="usage-stats-grid">
          <div className="usage-stat">
            <div className="usage-value">1,234</div>
            <div className="usage-label">Total Scans</div>
          </div>
          <div className="usage-stat">
            <div className="usage-value">89</div>
            <div className="usage-label">This Week</div>
          </div>
          <div className="usage-stat">
            <div className="usage-value">Property Check-in</div>
            <div className="usage-label">Most Popular</div>
          </div>
          <div className="usage-stat">
            <div className="usage-value">98.5%</div>
            <div className="usage-label">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOfflineModeTab = () => (
    <div className="offline-mode-tab">
      <div className="tab-header">
        <h3>Offline Mode Management</h3>
        <p>Configure offline functionality and sync settings</p>
      </div>

      <div className="offline-config">
        <div className="config-section">
          <h4>Offline Data Settings</h4>
          <div className="config-grid">
            <div className="config-item">
              <label>Data Retention Period</label>
              <select>
                <option value="7">7 days</option>
                <option value="14">14 days</option>
                <option value="30" selected>30 days</option>
                <option value="60">60 days</option>
              </select>
            </div>
            <div className="config-item">
              <label>Max Offline Actions</label>
              <input type="number" value="100" min="10" max="1000" />
            </div>
            <div className="config-item">
              <label>Sync Interval (minutes)</label>
              <input type="number" value="15" min="5" max="60" />
            </div>
            <div className="config-item">
              <label>Auto-sync on WiFi</label>
              <input type="checkbox" checked />
            </div>
          </div>
        </div>

        <div className="config-section">
          <h4>Offline Capabilities</h4>
          <div className="capabilities-grid">
            <div className="capability-item">
              <div className="capability-icon">📊</div>
              <div className="capability-info">
                <h5>Dashboard Data</h5>
                <p>View dashboard statistics offline</p>
              </div>
              <div className="capability-status enabled">Enabled</div>
            </div>
            <div className="capability-item">
              <div className="capability-icon">💰</div>
              <div className="capability-info">
                <h5>Payment Queue</h5>
                <p>Queue payments for later processing</p>
              </div>
              <div className="capability-status enabled">Enabled</div>
            </div>
            <div className="capability-item">
              <div className="capability-icon">🔧</div>
              <div className="capability-info">
                <h5>Maintenance Updates</h5>
                <p>Update maintenance status offline</p>
              </div>
              <div className="capability-status enabled">Enabled</div>
            </div>
            <div className="capability-item">
              <div className="capability-icon">📄</div>
              <div className="capability-info">
                <h5>Document Cache</h5>
                <p>Cache documents for offline viewing</p>
              </div>
              <div className="capability-status enabled">Enabled</div>
            </div>
          </div>
        </div>

        <div className="config-section">
          <h4>Sync Statistics</h4>
          <div className="sync-stats-grid">
            <div className="sync-stat">
              <div className="sync-value">245</div>
              <div className="sync-label">Queued Actions</div>
            </div>
            <div className="sync-stat">
              <div className="sync-value">1,892</div>
              <div className="sync-label">Synced Actions</div>
            </div>
            <div className="sync-stat">
              <div className="sync-value">12</div>
              <div className="sync-label">Failed Actions</div>
            </div>
            <div className="sync-stat">
              <div className="sync-value">99.4%</div>
              <div className="sync-label">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="analytics-tab">
      <div className="tab-header">
        <h3>Mobile Analytics</h3>
        <p>Track mobile app usage and performance</p>
      </div>

      <div className="analytics-charts">
        <div className="chart-card">
          <h4>Daily Active Users</h4>
          <div className="chart-placeholder">
            <div className="chart-bars">
              {[65, 78, 82, 91, 88, 95, 102].map((height, index) => (
                <div key={index} className="chart-bar" style={{ height: `${height}%` }}></div>
              ))}
            </div>
            <div className="chart-labels">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h4>Platform Distribution</h4>
          <div className="platform-chart">
            <div className="platform-segment ios" style={{ width: '60%' }}>iOS (60%)</div>
            <div className="platform-segment android" style={{ width: '40%' }}>Android (40%)</div>
          </div>
        </div>

        <div className="chart-card">
          <h4>Feature Usage</h4>
          <div className="feature-usage">
            <div className="feature-bar">
              <span>Payments</span>
              <div className="bar"><div className="fill" style={{ width: '85%' }}></div></div>
              <span>85%</span>
            </div>
            <div className="feature-bar">
              <span>QR Scanner</span>
              <div className="bar"><div className="fill" style={{ width: '72%' }}></div></div>
              <span>72%</span>
            </div>
            <div className="feature-bar">
              <span>Maintenance</span>
              <div className="bar"><div className="fill" style={{ width: '68%' }}></div></div>
              <span>68%</span>
            </div>
            <div className="feature-bar">
              <span>Documents</span>
              <div className="bar"><div className="fill" style={{ width: '54%' }}></div></div>
              <span>54%</span>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h4>App Performance</h4>
          <div className="performance-metrics">
            <div className="metric">
              <div className="metric-label">Avg Load Time</div>
              <div className="metric-value good">1.2s</div>
            </div>
            <div className="metric">
              <div className="metric-label">Crash Rate</div>
              <div className="metric-value good">0.02%</div>
            </div>
            <div className="metric">
              <div className="metric-label">Memory Usage</div>
              <div className="metric-value warning">85MB</div>
            </div>
            <div className="metric">
              <div className="metric-label">Battery Impact</div>
              <div className="metric-value good">Low</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading mobile data...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mobile-page">
        <div className="page-header">
          <h1>Mobile Application</h1>
          <p>Manage mobile app features, devices, and analytics</p>
        </div>

        <div className="mobile-tabs">
          <button 
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📱 Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'devices' ? 'active' : ''}`}
            onClick={() => setActiveTab('devices')}
          >
            📲 Devices
          </button>
          <button 
            className={`tab-button ${activeTab === 'qr-codes' ? 'active' : ''}`}
            onClick={() => setActiveTab('qr-codes')}
          >
            📷 QR Codes
          </button>
          <button 
            className={`tab-button ${activeTab === 'offline-mode' ? 'active' : ''}`}
            onClick={() => setActiveTab('offline-mode')}
          >
            📴 Offline Mode
          </button>
          <button 
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            📊 Analytics
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'devices' && renderDevicesTab()}
          {activeTab === 'qr-codes' && renderQRCodesTab()}
          {activeTab === 'offline-mode' && renderOfflineModeTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
        </div>

        {/* QR Code Modal */}
        {showQRModal && (
          <div className="modal-overlay" onClick={() => setShowQRModal(false)}>
            <div className="qr-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>QR Code - {qrAction.replace('_', ' ')}</h3>
                <button className="close-btn" onClick={() => setShowQRModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="qr-code-display">
                  <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" />
                </div>
                <p>Scan this QR code with the mobile app to perform the action.</p>
                <div className="qr-actions">
                  <button className="btn btn-secondary" onClick={() => setShowQRModal(false)}>
                    Close
                  </button>
                  <button className="btn btn-primary">
                    Download QR Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};