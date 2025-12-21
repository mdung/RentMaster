import React, { useState, useEffect } from 'react';
import { ExportRequest } from '../types';
import { exportApi } from '../services/api/exportApi';
import './ExportModal.css';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entity: 'INVOICES' | 'PAYMENTS' | 'CONTRACTS' | 'TENANTS' | 'PROPERTIES' | 'USERS';
  title: string;
  filters?: Record<string, any>;
}

export const ExportModal: React.FC<ExportModalProps> = ({ 
  isOpen, 
  onClose, 
  entity, 
  title,
  filters = {} 
}) => {
  const [exportType, setExportType] = useState<'EXCEL' | 'CSV' | 'PDF'>('EXCEL');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [includeFilters, setIncludeFilters] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadAvailableColumns();
      // Set default date range to last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      setDateRange({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0]
      });
    }
  }, [isOpen, entity]);

  const loadAvailableColumns = async () => {
    try {
      const columns = await exportApi.getAvailableColumns(entity);
      setAvailableColumns(columns);
      setSelectedColumns(columns); // Select all by default
    } catch (error) {
      console.error('Failed to load available columns:', error);
    }
  };

  const handleExport = async () => {
    setLoading(true);
    try {
      const request: ExportRequest = {
        type: exportType,
        entity,
        filters: includeFilters ? filters : undefined,
        dateRange: dateRange.startDate && dateRange.endDate ? dateRange : undefined,
        columns: selectedColumns.length > 0 ? selectedColumns : undefined
      };

      let blob: Blob;
      let mimeType: string;
      
      switch (exportType) {
        case 'EXCEL':
          blob = await exportApi.exportToExcel(request);
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
        case 'CSV':
          blob = await exportApi.exportToCsv(request);
          mimeType = 'text/csv';
          break;
        case 'PDF':
          blob = await exportApi.exportToPdf(request);
          mimeType = 'application/pdf';
          break;
      }

      const filename = exportApi.generateFilename(entity, exportType);
      exportApi.downloadFile(blob, filename, mimeType);
      
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Export failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleColumn = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column) 
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const selectAllColumns = () => {
    setSelectedColumns(availableColumns);
  };

  const deselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const getExportTypeIcon = (type: string) => {
    switch (type) {
      case 'EXCEL': return '📊';
      case 'CSV': return '📄';
      case 'PDF': return '📋';
      default: return '📁';
    }
  };

  const formatColumnName = (column: string) => {
    return column
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  if (!isOpen) return null;

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="export-modal-header">
          <h2>Export {title}</h2>
          <button className="export-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="export-modal-content">
          <div className="export-section">
            <h3>Export Format</h3>
            <div className="export-type-grid">
              {(['EXCEL', 'CSV', 'PDF'] as const).map((type) => (
                <button
                  key={type}
                  className={`export-type-btn ${exportType === type ? 'active' : ''}`}
                  onClick={() => setExportType(type)}
                >
                  <span className="export-type-icon">{getExportTypeIcon(type)}</span>
                  <span className="export-type-name">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="export-section">
            <h3>Date Range</h3>
            <div className="date-range-inputs">
              <div className="date-input-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="date-input-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {Object.keys(filters).length > 0 && (
            <div className="export-section">
              <h3>Current Filters</h3>
              <div className="filter-option">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={includeFilters}
                    onChange={(e) => setIncludeFilters(e.target.checked)}
                  />
                  <span className="checkbox-custom"></span>
                  Include current page filters in export
                </label>
              </div>
              {includeFilters && (
                <div className="current-filters">
                  {Object.entries(filters)
                    .filter(([key, value]) => value !== undefined && value !== null && value !== '')
                    .map(([key, value]) => (
                      <div key={key} className="filter-item">
                        <strong>{formatColumnName(key)}:</strong> {String(value)}
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          <div className="export-section">
            <div className="columns-header">
              <h3>Columns to Export</h3>
              <div className="column-actions">
                <button className="column-action-btn" onClick={selectAllColumns}>
                  Select All
                </button>
                <button className="column-action-btn" onClick={deselectAllColumns}>
                  Deselect All
                </button>
              </div>
            </div>
            <div className="columns-grid">
              {availableColumns.map((column) => (
                <label key={column} className="column-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(column)}
                    onChange={() => toggleColumn(column)}
                  />
                  <span className="checkbox-custom"></span>
                  <span className="column-name">{formatColumnName(column)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="export-modal-footer">
          <div className="export-info">
            <span className="export-format-info">
              {getExportTypeIcon(exportType)} {exportType} format
            </span>
            <span className="export-columns-info">
              {selectedColumns.length} of {availableColumns.length} columns
            </span>
          </div>
          <div className="export-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleExport}
              disabled={loading || selectedColumns.length === 0}
            >
              {loading ? 'Exporting...' : `Export ${exportType}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};