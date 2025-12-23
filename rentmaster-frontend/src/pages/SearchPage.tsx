import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/MainLayout';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Brain, 
  Lightbulb, 
  BarChart3, 
  Settings, 
  RefreshCw,
  Download,
  Share2,
  Star,
  Target,
  Zap
} from 'lucide-react';
import './SearchPage.css';
import './shared-styles.css';
import { searchApi } from '../services/api/searchApi';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  score: number;
  highlights?: Record<string, string[]>;
  metadata?: Record<string, any>;
}

interface SearchSuggestion {
  text: string;
  score: number;
  category: string;
}

interface AIInsight {
  type: string;
  title: string;
  description: string;
  confidence: number;
  data: Record<string, any>;
}

interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  score: number;
  action?: string;
}

interface ModalState {
  show: boolean;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  details?: string;
}

const SearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'insights' | 'recommendations' | 'analytics' | 'config'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchType, setSearchType] = useState('full-text');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [popularSearches, setPopularSearches] = useState<any[]>([]);
  const [searchTrends, setSearchTrends] = useState<any>({});
  const [searchConfig, setSearchConfig] = useState<any>({});
  const [modal, setModal] = useState<ModalState>({ show: false, title: '', message: '', type: 'info' });

  const showModal = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', details?: string) => {
    setModal({ show: true, title, message, type, details });
  };

  const hideModal = () => {
    setModal({ show: false, title: '', message: '', type: 'info' });
  };

  // Load initial data
  useEffect(() => {
    loadPopularSearches();
    loadSearchTrends();
    loadSearchConfig();
    if (activeTab === 'insights') {
      loadDashboardInsights();
    }
    if (activeTab === 'recommendations') {
      loadRecommendations();
    }
  }, [activeTab]);

  // Auto-complete suggestions
  useEffect(() => {
    if (searchQuery.length >= 2) {
      const debounceTimer = setTimeout(() => {
        loadSuggestions(searchQuery);
      }, 300);
      return () => clearTimeout(debounceTimer);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  const loadPopularSearches = async () => {
    try {
      const data = await searchApi.getPopularSearches(7, 10);
      setPopularSearches(data || []);
    } catch (error: any) {
      console.error('Failed to load popular searches:', error);
      setPopularSearches([]);
    }
  };

  const loadSearchTrends = async () => {
    try {
      const data = await searchApi.getSearchTrends('week');
      setSearchTrends(data || {});
    } catch (error: any) {
      console.error('Failed to load search trends:', error);
      setSearchTrends({});
    }
  };

  const loadSearchConfig = async () => {
    try {
      const data = await searchApi.getSearchConfig();
      setSearchConfig(data || {
        elasticsearchEnabled: true,
        fuzzySearchEnabled: true,
        autoCompleteEnabled: true,
        searchAnalyticsEnabled: true,
        maxResults: 20,
        searchTimeout: 5
      });
    } catch (error: any) {
      console.error('Failed to load search config:', error);
      setSearchConfig({
        elasticsearchEnabled: true,
        fuzzySearchEnabled: true,
        autoCompleteEnabled: true,
        searchAnalyticsEnabled: true,
        maxResults: 20,
        searchTimeout: 5
      });
    }
  };

  const loadDashboardInsights = async () => {
    try {
      setLoading(true);
      const data = await searchApi.getDashboardInsights(1);
      setInsights([
        {
          type: 'revenue',
          title: 'Revenue Growth Opportunity',
          description: data.revenue?.message || 'Market analysis suggests 8-12% rent increase potential for high-performing properties',
          confidence: data.revenue?.confidence || 0.87,
          data: data.revenue || {}
        },
        {
          type: 'occupancy',
          title: 'Occupancy Optimization',
          description: data.occupancy?.message || 'Predictive models indicate optimal timing for preventive maintenance',
          confidence: data.occupancy?.confidence || 0.82,
          data: data.occupancy || {}
        },
        {
          type: 'maintenance',
          title: 'Maintenance Prediction',
          description: data.maintenance?.message || 'HVAC systems require attention in the next 2-3 months',
          confidence: data.maintenance?.confidence || 0.75,
          data: data.maintenance || {}
        }
      ]);
    } catch (error: any) {
      console.error('Failed to load insights:', error);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  };

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const propertyRecs = await searchApi.getPropertyRecommendations(1, 5);
      const pricingRecs = await searchApi.getPricingRecommendations(1);
      
      setRecommendations([
        ...(propertyRecs || []).map((rec: any) => ({
          id: rec.propertyId || rec.id,
          type: 'property',
          title: rec.name || rec.title || 'Property Recommendation',
          description: `Match Score: ${rec.matchScore || rec.score || 0}% - ${(rec.matchReasons || []).join(', ') || 'Recommended property'}`,
          score: rec.matchScore || rec.score || 0,
          action: 'View Property'
        })),
        {
          id: 'pricing-1',
          type: 'pricing',
          title: 'Rent Optimization',
          description: `Recommended rent: $${pricingRecs?.recommendedRent || 0} (${pricingRecs?.adjustmentPercentage || 0}% increase)`,
          score: (pricingRecs?.confidence || 0) * 100,
          action: 'Apply Pricing'
        }
      ]);
    } catch (error: any) {
      console.error('Failed to load recommendations:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadSuggestions = async (query: string) => {
    try {
      const data = await searchApi.getSearchSuggestions(query, 5);
      setSuggestions((data || []).map((item: any) => ({
        text: item.text || item.query || item,
        score: item.score || 0,
        category: item.category || 'General'
      })));
    } catch (error: any) {
      console.error('Failed to load suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      let results;
      
      switch (searchType) {
        case 'natural-language':
          results = await searchApi.naturalLanguageSearch(searchQuery);
          break;
        case 'semantic':
          results = await searchApi.semanticSearch({ query: searchQuery });
          break;
        case 'advanced':
          results = await searchApi.advancedSearch({
            query: searchQuery,
            filters,
            sorting: { field: 'score', order: 'desc' }
          });
          break;
        default:
          results = await searchApi.fullTextSearch(searchQuery, 0, 20);
      }

      setSearchResults(results?.hits || results || []);
      
      // Track search for analytics
      try {
        await searchApi.learnFromSearch({
          query: searchQuery,
          searchType,
          userId: 1
        });
      } catch (e) {
        // Ignore tracking errors
      }
    } catch (err: any) {
      console.error('Search failed:', err);
      setError(err.response?.data?.message || 'Search failed. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.text);
    setSuggestions([]);
    handleSearch();
  };

  const handleReindexData = async () => {
    try {
      setLoading(true);
      await searchApi.reindexData({ indexType: 'all', fullReindex: false });
      showModal('Success', 'Data reindexing started successfully. This process may take a few minutes to complete.', 'success');
    } catch (error: any) {
      console.error('Reindexing failed:', error);
      showModal('Error', 'Failed to start reindexing', 'error', error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await searchApi.exportSearchResults({
        query: searchQuery,
        searchType,
        filters
      }, 'CSV');
      showModal('Success', 'Search results exported successfully!', 'success');
    } catch (error: any) {
      showModal('Export Failed', 'Failed to export search results', 'error', error.response?.data?.message || error.message);
    }
  };

  const renderSearchInterface = () => (
    <div className="search-interface">
      <div className="section-header">
        <h3>Advanced Search & AI</h3>
        <p className="section-subtitle">Intelligent search with AI-powered insights and recommendations</p>
      </div>

      <div className="search-controls">
        <div className="search-type-selector">
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            className="form-select"
          >
            <option value="full-text">Full-Text Search</option>
            <option value="natural-language">Natural Language</option>
            <option value="semantic">Semantic Search</option>
            <option value="advanced">Advanced Search</option>
          </select>
        </div>

        <div className="search-input-container">
          <div className="search-input-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder={
                searchType === 'natural-language' 
                  ? "Ask in natural language: 'Show me 2-bedroom apartments under $2000'"
                  : "Search properties, tenants, payments, documents..."
              }
              className="search-input"
            />
            <button onClick={handleSearch} disabled={loading} className="btn btn-primary search-button">
              {loading ? <RefreshCw className="spinning" /> : <Search />}
            </button>
          </div>

          {suggestions.length > 0 && (
            <div className="suggestions-dropdown">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-text">{suggestion.text}</span>
                  <span className="suggestion-category">{suggestion.category}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {searchType === 'advanced' && (
          <div className="advanced-filters">
            <Filter className="filter-icon" />
            <input
              type="text"
              placeholder="Property Type"
              value={filters.type || ''}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="form-input"
            />
            <input
              type="text"
              placeholder="Location"
              value={filters.location || ''}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="form-input"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              className="form-input"
            />
          </div>
        )}
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span className="error-text">{error}</span>
          <button className="error-close" onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="search-results">
        {searchResults.length > 0 && (
          <div className="results-header">
            <h4>Search Results ({searchResults.length})</h4>
            <div className="results-actions">
              <button className="btn btn-secondary" onClick={handleExport}>
                <Download /> Export
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  const shareText = `Search Results for "${searchQuery}"\n\nFound ${searchResults.length} results.`;
                  if (navigator.share) {
                    navigator.share({
                      title: 'Search Results',
                      text: shareText,
                      url: window.location.href
                    }).catch(err => console.log('Error sharing:', err));
                  } else {
                    // Fallback: copy to clipboard
                    navigator.clipboard.writeText(shareText).then(() => {
                      showModal('Success', 'Search results copied to clipboard!', 'success');
                    }).catch(() => {
                      showModal('Share Results', shareText, 'info');
                    });
                  }
                }}
              >
                <Share2 /> Share
              </button>
            </div>
          </div>
        )}

        <div className="results-list">
          {searchResults.map((result, index) => (
            <div 
              key={result.id || index} 
              className="result-item"
              onClick={() => {
                console.log('Result clicked:', result);
                const typeLabel = result.type?.charAt(0).toUpperCase() + result.type?.slice(1) || 'Item';
                showModal(
                  `Viewing ${typeLabel}`,
                  result.description || 'No description available',
                  'info',
                  `Title: ${result.title}\nType: ${result.type}\nScore: ${((result.score || 0) * 100).toFixed(1)}%`
                );
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="result-header">
                <h4 className="result-title">{result.title || 'Untitled'}</h4>
                <div className="result-score">
                  <Star className="score-icon" />
                  {((result.score || 0) * 100).toFixed(1)}%
                </div>
              </div>
              <p className="result-description">{result.description || 'No description available'}</p>
              <div className="result-metadata">
                <span className="result-type">{result.type || 'Unknown'}</span>
                {result.highlights && Object.keys(result.highlights).length > 0 && (
                  <div className="result-highlights">
                    {Object.entries(result.highlights).map(([field, highlights]) => (
                      <span key={field} className="highlight">
                        <strong>{field}:</strong> {Array.isArray(highlights) ? highlights.join(', ') : highlights}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {searchResults.length === 0 && searchQuery && !loading && (
          <div className="empty-state">
            <div className="empty-state-content">
              <Search className="empty-icon" />
              <h3>No results found</h3>
              <p>Try adjusting your search terms or using different keywords</p>
            </div>
          </div>
        )}

        {!searchQuery && searchResults.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-content">
              <Search className="empty-icon" />
              <h3>Start searching</h3>
              <p>Enter a search query to find properties, tenants, payments, and more</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="insights-section">
      <div className="section-header">
        <h3><Brain className="section-icon" />AI-Powered Insights</h3>
        <button onClick={loadDashboardInsights} className="btn btn-secondary refresh-button" disabled={loading}>
          <RefreshCw className={loading ? 'spinning' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading insights...</p>
        </div>
      ) : insights.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <Brain className="empty-icon" />
            <h3>No insights available</h3>
            <p>Insights will appear here once data is available</p>
          </div>
        </div>
      ) : (
        <div className="insights-grid">
          {insights.map((insight, index) => (
            <div key={index} className="insight-card">
              <div className="insight-header">
                <div className="insight-icon">
                  {insight.type === 'revenue' && <TrendingUp />}
                  {insight.type === 'occupancy' && <BarChart3 />}
                  {insight.type === 'maintenance' && <Settings />}
                </div>
                <div className="insight-confidence">
                  {((insight.confidence || 0) * 100).toFixed(0)}%
                </div>
              </div>
              <h4 className="insight-title">{insight.title}</h4>
              <p className="insight-description">{insight.description}</p>
              <div className="insight-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    console.log('View Details for insight:', insight);
                    showModal(
                      insight.title,
                      insight.description,
                      'info',
                      `Confidence: ${((insight.confidence || 0) * 100).toFixed(0)}%\nType: ${insight.type}`
                    );
                  }}
                >
                  View Details
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    console.log('Learn More about insight:', insight);
                    showModal(
                      `About ${insight.title}`,
                      'This insight is based on AI analysis of your property data. It uses machine learning algorithms to identify patterns and opportunities in your rental portfolio.',
                      'info',
                      `Insight Type: ${insight.type}\nConfidence Level: ${((insight.confidence || 0) * 100).toFixed(0)}%`
                    );
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderRecommendations = () => (
    <div className="recommendations-section">
      <div className="section-header">
        <h3><Lightbulb className="section-icon" />Smart Recommendations</h3>
        <button onClick={loadRecommendations} className="btn btn-secondary refresh-button" disabled={loading}>
          <RefreshCw className={loading ? 'spinning' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading recommendations...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <Lightbulb className="empty-icon" />
            <h3>No recommendations available</h3>
            <p>Recommendations will appear here once data is available</p>
          </div>
        </div>
      ) : (
        <div className="recommendations-grid">
          {recommendations.map((rec) => (
            <div key={rec.id} className="recommendation-card">
              <div className="recommendation-header">
                <div className="recommendation-type">{rec.type}</div>
                <div className="recommendation-score">
                  <Target className="score-icon" />
                  {(rec.score || 0).toFixed(1)}%
                </div>
              </div>
              <h4 className="recommendation-title">{rec.title}</h4>
              <p className="recommendation-description">{rec.description}</p>
              {rec.action && (
                <button 
                  className="btn btn-primary recommendation-action"
                  onClick={() => {
                    console.log('Action clicked for recommendation:', rec);
                    if (rec.type === 'property') {
                      showModal(
                        rec.title,
                        rec.description,
                        'info',
                        `Match Score: ${rec.score.toFixed(1)}%\nType: Property Recommendation`
                      );
                    } else if (rec.type === 'pricing') {
                      showModal(
                        'Pricing Recommendation',
                        rec.description,
                        'success',
                        `This pricing recommendation is based on market analysis and your property's performance metrics.`
                      );
                    } else {
                      showModal(
                        rec.action || 'Recommendation',
                        rec.description,
                        'info',
                        `Title: ${rec.title}\nScore: ${rec.score.toFixed(1)}%`
                      );
                    }
                  }}
                >
                  <Zap className="action-icon" />
                  {rec.action}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAnalytics = () => (
    <div className="analytics-section">
      <div className="section-header">
        <h3><BarChart3 className="section-icon" />Search Analytics</h3>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h4>Popular Searches</h4>
          <div className="popular-searches">
            {popularSearches.length === 0 ? (
              <p className="no-data">No popular searches available</p>
            ) : (
              popularSearches.map((search, index) => (
                <div key={index} className="popular-search-item">
                  <span className="search-query">{search.query || search.text || 'Unknown'}</span>
                  <span className="search-count">{search.count || 0}</span>
                  <span className="search-category">{search.category || 'General'}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="analytics-card">
          <h4>Search Trends</h4>
          <div className="trends-data">
            {searchTrends.trendingQueries && searchTrends.trendingQueries.length > 0 ? (
              searchTrends.trendingQueries.map((trend: any, index: number) => (
                <div key={index} className="trend-item">
                  <span className="trend-query">{trend.query || trend.text || 'Unknown'}</span>
                  <span className="trend-growth">+{(trend.growth || 0).toFixed(1)}%</span>
                </div>
              ))
            ) : (
              <p className="no-data">No trending searches available</p>
            )}
          </div>
        </div>

        <div className="analytics-card">
          <h4>Search Categories</h4>
          <div className="categories-data">
            {searchTrends.categories && Object.keys(searchTrends.categories).length > 0 ? (
              Object.entries(searchTrends.categories).map(([category, count]) => (
                <div key={category} className="category-item">
                  <span className="category-name">{category}</span>
                  <span className="category-count">{count as number}</span>
                </div>
              ))
            ) : (
              <p className="no-data">No category data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfiguration = () => (
    <div className="configuration-section">
      <div className="section-header">
        <h3><Settings className="section-icon" />Search Configuration</h3>
      </div>

      <div className="config-grid">
        <div className="config-card">
          <h4>Search Features</h4>
          <div className="config-options">
            <label className="config-option">
              <input 
                type="checkbox" 
                checked={searchConfig.elasticsearchEnabled !== false} 
                readOnly 
              />
              Elasticsearch Integration
            </label>
            <label className="config-option">
              <input 
                type="checkbox" 
                checked={searchConfig.fuzzySearchEnabled !== false} 
                readOnly 
              />
              Fuzzy Search
            </label>
            <label className="config-option">
              <input 
                type="checkbox" 
                checked={searchConfig.autoCompleteEnabled !== false} 
                readOnly 
              />
              Auto-complete
            </label>
            <label className="config-option">
              <input 
                type="checkbox" 
                checked={searchConfig.searchAnalyticsEnabled !== false} 
                readOnly 
              />
              Search Analytics
            </label>
          </div>
        </div>

        <div className="config-card">
          <h4>Performance Settings</h4>
          <div className="config-settings">
            <div className="setting-item">
              <label>Max Results: {searchConfig.maxResults || 20}</label>
            </div>
            <div className="setting-item">
              <label>Search Timeout: {searchConfig.searchTimeout || 5}s</label>
            </div>
          </div>
        </div>

        <div className="config-card">
          <h4>Data Management</h4>
          <div className="config-actions">
            <button 
              onClick={handleReindexData} 
              disabled={loading}
              className="btn btn-primary"
            >
              <RefreshCw className={loading ? 'spinning' : ''} />
              Reindex Data
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={async () => {
                try {
                  // Export analytics data
                  const analyticsData = {
                    popularSearches,
                    searchTrends,
                    config: searchConfig
                  };
                  
                  const dataStr = JSON.stringify(analyticsData, null, 2);
                  const dataBlob = new Blob([dataStr], { type: 'application/json' });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `search-analytics-${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  
                  showModal('Success', 'Analytics data exported successfully!', 'success');
                } catch (error: any) {
                  showModal('Export Failed', 'Failed to export analytics data', 'error', error.message || 'Unknown error');
                }
              }}
            >
              <Download />
              Export Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="search-page">
        <div className="page-header">
          <div>
            <h1>Advanced Search & AI</h1>
            <p className="page-subtitle">Intelligent search with AI-powered insights and recommendations</p>
          </div>
        </div>

        <div className="search-tabs">
          <button 
            className={`tab-button ${activeTab === 'search' ? 'active' : ''}`}
            onClick={() => setActiveTab('search')}
          >
            <Search className="tab-icon" />
            Search
          </button>
          <button 
            className={`tab-button ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            <Brain className="tab-icon" />
            AI Insights
          </button>
          <button 
            className={`tab-button ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
          >
            <Lightbulb className="tab-icon" />
            Recommendations
          </button>
          <button 
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart3 className="tab-icon" />
            Analytics
          </button>
          <button 
            className={`tab-button ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            <Settings className="tab-icon" />
            Configuration
          </button>
        </div>

        <div className="search-content">
          {activeTab === 'search' && renderSearchInterface()}
          {activeTab === 'insights' && renderInsights()}
          {activeTab === 'recommendations' && renderRecommendations()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'config' && renderConfiguration()}
        </div>
      </div>

      {/* Modern Modal */}
      {modal.show && (
        <div className="modal-overlay" onClick={hideModal}>
          <div className="modal-content notification-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-wrapper">
                {modal.type === 'success' && <div className="modal-icon success-icon">✓</div>}
                {modal.type === 'error' && <div className="modal-icon error-icon">✕</div>}
                {modal.type === 'warning' && <div className="modal-icon warning-icon">⚠</div>}
                {modal.type === 'info' && <div className="modal-icon info-icon">ℹ</div>}
              </div>
              <h2>{modal.title}</h2>
              <button className="modal-close" onClick={hideModal}>✕</button>
            </div>
            <div className="modal-body">
              <p className="modal-message">{modal.message}</p>
              {modal.details && (
                <div className="modal-details">
                  <pre>{modal.details}</pre>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={hideModal}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default SearchPage;
