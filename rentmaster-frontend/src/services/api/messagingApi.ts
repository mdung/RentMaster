import apiClient from './apiClient';

export const messagingApi = {
    getMessages: async (params: any) => {
        const response = await apiClient.get('/messaging/messages', { params });
        return response.data;
    },
    getAnnouncements: async (params: any) => {
        const response = await apiClient.get('/messaging/announcements', { params });
        return response.data;
    },
    getEvents: async (params: any) => {
        const response = await apiClient.get('/messaging/events', { params });
        return response.data;
    },
    getFeedback: async (params: any) => {
        const response = await apiClient.get('/messaging/feedback', { params });
        return response.data;
    },
    getStatistics: async () => {
        const response = await apiClient.get('/messaging/statistics');
        return response.data;
    },
    sendMessage: async (data: any) => {
        const response = await apiClient.post('/messaging/messages', data);
        return response.data;
    },
    markAsRead: async (messageId: number, userId: number) => {
        const response = await apiClient.put(`/messaging/messages/${messageId}/read`, null, { params: { userId } });
        return response.data;
    },
    archiveMessage: async (messageId: number, userId: number) => {
        const response = await apiClient.put(`/messaging/messages/${messageId}/archive`, null, { params: { userId } });
        return response.data;
    },
    deleteMessage: async (messageId: number, userId: number) => {
        await apiClient.delete(`/messaging/messages/${messageId}`, { params: { userId } });
    },
    createAnnouncement: async (data: any) => {
        const response = await apiClient.post('/messaging/announcements', data);
        return response.data;
    },
    updateAnnouncement: async (id: number, data: any) => {
        const response = await apiClient.put(`/messaging/announcements/${id}`, data);
        return response.data;
    },
    deleteAnnouncement: async (id: number) => {
        await apiClient.delete(`/messaging/announcements/${id}`);
    },
    createEvent: async (data: any) => {
        const response = await apiClient.post('/messaging/events', data);
        return response.data;
    },
    updateEvent: async (id: number, data: any) => {
        const response = await apiClient.put(`/messaging/events/${id}`, data);
        return response.data;
    },
    deleteEvent: async (id: number) => {
        await apiClient.delete(`/messaging/events/${id}`);
    },
    rsvpToEvent: async (id: number, userId: number, attending: boolean) => {
        const response = await apiClient.put(`/messaging/events/${id}/rsvp`, null, { params: { userId, attending } });
        return response.data;
    },
    submitFeedback: async (data: any) => {
        const response = await apiClient.post('/messaging/feedback', data);
        return response.data;
    },
    updateFeedbackStatus: async (id: number, status: string) => {
        const response = await apiClient.put(`/messaging/feedback/${id}/status`, { status });
        return response.data;
    },
    getUnreadMessageCount: async (userId: number) => {
        const response = await apiClient.get('/messaging/messages/unread-count', { params: { userId } });
        return response.data;
    },
};
