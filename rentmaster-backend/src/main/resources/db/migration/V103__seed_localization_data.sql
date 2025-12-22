-- Seed Localization Data
-- This migration seeds initial data for languages, locales, currencies, and translations

-- Insert Languages
INSERT INTO languages (code, name, native_name, country_code, direction, active, is_default, sort_order, flag_icon, completion_percentage, created_at, updated_at)
VALUES
    ('en', 'English', 'English', 'US', 'LTR', true, true, 1, '🇺🇸', 100.0, NOW(), NOW()),
    ('vi', 'Vietnamese', 'Tiếng Việt', 'VN', 'LTR', true, false, 2, '🇻🇳', 85.0, NOW(), NOW()),
    ('fr', 'French', 'Français', 'FR', 'LTR', true, false, 3, '🇫🇷', 60.0, NOW(), NOW()),
    ('es', 'Spanish', 'Español', 'ES', 'LTR', true, false, 4, '🇪🇸', 50.0, NOW(), NOW()),
    ('de', 'German', 'Deutsch', 'DE', 'LTR', true, false, 5, '🇩🇪', 40.0, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Insert Locale Configurations
INSERT INTO locale_configs (code, name, language_code, country_code, currency_code, time_zone, date_format, time_format, number_format, decimal_separator, thousands_separator, first_day_of_week, active, is_default, created_at, updated_at)
VALUES
    ('en-US', 'English (United States)', 'en', 'US', 'USD', 'America/New_York', 'MM/dd/yyyy', 'h:mm a', '#,##0.00', '.', ',', 1, true, true, NOW(), NOW()),
    ('vi-VN', 'Vietnamese (Vietnam)', 'vi', 'VN', 'VND', 'Asia/Ho_Chi_Minh', 'dd/MM/yyyy', 'HH:mm', '#.##0,00', ',', '.', 1, true, false, NOW(), NOW()),
    ('en-GB', 'English (United Kingdom)', 'en', 'GB', 'GBP', 'Europe/London', 'dd/MM/yyyy', 'HH:mm', '#,##0.00', '.', ',', 1, true, false, NOW(), NOW()),
    ('fr-FR', 'French (France)', 'fr', 'FR', 'EUR', 'Europe/Paris', 'dd/MM/yyyy', 'HH:mm', '#,##0.00', ',', ' ', 1, true, false, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Insert Currency Localizations
INSERT INTO currency_localizations (code, name, symbol, symbol_position, decimal_places, decimal_separator, thousands_separator, space_between_symbol, active, is_base_currency, exchange_rate, created_at, updated_at)
VALUES
    ('USD', 'US Dollar', '$', 'BEFORE', 2, '.', ',', false, true, true, 1.0, NOW(), NOW()),
    ('VND', 'Vietnamese Dong', '₫', 'AFTER', 0, ',', '.', true, true, false, 0.00004, NOW(), NOW()),
    ('EUR', 'Euro', '€', 'AFTER', 2, ',', '.', true, true, false, 1.08, NOW(), NOW()),
    ('GBP', 'British Pound', '£', 'BEFORE', 2, '.', ',', false, true, false, 1.27, NOW(), NOW()),
    ('JPY', 'Japanese Yen', '¥', 'BEFORE', 0, '.', ',', false, true, false, 0.0067, NOW(), NOW()),
    ('CNY', 'Chinese Yuan', '¥', 'BEFORE', 2, '.', ',', false, true, false, 0.14, NOW(), NOW())
ON CONFLICT (code) DO NOTHING;

-- Insert Common Translations for English
INSERT INTO translations (language_code, category, translation_key, value, description, is_approved, needs_review, created_at, updated_at)
VALUES
    ('en', 'common', 'save', 'Save', 'Save button text', true, false, NOW(), NOW()),
    ('en', 'common', 'cancel', 'Cancel', 'Cancel button text', true, false, NOW(), NOW()),
    ('en', 'common', 'delete', 'Delete', 'Delete button text', true, false, NOW(), NOW()),
    ('en', 'common', 'edit', 'Edit', 'Edit button text', true, false, NOW(), NOW()),
    ('en', 'common', 'add', 'Add', 'Add button text', true, false, NOW(), NOW()),
    ('en', 'common', 'search', 'Search', 'Search placeholder', true, false, NOW(), NOW()),
    ('en', 'common', 'loading', 'Loading...', 'Loading message', true, false, NOW(), NOW()),
    ('en', 'common', 'no_data', 'No data found', 'Empty state message', true, false, NOW(), NOW()),
    ('en', 'dashboard', 'title', 'Dashboard', 'Dashboard page title', true, false, NOW(), NOW()),
    ('en', 'dashboard', 'welcome', 'Welcome back!', 'Welcome message', true, false, NOW(), NOW()),
    ('en', 'properties', 'title', 'Properties', 'Properties page title', true, false, NOW(), NOW()),
    ('en', 'properties', 'add_property', 'Add Property', 'Add property button', true, false, NOW(), NOW()),
    ('en', 'tenants', 'title', 'Tenants', 'Tenants page title', true, false, NOW(), NOW()),
    ('en', 'tenants', 'add_tenant', 'Add Tenant', 'Add tenant button', true, false, NOW(), NOW()),
    ('en', 'contracts', 'title', 'Contracts', 'Contracts page title', true, false, NOW(), NOW()),
    ('en', 'contracts', 'add_contract', 'Add Contract', 'Add contract button', true, false, NOW(), NOW()),
    ('en', 'invoices', 'title', 'Invoices', 'Invoices page title', true, false, NOW(), NOW()),
    ('en', 'invoices', 'generate', 'Generate Invoice', 'Generate invoice button', true, false, NOW(), NOW())
ON CONFLICT (language_code, category, translation_key) DO NOTHING;

-- Insert Common Translations for Vietnamese
INSERT INTO translations (language_code, category, translation_key, value, description, is_approved, needs_review, created_at, updated_at)
VALUES
    ('vi', 'common', 'save', 'Lưu', 'Nút lưu', true, false, NOW(), NOW()),
    ('vi', 'common', 'cancel', 'Hủy', 'Nút hủy', true, false, NOW(), NOW()),
    ('vi', 'common', 'delete', 'Xóa', 'Nút xóa', true, false, NOW(), NOW()),
    ('vi', 'common', 'edit', 'Sửa', 'Nút sửa', true, false, NOW(), NOW()),
    ('vi', 'common', 'add', 'Thêm', 'Nút thêm', true, false, NOW(), NOW()),
    ('vi', 'common', 'search', 'Tìm kiếm', 'Placeholder tìm kiếm', true, false, NOW(), NOW()),
    ('vi', 'common', 'loading', 'Đang tải...', 'Thông báo đang tải', true, false, NOW(), NOW()),
    ('vi', 'common', 'no_data', 'Không có dữ liệu', 'Thông báo không có dữ liệu', true, false, NOW(), NOW()),
    ('vi', 'dashboard', 'title', 'Bảng điều khiển', 'Tiêu đề trang bảng điều khiển', true, false, NOW(), NOW()),
    ('vi', 'dashboard', 'welcome', 'Chào mừng trở lại!', 'Thông điệp chào mừng', true, false, NOW(), NOW()),
    ('vi', 'properties', 'title', 'Bất động sản', 'Tiêu đề trang bất động sản', true, false, NOW(), NOW()),
    ('vi', 'properties', 'add_property', 'Thêm Bất động sản', 'Nút thêm bất động sản', true, false, NOW(), NOW()),
    ('vi', 'tenants', 'title', 'Người thuê', 'Tiêu đề trang người thuê', true, false, NOW(), NOW()),
    ('vi', 'tenants', 'add_tenant', 'Thêm Người thuê', 'Nút thêm người thuê', true, false, NOW(), NOW()),
    ('vi', 'contracts', 'title', 'Hợp đồng', 'Tiêu đề trang hợp đồng', true, false, NOW(), NOW()),
    ('vi', 'contracts', 'add_contract', 'Thêm Hợp đồng', 'Nút thêm hợp đồng', true, false, NOW(), NOW()),
    ('vi', 'invoices', 'title', 'Hóa đơn', 'Tiêu đề trang hóa đơn', true, false, NOW(), NOW()),
    ('vi', 'invoices', 'generate', 'Tạo Hóa đơn', 'Nút tạo hóa đơn', true, false, NOW(), NOW())
ON CONFLICT (language_code, category, translation_key) DO NOTHING;

