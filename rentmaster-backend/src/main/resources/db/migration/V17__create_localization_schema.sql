-- Localization Schema

-- Languages
CREATE TABLE languages (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    native_name VARCHAR(100),
    country_code VARCHAR(10),
    direction VARCHAR(10) DEFAULT 'LTR',
    active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    flag_icon VARCHAR(50),
    completion_percentage DOUBLE PRECISION DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Locale Configs
CREATE TABLE locale_configs (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    country_code VARCHAR(10) NOT NULL,
    currency_code VARCHAR(10),
    time_zone VARCHAR(50),
    date_format VARCHAR(50),
    time_format VARCHAR(50),
    number_format VARCHAR(50),
    decimal_separator VARCHAR(5) DEFAULT '.',
    thousands_separator VARCHAR(5) DEFAULT ',',
    first_day_of_week INTEGER DEFAULT 1,
    weekend_days VARCHAR(20) DEFAULT '6,7',
    calendar_type VARCHAR(20) DEFAULT 'GREGORIAN',
    measurement_system VARCHAR(20) DEFAULT 'METRIC',
    paper_size VARCHAR(10) DEFAULT 'A4',
    active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Currency Localizations
CREATE TABLE currency_localizations (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    symbol_position VARCHAR(10) DEFAULT 'BEFORE',
    decimal_places INTEGER DEFAULT 2,
    decimal_separator VARCHAR(5) DEFAULT '.',
    thousands_separator VARCHAR(5) DEFAULT ',',
    space_between_symbol BOOLEAN DEFAULT FALSE,
    negative_format VARCHAR(20) DEFAULT 'PARENTHESES',
    rounding_mode VARCHAR(20) DEFAULT 'HALF_UP',
    exchange_rate DOUBLE PRECISION DEFAULT 1.0,
    is_base_currency BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    country_codes VARCHAR(200),
    format_template VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Translations
CREATE TABLE translations (
    id BIGSERIAL PRIMARY KEY,
    language_code VARCHAR(10) NOT NULL,
    category VARCHAR(100) NOT NULL,
    translation_key VARCHAR(200) NOT NULL,
    value TEXT,
    description TEXT,
    context TEXT,
    is_plural BOOLEAN DEFAULT FALSE,
    plural_forms TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    needs_review BOOLEAN DEFAULT FALSE,
    is_auto_translated BOOLEAN DEFAULT FALSE,
    source_text TEXT,
    translator_notes TEXT,
    character_limit INTEGER,
    tags VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    approved_by VARCHAR(255),
    approved_at TIMESTAMP,
    UNIQUE (language_code, category, translation_key)
);

-- DateTime Formats
CREATE TABLE datetime_formats (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    locale_code VARCHAR(20) NOT NULL,
    date_pattern VARCHAR(50) NOT NULL,
    time_pattern VARCHAR(50) NOT NULL,
    datetime_pattern VARCHAR(100) NOT NULL,
    short_date_pattern VARCHAR(50),
    long_date_pattern VARCHAR(100),
    short_time_pattern VARCHAR(50),
    long_time_pattern VARCHAR(50),
    month_names TEXT,
    short_month_names TEXT,
    day_names TEXT,
    short_day_names TEXT,
    am_pm_designators VARCHAR(50),
    first_day_of_week INTEGER DEFAULT 1,
    calendar_week_rule VARCHAR(20) DEFAULT 'FIRST_DAY',
    active BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Localized Templates
CREATE TABLE localized_templates (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    template_type VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    subject VARCHAR(500),
    content TEXT,
    variables TEXT,
    description TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    version VARCHAR(20) DEFAULT '1.0',
    parent_template_id BIGINT,
    approval_status VARCHAR(20) DEFAULT 'DRAFT',
    usage_count BIGINT DEFAULT 0,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255),
    approved_by VARCHAR(255),
    approved_at TIMESTAMP
);

-- Regional Compliance
CREATE TABLE regional_compliance (
    id BIGSERIAL PRIMARY KEY,
    country_code VARCHAR(10) UNIQUE NOT NULL,
    country_name VARCHAR(100) NOT NULL,
    tax_id_format VARCHAR(100),
    tax_id_label VARCHAR(50),
    phone_format VARCHAR(100),
    postal_code_format VARCHAR(100),
    postal_code_label VARCHAR(50),
    address_format TEXT,
    legal_requirements TEXT,
    data_protection_rules TEXT,
    contract_requirements TEXT,
    tenant_rights TEXT,
    landlord_obligations TEXT,
    eviction_rules TEXT,
    deposit_regulations TEXT,
    rent_control_rules TEXT,
    notice_periods TEXT,
    required_documents TEXT,
    tax_rates TEXT,
    currency_code VARCHAR(10),
    language_codes VARCHAR(100),
    business_hours VARCHAR(100),
    public_holidays TEXT,
    emergency_contacts TEXT,
    active BOOLEAN DEFAULT TRUE,
    compliance_version VARCHAR(20) DEFAULT '1.0',
    last_reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by VARCHAR(255),
    updated_by VARCHAR(255)
);

-- Indexes for performance
CREATE INDEX idx_languages_code ON languages(code);
CREATE INDEX idx_languages_active ON languages(active);
CREATE INDEX idx_locale_configs_code ON locale_configs(code);
CREATE INDEX idx_locale_configs_language_code ON locale_configs(language_code);
CREATE INDEX idx_currency_localizations_code ON currency_localizations(code);
CREATE INDEX idx_currency_localizations_active ON currency_localizations(active);
CREATE INDEX idx_translations_language_code ON translations(language_code);
CREATE INDEX idx_translations_category ON translations(category);
CREATE INDEX idx_translations_key ON translations(translation_key);
CREATE INDEX idx_datetime_formats_locale_code ON datetime_formats(locale_code);
CREATE INDEX idx_localized_templates_language_code ON localized_templates(language_code);
CREATE INDEX idx_localized_templates_template_type ON localized_templates(template_type);
CREATE INDEX idx_regional_compliance_country_code ON regional_compliance(country_code);

