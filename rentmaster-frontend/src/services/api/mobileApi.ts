import apiClient from './apiClient';

export interface MobileDevice {
  id: number;
  userId: number;
  deviceToken: string;
  platform: 'IOS' | 'ANDROID' | 'HYBRID';
  deviceModel?: string;
  deviceOsVersion?: string;
  appVersion?: string;
  isActive: boolean;
  pushNotificationsEnabled: boolean;
  lastActiveAt?: string;
  registeredAt: string;
  updatedAt: string;
  supportsBiometric: boolean;
  supportsNfc: boolean;
  supportsCamera: boolean;
  supportsLocation: boolean;
  notificationSound: string;
  notificationVibration: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

export interface OfflineAction {
  id: number;
  userId: number;
  actionType: string;
  actionData: Record<string, any>;
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  createdAt: string;
  processedAt?: string;
  retryCount: number;
  maxRetries: number;
  errorMessage?: string;
  deviceId?: string;
  syncPriority: number;
}

export interface MobileDashboard {
  stats: Record<string, any>;
  recentActivities: Array<{
    type: string;
    title: string;
    description: string;
    timestamp: string;
    icon: string;
  }>;
  quickActions: Array<{
    id: string;
    title: string;
    icon: string;
    route: string;
    enabled: boolean;
  }>;
  lastUpdated: string;
  userType: string;
}

export interface QRCodeData {
  success: boolean;
  qrCode?: string;
  qrContent?: string;
  expiresAt?: string;
  error?: string;
}

export interface PaymentMethod {
  type: string;
  name: string;
  lastFour: string;
  isDefault: boolean;
  icon: string;
}

export const mobileApi = {
  // Mobile Dashboard
  getMobileDashboard: async (userId?: number, userType?: string): Promise<MobileDashboard> => {
    let url = '/mobile/dashboard';
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId.toString());
    if (userType) params.append('userType', userType);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  getDashboardWidgets: async (userId: number, userType: string): Promise<Record<string, any>[]> => {
    const response = await apiClient.get(`/mobile/dashboard/widgets?userId=${userId}&userType=${userType}`);
    return response.data;
  },

  reorderDashboardWidgets: async (userId: number, widgetOrder: Record<string, any>[]): Promise<Record<string, any>> => {
    const response = await apiClient.post(`/mobile/dashboard/widgets/reorder?userId=${userId}`, widgetOrder);
    return response.data;
  },

  // Mobile Payments
  getMobilePaymentMethods: async (tenantId: number): Promise<PaymentMethod[]> => {
    const response = await apiClient.get(`/mobile/payments/methods?tenantId=${tenantId}`);
    return response.data;
  },

  processMobilePayment: async (paymentData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/mobile/payments/process', paymentData);
    return response.data;
  },

  processApplePayPayment: async (paymentData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/mobile/payments/apple-pay', paymentData);
    return response.data;
  },

  processGooglePayPayment: async (paymentData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/mobile/payments/google-pay', paymentData);
    return response.data;
  },

  getMobilePaymentHistory: async (tenantId: number, page: number = 0, size: number = 20): Promise<Record<string, any>[]> => {
    const response = await apiClient.get(`/mobile/payments/history?tenantId=${tenantId}&page=${page}&size=${size}`);
    return response.data;
  },

  // QR Code Functionality
  generateQRCode: async (qrData: Record<string, any>): Promise<QRCodeData> => {
    const response = await apiClient.post('/mobile/qr/generate', qrData);
    return response.data;
  },

  processQRCodeScan: async (scanData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/mobile/qr/scan', scanData);
    return response.data;
  },

  getQRCodeActions: async (): Promise<Record<string, any>[]> => {
    const response = await apiClient.get('/mobile/qr/actions');
    return response.data;
  },

  propertyCheckIn: async (propertyId: number, checkInData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post(`/mobile/qr/property/${propertyId}/checkin`, checkInData);
    return response.data;
  },

  updateMaintenanceViaQR: async (requestId: number, updateData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post(`/mobile/qr/maintenance/${requestId}/update`, updateData);
    return response.data;
  },

  // Offline Mode Support
  getSyncData: async (userId: number, userType: string, lastSyncTimestamp?: string): Promise<Record<string, any>> => {
    let url = `/mobile/offline/sync-data?userId=${userId}&userType=${userType}`;
    if (lastSyncTimestamp) url += `&lastSyncTimestamp=${lastSyncTimestamp}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  uploadOfflineData: async (offlineData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/mobile/offline/sync-upload', offlineData);
    return response.data;
  },

  getEssentialOfflineData: async (userId: number, userType: string): Promise<Record<string, any>> => {
    const response = await apiClient.get(`/mobile/offline/essential-data?userId=${userId}&userType=${userType}`);
    return response.data;
  },

  queueOfflineAction: async (actionData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/mobile/offline/queue-action', actionData);
    return response.data;
  },

  // Mobile Notifications
  registerMobileDevice: async (deviceData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/mobile/notifications/register-device', deviceData);
    return response.data;
  },

  sendPushNotification: async (notificationData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/mobile/notifications/send-push', notificationData);
    return response.data;
  },

  getMobileNotificationHistory: async (userId: number, page: number = 0, size: number = 50): Promise<Record<string, any>[]> => {
    const response = await apiClient.get(`/mobile/notifications/history?userId=${userId}&page=${page}&size=${size}`);
    return response.data;
  },

  // Mobile-specific Features
  uploadCameraImage: async (file: File, type: string, relatedId: number): Promise<Record<string, any>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('relatedId', relatedId.toString());

    const response = await apiClient.post('/mobile/camera/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  updateUserLocation: async (locationData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/mobile/location/update', locationData);
    return response.data;
  },

  getNearbyProperties: async (latitude: number, longitude: number, radiusKm: number = 10): Promise<Record<string, any>[]> => {
    const response = await apiClient.get(`/mobile/nearby/properties?latitude=${latitude}&longitude=${longitude}&radiusKm=${radiusKm}`);
    return response.data;
  },

  // Mobile App Configuration
  getMobileAppConfig: async (platform: string, version: string): Promise<Record<string, any>> => {
    const response = await apiClient.get(`/mobile/config?platform=${platform}&version=${version}`);
    return response.data;
  },

  checkAppVersion: async (platform: string, currentVersion: string): Promise<Record<string, any>> => {
    const response = await apiClient.get(`/mobile/version-check?platform=${platform}&currentVersion=${currentVersion}`);
    return response.data;
  },

  // Mobile Analytics
  trackMobileEvent: async (eventData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/mobile/analytics/track-event', eventData);
    return response.data;
  },

  trackScreenView: async (screenData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/mobile/analytics/track-screen', screenData);
    return response.data;
  },

  getMobileUsageStats: async (userId: number, period?: string): Promise<Record<string, any>> => {
    let url = `/mobile/analytics/usage-stats?userId=${userId}`;
    if (period) url += `&period=${period}`;

    const response = await apiClient.get(url);
    return response.data;
  },

  // Emergency Features
  sendEmergencyAlert: async (alertData: Record<string, any>): Promise<Record<string, any>> => {
    const response = await apiClient.post('/mobile/emergency/alert', alertData);
    return response.data;
  },

  getEmergencyContacts: async (propertyId: number): Promise<Record<string, any>[]> => {
    const response = await apiClient.get(`/mobile/emergency/contacts?propertyId=${propertyId}`);
    return response.data;
  },

  // Utility Functions for Mobile Development
  detectPlatform: (): 'IOS' | 'ANDROID' | 'WEB' => {
    const userAgent = navigator.userAgent || navigator.vendor;
    
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return 'IOS';
    } else if (/android/i.test(userAgent)) {
      return 'ANDROID';
    }
    return 'WEB';
  },

  getDeviceInfo: (): Record<string, any> => {
    return {
      platform: mobileApi.detectPlatform(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenWidth: screen.width,
      screenHeight: screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      pixelRatio: window.devicePixelRatio || 1,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  },

  isOnline: (): boolean => {
    return navigator.onLine;
  },

  supportsCamera: (): boolean => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  },

  supportsGeolocation: (): boolean => {
    return !!navigator.geolocation;
  },

  supportsNotifications: (): boolean => {
    return 'Notification' in window;
  },

  requestNotificationPermission: async (): Promise<NotificationPermission> => {
    if (!mobileApi.supportsNotifications()) {
      throw new Error('Notifications not supported');
    }
    return await Notification.requestPermission();
  },

  getCurrentPosition: (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!mobileApi.supportsGeolocation()) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      });
    });
  },

  // Offline Storage Utilities
  setOfflineData: (key: string, data: any): void => {
    try {
      localStorage.setItem(`rentmaster_offline_${key}`, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  },

  getOfflineData: (key: string): any => {
    try {
      const data = localStorage.getItem(`rentmaster_offline_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to retrieve offline data:', error);
      return null;
    }
  },

  clearOfflineData: (key?: string): void => {
    try {
      if (key) {
        localStorage.removeItem(`rentmaster_offline_${key}`);
      } else {
        // Clear all offline data
        Object.keys(localStorage)
          .filter(k => k.startsWith('rentmaster_offline_'))
          .forEach(k => localStorage.removeItem(k));
      }
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  },

  // Network Status
  addNetworkStatusListener: (callback: (isOnline: boolean) => void): (() => void) => {
    const onOnline = () => callback(true);
    const onOffline = () => callback(false);

    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    // Return cleanup function
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }
};