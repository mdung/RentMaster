import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { invoiceApi } from '../services/api/invoiceApi';
import { contractApi } from '../services/api/contractApi';
import { Invoice, Contract } from '../types';
import './InvoicesPage.css';

export const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [generateData, setGenerateData] = useState<any>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [invoicesData, contractsData] = await Promise.all([
        invoiceApi.getAll(),
        contractApi.getAll('ACTIVE'),
      ]);
      setInvoices(invoicesData);
      setContracts(contractsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await invoiceApi.generate(generateData);
      setShowGenerateModal(false);
      setGenerateData({});
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate invoice');
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
      <div className="invoices-page">
        <div className="page-header">
          <h1>Invoices</h1>
          <button onClick={() => { setGenerateData({}); setShowGenerateModal(true); }}>
            Generate Invoice
          </button>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Contract</th>
              <th>Tenant</th>
              <th>Room</th>
              <th>Period</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td>#{invoice.id}</td>
                <td>{invoice.contractCode}</td>
                <td>{invoice.tenantName}</td>
                <td>{invoice.roomCode}</td>
                <td>{formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}</td>
                <td>{formatCurrency(invoice.totalAmount)}</td>
                <td>{formatCurrency(invoice.paidAmount)}</td>
                <td>{invoice.status}</td>
                <td>
                  <button onClick={() => setSelectedInvoice(invoice)}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showGenerateModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Generate Invoice</h2>
              <form onSubmit={handleGenerate}>
                <select
                  value={generateData.contractId || ''}
                  onChange={(e) => setGenerateData({ ...generateData, contractId: parseInt(e.target.value) })}
                  required
                >
                  <option value="">Select Contract</option>
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>{c.code} - {c.primaryTenantName}</option>
                  ))}
                </select>
                <input
                  type="date"
                  placeholder="Period Start *"
                  value={generateData.periodStart || ''}
                  onChange={(e) => setGenerateData({ ...generateData, periodStart: e.target.value })}
                  required
                />
                <input
                  type="date"
                  placeholder="Period End *"
                  value={generateData.periodEnd || ''}
                  onChange={(e) => setGenerateData({ ...generateData, periodEnd: e.target.value })}
                  required
                />
                <input
                  type="date"
                  placeholder="Issue Date"
                  value={generateData.issueDate || ''}
                  onChange={(e) => setGenerateData({ ...generateData, issueDate: e.target.value })}
                />
                <input
                  type="date"
                  placeholder="Due Date"
                  value={generateData.dueDate || ''}
                  onChange={(e) => setGenerateData({ ...generateData, dueDate: e.target.value })}
                />
                <div className="modal-actions">
                  <button type="submit">Generate</button>
                  <button type="button" onClick={() => setShowGenerateModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedInvoice && (
          <div className="modal">
            <div className="modal-content large">
              <h2>Invoice Details</h2>
              <div className="invoice-details">
                <p><strong>Contract:</strong> {selectedInvoice.contractCode}</p>
                <p><strong>Tenant:</strong> {selectedInvoice.tenantName}</p>
                <p><strong>Room:</strong> {selectedInvoice.roomCode}</p>
                <p><strong>Period:</strong> {formatDate(selectedInvoice.periodStart)} - {formatDate(selectedInvoice.periodEnd)}</p>
                <p><strong>Total:</strong> {formatCurrency(selectedInvoice.totalAmount)}</p>
                <p><strong>Paid:</strong> {formatCurrency(selectedInvoice.paidAmount)}</p>
                <p><strong>Remaining:</strong> {formatCurrency(selectedInvoice.remainingAmount)}</p>
                <p><strong>Status:</strong> {selectedInvoice.status}</p>
                <h3>Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedInvoice.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.description}</td>
                        <td>{item.quantity}</td>
                        <td>{formatCurrency(item.unitPrice)}</td>
                        <td>{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="modal-actions">
                <button onClick={() => setSelectedInvoice(null)}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

