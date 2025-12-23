import apiClient from './apiClient';

const searchApi = {
  // Full-text Search
  fullTextSearch: async (query: string, page: number = 0, size: number = 20, types?: string[], filters?: Record<string, string>) => {
    const params: any = {
      query,
      page: page.toString(),
      size: size.toString()
    };
    
    if (types) {
      params.types = types;
    }
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[`filters.${key}`] = value;
      });
    }
    
    const response = await apiClient.get('/search/full-text', { params });
    return response.data;
  },

  // Advanced Search
  advancedSearch: async (searchParams: Record<string, any>) => {
    const response = await apiClient.get('/search/advanced', { params: searchParams });
    return response.data;
  },

  // Faceted Search
  facetedSearch: async (query: string, facets?: string[]) => {
    const params: any = { query };
    if (facets) {
      params.facets = facets;
    }
    
    const response = await apiClient.get('/search/faceted', { params });
    return response.data;
  },

  // Natural Language Search
  naturalLanguageSearch: async (query: string, context?: string) => {
    const response = await apiClient.post('/search/natural-language', { query, context });
    return response.data;
  },

  // Query Understanding
  analyzeQuery: async (query: string) => {
    const response = await apiClient.post('/search/query-understanding', { query });
    return response.data;
  },

  // Predictive Search & Auto-complete
  getSearchSuggestions: async (query: string, limit: number = 10, context?: string) => {
    const params: any = {
      query,
      limit: limit.toString()
    };
    
    if (context) {
      params.context = context;
    }
    
    const response = await apiClient.get('/search/suggestions', { params });
    return response.data;
  },

  autocomplete: async (query: string, limit: number = 5) => {
    const response = await apiClient.get('/search/autocomplete', { params: { query, limit } });
    return response.data;
  },

  learnFromSearch: async (searchData: Record<string, any>) => {
    const response = await apiClient.post('/search/learn-from-search', searchData);
    return response.data;
  },

  // AI-powered Insights
  getDashboardInsights: async (userId?: number) => {
    const params = userId ? { userId } : {};
    const response = await apiClient.get('/search/insights/dashboard', { params });
    return response.data;
  },

  getPropertyInsights: async (propertyId: number) => {
    const response = await apiClient.get(`/search/insights/property/${propertyId}`);
    return response.data;
  },

  getTenantInsights: async (tenantId: number) => {
    const response = await apiClient.get(`/search/insights/tenant/${tenantId}`);
    return response.data;
  },

  getFinancialInsights: async (period?: string, propertyId?: number) => {
    const params: Record<string, any> = {};
    if (period) params.period = period;
    if (propertyId) params.propertyId = propertyId;
    
    const response = await apiClient.get('/search/insights/financial', { params });
    return response.data;
  },

  getMaintenanceInsights: async () => {
    const response = await apiClient.get('/search/insights/maintenance');
    return response.data;
  },

  getMarketTrends: async (location?: string) => {
    const params = location ? { location } : {};
    const response = await apiClient.get('/search/insights/market-trends', { params });
    return response.data;
  },

  generatePredictions: async (predictionRequest: Record<string, any>) => {
    const response = await apiClient.post('/search/insights/predict', predictionRequest);
    return response.data;
  },

  // Smart Recommendations
  getPropertyRecommendations: async (userId: number, limit: number = 5) => {
    const response = await apiClient.get('/search/recommendations/properties', { params: { userId, limit } });
    return response.data;
  },

  getTenantRecommendations: async (propertyId: number, limit: number = 5) => {
    const response = await apiClient.get('/search/recommendations/tenants', { params: { propertyId, limit } });
    return response.data;
  },

  getPricingRecommendations: async (propertyId: number) => {
    const response = await apiClient.get('/search/recommendations/pricing', { params: { propertyId } });
    return response.data;
  },

  getMaintenanceRecommendations: async (propertyId: number) => {
    const response = await apiClient.get('/search/recommendations/maintenance', { params: { propertyId } });
    return response.data;
  },

  getInvestmentRecommendations: async (userId: number) => {
    const response = await apiClient.get('/search/recommendations/investment', { params: { userId } });
    return response.data;
  },

  submitRecommendationFeedback: async (feedback: Record<string, any>) => {
    const response = await apiClient.post('/search/recommendations/feedback', feedback);
    return response.data;
  },

  // Search Analytics
  getPopularSearches: async (days: number = 7, limit: number = 10) => {
    const response = await apiClient.get('/search/analytics/popular-searches', { params: { days, limit } });
    return response.data;
  },

  getSearchTrends: async (period?: string) => {
    const params = period ? { period } : {};
    const response = await apiClient.get('/search/analytics/search-trends', { params });
    return response.data;
  },

  getUserSearchBehavior: async (userId: number) => {
    const response = await apiClient.get('/search/analytics/user-behavior', { params: { userId } });
    return response.data;
  },

  // Search Configuration
  getSearchConfig: async () => {
    const response = await apiClient.get('/search/config');
    return response.data;
  },

  updateSearchConfig: async (config: Record<string, any>) => {
    const response = await apiClient.post('/search/config', config);
    return response.data;
  },

  reindexData: async (reindexRequest: Record<string, any>) => {
    const response = await apiClient.post('/search/reindex', reindexRequest);
    return response.data;
  },

  // Semantic Search
  semanticSearch: async (searchRequest: Record<string, any>) => {
    const response = await apiClient.post('/search/semantic', searchRequest);
    return response.data;
  },

  findSimilar: async (entityType: string, entityId: number, limit: number = 5) => {
    const response = await apiClient.get('/search/similar', { params: { entityType, entityId, limit } });
    return response.data;
  },

  // Batch Operations
  batchSearch: async (queries: string[]) => {
    const promises = queries.map(query => searchApi.fullTextSearch(query));
    return Promise.all(promises);
  },

  // Export Functions
  exportSearchResults: async (searchParams: Record<string, any>, format: 'CSV' | 'EXCEL' | 'PDF' = 'CSV') => {
    const response = await apiClient.post('/search/export', {
      ...searchParams,
      format
    }, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `search-results.${format.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  // Search History
  getSearchHistory: async (userId: number, limit: number = 20) => {
    const response = await apiClient.get('/search/history', { params: { userId, limit } });
    return response.data;
  },

  clearSearchHistory: async (userId: number) => {
    const response = await apiClient.delete('/search/history', { params: { userId } });
    return response.data;
  },

  // Saved Searches
  saveSearch: async (searchData: Record<string, any>) => {
    const response = await apiClient.post('/search/saved', searchData);
    return response.data;
  },

  getSavedSearches: async (userId: number) => {
    const response = await apiClient.get('/search/saved', { params: { userId } });
    return response.data;
  },

  deleteSavedSearch: async (searchId: number) => {
    const response = await apiClient.delete(`/search/saved/${searchId}`);
    return response.data;
  },

  // Search Alerts
  createSearchAlert: async (alertData: Record<string, any>) => {
    const response = await apiClient.post('/search/alerts', alertData);
    return response.data;
  },

  getSearchAlerts: async (userId: number) => {
    const response = await apiClient.get('/search/alerts', { params: { userId } });
    return response.data;
  },

  updateSearchAlert: async (alertId: number, alertData: Record<string, any>) => {
    const response = await apiClient.put(`/search/alerts/${alertId}`, alertData);
    return response.data;
  },

  deleteSearchAlert: async (alertId: number) => {
    const response = await apiClient.delete(`/search/alerts/${alertId}`);
    return response.data;
  }
};

export { searchApi };