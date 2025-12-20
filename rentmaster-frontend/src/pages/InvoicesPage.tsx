import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { ExportModal } from '../components/ExportModal';
import { invoiceApi, MeterReadingInput } from '../services/api/invoiceApi';
import { contractApi } from '../services/api/contractApi';
import { contractServiceApi, ContractService } from '../services/api/contractServiceApi';
import { Invoice, Contract } from '../types';
import './InvoicesPage.css';

export const InvoicesPage: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [generateData, setGenerateData] = useState<any>({});
  const [contractServices, setContractServices] = useState<ContractService[]>([]);
  const [meterReadings, setMeterReadings] = useState<MeterReadingInput[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);

  useEffect(() => {
    loadData();
  }, [statusFilter, currentPage, pageSize]);

  const loadData = async () => {
    try {
      const [paged, contractsData] = await Promise.all([
        invoiceApi.getPaged(
          statusFilter === 'ALL' ? undefined : statusFilter,
          currentPage - 1,
          pageSize
        ),
        contractApi.getAll('ACTIVE'),
      ]);
      setInvoices(paged.items);
      setTotalInvoices(paged.total);
      setContracts(contractsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...generateData,
        meterReadings: meterReadings.filter(
          (m) => m.currentIndex !== undefined && !Number.isNaN(m.currentIndex)
        ),
      };
      await invoiceApi.generate(payload);
      setShowGenerateModal(false);
      setGenerateData({});
      setMeterReadings([]);
      // After generating, reset to first page to ensure the new invoice is visible
      setCurrentPage(1);
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate invoice');
    }
  };

  const loadContractServices = async (contractId: number) => {
    try {
      const data = await contractServiceApi.getByContractId(contractId);
      setContractServices(data);
    } catch (error) {
      console.error('Failed to load contract services:', error);
      setContractServices([]);
    }
  };

  const handleSelectContractForGenerate = async (contractId: number) => {
    setGenerateData({ ...generateData, contractId });
    setMeterReadings([]);
    if (contractId) {
      await loadContractServices(contractId);
    } else {
      setContractServices([]);
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
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'OVERDUE':
        return 'error';
      case 'PARTIALLY_PAID':
        return 'info';
      default:
        return 'gray';
    }
  };

  const getPreviousIndex = (contractId: number, serviceId: number): number | null => {
    // Find last invoice for this contract that has an item for the given service
    const related = invoices
      .filter((inv) => inv.contractId === contractId)
      .sort(
        (a, b) =>
          new Date(b.periodEnd).getTime() - new Date(a.periodEnd).getTime()
      );

    for (const invoice of related) {
      const item = invoice.items.find((it) => it.serviceId === serviceId && it.currentIndex !== undefined && it.currentIndex !== null);
      if (item && item.currentIndex !== undefined && item.currentIndex !== null) {
        return item.currentIndex;
      }
    }
    return null;
  };

  return (
    <MainLayout>
      <div className="invoices-page">
        <div className="page-header">
          <div>
            <h1>Invoices</h1>
            <p className="page-subtitle">Manage invoices and billing</p>
          </div>
          <div className="action-buttons">
            <button className="btn btn-outline" onClick={() => setShowExportModal(true)}>
              <span>📊</span> Export
            </button>
            <button className="btn btn-primary" onClick={() => { setGenerateData({}); setShowGenerateModal(true); }}>
              <span>➕</span> Generate Invoice
            </button>
          </div>
        </div>

        <div className="table-container">
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
                <th>Remaining</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={10} className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">🧾</span>
                      <p>No invoices found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td><strong>#{invoice.id}</strong></td>
                    <td>{invoice.contractCode}</td>
                    <td>{invoice.tenantName}</td>
                    <td>{invoice.roomCode}</td>
                    <td>{formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}</td>
                    <td>{formatCurrency(invoice.totalAmount)}</td>
                    <td>{formatCurrency(invoice.paidAmount)}</td>
                    <td>
                      <span style={{ color: invoice.remainingAmount > 0 ? 'var(--error)' : 'var(--success)' }}>
                        {formatCurrency(invoice.remainingAmount)}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(invoice.status)}`}>
                        {invoice.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => setSelectedInvoice(invoice)}
                          title="View Details"
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

          {/* Pagination footer */}
          <div className="table-footer">
            <div className="table-footer-left">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              <span>
                {totalInvoices === 0
                  ? '0–0 of 0'
                  : `${(currentPage - 1) * pageSize + 1}–${Math.min(
                      currentPage * pageSize,
                      totalInvoices
                    )} of ${totalInvoices}`}
              </span>
            </div>
            <div className="table-footer-right">
              <button
                className="btn-icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                title="Previous page"
              >
                ◀
              </button>
              <span>
                Page {currentPage} of{' '}
                {Math.max(1, Math.ceil(totalInvoices / pageSize))}
              </span>
              <button
                className="btn-icon"
                onClick={() =>
                  setCurrentPage((p) =>
                    p < Math.ceil(totalInvoices / pageSize) ? p + 1 : p
                  )
                }
                disabled={currentPage >= Math.ceil(totalInvoices / pageSize)}
                title="Next page"
              >
                ▶
              </button>
            </div>
          </div>
        </div>

        {showGenerateModal && (
          <div className="modal-overlay" onClick={() => setShowGenerateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Generate Invoice</h2>
                <button className="modal-close" onClick={() => setShowGenerateModal(false)}>✕</button>
              </div>
              <form onSubmit={handleGenerate}>
                <div className="form-group">
                  <label>Contract *</label>
                  <select
                    value={generateData.contractId || ''}
                    onChange={(e) => handleSelectContractForGenerate(parseInt(e.target.value))}
                    required
                  >
                    <option value="">Select Contract</option>
                    {contracts.map((c) => (
                      <option key={c.id} value={c.id}>{c.code} - {c.primaryTenantName}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Period Start *</label>
                  <input
                    type="date"
                    value={generateData.periodStart || ''}
                    onChange={(e) => setGenerateData({ ...generateData, periodStart: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Period End *</label>
                  <input
                    type="date"
                    value={generateData.periodEnd || ''}
                    onChange={(e) => setGenerateData({ ...generateData, periodEnd: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Issue Date</label>
                  <input
                    type="date"
                    value={generateData.issueDate || ''}
                    onChange={(e) => setGenerateData({ ...generateData, issueDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={generateData.dueDate || ''}
                    onChange={(e) => setGenerateData({ ...generateData, dueDate: e.target.value })}
                  />
                </div>

                {/* Meter readings section for per-unit services (electricity, water) */}
                {generateData.contractId && (
                  <div className="meter-section">
                    <h3>Meter Readings (optional)</h3>
                    <p className="meter-section-subtitle">
                      Enter current meter indexes for electricity and water. Previous index is auto-filled from the last invoice.
                    </p>
                    <div className="meter-grid">
                      {contractServices
                        .filter(
                          (cs) =>
                            cs.serviceType === 'ELECTRICITY' ||
                            cs.serviceType === 'WATER'
                        )
                        .map((cs) => {
                          const prev = getPreviousIndex(
                            generateData.contractId,
                            cs.serviceId
                          );
                          const existing = meterReadings.find(
                            (m) => m.serviceId === cs.serviceId
                          );
                          const currentValue =
                            existing?.currentIndex !== undefined
                              ? existing.currentIndex
                              : '';

                          const unitLabel =
                            cs.unitName || (cs.serviceType === 'ELECTRICITY' ? 'kWh' : 'm³');

                          let usage: number | null = null;
                          if (prev !== null && existing && existing.currentIndex !== undefined) {
                            usage = existing.currentIndex - prev;
                            if (usage < 0) usage = 0;
                          }

                          return (
                            <div key={cs.id} className="meter-card">
                              <div className="meter-header">
                                <span className="meter-icon">
                                  {cs.serviceType === 'ELECTRICITY' ? '⚡' : '💧'}
                                </span>
                                <div>
                                  <div className="meter-title">{cs.serviceName}</div>
                                  <div className="meter-subtitle">
                                    Unit: {unitLabel} · Price:{' '}
                                    {cs.defaultUnitPrice
                                      ? cs.defaultUnitPrice.toLocaleString('vi-VN')
                                      : '-'}
                                  </div>
                                </div>
                              </div>
                              <div className="meter-fields">
                                <div className="meter-field">
                                  <label>Previous Index</label>
                                  <input
                                    type="number"
                                    value={prev !== null ? prev : 0}
                                    disabled
                                  />
                                </div>
                                <div className="meter-field">
                                  <label>Current Index</label>
                                  <input
                                    type="number"
                                    value={currentValue}
                                    min={prev ?? 0}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      const numeric = val === '' ? NaN : parseFloat(val);
                                      setMeterReadings((prevReadings) => {
                                        const others = prevReadings.filter(
                                          (m) => m.serviceId !== cs.serviceId
                                        );
                                        if (Number.isNaN(numeric)) {
                                          return others;
                                        }
                                        return [
                                          ...others,
                                          { serviceId: cs.serviceId, currentIndex: numeric },
                                        ];
                                      });
                                    }}
                                  />
                                </div>
                                <div className="meter-field">
                                  <label>Usage</label>
                                  <input
                                    type="text"
                                    value={
                                      usage !== null
                                        ? `${usage.toFixed(2)} ${unitLabel}`
                                        : '-'
                                    }
                                    disabled
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      {contractServices.filter(
                        (cs) =>
                          cs.serviceType === 'ELECTRICITY' ||
                          cs.serviceType === 'WATER'
                      ).length === 0 && (
                        <p className="meter-empty-text">
                          No per-unit electricity or water services configured for this contract.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Generate</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowGenerateModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedInvoice && (
          <div className="modal-overlay" onClick={() => setSelectedInvoice(null)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Invoice Details #{selectedInvoice.id}</h2>
                <button className="modal-close" onClick={() => setSelectedInvoice(null)}>✕</button>
              </div>
              <div className="invoice-details">
                <p><strong>Contract:</strong> {selectedInvoice.contractCode}</p>
                <p><strong>Tenant:</strong> {selectedInvoice.tenantName}</p>
                <p><strong>Room:</strong> {selectedInvoice.roomCode}</p>
                <p><strong>Period:</strong> {formatDate(selectedInvoice.periodStart)} - {formatDate(selectedInvoice.periodEnd)}</p>
                <p><strong>Total:</strong> {formatCurrency(selectedInvoice.totalAmount)}</p>
                <p><strong>Paid:</strong> {formatCurrency(selectedInvoice.paidAmount)}</p>
                <p><strong>Remaining:</strong> {formatCurrency(selectedInvoice.remainingAmount)}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`status-badge ${getStatusBadgeClass(selectedInvoice.status)}`}>
                    {selectedInvoice.status.replace('_', ' ')}
                  </span>
                </p>
                <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Items</h3>
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
                {selectedInvoice.payments && selectedInvoice.payments.length > 0 && (
                  <>
                    <h3 style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>Payments</h3>
                    <table className="items-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Method</th>
                          <th>Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.payments.map((payment) => (
                          <tr key={payment.id}>
                            <td>{formatDate(payment.paidAt)}</td>
                            <td>{formatCurrency(payment.amount)}</td>
                            <td>{payment.method || '-'}</td>
                            <td>{payment.note || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setSelectedInvoice(null)}>Close</button>
              </div>
            </div>
          </div>
        )}

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          entity="INVOICES"
          title="Invoices"
          filters={{ status: statusFilter !== 'ALL' ? statusFilter : undefined }}
        />
      </div>
    </MainLayout>
  );
};

