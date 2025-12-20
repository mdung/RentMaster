-- Property Analytics Table

CREATE TABLE property_analytics (
    id BIGSERIAL PRIMARY KEY,
    property_id BIGINT NOT NULL,
    metric_type VARCHAR(50),
    metric_date DATE,
    value DOUBLE PRECISION,
    unit VARCHAR(50),
    period_type VARCHAR(50),
    year INTEGER,
    month INTEGER,
    quarter INTEGER,
    notes TEXT,
    calculated_at TIMESTAMP DEFAULT NOW(),
    calculated_by VARCHAR(255)
);

-- Indexes for performance
CREATE INDEX idx_property_analytics_property_id ON property_analytics(property_id);
CREATE INDEX idx_property_analytics_metric_type ON property_analytics(metric_type);
CREATE INDEX idx_property_analytics_metric_date ON property_analytics(metric_date);
CREATE INDEX idx_property_analytics_period_type ON property_analytics(period_type);
CREATE INDEX idx_property_analytics_year ON property_analytics(year);
CREATE INDEX idx_property_analytics_month ON property_analytics(month);
CREATE INDEX idx_property_analytics_quarter ON property_analytics(quarter);
CREATE INDEX idx_property_analytics_property_metric_type ON property_analytics(property_id, metric_type);
CREATE INDEX idx_property_analytics_property_metric_date ON property_analytics(property_id, metric_date);
CREATE INDEX idx_property_analytics_property_period ON property_analytics(property_id, period_type);
CREATE INDEX idx_property_analytics_property_year_month ON property_analytics(property_id, year, month);
CREATE INDEX idx_property_analytics_property_year_quarter ON property_analytics(property_id, year, quarter);

