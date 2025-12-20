package com.rentmaster.search;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "search_config")
public class SearchConfig {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "config_key", unique = true, nullable = false)
    private String configKey;
    
    @Column(name = "elasticsearch_enabled")
    private boolean elasticsearchEnabled = true;
    
    @Column(name = "fuzzy_search_enabled")
    private boolean fuzzySearchEnabled = true;
    
    @Column(name = "auto_complete_enabled")
    private boolean autoCompleteEnabled = true;
    
    @Column(name = "search_analytics_enabled")
    private boolean searchAnalyticsEnabled = true;
    
    @Column(name = "semantic_search_enabled")
    private boolean semanticSearchEnabled = false;
    
    @Column(name = "ai_insights_enabled")
    private boolean aiInsightsEnabled = true;
    
    @Column(name = "recommendations_enabled")
    private boolean recommendationsEnabled = true;
    
    @Column(name = "max_results")
    private int maxResults = 100;
    
    @Column(name = "search_timeout")
    private int searchTimeout = 30; // seconds
    
    @Column(name = "autocomplete_limit")
    private int autocompleteLimit = 10;
    
    @Column(name = "suggestions_limit")
    private int suggestionsLimit = 5;
    
    @Column(name = "min_query_length")
    private int minQueryLength = 2;
    
    @Column(name = "max_query_length")
    private int maxQueryLength = 500;
    
    @Column(name = "cache_enabled")
    private boolean cacheEnabled = true;
    
    @Column(name = "cache_ttl")
    private int cacheTtl = 300; // seconds
    
    @Column(name = "log_queries")
    private boolean logQueries = true;
    
    @Column(name = "log_results")
    private boolean logResults = false;
    
    @Column(name = "boost_recent_results")
    private boolean boostRecentResults = true;
    
    @Column(name = "boost_popular_results")
    private boolean boostPopularResults = true;
    
    @Column(name = "personalization_enabled")
    private boolean personalizationEnabled = true;
    
    @ElementCollection
    @CollectionTable(name = "search_config_index_settings", 
                     joinColumns = @JoinColumn(name = "config_id"))
    @MapKeyColumn(name = "setting_key")
    @Column(name = "setting_value", columnDefinition = "TEXT")
    private Map<String, String> indexSettings;
    
    @ElementCollection
    @CollectionTable(name = "search_config_analyzer_settings", 
                     joinColumns = @JoinColumn(name = "config_id"))
    @MapKeyColumn(name = "analyzer_key")
    @Column(name = "analyzer_value", columnDefinition = "TEXT")
    private Map<String, String> analyzerSettings;
    
    @ElementCollection
    @CollectionTable(name = "search_config_boost_fields", 
                     joinColumns = @JoinColumn(name = "config_id"))
    @MapKeyColumn(name = "field_name")
    @Column(name = "boost_value")
    private Map<String, Double> boostFields;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "updated_by")
    private String updatedBy;

    // Constructors
    public SearchConfig() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public SearchConfig(String configKey) {
        this();
        this.configKey = configKey;
    }

    // Lifecycle callbacks
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getConfigKey() {
        return configKey;
    }

    public void setConfigKey(String configKey) {
        this.configKey = configKey;
    }

    public boolean isElasticsearchEnabled() {
        return elasticsearchEnabled;
    }

    public void setElasticsearchEnabled(boolean elasticsearchEnabled) {
        this.elasticsearchEnabled = elasticsearchEnabled;
    }

    public boolean isFuzzySearchEnabled() {
        return fuzzySearchEnabled;
    }

    public void setFuzzySearchEnabled(boolean fuzzySearchEnabled) {
        this.fuzzySearchEnabled = fuzzySearchEnabled;
    }

    public boolean isAutoCompleteEnabled() {
        return autoCompleteEnabled;
    }

    public void setAutoCompleteEnabled(boolean autoCompleteEnabled) {
        this.autoCompleteEnabled = autoCompleteEnabled;
    }

    public boolean isSearchAnalyticsEnabled() {
        return searchAnalyticsEnabled;
    }

    public void setSearchAnalyticsEnabled(boolean searchAnalyticsEnabled) {
        this.searchAnalyticsEnabled = searchAnalyticsEnabled;
    }

    public boolean isSemanticSearchEnabled() {
        return semanticSearchEnabled;
    }

    public void setSemanticSearchEnabled(boolean semanticSearchEnabled) {
        this.semanticSearchEnabled = semanticSearchEnabled;
    }

    public boolean isAiInsightsEnabled() {
        return aiInsightsEnabled;
    }

    public void setAiInsightsEnabled(boolean aiInsightsEnabled) {
        this.aiInsightsEnabled = aiInsightsEnabled;
    }

    public boolean isRecommendationsEnabled() {
        return recommendationsEnabled;
    }

    public void setRecommendationsEnabled(boolean recommendationsEnabled) {
        this.recommendationsEnabled = recommendationsEnabled;
    }

    public int getMaxResults() {
        return maxResults;
    }

    public void setMaxResults(int maxResults) {
        this.maxResults = maxResults;
    }

    public int getSearchTimeout() {
        return searchTimeout;
    }

    public void setSearchTimeout(int searchTimeout) {
        this.searchTimeout = searchTimeout;
    }

    public int getAutocompleteLimit() {
        return autocompleteLimit;
    }

    public void setAutocompleteLimit(int autocompleteLimit) {
        this.autocompleteLimit = autocompleteLimit;
    }

    public int getSuggestionsLimit() {
        return suggestionsLimit;
    }

    public void setSuggestionsLimit(int suggestionsLimit) {
        this.suggestionsLimit = suggestionsLimit;
    }

    public int getMinQueryLength() {
        return minQueryLength;
    }

    public void setMinQueryLength(int minQueryLength) {
        this.minQueryLength = minQueryLength;
    }

    public int getMaxQueryLength() {
        return maxQueryLength;
    }

    public void setMaxQueryLength(int maxQueryLength) {
        this.maxQueryLength = maxQueryLength;
    }

    public boolean isCacheEnabled() {
        return cacheEnabled;
    }

    public void setCacheEnabled(boolean cacheEnabled) {
        this.cacheEnabled = cacheEnabled;
    }

    public int getCacheTtl() {
        return cacheTtl;
    }

    public void setCacheTtl(int cacheTtl) {
        this.cacheTtl = cacheTtl;
    }

    public boolean isLogQueries() {
        return logQueries;
    }

    public void setLogQueries(boolean logQueries) {
        this.logQueries = logQueries;
    }

    public boolean isLogResults() {
        return logResults;
    }

    public void setLogResults(boolean logResults) {
        this.logResults = logResults;
    }

    public boolean isBoostRecentResults() {
        return boostRecentResults;
    }

    public void setBoostRecentResults(boolean boostRecentResults) {
        this.boostRecentResults = boostRecentResults;
    }

    public boolean isBoostPopularResults() {
        return boostPopularResults;
    }

    public void setBoostPopularResults(boolean boostPopularResults) {
        this.boostPopularResults = boostPopularResults;
    }

    public boolean isPersonalizationEnabled() {
        return personalizationEnabled;
    }

    public void setPersonalizationEnabled(boolean personalizationEnabled) {
        this.personalizationEnabled = personalizationEnabled;
    }

    public Map<String, String> getIndexSettings() {
        return indexSettings;
    }

    public void setIndexSettings(Map<String, String> indexSettings) {
        this.indexSettings = indexSettings;
    }

    public Map<String, String> getAnalyzerSettings() {
        return analyzerSettings;
    }

    public void setAnalyzerSettings(Map<String, String> analyzerSettings) {
        this.analyzerSettings = analyzerSettings;
    }

    public Map<String, Double> getBoostFields() {
        return boostFields;
    }

    public void setBoostFields(Map<String, Double> boostFields) {
        this.boostFields = boostFields;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    @Override
    public String toString() {
        return "SearchConfig{" +
                "id=" + id +
                ", configKey='" + configKey + '\'' +
                ", elasticsearchEnabled=" + elasticsearchEnabled +
                ", fuzzySearchEnabled=" + fuzzySearchEnabled +
                ", autoCompleteEnabled=" + autoCompleteEnabled +
                ", maxResults=" + maxResults +
                ", searchTimeout=" + searchTimeout +
                '}';
    }
}