import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { financialApi } from '../services/api/financialApi';
import { Currency } from '../types';

export const CurrencyManagementPage: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadCurrencies();
  }, []);

  const loadCurrencies = async () => {
    try {
      const data = await financialApi.getCurrencies();
      setCurrencies(data);
    } catch (error) {
      console.error('Failed to load currencies:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (editingCurrency) {
        await financialApi.updateCurrency(editingCurrency.id, formData);
        setMessage({ type: 'success', text: 'Currency updated successfully!' });
      } else {
        await financialApi.createCurrency(formData);
        setMessage({ type: 'success', text: 'Currency added successfully!' });
      }
      setShowModal(false);
      setEditingCurrency(null);
      setFormData({});
      loadCurrencies();
    } catch (error: any) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save currency' });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await financialApi.setDefaultCurrency(id);
      setMessage({ type: 'success', text: 'Default currency updated!' });
      loadCurrencies();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to set default currency' });
    }
  };

  const handleUpdateRates = async () => {
    setLoading(true);
    try {
      await financialApi.updateExchangeRates();
      setMessage({ type: 'success', text: 'Exchange rates updated successfully!' });
      loadCurrencies();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update exchange rates' });
    } finally {
      setLoading(false);
    }
  };

  const formatExchangeRate = (rate: number) => {
    return rate.toFixed(4);
  };

  const getLastUpdated = () => {
    // Mock last updated time
    return new Date().toLocaleString();
  };

  return (
    <MainLayout>
      <div className="currency-management-page">
        <div className="page-header">
          <div>
            <h1>Currency Management</h1>
            <p className="page-subtitle">Manage currencies and exchange rates</p>
          </div>
          <div className="action-buttons">
            <button 
              className="btn btn-outline" 
              onClick={handleUpdateRates}
              disabled={loading}
            >
              <span>🔄</span> Update Rates
            </button>
            <button className="btn btn-primary" onClick={() => { setFormData({}); setShowModal(true); }}>
              <span>➕</span> Add Currency
            </button>
          </div>
        </div>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Exchange Rate Info */}
        <div className="rate-info-card">
          <div className="rate-info-header">
            <h3>Exchange Rate Information</h3>
            <span className="last-updated">Last updated: {getLastUpdated()}</span>
          </div>
          <p>Exchange rates are updated automatically from external sources. You can also manually update rates or set custom rates for specific currencies.</p>
        </div>

        {/* Currencies Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Currency</th>
                <th>Code</th>
                <th>Symbol</th>
                <th>Exchange Rate</th>
                <th>Status</th>
                <th>Default</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currencies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">💱</span>
                      <p>No currencies configured</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currencies.map((currency) => (
                  <tr key={currency.id} className={currency.isDefault ? 'default-currency' : ''}>
                    <td><strong>{currency.name}</strong></td>
                    <td>
                      <span className="currency-code">{currency.code}</span>
                    </td>
                    <td>
                      <span className="currency-symbol">{currency.symbol}</span>
                    </td>
                    <td>
                      <span className="exchange-rate">
                        {currency.isDefault ? '1.0000 (Base)' : formatExchangeRate(currency.exchangeRate)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${currency.active ? 'success' : 'error'}`}>
                        {currency.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      {currency.isDefault ? (
                        <span className="default-badge">Default</span>
                      ) : (
                        <button
                          className="btn-link"
                          onClick={() => handleSetDefault(currency.id)}
                        >
                          Set as Default
                        </button>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => {
                            setEditingCurrency(currency);
                            setFormData({
                              code: currency.code,
                              name: currency.name,
                              symbol: currency.symbol,
                              exchangeRate: currency.exchangeRate,
                              active: currency.active,
                            });
                            setShowModal(true);
                          }}
                          title="Edit"
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

        {/* Add/Edit Currency Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingCurrency ? 'Edit Currency' : 'Add Currency'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Currency Code *</label>
                    <input
                      type="text"
                      value={formData.code || ''}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="USD"
                      maxLength={3}
                      required
                      disabled={!!editingCurrency}
                    />
                    <small>3-letter ISO currency code</small>
                  </div>
                  <div className="form-group">
                    <label>Currency Name *</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="US Dollar"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Symbol *</label>
                    <input
                      type="text"
                      value={formData.symbol || ''}
                      onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                      placeholder="$"
                      maxLength={5}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Exchange Rate *</label>
                    <input
                      type="number"
                      value={formData.exchangeRate || ''}
                      onChange={(e) => setFormData({ ...formData, exchangeRate: parseFloat(e.target.value) })}
                      placeholder="1.0000"
                      step="0.0001"
                      min="0"
                      required
                    />
                    <small>Rate relative to base currency</small>
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.active !== false}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    />
                    <span className="checkbox-custom"></span>
                    Active currency
                  </label>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : editingCurrency ? 'Update Currency' : 'Add Currency'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Currency Conversion Helper */}
        <div className="conversion-helper">
          <h3>Quick Currency Converter</h3>
          <div className="converter-grid">
            <div className="converter-input">
              <label>Amount</label>
              <input type="number" placeholder="100" />
            </div>
            <div className="converter-input">
              <label>From</label>
              <select>
                {currencies.filter(c => c.active).map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="converter-arrow">→</div>
            <div className="converter-input">
              <label>To</label>
              <select>
                {currencies.filter(c => c.active).map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="converter-result">
              <label>Result</label>
              <div className="result-display">-</div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};