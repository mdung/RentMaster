import { apiClient } from './apiClient';
import { TenantCommunity, CommunityPost, CommunityEvent } from '../../types';

export interface CommunityComment {
  id: number;
  postId: number;
  authorName: string;
  authorAvatar?: string;
  content: string;
  likes: number;
  isLiked: boolean;
  createdAt: string;
  replies: CommunityComment[];
}

export interface CommunityAnnouncement {
  id: number;
  title: string;
  content: string;
  type: 'GENERAL' | 'MAINTENANCE' | 'POLICY' | 'EVENT' | 'EMERGENCY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  targetAudience: 'ALL_TENANTS' | 'PROPERTY_TENANTS' | 'SPECIFIC_TENANTS';
  propertyIds?: number[];
  tenantIds?: number[];
  publishDate: string;
  expiryDate?: string;
  isActive: boolean;
  readBy: number[];
  attachments: string[];
  createdBy: string;
  createdAt: string;
}

export const communityApi = {
  // Communities
  getCommunities: async (): Promise<TenantCommunity[]> => {
    const response = await apiClient.get('/community/communities');
    return response.data;
  },

  getCommunity: async (communityId: number): Promise<TenantCommunity> => {
    const response = await apiClient.get(`/community/communities/${communityId}`);
    return response.data;
  },

  createCommunity: async (community: Omit<TenantCommunity, 'id' | 'memberCount' | 'recentPosts' | 'events'>): Promise<TenantCommunity> => {
    const response = await apiClient.post('/community/communities', community);
    return response.data;
  },

  updateCommunity: async (communityId: number, updates: Partial<TenantCommunity>): Promise<TenantCommunity> => {
    const response = await apiClient.put(`/community/communities/${communityId}`, updates);
    return response.data;
  },

  deleteCommunity: async (communityId: number): Promise<void> => {
    await apiClient.delete(`/community/communities/${communityId}`);
  },

  joinCommunity: async (communityId: number): Promise<void> => {
    await apiClient.post(`/community/communities/${communityId}/join`);
  },

  leaveCommunity: async (communityId: number): Promise<void> => {
    await apiClient.post(`/community/communities/${communityId}/leave`);
  },

  // Posts
  getPosts: async (communityId?: number, type?: string, page: number = 1, limit: number = 20): Promise<{ posts: CommunityPost[], total: number }> => {
    let url = '/community/posts';
    const params = new URLSearchParams();
    if (communityId) params.append('communityId', communityId.toString());
    if (type) params.append('type', type);
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (params.toString()) url += `?${params.toString()}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  getPost: async (postId: number): Promise<CommunityPost> => {
    const response = await apiClient.get(`/community/posts/${postId}`);
    return response.data;
  },

  createPost: async (post: Omit<CommunityPost, 'id' | 'authorName' | 'authorAvatar' | 'likes' | 'comments' | 'isLiked' | 'createdAt'>): Promise<CommunityPost> => {
    const response = await apiClient.post('/community/posts', post);
    return response.data;
  },

  updatePost: async (postId: number, updates: Partial<CommunityPost>): Promise<CommunityPost> => {
    const response = await apiClient.put(`/community/posts/${postId}`, updates);
    return response.data;
  },

  deletePost: async (postId: number): Promise<void> => {
    await apiClient.delete(`/community/posts/${postId}`);
  },

  likePost: async (postId: number): Promise<void> => {
    await apiClient.post(`/community/posts/${postId}/like`);
  },

  unlikePost: async (postId: number): Promise<void> => {
    await apiClient.delete(`/community/posts/${postId}/like`);
  },

  // Comments
  getComments: async (postId: number): Promise<CommunityComment[]> => {
    const response = await apiClient.get(`/community/posts/${postId}/comments`);
    return response.data;
  },

  createComment: async (postId: number, content: string, parentId?: number): Promise<CommunityComment> => {
    const response = await apiClient.post(`/community/posts/${postId}/comments`, { content, parentId });
    return response.data;
  },

  updateComment: async (commentId: number, content: string): Promise<CommunityComment> => {
    const response = await apiClient.put(`/community/comments/${commentId}`, { content });
    return response.data;
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await apiClient.delete(`/community/comments/${commentId}`);
  },

  likeComment: async (commentId: number): Promise<void> => {
    await apiClient.post(`/community/comments/${commentId}/like`);
  },

  unlikeComment: async (commentId: number): Promise<void> => {
    await apiClient.delete(`/community/comments/${commentId}/like`);
  },

  // Events
  getEvents: async (communityId?: number, status?: string): Promise<CommunityEvent[]> => {
    let url = '/community/events';
    const params = new URLSearchParams();
    if (communityId) params.append('communityId', communityId.toString());
    if (status) params.append('status', status);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  getEvent: async (eventId: number): Promise<CommunityEvent> => {
    const response = await apiClient.get(`/community/events/${eventId}`);
    return response.data;
  },

  createEvent: async (event: Omit<CommunityEvent, 'id' | 'currentAttendees' | 'isAttending'>): Promise<CommunityEvent> => {
    const response = await apiClient.post('/community/events', event);
    return response.data;
  },

  updateEvent: async (eventId: number, updates: Partial<CommunityEvent>): Promise<CommunityEvent> => {
    const response = await apiClient.put(`/community/events/${eventId}`, updates);
    return response.data;
  },

  deleteEvent: async (eventId: number): Promise<void> => {
    await apiClient.delete(`/community/events/${eventId}`);
  },

  attendEvent: async (eventId: number): Promise<void> => {
    await apiClient.post(`/community/events/${eventId}/attend`);
  },

  unattendEvent: async (eventId: number): Promise<void> => {
    await apiClient.delete(`/community/events/${eventId}/attend`);
  },

  getEventAttendees: async (eventId: number): Promise<any[]> => {
    const response = await apiClient.get(`/community/events/${eventId}/attendees`);
    return response.data;
  },

  // Announcements
  getAnnouncements: async (propertyId?: number): Promise<CommunityAnnouncement[]> => {
    let url = '/community/announcements';
    if (propertyId) url += `?propertyId=${propertyId}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  getAnnouncement: async (announcementId: number): Promise<CommunityAnnouncement> => {
    const response = await apiClient.get(`/community/announcements/${announcementId}`);
    return response.data;
  },

  createAnnouncement: async (announcement: Omit<CommunityAnnouncement, 'id' | 'readBy' | 'createdBy' | 'createdAt'>): Promise<CommunityAnnouncement> => {
    const response = await apiClient.post('/community/announcements', announcement);
    return response.data;
  },

  updateAnnouncement: async (announcementId: number, updates: Partial<CommunityAnnouncement>): Promise<CommunityAnnouncement> => {
    const response = await apiClient.put(`/community/announcements/${announcementId}`, updates);
    return response.data;
  },

  deleteAnnouncement: async (announcementId: number): Promise<void> => {
    await apiClient.delete(`/community/announcements/${announcementId}`);
  },

  markAnnouncementAsRead: async (announcementId: number): Promise<void> => {
    await apiClient.post(`/community/announcements/${announcementId}/read`);
  },

  // File uploads
  uploadFile: async (file: File, type: 'post' | 'event' | 'announcement'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await apiClient.post('/community/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.filePath;
  },

  // Moderation
  reportContent: async (contentType: 'post' | 'comment' | 'event', contentId: number, reason: string): Promise<void> => {
    await apiClient.post('/community/report', { contentType, contentId, reason });
  },

  moderateContent: async (contentType: 'post' | 'comment' | 'event', contentId: number, action: 'approve' | 'reject' | 'hide'): Promise<void> => {
    await apiClient.post('/community/moderate', { contentType, contentId, action });
  }
};