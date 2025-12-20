import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const searchApi = {
  // Full-text Search
  fullTextSearch: async (query: string, page: number = 0, size: number = 20, types?: string[], filters?: Record<string, string>) => {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      size: size.toString()
    });
    
    if (types) {
      types.forEach(type => params.append('types', type));
    }
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(`filters.${key}`, value);
      });
    }
    
    const response = await axios.get(`${API_BASE_URL}/search/full-text?${params}`);
    return response.data;
  },

  // Advanced Search
  advancedSearch: async (searchParams: Record<string, any>) => {
    const response = await axios.get(`${API_BASE_URL}/search/advanced`, {
      params: searchParams
    });
    return response.data;
  },

  // Faceted Search
  facetedSearch: async (query: string, facets?: string[]) => {
    const params = new URLSearchParams({ query });
    if (facets) {
      facets.forEach(facet => params.append('facets', facet));
    }
    
    const response = await axios.get(`${API_BASE_URL}/search/faceted?${params}`);
    return response.data;
  },

  // Natural Language Search
  naturalLanguageSearch: async (query: string, context?: string) => {
    const response = await axios.post(`${API_BASE_URL}/search/natural-language`, {
      query,
      context
    });
    return response.data;
  },

  // Query Understanding
  analyzeQuery: async (query: string) => {
    const response = await axios.post(`${API_BASE_URL}/search/query-understanding`, {
      query
    });
    return response.data;
  },

  // Predictive Search & Auto-complete
  getSearchSuggestions: async (query: string, limit: number = 10, context?: string) => {
    const params = new URLSearchParams({
      query,
      limit: limit.toString()
    });
    
    if (context) {
      params.append('context', context);
    }
    
    const response = await axios.get(`${API_BASE_URL}/search/suggestions?${params}`);
    return response.data;
  },

  autocomplete: async (query: string, limit: number = 5) => {
    const response = await axios.get(`${API_BASE_URL}/search/autocomplete`, {
      params: { query, limit }
    });
    return response.data;
  },

  learnFromSearch: async (searchData: Record<string, any>) => {
    const response = await axios.post(`${API_BASE_URL}/search/learn-from-search`, searchData);
    return response.data;
  },

  // AI-powered Insights
  getDashboardInsights: async (userId?: number) => {
    const params = userId ? { userId } : {};
    const response = await axios.get(`${API_BASE_URL}/search/insights/dashboard`, { params });
    return response.data;
  },

  getPropertyInsights: async (propertyId: number) => {
    const response = await axios.get(`${API_BASE_URL}/search/insights/property/${propertyId}`);
    return response.data;
  },

  getTenantInsights: async (tenantId: number) => {
    const response = await axios.get(`${API_BASE_URL}/search/insights/tenant/${tenantId}`);
    return response.data;
  },

  getFinancialInsights: async (period?: string, propertyId?: number) => {
    const params: Record<string, any> = {};
    if (period) params.period = period;
    if (propertyId) params.propertyId = propertyId;
    
    const response = await axios.get(`${API_BASE_URL}/search/insights/financial`, { params });
    return response.data;
  },

  getMaintenanceInsights: async () => {
    const response = await axios.get(`${API_BASE_URL}/search/insights/maintenance`);
    return response.data;
  },

  getMarketTrends: async (location?: string) => {
    const params = location ? { location } : {};
    const response = await axios.get(`${API_BASE_URL}/search/insights/market-trends`, { params });
    return response.data;
  },

  generatePredictions: async (predictionRequest: Record<string, any>) => {
    const response = await axios.post(`${API_BASE_URL}/search/insights/predict`, predictionRequest);
    return response.data;
  },

  // Smart Recommendations
  getPropertyRecommendations: async (userId: number, limit: number = 5) => {
    const response = await axios.get(`${API_BASE_URL}/search/recommendations/properties`, {
      params: { userId, limit }
    });
    return response.data;
  },

  getTenantRecommendations: async (propertyId: number, limit: number = 5) => {
    const response = await axios.get(`${API_BASE_URL}/search/recommendations/tenants`, {
      params: { propertyId, limit }
    });
    return response.data;
  },

  getPricingRecommendations: async (propertyId: number) => {
    const response = await axios.get(`${API_BASE_URL}/search/recommendations/pricing`, {
      params: { propertyId }
    });
    return response.data;
  },

  getMaintenanceRecommendations: async (propertyId: number) => {
    const response = await axios.get(`${API_BASE_URL}/search/recommendations/maintenance`, {
      params: { propertyId }
    });
    return response.data;
  },

  getInvestmentRecommendations: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/search/recommendations/investment`, {
      params: { userId }
    });
    return response.data;
  },

  submitRecommendationFeedback: async (feedback: Record<string, any>) => {
    const response = await axios.post(`${API_BASE_URL}/search/recommendations/feedback`, feedback);
    return response.data;
  },

  // Search Analytics
  getPopularSearches: async (days: number = 7, limit: number = 10) => {
    const response = await axios.get(`${API_BASE_URL}/search/analytics/popular-searches`, {
      params: { days, limit }
    });
    return response.data;
  },

  getSearchTrends: async (period?: string) => {
    const params = period ? { period } : {};
    const response = await axios.get(`${API_BASE_URL}/search/analytics/search-trends`, { params });
    return response.data;
  },

  getUserSearchBehavior: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/search/analytics/user-behavior`, {
      params: { userId }
    });
    return response.data;
  },

  // Search Configuration
  getSearchConfig: async () => {
    const response = await axios.get(`${API_BASE_URL}/search/config`);
    return response.data;
  },

  updateSearchConfig: async (config: Record<string, any>) => {
    const response = await axios.post(`${API_BASE_URL}/search/config`, config);
    return response.data;
  },

  reindexData: async (reindexRequest: Record<string, any>) => {
    const response = await axios.post(`${API_BASE_URL}/search/reindex`, reindexRequest);
    return response.data;
  },

  // Semantic Search
  semanticSearch: async (searchRequest: Record<string, any>) => {
    const response = await axios.post(`${API_BASE_URL}/search/semantic`, searchRequest);
    return response.data;
  },

  findSimilar: async (entityType: string, entityId: number, limit: number = 5) => {
    const response = await axios.get(`${API_BASE_URL}/search/similar`, {
      params: { entityType, entityId, limit }
    });
    return response.data;
  },

  // Batch Operations
  batchSearch: async (queries: string[]) => {
    const promises = queries.map(query => searchApi.fullTextSearch(query));
    return Promise.all(promises);
  },

  // Export Functions
  exportSearchResults: async (searchParams: Record<string, any>, format: 'CSV' | 'EXCEL' | 'PDF' = 'CSV') => {
    const response = await axios.post(`${API_BASE_URL}/search/export`, {
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
    const response = await axios.get(`${API_BASE_URL}/search/history`, {
      params: { userId, limit }
    });
    return response.data;
  },

  clearSearchHistory: async (userId: number) => {
    const response = await axios.delete(`${API_BASE_URL}/search/history`, {
      params: { userId }
    });
    return response.data;
  },

  // Saved Searches
  saveSearch: async (searchData: Record<string, any>) => {
    const response = await axios.post(`${API_BASE_URL}/search/saved`, searchData);
    return response.data;
  },

  getSavedSearches: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/search/saved`, {
      params: { userId }
    });
    return response.data;
  },

  deleteSavedSearch: async (searchId: number) => {
    const response = await axios.delete(`${API_BASE_URL}/search/saved/${searchId}`);
    return response.data;
  },

  // Search Alerts
  createSearchAlert: async (alertData: Record<string, any>) => {
    const response = await axios.post(`${API_BASE_URL}/search/alerts`, alertData);
    return response.data;
  },

  getSearchAlerts: async (userId: number) => {
    const response = await axios.get(`${API_BASE_URL}/search/alerts`, {
      params: { userId }
    });
    return response.data;
  },

  updateSearchAlert: async (alertId: number, alertData: Record<string, any>) => {
    const response = await axios.put(`${API_BASE_URL}/search/alerts/${alertId}`, alertData);
    return response.data;
  },

  deleteSearchAlert: async (alertId: number) => {
    const response = await axios.delete(`${API_BASE_URL}/search/alerts/${alertId}`);
    return response.data;
  }
};

export { searchApi };