import React, { useEffect, useState } from 'react';
import { MainLayout } from '../components/MainLayout';
import {
  TenantCommunity,
  CommunityPost,
  CommunityEvent,
  TenantAnnouncement
} from '../types';
import './CommunityPage.css';

export const CommunityPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'communities' | 'posts' | 'events' | 'announcements'>('communities');
  const [loading, setLoading] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<number | null>(null);
  
  // State for community data
  const [communities, setCommunities] = useState<TenantCommunity[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [announcements, setAnnouncements] = useState<TenantAnnouncement[]>([]);

  useEffect(() => {
    loadCommunityData();
  }, [activeTab, selectedCommunity]);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadCommunities(),
        loadPosts(),
        loadEvents(),
        loadAnnouncements()
      ]);
    } catch (error) {
      console.error('Error loading community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCommunities = async () => {
    // Mock data - replace with actual API call
    const mockCommunities: TenantCommunity[] = [
      {
        id: 1,
        name: 'Sunset Apartments Community',
        description: 'Connect with your neighbors at Sunset Apartments',
        type: 'PROPERTY',
        memberCount: 142,
        isPublic: true,
        rules: [
          'Be respectful to all community members',
          'No spam or promotional content',
          'Keep discussions relevant to the community',
          'Report any issues to moderators'
        ],
        moderators: ['John Admin', 'Sarah Manager'],
        recentPosts: [],
        events: []
      },
      {
        id: 2,
        name: 'Downtown Neighborhood',
        description: 'Community for all downtown residents',
        type: 'NEIGHBORHOOD',
        memberCount: 856,
        isPublic: true,
        rules: [
          'Focus on neighborhood-related topics',
          'Share local events and news',
          'Help your neighbors',
          'No political discussions'
        ],
        moderators: ['Mike Moderator', 'Lisa Community'],
        recentPosts: [],
        events: []
      },
      {
        id: 3,
        name: 'Building A Residents',
        description: 'Private group for Building A residents only',
        type: 'BUILDING',
        memberCount: 48,
        isPublic: false,
        rules: [
          'Building A residents only',
          'Discuss building-specific matters',
          'Coordinate shared activities',
          'Respect privacy'
        ],
        moderators: ['Anna Resident'],
        recentPosts: [],
        events: []
      }
    ];
    setCommunities(mockCommunities);
    if (!selectedCommunity && mockCommunities.length > 0) {
      setSelectedCommunity(mockCommunities[0].id);
    }
  };

  const loadPosts = async () => {
    // Mock data - replace with actual API call
    const mockPosts: CommunityPost[] = [
      {
        id: 1,
        authorName: 'John Doe',
        authorAvatar: '/avatars/john.jpg',
        title: 'Welcome to our community!',
        content: 'Hi everyone! I\'m excited to be part of this community. Looking forward to meeting all of you and participating in community events.',
        type: 'DISCUSSION',
        tags: ['welcome', 'introduction'],
        likes: 12,
        comments: 5,
        isLiked: false,
        createdAt: '2024-11-20T10:30:00',
        attachments: []
      },
      {
        id: 2,
        authorName: 'Sarah Johnson',
        authorAvatar: '/avatars/sarah.jpg',
        title: 'Pool maintenance scheduled',
        content: 'The pool will be closed for maintenance from December 1-3. We apologize for any inconvenience.',
        type: 'ANNOUNCEMENT',
        tags: ['maintenance', 'pool'],
        likes: 8,
        comments: 3,
        isLiked: true,
        createdAt: '2024-11-19T14:15:00',
        attachments: []
      },
      {
        id: 3,
        authorName: 'Mike Wilson',
        authorAvatar: '/avatars/mike.jpg',
        title: 'Holiday party planning',
        content: 'Who\'s interested in organizing a holiday party for the community? Let\'s discuss ideas and volunteer to help!',
        type: 'EVENT',
        tags: ['holiday', 'party', 'planning'],
        likes: 15,
        comments: 8,
        isLiked: false,
        createdAt: '2024-11-18T16:45:00',
        attachments: []
      },
      {
        id: 4,
        authorName: 'Lisa Chen',
        authorAvatar: '/avatars/lisa.jpg',
        title: 'Selling furniture - moving out',
        content: 'I\'m moving out next month and selling some furniture. Sofa, dining table, and bookshelf available. DM me for details!',
        type: 'MARKETPLACE',
        tags: ['furniture', 'sale', 'moving'],
        likes: 6,
        comments: 12,
        isLiked: false,
        createdAt: '2024-11-17T11:20:00',
        attachments: ['/images/furniture1.jpg', '/images/furniture2.jpg']
      }
    ];
    setPosts(mockPosts);
  };

  const loadEvents = async () => {
    // Mock data - replace with actual API call
    const mockEvents: CommunityEvent[] = [
      {
        id: 1,
        title: 'Community Holiday Party',
        description: 'Join us for a festive holiday celebration with food, drinks, and entertainment for the whole family!',
        eventDate: '2024-12-15T18:00:00',
        location: 'Community Room',
        organizer: 'Community Management',
        maxAttendees: 100,
        currentAttendees: 45,
        isAttending: false,
        type: 'SOCIAL',
        status: 'UPCOMING'
      },
      {
        id: 2,
        title: 'Fitness Class - Yoga',
        description: 'Weekly yoga class for all skill levels. Bring your own mat!',
        eventDate: '2024-11-25T07:00:00',
        location: 'Fitness Center',
        organizer: 'Sarah Johnson',
        maxAttendees: 20,
        currentAttendees: 12,
        isAttending: true,
        type: 'SOCIAL',
        status: 'UPCOMING'
      },
      {
        id: 3,
        title: 'Building Maintenance Meeting',
        description: 'Monthly meeting to discuss building maintenance and improvements.',
        eventDate: '2024-12-01T19:00:00',
        location: 'Conference Room',
        organizer: 'Property Management',
        maxAttendees: 50,
        currentAttendees: 18,
        isAttending: false,
        type: 'MEETING',
        status: 'UPCOMING'
      },
      {
        id: 4,
        title: 'Fire Safety Drill',
        description: 'Mandatory fire safety drill for all residents. Please participate.',
        eventDate: '2024-11-30T10:00:00',
        location: 'Entire Building',
        organizer: 'Safety Team',
        currentAttendees: 0,
        isAttending: false,
        type: 'EMERGENCY',
        status: 'UPCOMING'
      }
    ];
    setEvents(mockEvents);
  };

  const loadAnnouncements = async () => {
    // Mock data - replace with actual API call
    const mockAnnouncements: TenantAnnouncement[] = [
      {
        id: 1,
        title: 'New Parking Regulations',
        content: 'Starting December 1st, new parking regulations will be in effect. Please review the updated parking policy attached.',
        type: 'POLICY',
        priority: 'HIGH',
        targetAudience: 'ALL_TENANTS',
        publishDate: '2024-11-20',
        expiryDate: '2024-12-31',
        isActive: true,
        readBy: [1, 5, 12],
        attachments: ['/documents/parking-policy.pdf'],
        createdBy: 'Property Management',
        createdAt: '2024-11-20T09:00:00'
      },
      {
        id: 2,
        title: 'Holiday Office Hours',
        content: 'The leasing office will have modified hours during the holiday season. We will be closed on December 25th and January 1st.',
        type: 'GENERAL',
        priority: 'MEDIUM',
        targetAudience: 'ALL_TENANTS',
        publishDate: '2024-11-18',
        expiryDate: '2025-01-02',
        isActive: true,
        readBy: [1, 2, 3, 8, 15, 22],
        attachments: [],
        createdBy: 'Leasing Office',
        createdAt: '2024-11-18T14:30:00'
      },
      {
        id: 3,
        title: 'Gym Equipment Upgrade',
        content: 'We\'re excited to announce new fitness equipment will be installed in the gym next week. The gym will be temporarily closed from Nov 25-27.',
        type: 'MAINTENANCE',
        priority: 'MEDIUM',
        targetAudience: 'ALL_TENANTS',
        publishDate: '2024-11-15',
        expiryDate: '2024-11-28',
        isActive: true,
        readBy: [1, 4, 7, 9, 11, 16, 19, 25],
        attachments: ['/images/new-equipment.jpg'],
        createdBy: 'Facilities Team',
        createdAt: '2024-11-15T11:15:00'
      }
    ];
    setAnnouncements(mockAnnouncements);
  };

  const handleLikePost = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ));
  };

  const handleAttendEvent = (eventId: number) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { 
            ...event, 
            currentAttendees: event.isAttending ? event.currentAttendees - 1 : event.currentAttendees + 1,
            isAttending: !event.isAttending 
          }
        : event
    ));
  };

  return (
    <MainLayout>
      <div className="community-page">
        <div className="community-header">
          <h1>Community Hub</h1>
          <p>Connect, share, and engage with your neighbors</p>
        </div>

        <div className="community-tabs">
          <button
            className={`tab-button ${activeTab === 'communities' ? 'active' : ''}`}
            onClick={() => setActiveTab('communities')}
          >
            <i className="fas fa-users"></i>
            Communities
          </button>
          <button
            className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <i className="fas fa-comments"></i>
            Posts
          </button>
          <button
            className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <i className="fas fa-calendar-alt"></i>
            Events
          </button>
          <button
            className={`tab-button ${activeTab === 'announcements' ? 'active' : ''}`}
            onClick={() => setActiveTab('announcements')}
          >
            <i className="fas fa-bullhorn"></i>
            Announcements
          </button>
        </div>

        <div className="community-content">
          {loading ? (
            <div className="community-loading">
              <div className="loading-spinner"></div>
              <p>Loading community data...</p>
            </div>
          ) : (
            <>
              {activeTab === 'communities' && (
                <CommunitiesTab 
                  communities={communities} 
                  selectedCommunity={selectedCommunity}
                  onSelectCommunity={setSelectedCommunity}
                />
              )}
              {activeTab === 'posts' && (
                <PostsTab 
                  posts={posts} 
                  onLikePost={handleLikePost}
                  communities={communities}
                  selectedCommunity={selectedCommunity}
                />
              )}
              {activeTab === 'events' && (
                <EventsTab 
                  events={events} 
                  onAttendEvent={handleAttendEvent}
                />
              )}
              {activeTab === 'announcements' && (
                <AnnouncementsTab announcements={announcements} />
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

// Communities Tab Component
const CommunitiesTab: React.FC<{ 
  communities: TenantCommunity[]; 
  selectedCommunity: number | null;
  onSelectCommunity: (id: number) => void;
}> = ({ communities, selectedCommunity, onSelectCommunity }) => {
  return (
    <div className="communities-tab">
      <div className="communities-header">
        <h3>Your Communities</h3>
        <button className="create-community-button">
          <i className="fas fa-plus"></i>
          Create Community
        </button>
      </div>

      <div className="communities-grid">
        {communities.map(community => (
          <div 
            key={community.id} 
            className={`community-card ${selectedCommunity === community.id ? 'selected' : ''}`}
            onClick={() => onSelectCommunity(community.id)}
          >
            <div className="community-header-card">
              <h4>{community.name}</h4>
              <div className={`community-type ${community.type.toLowerCase()}`}>
                {community.type}
              </div>
            </div>
            <p className="community-description">{community.description}</p>
            <div className="community-stats">
              <div className="stat-item">
                <i className="fas fa-users"></i>
                <span>{community.memberCount} members</span>
              </div>
              <div className="stat-item">
                <i className={`fas ${community.isPublic ? 'fa-globe' : 'fa-lock'}`}></i>
                <span>{community.isPublic ? 'Public' : 'Private'}</span>
              </div>
            </div>
            <div className="community-moderators">
              <strong>Moderators:</strong> {community.moderators.join(', ')}
            </div>
            <div className="community-rules">
              <strong>Community Rules:</strong>
              <ul>
                {community.rules.slice(0, 2).map((rule, index) => (
                  <li key={index}>{rule}</li>
                ))}
                {community.rules.length > 2 && (
                  <li>... and {community.rules.length - 2} more</li>
                )}
              </ul>
            </div>
            <div className="community-actions">
              <button className="join-button">
                <i className="fas fa-user-plus"></i>
                Join Community
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Posts Tab Component
const PostsTab: React.FC<{ 
  posts: CommunityPost[]; 
  onLikePost: (id: number) => void;
  communities: TenantCommunity[];
  selectedCommunity: number | null;
}> = ({ posts, onLikePost, communities, selectedCommunity }) => {
  return (
    <div className="posts-tab">
      <div className="posts-header">
        <h3>Community Posts</h3>
        <div className="posts-controls">
          <select className="community-filter">
            <option value="">All Communities</option>
            {communities.map(community => (
              <option key={community.id} value={community.id}>
                {community.name}
              </option>
            ))}
          </select>
          <button className="create-post-button">
            <i className="fas fa-plus"></i>
            Create Post
          </button>
        </div>
      </div>

      <div className="posts-feed">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-author">
                <div className="author-avatar">
                  <img src={post.authorAvatar || '/default-avatar.png'} alt={post.authorName} />
                </div>
                <div className="author-info">
                  <h4>{post.authorName}</h4>
                  <span className="post-time">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className={`post-type ${post.type.toLowerCase()}`}>
                {post.type}
              </div>
            </div>

            <div className="post-content">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              
              {post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="post-tag">#{tag}</span>
                  ))}
                </div>
              )}

              {post.attachments.length > 0 && (
                <div className="post-attachments">
                  {post.attachments.map((attachment, index) => (
                    <img key={index} src={attachment} alt={`Attachment ${index + 1}`} />
                  ))}
                </div>
              )}
            </div>

            <div className="post-actions">
              <button 
                className={`like-button ${post.isLiked ? 'liked' : ''}`}
                onClick={() => onLikePost(post.id)}
              >
                <i className={`fas ${post.isLiked ? 'fa-heart' : 'fa-heart'}`}></i>
                <span>{post.likes}</span>
              </button>
              <button className="comment-button">
                <i className="fas fa-comment"></i>
                <span>{post.comments}</span>
              </button>
              <button className="share-button">
                <i className="fas fa-share"></i>
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Events Tab Component
const EventsTab: React.FC<{ 
  events: CommunityEvent[]; 
  onAttendEvent: (id: number) => void;
}> = ({ events, onAttendEvent }) => {
  return (
    <div className="events-tab">
      <div className="events-header">
        <h3>Community Events</h3>
        <button className="create-event-button">
          <i className="fas fa-plus"></i>
          Create Event
        </button>
      </div>

      <div className="events-grid">
        {events.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <h4>{event.title}</h4>
              <div className={`event-type ${event.type.toLowerCase()}`}>
                {event.type}
              </div>
            </div>

            <div className="event-details">
              <p className="event-description">{event.description}</p>
              
              <div className="event-info">
                <div className="info-item">
                  <i className="fas fa-calendar"></i>
                  <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-clock"></i>
                  <span>{new Date(event.eventDate).toLocaleTimeString()}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{event.location}</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-user"></i>
                  <span>Organized by {event.organizer}</span>
                </div>
              </div>

              <div className="event-attendance">
                <div className="attendance-info">
                  <span>{event.currentAttendees} attending</span>
                  {event.maxAttendees && (
                    <span> / {event.maxAttendees} max</span>
                  )}
                </div>
                <div className="attendance-bar">
                  <div 
                    className="attendance-fill" 
                    style={{ 
                      width: event.maxAttendees 
                        ? `${(event.currentAttendees / event.maxAttendees) * 100}%` 
                        : '0%' 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="event-actions">
              <button 
                className={`attend-button ${event.isAttending ? 'attending' : ''}`}
                onClick={() => onAttendEvent(event.id)}
              >
                <i className={`fas ${event.isAttending ? 'fa-check' : 'fa-plus'}`}></i>
                {event.isAttending ? 'Attending' : 'Attend'}
              </button>
              <button className="share-event-button">
                <i className="fas fa-share"></i>
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Announcements Tab Component
const AnnouncementsTab: React.FC<{ announcements: TenantAnnouncement[] }> = ({ announcements }) => {
  return (
    <div className="announcements-tab">
      <div className="announcements-header">
        <h3>Community Announcements</h3>
        <button className="create-announcement-button">
          <i className="fas fa-plus"></i>
          Create Announcement
        </button>
      </div>

      <div className="announcements-list">
        {announcements.map(announcement => (
          <div key={announcement.id} className="announcement-card">
            <div className="announcement-header">
              <h4>{announcement.title}</h4>
              <div className="announcement-meta">
                <div className={`priority-badge ${announcement.priority.toLowerCase()}`}>
                  {announcement.priority}
                </div>
                <div className={`type-badge ${announcement.type.toLowerCase()}`}>
                  {announcement.type}
                </div>
              </div>
            </div>

            <div className="announcement-content">
              <p>{announcement.content}</p>
              
              {announcement.attachments.length > 0 && (
                <div className="announcement-attachments">
                  <strong>Attachments:</strong>
                  {announcement.attachments.map((attachment, index) => (
                    <a key={index} href={attachment} className="attachment-link">
                      <i className="fas fa-paperclip"></i>
                      {attachment.split('/').pop()}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="announcement-footer">
              <div className="announcement-info">
                <span>By {announcement.createdBy}</span>
                <span>Published: {new Date(announcement.publishDate).toLocaleDateString()}</span>
                {announcement.expiryDate && (
                  <span>Expires: {new Date(announcement.expiryDate).toLocaleDateString()}</span>
                )}
              </div>
              <div className="announcement-stats">
                <span>{announcement.readBy.length} people read this</span>
              </div>
            </div>

            <div className="announcement-actions">
              <button className="mark-read-button">
                <i className="fas fa-check"></i>
                Mark as Read
              </button>
              <button className="share-announcement-button">
                <i className="fas fa-share"></i>
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};