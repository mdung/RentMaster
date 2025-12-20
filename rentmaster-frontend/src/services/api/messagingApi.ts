import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const messagingApi = {
    getMessages: async (params: any) => {
        const response = await axios.get(`${API_BASE_URL}/messaging/messages`, { params });
        return response.data;
    },
    getAnnouncements: async (params: any) => {
        const response = await axios.get(`${API_BASE_URL}/messaging/announcements`, { params });
        return response.data;
    },
    getEvents: async (params: any) => {
        const response = await axios.get(`${API_BASE_URL}/messaging/events`, { params });
        return response.data;
    },
    getFeedback: async (params: any) => {
        const response = await axios.get(`${API_BASE_URL}/messaging/feedback`, { params });
        return response.data;
    },
    getStatistics: async () => {
        const response = await axios.get(`${API_BASE_URL}/messaging/statistics`);
        return response.data;
    },
    sendMessage: async (data: any) => {
        const response = await axios.post(`${API_BASE_URL}/messaging/messages`, data);
        return response.data;
    },
    markAsRead: async (messageId: number, userId: number) => {
        const response = await axios.post(`${API_BASE_URL}/messaging/messages/${messageId}/read`, { userId });
        return response.data;
    },
    createAnnouncement: async (data: any) => {
        const response = await axios.post(`${API_BASE_URL}/messaging/announcements`, data);
        return response.data;
    },
    createEvent: async (data: any) => {
        const response = await axios.post(`${API_BASE_URL}/messaging/events`, data);
        return response.data;
    },
    submitFeedback: async (data: any) => {
        const response = await axios.post(`${API_BASE_URL}/messaging/feedback`, data);
        return response.data;
    }
};

export { messagingApi };
