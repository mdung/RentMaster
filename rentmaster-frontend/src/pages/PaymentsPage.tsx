import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { paymentApi } from '../services/api/paymentApi';
import { invoiceApi } from '../services/api/invoiceApi';
import { Payment, Invoice } from '../types';
import './PaymentsPage.css';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showModal, setShowModal] = useState(false);
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
      await paymentApi.create(formData);
      setShowModal(false);
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
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <MainLayout>
      <div className="payments-page">
        <div className="page-header">
          <h1>Payments</h1>
          <button onClick={() => { setFormData({}); setShowModal(true); }}>
            Add Payment
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Amount</th>
              <th>Paid At</th>
              <th>Method</th>
              <th>Note</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>#{payment.invoiceId}</td>
                <td>{formatCurrency(payment.amount)}</td>
                <td>{formatDate(payment.paidAt)}</td>
                <td>{payment.method || '-'}</td>
                <td>{payment.note || '-'}</td>
                <td>
                  <button onClick={() => handleDelete(payment.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Add Payment</h2>
              <form onSubmit={handleSubmit}>
                <select
                  value={formData.invoiceId || ''}
                  onChange={(e) => setFormData({ ...formData, invoiceId: parseInt(e.target.value) })}
                  required
                >
                  <option value="">Select Invoice</option>
                  {invoices.map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      #{inv.id} - {inv.contractCode} - {formatCurrency(inv.remainingAmount)} remaining
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Amount *"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                  required
                  step="0.01"
                />
                <input
                  placeholder="Payment Method"
                  value={formData.method || ''}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                />
                <textarea
                  placeholder="Note"
                  value={formData.note || ''}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
                <div className="modal-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

