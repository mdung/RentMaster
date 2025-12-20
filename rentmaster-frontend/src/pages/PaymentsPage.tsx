import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { ExportModal } from '../components/ExportModal';
import { paymentApi } from '../services/api/paymentApi';
import { invoiceApi } from '../services/api/invoiceApi';
import { Payment, Invoice } from '../types';
import './PaymentsPage.css';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [paymentsData, invoicesData] = await Promise.all([
        paymentApi.getAll(),
        invoiceApi.getAll('PENDING'),
      ]);
      setPayments(paymentsData);
      setInvoices(invoicesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPayment) {
        await paymentApi.update(editingPayment.id, {
          amount: formData.amount,
          method: formData.method,
          note: formData.note,
        });
      } else {
        await paymentApi.create(formData);
      }
      setShowModal(false);
      setEditingPayment(null);
      setFormData({});
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create payment');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await paymentApi.delete(id);
      loadData();
    } catch (error) {
      alert('Failed to delete payment');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPaymentMethodBadge = (method: string | undefined) => {
    if (!method) return <span style={{ color: 'var(--text-muted)' }}>-</span>;
    
    const methodUpper = method.toUpperCase();
    let badgeClass = 'info';
    let icon = '💳';
    
    if (methodUpper.includes('BANK') || methodUpper.includes('TRANSFER')) {
      badgeClass = 'info';
      icon = '🏦';
    } else if (methodUpper.includes('CASH')) {
      badgeClass = 'success';
      icon = '💵';
    } else if (methodUpper.includes('CARD') || methodUpper.includes('CREDIT')) {
      badgeClass = 'info';
      icon = '💳';
    } else if (methodUpper.includes('MOBILE') || methodUpper.includes('WALLET')) {
      badgeClass = 'warning';
      icon = '📱';
    }
    
    return (
      <span className={`status-badge ${badgeClass}`}>
        {icon} {method}
      </span>
    );
  };

  return (
    <MainLayout>
      <div className="payments-page">
        <div className="page-header">
          <div>
            <h1>Payments</h1>
            <p className="page-subtitle">Track and manage payment records</p>
          </div>
          <div className="action-buttons">
            <button className="btn btn-outline" onClick={() => setShowExportModal(true)}>
              <span>📊</span> Export
            </button>
            <button className="btn btn-primary" onClick={() => { setFormData({}); setShowModal(true); }}>
              <span>➕</span> Add Payment
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Payment #</th>
                <th>Invoice #</th>
                <th>Amount</th>
                <th>Paid At</th>
                <th>Method</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">💰</span>
                      <p>No payments found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id}>
                    <td><strong>#{payment.id}</strong></td>
                    <td>#{payment.invoiceId}</td>
                    <td><strong>{formatCurrency(payment.amount)}</strong></td>
                    <td>{formatDate(payment.paidAt)}</td>
                    <td>{getPaymentMethodBadge(payment.method)}</td>
                    <td>{payment.note || <span style={{ color: 'var(--text-muted)' }}>-</span>}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => {
                            setEditingPayment(payment);
                            setFormData({
                              invoiceId: payment.invoiceId,
                              amount: payment.amount,
                              method: payment.method,
                              note: payment.note,
                            });
                            setShowModal(true);
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => handleDelete(payment.id)}
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
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingPayment ? 'Edit Payment' : 'Add Payment'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Invoice *</label>
                  <select
                    value={formData.invoiceId || ''}
                    onChange={(e) => setFormData({ ...formData, invoiceId: parseInt(e.target.value) })}
                    required
                    disabled={!!editingPayment}
                  >
                    <option value="">Select Invoice</option>
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        #{inv.id} - {inv.contractCode} - {formatCurrency(inv.remainingAmount)} remaining
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Amount (VND) *</label>
                  <input
                    type="number"
                    placeholder="Enter payment amount"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    required
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Payment Method</label>
                  <select
                    value={formData.method || ''}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  >
                    <option value="">Select Method</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CASH">Cash</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="MOBILE_WALLET">Mobile Wallet</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Note</label>
                  <textarea
                    placeholder="Payment notes or reference"
                    value={formData.note || ''}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    rows={3}
                  />
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Save Payment</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          entity="PAYMENTS"
          title="Payments"
        />
      </div>
    </MainLayout>
  );
};

