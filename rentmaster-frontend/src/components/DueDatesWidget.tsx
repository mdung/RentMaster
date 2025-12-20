import React, { useState } from 'react';
import { UpcomingDueDate } from '../types';
import './DueDatesWidget.css';

interface DueDatesWidgetProps {
  dueDates: UpcomingDueDate[];
  title?: string;
  maxItems?: number;
  onItemClick?: (item: UpcomingDueDate) => void;
}

export const DueDatesWidget: React.FC<DueDatesWidgetProps> = ({
  dueDates,
  title = "Upcoming Due Dates",
  maxItems = 8,
  onItemClick
}) => {
  const [filter, setFilter] = useState<string>('ALL');

  const filteredDueDates = dueDates.filter(item => 
    filter === 'ALL' || item.status === filter
  );

  const displayedItems = filteredDueDates.slice(0, maxItems);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      const diffTime = date.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) {
        return `${Math.abs(diffDays)} days overdue`;
      } else if (diffDays <= 7) {
        return `In ${diffDays} days`;
      } else {
        return date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'OVERDUE': return 'overdue';
      case 'DUE_TODAY': return 'due-today';
      case 'UPCOMING': return 'upcoming';
      default: return 'upcoming';
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'urgent';
      case 'HIGH': return 'high';
      case 'MEDIUM': return 'medium';
      case 'LOW': return 'low';
      default: return 'medium';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'INVOICE': return '🧾';
      case 'CONTRACT': return '📄';
      case 'MAINTENANCE': return '🔧';
      case 'INSPECTION': return '🔍';
      default: return '📅';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'INVOICE': return 'var(--error)';
      case 'CONTRACT': return 'var(--primary)';
      case 'MAINTENANCE': return 'var(--warning)';
      case 'INSPECTION': return 'var(--info)';
      default: return 'var(--text-muted)';
    }
  };

  const statusOptions = ['ALL', 'OVERDUE', 'DUE_TODAY', 'UPCOMING'];

  return (
    <div className="due-dates-widget">
      <div className="widget-header">
        <h3 className="widget-title">{title}</h3>
        <div className="widget-filters">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'All Items' : status.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="due-dates-list">
        {displayedItems.length === 0 ? (
          <div className="due-dates-empty">
            <div className="empty-icon">📅</div>
            <p>No upcoming due dates</p>
          </div>
        ) : (
          displayedItems.map((item) => (
            <div 
              key={item.id}
              className={`due-date-item ${getStatusClass(item.status)} ${getPriorityClass(item.priority)}`}
              onClick={() => onItemClick?.(item)}
            >
              <div className="due-date-icon" style={{ color: getTypeColor(item.type) }}>
                {getTypeIcon(item.type)}
              </div>
              
              <div className="due-date-content">
                <div className="due-date-main">
                  <h4 className="due-date-title">{item.title}</h4>
                  <span className={`due-date-time ${getStatusClass(item.status)}`}>
                    {formatDate(item.dueDate)}
                  </span>
                </div>
                
                <p className="due-date-description">{item.description}</p>
                
                <div className="due-date-meta">
                  <span className={`due-date-type ${item.type.toLowerCase()}`}>
                    {item.type}
                  </span>
                  
                  {item.amount && (
                    <span className="due-date-amount">
                      {formatCurrency(item.amount)}
                    </span>
                  )}
                  
                  {item.priority !== 'LOW' && (
                    <span className={`due-date-priority ${getPriorityClass(item.priority)}`}>
                      {item.priority}
                    </span>
                  )}
                </div>
              </div>
              
              {onItemClick && (
                <div className="due-date-arrow">→</div>
              )}
            </div>
          ))
        )}
      </div>

      {filteredDueDates.length > maxItems && (
        <div className="widget-footer">
          <button className="view-all-btn">
            View All ({filteredDueDates.length})
          </button>
        </div>
      )}
    </div>
  );
};