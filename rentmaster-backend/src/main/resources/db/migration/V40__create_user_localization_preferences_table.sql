-- User Localization Preferences Table
CREATE TABLE user_localization_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    language_code VARCHAR(10),
    locale_code VARCHAR(10),
    currency_code VARCHAR(10),
    date_format VARCHAR(50),
    time_format VARCHAR(50),
    timezone VARCHAR(50),
    number_format VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_localization_preferences_user_id ON user_localization_preferences(user_id);
CREATE INDEX idx_user_localization_preferences_language_code ON user_localization_preferences(language_code);
CREATE INDEX idx_user_localization_preferences_locale_code ON user_localization_preferences(locale_code);
CREATE INDEX idx_user_localization_preferences_currency_code ON user_localization_preferences(currency_code);

