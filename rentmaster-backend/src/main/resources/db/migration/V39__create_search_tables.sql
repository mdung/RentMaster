-- Search Analytics Table
CREATE TABLE search_analytics (
    id BIGSERIAL PRIMARY KEY,
    query VARCHAR(500) NOT NULL,
    search_type VARCHAR(100),
    result_id VARCHAR(255),
    action VARCHAR(100),
    user_id BIGINT,
    session_id VARCHAR(255),
    ip_address VARCHAR(50),
    user_agent VARCHAR(500),
    results_count INTEGER,
    response_time BIGINT,
    clicked_position INTEGER,
    metadata TEXT,
    timestamp TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Search Config Table
CREATE TABLE search_config (
    id BIGSERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    elasticsearch_enabled BOOLEAN DEFAULT TRUE,
    fuzzy_search_enabled BOOLEAN DEFAULT TRUE,
    auto_complete_enabled BOOLEAN DEFAULT TRUE,
    search_analytics_enabled BOOLEAN DEFAULT TRUE,
    semantic_search_enabled BOOLEAN DEFAULT FALSE,
    ai_insights_enabled BOOLEAN DEFAULT TRUE,
    recommendations_enabled BOOLEAN DEFAULT TRUE,
    max_results INTEGER DEFAULT 100,
    search_timeout INTEGER DEFAULT 30,
    autocomplete_limit INTEGER DEFAULT 10,
    suggestions_limit INTEGER DEFAULT 5,
    min_query_length INTEGER DEFAULT 2,
    max_query_length INTEGER DEFAULT 500,
    cache_enabled BOOLEAN DEFAULT TRUE,
    cache_ttl INTEGER DEFAULT 300,
    log_queries BOOLEAN DEFAULT TRUE,
    log_results BOOLEAN DEFAULT FALSE,
    boost_recent_results BOOLEAN DEFAULT TRUE,
    boost_popular_results BOOLEAN DEFAULT TRUE,
    personalization_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Search Config Index Settings (collection table)
CREATE TABLE search_config_index_settings (
    config_id BIGINT NOT NULL REFERENCES search_config(id) ON DELETE CASCADE,
    setting_key VARCHAR(255) NOT NULL,
    setting_value TEXT,
    PRIMARY KEY (config_id, setting_key)
);

-- Search Config Analyzer Settings (collection table)
CREATE TABLE search_config_analyzer_settings (
    config_id BIGINT NOT NULL REFERENCES search_config(id) ON DELETE CASCADE,
    analyzer_key VARCHAR(255) NOT NULL,
    analyzer_value TEXT,
    PRIMARY KEY (config_id, analyzer_key)
);

-- Search Config Boost Fields (collection table)
CREATE TABLE search_config_boost_fields (
    config_id BIGINT NOT NULL REFERENCES search_config(id) ON DELETE CASCADE,
    field_name VARCHAR(255) NOT NULL,
    boost_value DOUBLE PRECISION,
    PRIMARY KEY (config_id, field_name)
);

-- Indexes for search_analytics
CREATE INDEX idx_search_analytics_user_id ON search_analytics(user_id);
CREATE INDEX idx_search_analytics_timestamp ON search_analytics(timestamp);
CREATE INDEX idx_search_analytics_search_type ON search_analytics(search_type);
CREATE INDEX idx_search_analytics_session_id ON search_analytics(session_id);
CREATE INDEX idx_search_analytics_query ON search_analytics(query);

-- Indexes for search_config
CREATE INDEX idx_search_config_config_key ON search_config(config_key);

