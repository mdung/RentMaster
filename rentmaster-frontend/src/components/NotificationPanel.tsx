import React, { useEffect, useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import './NotificationPanel.css';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    loading, 
    loadNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotifications();
  
  const [filter, setFilter] = useState<'ALL' | 'UNREAD'>('ALL');

  useEffect(() => {
    if (isOpen && notifications.length === 0) {
      loadNotifications();
    }
  }, [isOpen]);

  const filteredNotifications = notifications.filter(n => 
    filter === 'ALL' || !n.read
  );

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'INVOICE_DUE': return '🧾';
      case 'PAYMENT_RECEIVED': return '💰';
      case 'CONTRACT_EXPIRING': return '📄';
      case 'MAINTENANCE_REQUEST': return '🔧';
      case 'REMINDER': return '⏰';
      case 'SYSTEM': return '⚙️';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return 'var(--error)';
      case 'HIGH': return 'var(--warning)';
      case 'MEDIUM': return 'var(--primary)';
      case 'LOW': return 'var(--text-muted)';
      default: return 'var(--text-secondary)';
    }
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.relatedEntityType && notification.relatedEntityId) {
      // TODO: Navigate to related entity
      console.log(`Navigate to ${notification.relatedEntityType} ${notification.relatedEntityId}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="notification-panel-overlay" onClick={onClose}>
      <div className="notification-panel" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          <h3>Notifications</h3>
          <div className="notification-header-actions">
            <div className="notification-filters">
              <button 
                className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
                onClick={() => setFilter('ALL')}
              >
                All
              </button>
              <button 
                className={`filter-btn ${filter === 'UNREAD' ? 'active' : ''}`}
                onClick={() => setFilter('UNREAD')}
              >
                Unread
              </button>
            </div>
            <button className="mark-all-read-btn" onClick={markAllAsRead}>
              Mark all read
            </button>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="notification-list">
          {loading && notifications.length === 0 ? (
            <div className="notification-loading">
              <div className="loading-spinner">⏳</div>
              <p>Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="notification-empty">
              <div className="empty-icon">🔔</div>
              <p>{filter === 'UNREAD' ? 'No unread notifications' : 'No notifications yet'}</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div 
                key={notification.id}
                className={`notification-item ${!notification.read ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-title">
                    {notification.title}
                    {!notification.read && <span className="unread-dot"></span>}
                  </div>
                  <div className="notification-message">
                    {notification.message}
                  </div>
                  <div className="notification-meta">
                    <span className="notification-time">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                    <span 
                      className="notification-priority"
                      style={{ color: getPriorityColor(notification.priority) }}
                    >
                      {notification.priority}
                    </span>
                  </div>
                </div>
                <div className="notification-actions">
                  <button 
                    className="notification-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {filteredNotifications.length > 0 && (
          <div className="notification-footer">
            <button 
              className="load-more-btn"
              onClick={() => loadNotifications(Math.floor(notifications.length / 20))}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};