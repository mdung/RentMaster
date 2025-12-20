import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/MainLayout';
import { integrationApi, Integration, WebhookConfiguration } from '../services/api/integrationApi';
import './IntegrationPage.css';

export const IntegrationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('integrations');
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'integration' | 'webhook'>('integration');
  const [selectedItem, setSelectedItem] = useState<Integration | WebhookConfiguration | null>(null);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [integrationsData, webhooksData, statsData] = await Promise.all([
        integrationApi.getIntegrations(),
        integrationApi.getWebhookConfigurations(),
        integrationApi.getIntegrationStats()
      ]);
      
      setIntegrations(integrationsData);
      setWebhooks(webhooksData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading integration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIntegration = () => {
    setSelectedItem(null);
    setModalType('integration');
    setShowModal(true);
  };

  const handleEditIntegration = (integration: Integration) => {
    setSelectedItem(integration);
    setModalType('integration');
    setShowModal(true);
  };

  const handleCreateWebhook = () => {
    setSelectedItem(null);
    setModalType('webhook');
    setShowModal(true);
  };

  const handleEditWebhook = (webhook: WebhookConfiguration) => {
    setSelectedItem(webhook);
    setModalType('webhook');
    setShowModal(true);
  };

  const handleToggleIntegration = async (id: number) => {
    try {
      await integrationApi.toggleIntegration(id);
      loadData();
    } catch (error) {
      console.error('Error toggling integration:', error);
    }
  };

  const handleTestIntegration = async (id: number) => {
    try {
      const result = await integrationApi.testIntegration(id);
      alert(result.success ? 'Integration test successful!' : `Test failed: ${result.message}`);
    } catch (error) {
      console.error('Error testing integration:', error);
      alert('Integration test failed');
    }
  };

  const renderIntegrationsTab = () => (
    <div className="integrations-tab">
      <div className="tab-header">
        <h3>Third-Party Integrations</h3>
        <button className="btn btn-primary" onClick={handleCreateIntegration}>
          Add Integration
        </button>
      </div>

      <div className="integration-stats">
        <div className="stat-card">
          <div className="stat-value">{integrations.length}</div>
          <div className="stat-label">Total Integrations</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{integrations.filter(i => i.isActive).length}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{integrations.filter(i => i.autoSync).length}</div>
          <div className="stat-label">Auto-Sync Enabled</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalSyncs || 0}</div>
          <div className="stat-label">Total Syncs</div>
        </div>
      </div>

      <div className="integrations-grid">
        {integrations.map(integration => (
          <div key={integration.id} className={`integration-card ${integration.isActive ? 'active' : 'inactive'}`}>
            <div className="integration-header">
              <div className="integration-icon">
                {getIntegrationIcon(integration.type)}
              </div>
              <div className="integration-info">
                <h4>{integration.name}</h4>
                <span className="integration-type">{integration.type}</span>
              </div>
              <div className="integration-status">
                <span className={`status-badge ${integration.syncStatus.toLowerCase()}`}>
                  {integration.syncStatus}
                </span>
              </div>
            </div>

            <div className="integration-body">
              <p>{integration.description}</p>
              
              <div className="integration-metrics">
                <div className="metric">
                  <span className="metric-label">Success Rate:</span>
                  <span className="metric-value">
                    {integration.successCount + integration.errorCount > 0 
                      ? Math.round((integration.successCount / (integration.successCount + integration.errorCount)) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="metric">
                  <span className="metric-label">Last Sync:</span>
                  <span className="metric-value">
                    {integration.lastSyncAt ? new Date(integration.lastSyncAt).toLocaleDateString() : 'Never'}
                  </span>
                </div>
                {integration.autoSync && (
                  <div className="metric">
                    <span className="metric-label">Next Sync:</span>
                    <span className="metric-value">
                      {integration.nextSyncAt ? new Date(integration.nextSyncAt).toLocaleDateString() : 'Not scheduled'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="integration-actions">
              <button 
                className="btn btn-sm btn-secondary" 
                onClick={() => handleEditIntegration(integration)}
              >
                Configure
              </button>
              <button 
                className="btn btn-sm btn-outline" 
                onClick={() => handleTestIntegration(integration.id)}
              >
                Test
              </button>
              <button 
                className={`btn btn-sm ${integration.isActive ? 'btn-warning' : 'btn-success'}`}
                onClick={() => handleToggleIntegration(integration.id)}
              >
                {integration.isActive ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWebhooksTab = () => (
    <div className="webhooks-tab">
      <div className="tab-header">
        <h3>Webhook Configurations</h3>
        <button className="btn btn-primary" onClick={handleCreateWebhook}>
          Add Webhook
        </button>
      </div>

      <div className="webhooks-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>URL</th>
              <th>Event Types</th>
              <th>Status</th>
              <th>Success Rate</th>
              <th>Last Triggered</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {webhooks.map(webhook => (
              <tr key={webhook.id}>
                <td>
                  <div className="webhook-name">
                    <strong>{webhook.name}</strong>
                    {webhook.description && <small>{webhook.description}</small>}
                  </div>
                </td>
                <td>
                  <code className="webhook-url">{webhook.url}</code>
                </td>
                <td>
                  <div className="event-types">
                    {webhook.eventTypes.slice(0, 2).map(type => (
                      <span key={type} className="event-type-badge">{type}</span>
                    ))}
                    {webhook.eventTypes.length > 2 && (
                      <span className="event-type-badge">+{webhook.eventTypes.length - 2} more</span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`status-badge ${webhook.isActive ? 'active' : 'inactive'}`}>
                    {webhook.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  {webhook.successCount + webhook.failureCount > 0 
                    ? Math.round((webhook.successCount / (webhook.successCount + webhook.failureCount)) * 100)
                    : 0}%
                </td>
                <td>
                  {webhook.lastTriggeredAt 
                    ? new Date(webhook.lastTriggeredAt).toLocaleDateString()
                    : 'Never'
                  }
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleEditWebhook(webhook)}
                    >
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline">
                      Test
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPaymentGatewaysTab = () => (
    <div className="payment-gateways-tab">
      <div className="tab-header">
        <h3>Payment Gateway Integration</h3>
        <button className="btn btn-primary">
          Add Payment Gateway
        </button>
      </div>

      <div className="payment-gateways-grid">
        <div className="gateway-card">
          <div className="gateway-icon">💳</div>
          <h4>Stripe</h4>
          <p>Accept credit cards, digital wallets, and bank transfers</p>
          <div className="gateway-status active">Connected</div>
          <button className="btn btn-secondary">Configure</button>
        </div>

        <div className="gateway-card">
          <div className="gateway-icon">🅿️</div>
          <h4>PayPal</h4>
          <p>Accept PayPal payments and digital wallet transactions</p>
          <div className="gateway-status inactive">Not Connected</div>
          <button className="btn btn-primary">Connect</button>
        </div>

        <div className="gateway-card">
          <div className="gateway-icon">⬜</div>
          <h4>Square</h4>
          <p>In-person and online payment processing</p>
          <div className="gateway-status inactive">Not Connected</div>
          <button className="btn btn-primary">Connect</button>
        </div>

        <div className="gateway-card">
          <div className="gateway-icon">🏦</div>
          <h4>Bank Transfer</h4>
          <p>Direct bank account transfers and ACH payments</p>
          <div className="gateway-status active">Connected</div>
          <button className="btn btn-secondary">Configure</button>
        </div>
      </div>
    </div>
  );

  const renderAPIDocsTab = () => (
    <div className="api-docs-tab">
      <div className="tab-header">
        <h3>API Documentation</h3>
        <div className="api-actions">
          <button className="btn btn-secondary">Download OpenAPI Spec</button>
          <button className="btn btn-primary">View Interactive Docs</button>
        </div>
      </div>

      <div className="api-overview">
        <div className="api-info-card">
          <h4>🔗 Base URL</h4>
          <code>https://api.rentmaster.com/v1</code>
        </div>

        <div className="api-info-card">
          <h4>🔐 Authentication</h4>
          <p>Bearer Token (JWT)</p>
          <code>Authorization: Bearer &lt;your-token&gt;</code>
        </div>

        <div className="api-info-card">
          <h4>📊 Rate Limits</h4>
          <p>1000 requests per hour per API key</p>
        </div>

        <div className="api-info-card">
          <h4>📝 Response Format</h4>
          <p>JSON with consistent error handling</p>
        </div>
      </div>

      <div className="api-endpoints">
        <h4>Available Endpoints</h4>
        <div className="endpoint-categories">
          <div className="endpoint-category">
            <h5>🏢 Properties</h5>
            <ul>
              <li><span className="method get">GET</span> /properties</li>
              <li><span className="method post">POST</span> /properties</li>
              <li><span className="method put">PUT</span> /properties/{id}</li>
              <li><span className="method delete">DELETE</span> /properties/{id}</li>
            </ul>
          </div>

          <div className="endpoint-category">
            <h5>👥 Tenants</h5>
            <ul>
              <li><span className="method get">GET</span> /tenants</li>
              <li><span className="method post">POST</span> /tenants</li>
              <li><span className="method put">PUT</span> /tenants/{id}</li>
              <li><span className="method delete">DELETE</span> /tenants/{id}</li>
            </ul>
          </div>

          <div className="endpoint-category">
            <h5>💰 Payments</h5>
            <ul>
              <li><span className="method get">GET</span> /payments</li>
              <li><span className="method post">POST</span> /payments</li>
              <li><span className="method get">GET</span> /payment-intents</li>
              <li><span className="method post">POST</span> /payment-intents</li>
            </ul>
          </div>

          <div className="endpoint-category">
            <h5>🔗 Webhooks</h5>
            <ul>
              <li><span className="method post">POST</span> /webhooks/stripe</li>
              <li><span className="method post">POST</span> /webhooks/paypal</li>
              <li><span className="method get">GET</span> /webhooks/events</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const getIntegrationIcon = (type: string) => {
    const icons: Record<string, string> = {
      QUICKBOOKS: '📊',
      XERO: '📈',
      BANK_PLAID: '🏦',
      BANK_YODLEE: '🏛️',
      GOOGLE_CALENDAR: '📅',
      OUTLOOK_CALENDAR: '📆',
      STRIPE: '💳',
      PAYPAL: '🅿️',
      SQUARE: '⬜',
      MAILCHIMP: '📧',
      SENDGRID: '✉️',
      TWILIO: '📱',
      SLACK: '💬',
      ZAPIER: '⚡',
      CUSTOM_WEBHOOK: '🔗'
    };
    return icons[type] || '🔌';
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading integrations...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="integration-page">
        <div className="page-header">
          <h1>Integration & APIs</h1>
          <p>Manage third-party integrations, webhooks, and API access</p>
        </div>

        <div className="integration-tabs">
          <button 
            className={`tab-button ${activeTab === 'integrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('integrations')}
          >
            🔌 Integrations
          </button>
          <button 
            className={`tab-button ${activeTab === 'webhooks' ? 'active' : ''}`}
            onClick={() => setActiveTab('webhooks')}
          >
            🔗 Webhooks
          </button>
          <button 
            className={`tab-button ${activeTab === 'payment-gateways' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment-gateways')}
          >
            💳 Payment Gateways
          </button>
          <button 
            className={`tab-button ${activeTab === 'api-docs' ? 'active' : ''}`}
            onClick={() => setActiveTab('api-docs')}
          >
            📚 API Documentation
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'integrations' && renderIntegrationsTab()}
          {activeTab === 'webhooks' && renderWebhooksTab()}
          {activeTab === 'payment-gateways' && renderPaymentGatewaysTab()}
          {activeTab === 'api-docs' && renderAPIDocsTab()}
        </div>
      </div>
    </MainLayout>
  );
};