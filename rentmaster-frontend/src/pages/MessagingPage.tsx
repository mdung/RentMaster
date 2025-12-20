import React, { useState, useEffect } from 'react';
import { messagingApi } from '../services/api/messagingApi';
import './MessagingPage.css';

interface Message {
  id: number;
  senderId: number;
  senderName: string;
  senderType: string;
  recipientId: number;
  recipientName: string;
  recipientType: string;
  subject: string;
  content: string;
  messageType: string;
  priority: string;
  threadId?: number;
  parentMessageId?: number;
  propertyId?: number;
  contractId?: number;
  isRead: boolean;
  readAt?: string;
  isArchived: boolean;
  archivedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  attachments?: string[];
  tags?: string[];
  metadata?: string;
  createdAt: string;
  updatedAt?: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
  priority: string;
  targetAudience: string;
  propertyIds?: number[];
  tenantIds?: number[];
  authorId: number;
  authorName: string;
  authorType: string;
  publishDate: string;
  expiryDate?: string;
  isActive: boolean;
  isPinned: boolean;
  requiresAcknowledgment: boolean;
  readBy?: number[];
  acknowledgedBy?: number[];
  attachments?: string[];
  tags?: string[];
  viewCount: number;
  acknowledgmentCount: number;
  metadata?: string;
  createdAt: string;
  updatedAt?: string;
}

interface PropertyEvent {
  id: number;
  title: string;
  description?: string;
  type: string;
  category: string;
  priority: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  locationDetails?: string;
  propertyId: number;
  propertyName: string;
  organizerId: number;
  organizerName: string;
  organizerType: string;
  maxAttendees?: number;
  currentAttendees: number;
  attendeeIds?: number[];
  invitedIds?: number[];
  declinedIds?: number[];
  status: string;
  isPublic: boolean;
  requiresRSVP: boolean;
  allowGuestInvites: boolean;
  rsvpDeadline?: string;
  attachments?: string[];
  tags?: string[];
  notes?: string;
  requirements?: string;
  agenda?: string;
  contactInfo?: string;
  sendReminders: boolean;
  reminderHours: number;
  metadata?: string;
  createdAt: string;
  updatedAt?: string;
}

interface TenantFeedback {
  id: number;
  tenantId: number;
  tenantName: string;
  propertyId: number;
  propertyName: string;
  contractId?: number;
  type: string;
  category: string;
  subject: string;
  message: string;
  rating?: number;
  priority: string;
  status: string;
  attachments?: string[];
  tags?: string[];
  isAnonymous: boolean;
  allowFollowUp: boolean;
  isPublic: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: number;
  acknowledgedByName?: string;
  resolvedAt?: string;
  resolvedBy?: number;
  resolvedByName?: string;
  response?: string;
  respondedAt?: string;
  respondedBy?: number;
  respondedByName?: string;
  resolutionNotes?: string;
  internalNotes?: string;
  satisfactionRating?: number;
  satisfactionComment?: string;
  requiresAction: boolean;
  actionDueDate?: string;
  assignedTo?: number;
  assignedToName?: string;
  actionPlan?: string;
  metadata?: string;
  createdAt: string;
  updatedAt?: string;
}

export const MessagingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Messages state
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messageFilters, setMessageFilters] = useState({
    type: '',
    unreadOnly: false,
    searchTerm: ''
  });

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [announcementFilters, setAnnouncementFilters] = useState({
    type: '',
    propertyId: '',
    searchTerm: ''
  });

  // Events state
  const [events, setEvents] = useState<PropertyEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<PropertyEvent | null>(null);
  const [eventFilters, setEventFilters] = useState({
    type: '',
    status: '',
    propertyId: '',
    startDate: '',
    endDate: ''
  });

  // Feedback state
  const [feedback, setFeedback] = useState<TenantFeedback[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<TenantFeedback | null>(null);
  const [feedbackFilters, setFeedbackFilters] = useState({
    type: '',
    status: '',
    propertyId: '',
    tenantId: ''
  });

  // Statistics state
  const [statistics, setStatistics] = useState<any>({});

  const currentUserId = 1; // This should come from auth context

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      switch (activeTab) {
        case 'messages':
          await loadMessages();
          break;
        case 'announcements':
          await loadAnnouncements();
          break;
        case 'events':
          await loadEvents();
          break;
        case 'feedback':
          await loadFeedback();
          break;
        case 'statistics':
          await loadStatistics();
          break;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    const params = {
      userId: currentUserId,
      type: messageFilters.type || undefined,
      unreadOnly: messageFilters.unreadOnly || undefined
    };
    const data = await messagingApi.getMessages(params);
    setMessages(data);
  };

  const loadAnnouncements = async () => {
    const params = {
      userId: currentUserId,
      propertyId: announcementFilters.propertyId ? parseInt(announcementFilters.propertyId) : undefined,
      type: announcementFilters.type || undefined
    };
    const data = await messagingApi.getAnnouncements(params);
    setAnnouncements(data);
  };

  const loadEvents = async () => {
    const params = {
      propertyId: eventFilters.propertyId ? parseInt(eventFilters.propertyId) : undefined,
      type: eventFilters.type || undefined,
      status: eventFilters.status || undefined,
      startDate: eventFilters.startDate || undefined,
      endDate: eventFilters.endDate || undefined
    };
    const data = await messagingApi.getEvents(params);
    setEvents(data);
  };

  const loadFeedback = async () => {
    const params = {
      tenantId: feedbackFilters.tenantId ? parseInt(feedbackFilters.tenantId) : undefined,
      propertyId: feedbackFilters.propertyId ? parseInt(feedbackFilters.propertyId) : undefined,
      status: feedbackFilters.status || undefined,
      type: feedbackFilters.type || undefined
    };
    const data = await messagingApi.getFeedback(params);
    setFeedback(data);
  };

  const loadStatistics = async () => {
    const data = await messagingApi.getStatistics();
    setStatistics(data);
  };

  const handleSendMessage = async (messageData: Partial<Message>) => {
    try {
      const newMessage = await messagingApi.sendMessage(messageData);
      setMessages(prev => [newMessage, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const handleMarkAsRead = async (messageId: number) => {
    try {
      await messagingApi.markAsRead(messageId, currentUserId);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true, readAt: new Date().toISOString() } : msg
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as read');
    }
  };

  const handleCreateAnnouncement = async (announcementData: Partial<Announcement>) => {
    try {
      const newAnnouncement = await messagingApi.createAnnouncement(announcementData);
      setAnnouncements(prev => [newAnnouncement, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create announcement');
    }
  };

  const handleCreateEvent = async (eventData: Partial<PropertyEvent>) => {
    try {
      const newEvent = await messagingApi.createEvent(eventData);
      setEvents(prev => [newEvent, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    }
  };

  const handleSubmitFeedback = async (feedbackData: Partial<TenantFeedback>) => {
    try {
      const newFeedback = await messagingApi.submitFeedback(feedbackData);
      setFeedback(prev => [newFeedback, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit feedback');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT': return '#dc3545';
      case 'HIGH': return '#fd7e14';
      case 'MEDIUM': return '#ffc107';
      case 'LOW': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
      case 'COMPLETED':
      case 'RESOLVED': return '#28a745';
      case 'PENDING':
      case 'SCHEDULED':
      case 'IN_PROGRESS': return '#ffc107';
      case 'CANCELLED':
      case 'REJECTED': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const renderMessages = () => (
    <div className="messages-section">
      <div className="section-header">
        <h3>Messages</h3>
        <div className="filters">
          <select 
            value={messageFilters.type} 
            onChange={(e) => setMessageFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">All Types</option>
            <option value="DIRECT">Direct</option>
            <option value="GROUP">Group</option>
            <option value="ANNOUNCEMENT">Announcement</option>
            <option value="SYSTEM">System</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={messageFilters.unreadOnly}
              onChange={(e) => setMessageFilters(prev => ({ ...prev, unreadOnly: e.target.checked }))}
            />
            Unread Only
          </label>
          <button onClick={loadMessages} className="btn btn-primary">Refresh</button>
        </div>
      </div>

      <div className="messages-list">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`message-item ${!message.isRead ? 'unread' : ''}`}
            onClick={() => setSelectedMessage(message)}
          >
            <div className="message-header">
              <span className="sender">{message.senderName}</span>
              <span className="date">{formatDate(message.createdAt)}</span>
              <span 
                className="priority-badge"
                style={{ backgroundColor: getPriorityColor(message.priority) }}
              >
                {message.priority}
              </span>
            </div>
            <div className="message-subject">{message.subject}</div>
            <div className="message-preview">{message.content.substring(0, 100)}...</div>
            {message.attachments && message.attachments.length > 0 && (
              <div className="attachment-indicator">📎 {message.attachments.length} attachment(s)</div>
            )}
          </div>
        ))}
      </div>

      {selectedMessage && (
        <div className="message-detail-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h4>{selectedMessage.subject}</h4>
              <button onClick={() => setSelectedMessage(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="message-meta">
                <p><strong>From:</strong> {selectedMessage.senderName} ({selectedMessage.senderType})</p>
                <p><strong>To:</strong> {selectedMessage.recipientName} ({selectedMessage.recipientType})</p>
                <p><strong>Date:</strong> {formatDate(selectedMessage.createdAt)}</p>
                <p><strong>Priority:</strong> {selectedMessage.priority}</p>
              </div>
              <div className="message-content">
                {selectedMessage.content}
              </div>
              {selectedMessage.attachments && selectedMessage.attachments.length > 0 && (
                <div className="attachments">
                  <h5>Attachments:</h5>
                  {selectedMessage.attachments.map((attachment, index) => (
                    <a key={index} href={attachment} target="_blank" rel="noopener noreferrer">
                      Attachment {index + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <div className="modal-footer">
              {!selectedMessage.isRead && (
                <button 
                  onClick={() => handleMarkAsRead(selectedMessage.id)}
                  className="btn btn-primary"
                >
                  Mark as Read
                </button>
              )}
              <button className="btn btn-secondary">Reply</button>
              <button className="btn btn-secondary">Archive</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAnnouncements = () => (
    <div className="announcements-section">
      <div className="section-header">
        <h3>Announcements</h3>
        <div className="filters">
          <select 
            value={announcementFilters.type} 
            onChange={(e) => setAnnouncementFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">All Types</option>
            <option value="GENERAL">General</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="POLICY">Policy</option>
            <option value="EVENT">Event</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
          <button onClick={loadAnnouncements} className="btn btn-primary">Refresh</button>
        </div>
      </div>

      <div className="announcements-list">
        {announcements.map(announcement => (
          <div 
            key={announcement.id} 
            className={`announcement-item ${announcement.isPinned ? 'pinned' : ''}`}
            onClick={() => setSelectedAnnouncement(announcement)}
          >
            <div className="announcement-header">
              <span className="title">{announcement.title}</span>
              {announcement.isPinned && <span className="pin-icon">📌</span>}
              <span 
                className="priority-badge"
                style={{ backgroundColor: getPriorityColor(announcement.priority) }}
              >
                {announcement.priority}
              </span>
            </div>
            <div className="announcement-meta">
              <span>By {announcement.authorName}</span>
              <span>{formatDate(announcement.publishDate)}</span>
              <span>{announcement.viewCount} views</span>
            </div>
            <div className="announcement-preview">{announcement.content.substring(0, 150)}...</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="events-section">
      <div className="section-header">
        <h3>Property Events</h3>
        <div className="filters">
          <select 
            value={eventFilters.type} 
            onChange={(e) => setEventFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">All Types</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="INSPECTION">Inspection</option>
            <option value="SOCIAL">Social</option>
            <option value="MEETING">Meeting</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
          <select 
            value={eventFilters.status} 
            onChange={(e) => setEventFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <button onClick={loadEvents} className="btn btn-primary">Refresh</button>
        </div>
      </div>

      <div className="events-list">
        {events.map(event => (
          <div 
            key={event.id} 
            className="event-item"
            onClick={() => setSelectedEvent(event)}
          >
            <div className="event-header">
              <span className="title">{event.title}</span>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(event.status) }}
              >
                {event.status}
              </span>
            </div>
            <div className="event-details">
              <p><strong>Date:</strong> {formatDate(event.startDateTime)} - {formatDate(event.endDateTime)}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Property:</strong> {event.propertyName}</p>
              <p><strong>Organizer:</strong> {event.organizerName}</p>
              {event.maxAttendees && (
                <p><strong>Attendees:</strong> {event.currentAttendees}/{event.maxAttendees}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="feedback-section">
      <div className="section-header">
        <h3>Tenant Feedback</h3>
        <div className="filters">
          <select 
            value={feedbackFilters.type} 
            onChange={(e) => setFeedbackFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">All Types</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="PAYMENT">Payment</option>
            <option value="GENERAL">General</option>
            <option value="SUGGESTION">Suggestion</option>
            <option value="COMPLAINT">Complaint</option>
          </select>
          <select 
            value={feedbackFilters.status} 
            onChange={(e) => setFeedbackFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          <button onClick={loadFeedback} className="btn btn-primary">Refresh</button>
        </div>
      </div>

      <div className="feedback-list">
        {feedback.map(item => (
          <div 
            key={item.id} 
            className="feedback-item"
            onClick={() => setSelectedFeedback(item)}
          >
            <div className="feedback-header">
              <span className="subject">{item.subject}</span>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(item.status) }}
              >
                {item.status}
              </span>
            </div>
            <div className="feedback-meta">
              <span>From: {item.isAnonymous ? 'Anonymous' : item.tenantName}</span>
              <span>Property: {item.propertyName}</span>
              <span>Type: {item.type}</span>
              <span>{formatDate(item.createdAt)}</span>
            </div>
            <div className="feedback-preview">{item.message.substring(0, 100)}...</div>
            {item.rating && (
              <div className="rating">
                Rating: {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderStatistics = () => (
    <div className="statistics-section">
      <h3>Messaging Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Messages by Type</h4>
          {statistics.messagesByType && Object.entries(statistics.messagesByType).map(([type, count]) => (
            <div key={type} className="stat-item">
              <span>{type}:</span>
              <span>{count as number}</span>
            </div>
          ))}
        </div>
        
        <div className="stat-card">
          <h4>Messages by Priority</h4>
          {statistics.messagesByPriority && Object.entries(statistics.messagesByPriority).map(([priority, count]) => (
            <div key={priority} className="stat-item">
              <span>{priority}:</span>
              <span>{count as number}</span>
            </div>
          ))}
        </div>
        
        <div className="stat-card">
          <h4>Announcements by Type</h4>
          {statistics.announcementsByType && Object.entries(statistics.announcementsByType).map(([type, count]) => (
            <div key={type} className="stat-item">
              <span>{type}:</span>
              <span>{count as number}</span>
            </div>
          ))}
        </div>
        
        <div className="stat-card">
          <h4>Events by Type</h4>
          {statistics.eventsByType && Object.entries(statistics.eventsByType).map(([type, count]) => (
            <div key={type} className="stat-item">
              <span>{type}:</span>
              <span>{count as number}</span>
            </div>
          ))}
        </div>
        
        <div className="stat-card">
          <h4>Feedback Statistics</h4>
          <div className="stat-item">
            <span>Average Rating:</span>
            <span>{statistics.averageFeedbackRating?.toFixed(1) || 'N/A'}</span>
          </div>
          <div className="stat-item">
            <span>Average Satisfaction:</span>
            <span>{statistics.averageSatisfactionRating?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="messaging-page">
      <div className="page-header">
        <h2>Messaging & Communication Center</h2>
        <p>Manage messages, announcements, events, and tenant feedback</p>
      </div>

      {error && (
        <div className="error-message">
          <span>⚠️ {error}</span>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="tabs">
        <button 
          className={activeTab === 'messages' ? 'active' : ''} 
          onClick={() => setActiveTab('messages')}
        >
          📧 Messages
        </button>
        <button 
          className={activeTab === 'announcements' ? 'active' : ''} 
          onClick={() => setActiveTab('announcements')}
        >
          📢 Announcements
        </button>
        <button 
          className={activeTab === 'events' ? 'active' : ''} 
          onClick={() => setActiveTab('events')}
        >
          📅 Events
        </button>
        <button 
          className={activeTab === 'feedback' ? 'active' : ''} 
          onClick={() => setActiveTab('feedback')}
        >
          💬 Feedback
        </button>
        <button 
          className={activeTab === 'statistics' ? 'active' : ''} 
          onClick={() => setActiveTab('statistics')}
        >
          📊 Statistics
        </button>
      </div>

      <div className="tab-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {activeTab === 'messages' && renderMessages()}
            {activeTab === 'announcements' && renderAnnouncements()}
            {activeTab === 'events' && renderEvents()}
            {activeTab === 'feedback' && renderFeedback()}
            {activeTab === 'statistics' && renderStatistics()}
          </>
        )}
      </div>
    </div>
  );
};

export default MessagingPage;