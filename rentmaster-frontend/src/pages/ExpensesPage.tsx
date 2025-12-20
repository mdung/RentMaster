import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import { ExportModal } from '../components/ExportModal';
import { financialApi } from '../services/api/financialApi';
import { propertyApi } from '../services/api/propertyApi';
import { Expense, Property, Currency } from '../types';
import './ExpensesPage.css';

export const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [filters, setFilters] = useState({
    category: '',
    propertyId: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      const [expensesData, propertiesData, currenciesData, categoriesData] = await Promise.all([
        financialApi.getExpenses(filters),
        propertyApi.getAll(),
        financialApi.getCurrencies(),
        financialApi.getExpenseCategories(),
      ]);
      
      setExpenses(expensesData);
      setProperties(propertiesData);
      setCurrencies(currenciesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await financialApi.updateExpense(editingExpense.id, formData);
      } else {
        await financialApi.createExpense(formData);
      }
      setShowModal(false);
      setEditingExpense(null);
      setFormData({});
      loadData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to save expense');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    try {
      await financialApi.deleteExpense(id);
      loadData();
    } catch (error) {
      alert('Failed to delete expense');
    }
  };

  const formatCurrency = (amount: number, currencyCode: string = 'USD') => {
    const currency = currencies.find(c => c.code === currencyCode);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category.toLowerCase()) {
      case 'maintenance': return 'warning';
      case 'utilities': return 'info';
      case 'administrative': return 'primary';
      case 'marketing': return 'success';
      case 'insurance': return 'secondary';
      default: return 'gray';
    }
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => {
      // Convert to default currency if needed
      const currency = currencies.find(c => c.code === expense.currency);
      const rate = currency?.exchangeRate || 1;
      return total + (expense.amount / rate);
    }, 0);
  };

  const getExpensesByCategory = () => {
    const categoryTotals: Record<string, number> = {};
    expenses.forEach(expense => {
      const currency = currencies.find(c => c.code === expense.currency);
      const rate = currency?.exchangeRate || 1;
      const amount = expense.amount / rate;
      
      categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + amount;
    });
    return categoryTotals;
  };

  const defaultCurrency = currencies.find(c => c.isDefault)?.code || 'USD';

  return (
    <MainLayout>
      <div className="expenses-page">
        <div className="page-header">
          <div>
            <h1>Expense Management</h1>
            <p className="page-subtitle">Track and manage property maintenance costs</p>
          </div>
          <div className="action-buttons">
            <button className="btn btn-outline" onClick={() => setShowExportModal(true)}>
              <span>📊</span> Export
            </button>
            <button className="btn btn-primary" onClick={() => { setFormData({}); setShowModal(true); }}>
              <span>➕</span> Add Expense
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="expense-summary">
          <div className="summary-card total">
            <div className="summary-icon">💰</div>
            <div className="summary-content">
              <h3>Total Expenses</h3>
              <div className="summary-value">{formatCurrency(getTotalExpenses(), defaultCurrency)}</div>
              <div className="summary-period">This period</div>
            </div>
          </div>
          
          <div className="summary-card count">
            <div className="summary-icon">📊</div>
            <div className="summary-content">
              <h3>Total Records</h3>
              <div className="summary-value">{expenses.length}</div>
              <div className="summary-period">Expense entries</div>
            </div>
          </div>

          <div className="summary-card categories">
            <div className="summary-icon">📋</div>
            <div className="summary-content">
              <h3>Categories</h3>
              <div className="summary-value">{Object.keys(getExpensesByCategory()).length}</div>
              <div className="summary-period">Active categories</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Property</label>
              <select
                value={filters.propertyId}
                onChange={(e) => setFilters({ ...filters, propertyId: e.target.value })}
              >
                <option value="">All Properties</option>
                {properties.map(property => (
                  <option key={property.id} value={property.id}>{property.name}</option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <label>Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>
            
            <div className="filter-group">
              <label>End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Property</th>
                <th>Amount</th>
                <th>Vendor</th>
                <th>Receipt #</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-state">
                    <div className="empty-state-content">
                      <span className="empty-icon">💸</span>
                      <p>No expenses found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{formatDate(expense.expenseDate)}</td>
                    <td>
                      <span className={`status-badge ${getCategoryBadgeClass(expense.category)}`}>
                        {expense.category}
                      </span>
                    </td>
                    <td>{expense.description}</td>
                    <td>{expense.propertyName || '-'}</td>
                    <td><strong>{formatCurrency(expense.amount, expense.currency)}</strong></td>
                    <td>{expense.vendor || '-'}</td>
                    <td>{expense.receiptNumber || '-'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-icon"
                          onClick={() => {
                            setEditingExpense(expense);
                            setFormData({
                              propertyId: expense.propertyId,
                              category: expense.category,
                              description: expense.description,
                              amount: expense.amount,
                              currency: expense.currency,
                              expenseDate: expense.expenseDate,
                              vendor: expense.vendor,
                              receiptNumber: expense.receiptNumber,
                              notes: expense.notes,
                            });
                            setShowModal(true);
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-icon danger"
                          onClick={() => handleDelete(expense.id)}
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

        {/* Add/Edit Expense Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingExpense ? 'Edit Expense' : 'Add Expense'}</h2>
                <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Property</label>
                    <select
                      value={formData.propertyId || ''}
                      onChange={(e) => setFormData({ ...formData, propertyId: parseInt(e.target.value) || undefined })}
                    >
                      <option value="">Select Property</option>
                      {properties.map(property => (
                        <option key={property.id} value={property.id}>{property.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <input
                    type="text"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter expense description"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Amount *</label>
                    <input
                      type="number"
                      value={formData.amount || ''}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Currency *</label>
                    <select
                      value={formData.currency || defaultCurrency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      required
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Expense Date *</label>
                    <input
                      type="date"
                      value={formData.expenseDate || ''}
                      onChange={(e) => setFormData({ ...formData, expenseDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Vendor</label>
                    <input
                      type="text"
                      value={formData.vendor || ''}
                      onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                      placeholder="Vendor name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Receipt Number</label>
                  <input
                    type="text"
                    value={formData.receiptNumber || ''}
                    onChange={(e) => setFormData({ ...formData, receiptNumber: e.target.value })}
                    placeholder="Receipt or invoice number"
                  />
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes"
                    rows={3}
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingExpense ? 'Update Expense' : 'Add Expense'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          entity="EXPENSES"
          title="Expenses"
          filters={filters}
        />
      </div>
    </MainLayout>
  );
};