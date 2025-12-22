import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/MainLayout';
import { messagingApi } from '../services/api/messagingApi';
import './MessagingPage.css';
import './shared-styles.css';

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
  const [activeTab, setActiveTab] = useState<'messages' | 'announcements' | 'events' | 'feedback' | 'statistics'>('messages');
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
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const params: any = {
        userId: currentUserId
      };
      if (messageFilters.type) params.type = messageFilters.type;
      if (messageFilters.unreadOnly) params.unreadOnly = true;
      const data = await messagingApi.getMessages(params);
      setMessages(data || []);
    } catch (err: any) {
      console.error('Error loading messages:', err);
      setMessages([]);
      throw err;
    }
  };

  const loadAnnouncements = async () => {
    try {
      const params: any = {
        userId: currentUserId
      };
      if (announcementFilters.propertyId) params.propertyId = parseInt(announcementFilters.propertyId);
      if (announcementFilters.type) params.type = announcementFilters.type;
      const data = await messagingApi.getAnnouncements(params);
      setAnnouncements(data || []);
    } catch (err: any) {
      console.error('Error loading announcements:', err);
      setAnnouncements([]);
      throw err;
    }
  };

  const loadEvents = async () => {
    try {
      const params: any = {};
      if (eventFilters.propertyId) params.propertyId = parseInt(eventFilters.propertyId);
      if (eventFilters.type) params.type = eventFilters.type;
      if (eventFilters.status) params.status = eventFilters.status;
      if (eventFilters.startDate) params.startDate = eventFilters.startDate;
      if (eventFilters.endDate) params.endDate = eventFilters.endDate;
      const data = await messagingApi.getEvents(params);
      setEvents(data || []);
    } catch (err: any) {
      console.error('Error loading events:', err);
      setEvents([]);
      throw err;
    }
  };

  const loadFeedback = async () => {
    try {
      const params: any = {};
      if (feedbackFilters.tenantId) params.tenantId = parseInt(feedbackFilters.tenantId);
      if (feedbackFilters.propertyId) params.propertyId = parseInt(feedbackFilters.propertyId);
      if (feedbackFilters.status) params.status = feedbackFilters.status;
      if (feedbackFilters.type) params.type = feedbackFilters.type;
      const data = await messagingApi.getFeedback(params);
      setFeedback(data || []);
    } catch (err: any) {
      console.error('Error loading feedback:', err);
      setFeedback([]);
      throw err;
    }
  };

  const loadStatistics = async () => {
    try {
      const data = await messagingApi.getStatistics();
      setStatistics(data || {});
    } catch (err: any) {
      console.error('Error loading statistics:', err);
      setStatistics({});
      throw err;
    }
  };

  const handleSendMessage = async (messageData: Partial<Message>) => {
    try {
      const newMessage = await messagingApi.sendMessage(messageData);
      setMessages(prev => [newMessage, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  const handleMarkAsRead = async (messageId: number) => {
    try {
      await messagingApi.markAsRead(messageId, currentUserId);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true, readAt: new Date().toISOString() } : msg
      ));
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, isRead: true, readAt: new Date().toISOString() });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark as read');
    }
  };

  const handleCreateAnnouncement = async (announcementData: Partial<Announcement>) => {
    try {
      const newAnnouncement = await messagingApi.createAnnouncement(announcementData);
      setAnnouncements(prev => [newAnnouncement, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create announcement');
    }
  };

  const handleCreateEvent = async (eventData: Partial<PropertyEvent>) => {
    try {
      const newEvent = await messagingApi.createEvent(eventData);
      setEvents(prev => [newEvent, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleSubmitFeedback = async (feedbackData: Partial<TenantFeedback>) => {
    try {
      const newFeedback = await messagingApi.submitFeedback(feedbackData);
      setFeedback(prev => [newFeedback, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'URGENT': return '#dc3545';
      case 'HIGH': return '#fd7e14';
      case 'MEDIUM': return '#ffc107';
      case 'LOW': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
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
            className="form-select"
            value={messageFilters.type} 
            onChange={(e) => {
              setMessageFilters(prev => ({ ...prev, type: e.target.value }));
              setTimeout(loadMessages, 100);
            }}
          >
            <option value="">All Types</option>
            <option value="DIRECT">Direct</option>
            <option value="GROUP">Group</option>
            <option value="ANNOUNCEMENT">Announcement</option>
            <option value="SYSTEM">System</option>
          </select>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={messageFilters.unreadOnly}
              onChange={(e) => {
                setMessageFilters(prev => ({ ...prev, unreadOnly: e.target.checked }));
                setTimeout(loadMessages, 100);
              }}
            />
            Unread Only
          </label>
          <button onClick={loadMessages} className="btn btn-primary">Refresh</button>
        </div>
      </div>

      <div className="messages-list">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">📧</span>
              <p>No messages found</p>
            </div>
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id} 
              className={`message-item ${!message.isRead ? 'unread' : ''}`}
              onClick={() => setSelectedMessage(message)}
            >
              <div className="message-header">
                <span className="sender">{message.senderName || 'Unknown'}</span>
                <span className="date">{formatDate(message.createdAt)}</span>
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(message.priority) }}
                >
                  {message.priority || 'NORMAL'}
                </span>
              </div>
              <div className="message-subject">{message.subject || '(No Subject)'}</div>
              <div className="message-preview">{message.content?.substring(0, 100) || ''}...</div>
              {message.attachments && message.attachments.length > 0 && (
                <div className="attachment-indicator">📎 {message.attachments.length} attachment(s)</div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedMessage && (
        <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedMessage.subject || '(No Subject)'}</h2>
              <button className="modal-close" onClick={() => setSelectedMessage(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="message-meta">
                <p><strong>From:</strong> {selectedMessage.senderName || 'Unknown'} ({selectedMessage.senderType || 'N/A'})</p>
                <p><strong>To:</strong> {selectedMessage.recipientName || 'Unknown'} ({selectedMessage.recipientType || 'N/A'})</p>
                <p><strong>Date:</strong> {formatDate(selectedMessage.createdAt)}</p>
                <p><strong>Priority:</strong> {selectedMessage.priority || 'NORMAL'}</p>
              </div>
              <div className="message-content">
                {selectedMessage.content || '(No content)'}
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
            <div className="modal-actions">
              {!selectedMessage.isRead && (
                <button 
                  onClick={() => handleMarkAsRead(selectedMessage.id)}
                  className="btn btn-primary"
                >
                  Mark as Read
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => setSelectedMessage(null)}>Close</button>
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
            className="form-select"
            value={announcementFilters.type} 
            onChange={(e) => {
              setAnnouncementFilters(prev => ({ ...prev, type: e.target.value }));
              setTimeout(loadAnnouncements, 100);
            }}
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
        {announcements.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">📢</span>
              <p>No announcements found</p>
            </div>
          </div>
        ) : (
          announcements.map(announcement => (
            <div 
              key={announcement.id} 
              className={`announcement-item ${announcement.isPinned ? 'pinned' : ''}`}
              onClick={() => setSelectedAnnouncement(announcement)}
            >
              <div className="announcement-header">
                <span className="title">{announcement.title || '(No Title)'}</span>
                {announcement.isPinned && <span className="pin-icon">📌</span>}
                <span 
                  className="priority-badge"
                  style={{ backgroundColor: getPriorityColor(announcement.priority) }}
                >
                  {announcement.priority || 'NORMAL'}
                </span>
              </div>
              <div className="announcement-meta">
                <span>By {announcement.authorName || 'Unknown'}</span>
                <span>{formatDate(announcement.publishDate || announcement.createdAt)}</span>
                <span>{announcement.viewCount || 0} views</span>
              </div>
              <div className="announcement-preview">{announcement.content?.substring(0, 150) || ''}...</div>
            </div>
          ))
        )}
      </div>

      {selectedAnnouncement && (
        <div className="modal-overlay" onClick={() => setSelectedAnnouncement(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedAnnouncement.title || '(No Title)'}</h2>
              <button className="modal-close" onClick={() => setSelectedAnnouncement(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="message-meta">
                <p><strong>Author:</strong> {selectedAnnouncement.authorName || 'Unknown'}</p>
                <p><strong>Published:</strong> {formatDate(selectedAnnouncement.publishDate || selectedAnnouncement.createdAt)}</p>
                <p><strong>Type:</strong> {selectedAnnouncement.type || 'N/A'}</p>
                <p><strong>Priority:</strong> {selectedAnnouncement.priority || 'NORMAL'}</p>
                <p><strong>Views:</strong> {selectedAnnouncement.viewCount || 0}</p>
              </div>
              <div className="message-content">
                {selectedAnnouncement.content || '(No content)'}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedAnnouncement(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderEvents = () => (
    <div className="events-section">
      <div className="section-header">
        <h3>Property Events</h3>
        <div className="filters">
          <select 
            className="form-select"
            value={eventFilters.type} 
            onChange={(e) => {
              setEventFilters(prev => ({ ...prev, type: e.target.value }));
              setTimeout(loadEvents, 100);
            }}
          >
            <option value="">All Types</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="INSPECTION">Inspection</option>
            <option value="SOCIAL">Social</option>
            <option value="MEETING">Meeting</option>
            <option value="EMERGENCY">Emergency</option>
          </select>
          <select 
            className="form-select"
            value={eventFilters.status} 
            onChange={(e) => {
              setEventFilters(prev => ({ ...prev, status: e.target.value }));
              setTimeout(loadEvents, 100);
            }}
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
        {events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">📅</span>
              <p>No events found</p>
            </div>
          </div>
        ) : (
          events.map(event => (
            <div 
              key={event.id} 
              className="event-item"
              onClick={() => setSelectedEvent(event)}
            >
              <div className="event-header">
                <span className="title">{event.title || '(No Title)'}</span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(event.status) }}
                >
                  {event.status || 'N/A'}
                </span>
              </div>
              <div className="event-details">
                <p><strong>Date:</strong> {formatDate(event.startDateTime)} - {formatDate(event.endDateTime)}</p>
                <p><strong>Location:</strong> {event.location || 'N/A'}</p>
                <p><strong>Property:</strong> {event.propertyName || 'N/A'}</p>
                <p><strong>Organizer:</strong> {event.organizerName || 'Unknown'}</p>
                {event.maxAttendees && (
                  <p><strong>Attendees:</strong> {event.currentAttendees || 0}/{event.maxAttendees}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedEvent.title || '(No Title)'}</h2>
              <button className="modal-close" onClick={() => setSelectedEvent(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="message-meta">
                <p><strong>Start:</strong> {formatDate(selectedEvent.startDateTime)}</p>
                <p><strong>End:</strong> {formatDate(selectedEvent.endDateTime)}</p>
                <p><strong>Location:</strong> {selectedEvent.location || 'N/A'}</p>
                <p><strong>Property:</strong> {selectedEvent.propertyName || 'N/A'}</p>
                <p><strong>Organizer:</strong> {selectedEvent.organizerName || 'Unknown'}</p>
                <p><strong>Status:</strong> {selectedEvent.status || 'N/A'}</p>
              </div>
              {selectedEvent.description && (
                <div className="message-content">
                  {selectedEvent.description}
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedEvent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderFeedback = () => (
    <div className="feedback-section">
      <div className="section-header">
        <h3>Tenant Feedback</h3>
        <div className="filters">
          <select 
            className="form-select"
            value={feedbackFilters.type} 
            onChange={(e) => {
              setFeedbackFilters(prev => ({ ...prev, type: e.target.value }));
              setTimeout(loadFeedback, 100);
            }}
          >
            <option value="">All Types</option>
            <option value="MAINTENANCE">Maintenance</option>
            <option value="PAYMENT">Payment</option>
            <option value="GENERAL">General</option>
            <option value="SUGGESTION">Suggestion</option>
            <option value="COMPLAINT">Complaint</option>
          </select>
          <select 
            className="form-select"
            value={feedbackFilters.status} 
            onChange={(e) => {
              setFeedbackFilters(prev => ({ ...prev, status: e.target.value }));
              setTimeout(loadFeedback, 100);
            }}
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
        {feedback.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-content">
              <span className="empty-icon">💬</span>
              <p>No feedback found</p>
            </div>
          </div>
        ) : (
          feedback.map(item => (
            <div 
              key={item.id} 
              className="feedback-item"
              onClick={() => setSelectedFeedback(item)}
            >
              <div className="feedback-header">
                <span className="subject">{item.subject || '(No Subject)'}</span>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(item.status) }}
                >
                  {item.status || 'N/A'}
                </span>
              </div>
              <div className="feedback-meta">
                <span>From: {item.isAnonymous ? 'Anonymous' : (item.tenantName || 'Unknown')}</span>
                <span>Property: {item.propertyName || 'N/A'}</span>
                <span>Type: {item.type || 'N/A'}</span>
                <span>{formatDate(item.createdAt)}</span>
              </div>
              <div className="feedback-preview">{item.message?.substring(0, 100) || ''}...</div>
              {item.rating && (
                <div className="rating">
                  Rating: {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {selectedFeedback && (
        <div className="modal-overlay" onClick={() => setSelectedFeedback(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedFeedback.subject || '(No Subject)'}</h2>
              <button className="modal-close" onClick={() => setSelectedFeedback(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="message-meta">
                <p><strong>From:</strong> {selectedFeedback.isAnonymous ? 'Anonymous' : (selectedFeedback.tenantName || 'Unknown')}</p>
                <p><strong>Property:</strong> {selectedFeedback.propertyName || 'N/A'}</p>
                <p><strong>Type:</strong> {selectedFeedback.type || 'N/A'}</p>
                <p><strong>Status:</strong> {selectedFeedback.status || 'N/A'}</p>
                <p><strong>Date:</strong> {formatDate(selectedFeedback.createdAt)}</p>
                {selectedFeedback.rating && (
                  <p><strong>Rating:</strong> {'★'.repeat(selectedFeedback.rating)}{'☆'.repeat(5 - selectedFeedback.rating)}</p>
                )}
              </div>
              <div className="message-content">
                {selectedFeedback.message || '(No message)'}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setSelectedFeedback(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderStatistics = () => (
    <div className="statistics-section">
      <div className="section-header">
        <h3>Messaging Statistics</h3>
      </div>
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Messages by Type</h4>
          {statistics.messagesByType && Object.keys(statistics.messagesByType).length > 0 ? (
            Object.entries(statistics.messagesByType).map(([type, count]) => (
              <div key={type} className="stat-item">
                <span>{type}:</span>
                <span>{count as number}</span>
              </div>
            ))
          ) : (
            <p className="no-data">No data available</p>
          )}
        </div>
        
        <div className="stat-card">
          <h4>Messages by Priority</h4>
          {statistics.messagesByPriority && Object.keys(statistics.messagesByPriority).length > 0 ? (
            Object.entries(statistics.messagesByPriority).map(([priority, count]) => (
              <div key={priority} className="stat-item">
                <span>{priority}:</span>
                <span>{count as number}</span>
              </div>
            ))
          ) : (
            <p className="no-data">No data available</p>
          )}
        </div>
        
        <div className="stat-card">
          <h4>Announcements by Type</h4>
          {statistics.announcementsByType && Object.keys(statistics.announcementsByType).length > 0 ? (
            Object.entries(statistics.announcementsByType).map(([type, count]) => (
              <div key={type} className="stat-item">
                <span>{type}:</span>
                <span>{count as number}</span>
              </div>
            ))
          ) : (
            <p className="no-data">No data available</p>
          )}
        </div>
        
        <div className="stat-card">
          <h4>Events by Type</h4>
          {statistics.eventsByType && Object.keys(statistics.eventsByType).length > 0 ? (
            Object.entries(statistics.eventsByType).map(([type, count]) => (
              <div key={type} className="stat-item">
                <span>{type}:</span>
                <span>{count as number}</span>
              </div>
            ))
          ) : (
            <p className="no-data">No data available</p>
          )}
        </div>
        
        <div className="stat-card">
          <h4>Feedback Statistics</h4>
          <div className="stat-item">
            <span>Average Rating:</span>
            <span>{statistics.averageFeedbackRating ? statistics.averageFeedbackRating.toFixed(1) : 'N/A'}</span>
          </div>
          <div className="stat-item">
            <span>Average Satisfaction:</span>
            <span>{statistics.averageSatisfactionRating ? statistics.averageSatisfactionRating.toFixed(1) : 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="messaging-page">
        <div className="page-header">
          <div>
            <h1>Messaging & Communication Center</h1>
            <p className="page-subtitle">Manage messages, announcements, events, and tenant feedback</p>
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
            <button className="error-close" onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="messaging-tabs">
          <button 
            className={`tab-button ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <span>📧</span> Messages
          </button>
          <button 
            className={`tab-button ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            <span>📢</span> Announcements
          </button>
          <button 
            className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <span>📅</span> Events
          </button>
          <button 
            className={`tab-button ${activeTab === 'feedback' ? 'active' : ''}`}
            onClick={() => setActiveTab('feedback')}
          >
            <span>💬</span> Feedback
          </button>
          <button 
            className={`tab-button ${activeTab === 'statistics' ? 'active' : ''}`}
            onClick={() => setActiveTab('statistics')}
          >
            <span>📊</span> Statistics
          </button>
        </div>

        <div className="messaging-content">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
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
    </MainLayout>
  );
};

export default MessagingPage;
