import React, { useState } from 'react';
import { ActivityItem } from '../types';
import './ActivityFeed.css';

interface ActivityFeedProps {
  activities: ActivityItem[];
  title?: string;
  maxItems?: number;
  showFilters?: boolean;
  onActivityClick?: (activity: ActivityItem) => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  title = "Recent Activity",
  maxItems = 10,
  showFilters = true,
  onActivityClick
}) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [showAll, setShowAll] = useState(false);

  const filteredActivities = activities.filter(activity => 
    filter === 'ALL' || activity.type === filter
  );

  const displayedActivities = showAll 
    ? filteredActivities 
    : filteredActivities.slice(0, maxItems);

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'PAYMENT': return 'Payments';
      case 'TENANT': return 'Tenants';
      case 'CONTRACT': return 'Contracts';
      case 'MAINTENANCE': return 'Maintenance';
      case 'INVOICE': return 'Invoices';
      case 'SYSTEM': return 'System';
      default: return type;
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

  const activityTypes = ['ALL', 'PAYMENT', 'TENANT', 'CONTRACT', 'MAINTENANCE', 'INVOICE', 'SYSTEM'];

  return (
    <div className="activity-feed">
      <div className="activity-header">
        <h3 className="activity-title">{title}</h3>
        {showFilters && (
          <div className="activity-filters">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="activity-filter-select"
            >
              {activityTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'ALL' ? 'All Activities' : getActivityTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="activity-list">
        {displayedActivities.length === 0 ? (
          <div className="activity-empty">
            <div className="empty-icon">📋</div>
            <p>No activities found</p>
          </div>
        ) : (
          displayedActivities.map((activity) => (
            <div 
              key={activity.id}
              className={`activity-item ${getPriorityClass(activity.priority)}`}
              onClick={() => onActivityClick?.(activity)}
            >
              <div className="activity-icon" style={{ backgroundColor: activity.color }}>
                {activity.icon}
              </div>
              
              <div className="activity-content">
                <div className="activity-main">
                  <h4 className="activity-item-title">{activity.title}</h4>
                  <span className="activity-time">{formatTimeAgo(activity.timestamp)}</span>
                </div>
                <p className="activity-description">{activity.description}</p>
                
                <div className="activity-meta">
                  <span className={`activity-type ${activity.type.toLowerCase()}`}>
                    {getActivityTypeLabel(activity.type)}
                  </span>
                  {activity.priority !== 'LOW' && (
                    <span className={`activity-priority ${getPriorityClass(activity.priority)}`}>
                      {activity.priority}
                    </span>
                  )}
                </div>
              </div>
              
              {onActivityClick && (
                <div className="activity-arrow">→</div>
              )}
            </div>
          ))
        )}
      </div>

      {filteredActivities.length > maxItems && (
        <div className="activity-footer">
          <button 
            className="show-more-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show Less' : `Show All (${filteredActivities.length})`}
          </button>
        </div>
      )}
    </div>
  );
};