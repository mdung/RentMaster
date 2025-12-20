import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Brain, 
  Lightbulb, 
  BarChart3, 
  Settings, 
  History,
  Star,
  Clock,
  Target,
  Zap,
  RefreshCw,
  Download,
  Share2,
  BookOpen
} from 'lucide-react';
import './SearchPage.css';
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

const SearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('full-text');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [popularSearches, setPopularSearches] = useState<any[]>([]);
  const [searchTrends, setSearchTrends] = useState<any>({});
  const [searchConfig, setSearchConfig] = useState<any>({});

  // Load initial data
  useEffect(() => {
    loadPopularSearches();
    loadSearchTrends();
    loadSearchConfig();
    loadDashboardInsights();
  }, []);

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
      setPopularSearches(data);
    } catch (error) {
      console.error('Failed to load popular searches:', error);
    }
  };

  const loadSearchTrends = async () => {
    try {
      const data = await searchApi.getSearchTrends('week');
      setSearchTrends(data);
    } catch (error) {
      console.error('Failed to load search trends:', error);
    }
  };

  const loadSearchConfig = async () => {
    try {
      const data = await searchApi.getSearchConfig();
      setSearchConfig(data);
    } catch (error) {
      console.error('Failed to load search config:', error);
    }
  };

  const loadDashboardInsights = async () => {
    try {
      const data = await searchApi.getDashboardInsights();
      setInsights([
        {
          type: 'revenue',
          title: 'Revenue Growth Opportunity',
          description: 'Market analysis suggests 8-12% rent increase potential for high-performing properties',
          confidence: 0.87,
          data: data.revenue || {}
        },
        {
          type: 'occupancy',
          title: 'Occupancy Optimization',
          description: 'Predictive models indicate optimal timing for preventive maintenance',
          confidence: 0.82,
          data: data.occupancy || {}
        },
        {
          type: 'maintenance',
          title: 'Maintenance Prediction',
          description: 'HVAC systems require attention in the next 2-3 months',
          confidence: 0.75,
          data: data.maintenance || {}
        }
      ]);

      // Load recommendations
      const propertyRecs = await searchApi.getPropertyRecommendations(1, 5);
      const pricingRecs = await searchApi.getPricingRecommendations(1);
      
      setRecommendations([
        ...propertyRecs.map((rec: any) => ({
          id: rec.propertyId,
          type: 'property',
          title: rec.name,
          description: `Match Score: ${rec.matchScore}% - ${rec.matchReasons?.join(', ')}`,
          score: rec.matchScore,
          action: 'View Property'
        })),
        {
          id: 'pricing-1',
          type: 'pricing',
          title: 'Rent Optimization',
          description: `Recommended rent: $${pricingRecs.recommendedRent} (${pricingRecs.adjustmentPercentage}% increase)`,
          score: pricingRecs.confidence * 100,
          action: 'Apply Pricing'
        }
      ]);
    } catch (error) {
      console.error('Failed to load insights:', error);
    }
  };

  const loadSuggestions = async (query: string) => {
    try {
      const data = await searchApi.getSearchSuggestions(query, 5);
      setSuggestions(data.map((item: any) => ({
        text: item.text || item.query,
        score: item.score || 0,
        category: item.category || 'General'
      })));
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
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

      setSearchResults(results.hits || []);
      
      // Track search for analytics
      await searchApi.learnFromSearch({
        query: searchQuery,
        searchType,
        userId: 1 // Replace with actual user ID
      });
    } catch (error) {
      console.error('Search failed:', error);
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
      alert('Data reindexing started successfully');
    } catch (error) {
      console.error('Reindexing failed:', error);
      alert('Failed to start reindexing');
    } finally {
      setLoading(false);
    }
  };

  const renderSearchInterface = () => (
    <div className="search-interface">
      <div className="search-header">
        <h2>Advanced Search & AI</h2>
        <p>Intelligent search with AI-powered insights and recommendations</p>
      </div>

      <div className="search-controls">
        <div className="search-type-selector">
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            className="search-type-select"
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
            <button onClick={handleSearch} disabled={loading} className="search-button">
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
              className="filter-input"
            />
            <input
              type="text"
              placeholder="Location"
              value={filters.location || ''}
              onChange={(e) => setFilters({...filters, location: e.target.value})}
              className="filter-input"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
              className="filter-input"
            />
          </div>
        )}
      </div>

      <div className="search-results">
        {searchResults.length > 0 && (
          <div className="results-header">
            <h3>Search Results ({searchResults.length})</h3>
            <div className="results-actions">
              <button className="action-button">
                <Download /> Export
              </button>
              <button className="action-button">
                <Share2 /> Share
              </button>
            </div>
          </div>
        )}

        <div className="results-list">
          {searchResults.map((result) => (
            <div key={result.id} className="result-item">
              <div className="result-header">
                <h4 className="result-title">{result.title}</h4>
                <div className="result-score">
                  <Star className="score-icon" />
                  {(result.score * 100).toFixed(1)}%
                </div>
              </div>
              <p className="result-description">{result.description}</p>
              <div className="result-metadata">
                <span className="result-type">{result.type}</span>
                {result.highlights && Object.keys(result.highlights).length > 0 && (
                  <div className="result-highlights">
                    {Object.entries(result.highlights).map(([field, highlights]) => (
                      <span key={field} className="highlight">
                        <strong>{field}:</strong> {highlights.join(', ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {searchResults.length === 0 && searchQuery && !loading && (
          <div className="no-results">
            <Search className="no-results-icon" />
            <h3>No results found</h3>
            <p>Try adjusting your search terms or using different keywords</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="insights-section">
      <div className="section-header">
        <h3><Brain className="section-icon" />AI-Powered Insights</h3>
        <button onClick={loadDashboardInsights} className="refresh-button">
          <RefreshCw />
        </button>
      </div>

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
                {(insight.confidence * 100).toFixed(0)}%
              </div>
            </div>
            <h4 className="insight-title">{insight.title}</h4>
            <p className="insight-description">{insight.description}</p>
            <div className="insight-actions">
              <button className="insight-action">View Details</button>
              <button className="insight-action secondary">Learn More</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRecommendations = () => (
    <div className="recommendations-section">
      <div className="section-header">
        <h3><Lightbulb className="section-icon" />Smart Recommendations</h3>
      </div>

      <div className="recommendations-grid">
        {recommendations.map((rec) => (
          <div key={rec.id} className="recommendation-card">
            <div className="recommendation-header">
              <div className="recommendation-type">{rec.type}</div>
              <div className="recommendation-score">
                <Target className="score-icon" />
                {rec.score.toFixed(1)}%
              </div>
            </div>
            <h4 className="recommendation-title">{rec.title}</h4>
            <p className="recommendation-description">{rec.description}</p>
            {rec.action && (
              <button className="recommendation-action">
                <Zap className="action-icon" />
                {rec.action}
              </button>
            )}
          </div>
        ))}
      </div>
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
            {popularSearches.map((search, index) => (
              <div key={index} className="popular-search-item">
                <span className="search-query">{search.query}</span>
                <span className="search-count">{search.count}</span>
                <span className="search-category">{search.category}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h4>Search Trends</h4>
          <div className="trends-data">
            {searchTrends.trendingQueries?.map((trend: any, index: number) => (
              <div key={index} className="trend-item">
                <span className="trend-query">{trend.query}</span>
                <span className="trend-growth">+{trend.growth?.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="analytics-card">
          <h4>Search Categories</h4>
          <div className="categories-data">
            {Object.entries(searchTrends.categories || {}).map(([category, count]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-count">{count as number}</span>
              </div>
            ))}
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
                checked={searchConfig.elasticsearchEnabled} 
                readOnly 
              />
              Elasticsearch Integration
            </label>
            <label className="config-option">
              <input 
                type="checkbox" 
                checked={searchConfig.fuzzySearchEnabled} 
                readOnly 
              />
              Fuzzy Search
            </label>
            <label className="config-option">
              <input 
                type="checkbox" 
                checked={searchConfig.autoCompleteEnabled} 
                readOnly 
              />
              Auto-complete
            </label>
            <label className="config-option">
              <input 
                type="checkbox" 
                checked={searchConfig.searchAnalyticsEnabled} 
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
              <label>Max Results: {searchConfig.maxResults}</label>
            </div>
            <div className="setting-item">
              <label>Search Timeout: {searchConfig.searchTimeout}s</label>
            </div>
          </div>
        </div>

        <div className="config-card">
          <h4>Data Management</h4>
          <div className="config-actions">
            <button 
              onClick={handleReindexData} 
              disabled={loading}
              className="config-action-button"
            >
              <RefreshCw className={loading ? 'spinning' : ''} />
              Reindex Data
            </button>
            <button className="config-action-button">
              <Download />
              Export Analytics
            </button>
            <button className="config-action-button">
              <BookOpen />
              View Documentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="search-page">
      <div className="search-tabs">
        <button 
          className={`tab ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <Search className="tab-icon" />
          Search
        </button>
        <button 
          className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <Brain className="tab-icon" />
          AI Insights
        </button>
        <button 
          className={`tab ${activeTab === 'recommendations' ? 'active' : ''}`}
          onClick={() => setActiveTab('recommendations')}
        >
          <Lightbulb className="tab-icon" />
          Recommendations
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 className="tab-icon" />
          Analytics
        </button>
        <button 
          className={`tab ${activeTab === 'config' ? 'active' : ''}`}
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
  );
};

export default SearchPage;