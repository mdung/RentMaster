import React, { useState, useEffect } from 'react';
import { MainLayout } from '../components/MainLayout';
import { localizationApi } from '../services/api/localizationApi';
import './LocalizationPage.css';
import './shared-styles.css';

interface Language {
  id?: number;
  code: string;
  name: string;
  nativeName?: string;
  countryCode?: string;
  direction?: string;
  active?: boolean;
  isDefault?: boolean;
  completionPercentage?: number;
  flagIcon?: string;
  sortOrder?: number;
}

interface Translation {
  id?: number;
  languageCode: string;
  category: string;
  key: string; // Backend uses 'key' not 'translationKey'
  value: string;
  description?: string;
  isApproved?: boolean;
  needsReview?: boolean;
}

interface LocaleConfig {
  id?: number;
  code: string;
  name: string;
  languageCode: string;
  countryCode: string;
  currencyCode?: string;
  timeZone?: string;
  dateFormat?: string;
  timeFormat?: string;
  numberFormat?: string;
  decimalSeparator?: string;
  thousandsSeparator?: string;
}

interface CurrencyLocalization {
  id?: number;
  code: string;
  name: string;
  symbol: string;
  symbolPosition?: string;
  decimalPlaces?: number;
  decimalSeparator?: string;
  thousandsSeparator?: string;
  active?: boolean;
}

export const LocalizationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'languages' | 'translations' | 'locales' | 'currencies' | 'statistics'>('languages');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [localeConfigs, setLocaleConfigs] = useState<LocaleConfig[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyLocalization[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCategory, setSelectedCategory] = useState('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'language' | 'translation' | 'locale' | 'currency'>('language');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [statistics, setStatistics] = useState<any>({});

  useEffect(() => {
    loadLanguages();
    loadLocaleConfigs();
    loadCurrencies();
    loadStatistics();
  }, []);

  useEffect(() => {
    if (activeTab === 'translations') {
      loadTranslations();
    }
  }, [activeTab, selectedLanguage, selectedCategory]);

  const loadLanguages = async () => {
    try {
      const data = await localizationApi.getSupportedLanguages();
      setLanguages(data || []);
    } catch (error) {
      console.error('Failed to load languages:', error);
      setLanguages([]);
    }
  };

  const loadTranslations = async () => {
    try {
      setLoading(true);
      const data = await localizationApi.getTranslations(selectedLanguage, selectedCategory);
      setTranslations(data || []);
    } catch (error) {
      console.error('Failed to load translations:', error);
      setTranslations([]);
    } finally {
      setLoading(false);
    }
  };

  const loadLocaleConfigs = async () => {
    try {
      const data = await localizationApi.getLocaleConfigurations();
      setLocaleConfigs(data || []);
    } catch (error) {
      console.error('Failed to load locale configs:', error);
      setLocaleConfigs([]);
    }
  };

  const loadCurrencies = async () => {
    try {
      const data = await localizationApi.getCurrencyLocalizations();
      setCurrencies(data || []);
    } catch (error) {
      console.error('Failed to load currencies:', error);
      setCurrencies([]);
    }
  };

  const loadStatistics = async () => {
    try {
      const data = await localizationApi.getTranslationStatistics();
      setStatistics(data || {});
    } catch (error) {
      console.error('Failed to load statistics:', error);
      setStatistics({});
    }
  };

  const handleOpenModal = (type: 'language' | 'translation' | 'locale' | 'currency', item?: any) => {
    setModalType(type);
    setEditingItem(item || null);
    if (item) {
      setFormData(item);
    } else {
      // Set default form data based on type
      switch (type) {
        case 'language':
          setFormData({ active: true, isDefault: false, direction: 'LTR', completionPercentage: 0 });
          break;
        case 'translation':
          setFormData({ languageCode: selectedLanguage, category: selectedCategory, isApproved: false, needsReview: false });
          break;
        case 'locale':
          setFormData({ decimalSeparator: '.', thousandsSeparator: ',', firstDayOfWeek: 1 });
          break;
        case 'currency':
          setFormData({ symbolPosition: 'BEFORE', decimalPlaces: 2, decimalSeparator: '.', thousandsSeparator: ',', active: true });
          break;
      }
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      switch (modalType) {
        case 'language':
          if (editingItem?.id) {
            await localizationApi.updateLanguage(editingItem.id, formData);
      } else {
            await localizationApi.createLanguage(formData);
          }
          await loadLanguages();
          break;
        case 'translation':
          if (editingItem?.id) {
            await localizationApi.updateTranslation(editingItem.id, formData);
          } else {
            await localizationApi.createTranslation(formData);
          }
          await loadTranslations();
          break;
        case 'locale':
          if (editingItem?.id) {
            await localizationApi.updateLocaleConfiguration(editingItem.id, formData);
          } else {
            await localizationApi.createLocaleConfiguration(formData);
          }
          await loadLocaleConfigs();
          break;
        case 'currency':
          if (editingItem?.id) {
            await localizationApi.updateCurrencyLocalization(editingItem.id, formData);
          } else {
            await localizationApi.createCurrencyLocalization(formData);
          }
          await loadCurrencies();
          break;
      }
      handleCloseModal();
      await loadStatistics();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to save ${modalType}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (type: string, id: number) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    try {
      switch (type) {
        case 'language':
          await localizationApi.deleteLanguage(id);
          await loadLanguages();
          break;
        case 'translation':
        await localizationApi.deleteTranslation(id);
          await loadTranslations();
          break;
      }
      await loadStatistics();
    } catch (error: any) {
      alert(error.response?.data?.message || `Failed to delete ${type}`);
    }
  };

  const handleExportTranslations = async (format: string) => {
    try {
      setLoading(true);
      await localizationApi.exportTranslations(selectedLanguage, format);
    } catch (error) {
      alert('Failed to export translations');
    } finally {
      setLoading(false);
    }
  };

  const filteredTranslations = translations.filter(t =>
    t.key?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.value?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="localization-page">
        <div className="page-header">
          <div>
            <h1>Localization</h1>
            <p className="page-subtitle">Manage languages, translations, locales, and currencies</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="localization-tabs">
          <button
            className={`tab-button ${activeTab === 'languages' ? 'active' : ''}`}
            onClick={() => setActiveTab('languages')}
          >
            <span>🌐</span> Languages
          </button>
          <button
            className={`tab-button ${activeTab === 'translations' ? 'active' : ''}`}
            onClick={() => setActiveTab('translations')}
          >
            <span>📝</span> Translations
          </button>
          <button
            className={`tab-button ${activeTab === 'locales' ? 'active' : ''}`}
            onClick={() => setActiveTab('locales')}
          >
            <span>📍</span> Locales
          </button>
          <button
            className={`tab-button ${activeTab === 'currencies' ? 'active' : ''}`}
            onClick={() => setActiveTab('currencies')}
          >
            <span>💰</span> Currencies
          </button>
          <button
            className={`tab-button ${activeTab === 'statistics' ? 'active' : ''}`}
            onClick={() => setActiveTab('statistics')}
          >
            <span>📊</span> Statistics
          </button>
        </div>

        {/* Tab Content */}
        <div className="localization-content">
          {activeTab === 'languages' && (
            <LanguagesTab
              languages={languages}
              onAdd={() => handleOpenModal('language')}
              onEdit={(lang) => handleOpenModal('language', lang)}
              onDelete={(id) => handleDelete('language', id)}
            />
          )}

          {activeTab === 'translations' && (
            <TranslationsTab
              translations={filteredTranslations}
              languages={languages}
              selectedLanguage={selectedLanguage}
              selectedCategory={selectedCategory}
              searchTerm={searchTerm}
              onLanguageChange={setSelectedLanguage}
              onCategoryChange={setSelectedCategory}
              onSearchChange={setSearchTerm}
              onAdd={() => handleOpenModal('translation')}
              onEdit={(trans) => handleOpenModal('translation', trans)}
              onDelete={(id) => handleDelete('translation', id)}
              onExport={handleExportTranslations}
              loading={loading}
            />
          )}

          {activeTab === 'locales' && (
            <LocalesTab
              locales={localeConfigs}
              onAdd={() => handleOpenModal('locale')}
              onEdit={(locale) => handleOpenModal('locale', locale)}
            />
          )}

          {activeTab === 'currencies' && (
            <CurrenciesTab
              currencies={currencies}
              onAdd={() => handleOpenModal('currency')}
              onEdit={(currency) => handleOpenModal('currency', currency)}
            />
          )}

          {activeTab === 'statistics' && (
            <StatisticsTab statistics={statistics} onRefresh={loadStatistics} />
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h2>
                <button className="modal-close" onClick={handleCloseModal}>✕</button>
              </div>
              <form onSubmit={handleSubmit}>
                {modalType === 'language' && (
                  <>
                    <div className="form-group">
                      <label>Code *</label>
                      <input
                        type="text"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="e.g., en, vi, fr"
                        required
                        disabled={!!editingItem}
                      />
                    </div>
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., English"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Native Name</label>
                      <input
                        type="text"
                        value={formData.nativeName || ''}
                        onChange={(e) => setFormData({ ...formData, nativeName: e.target.value })}
                        placeholder="e.g., English"
                      />
                    </div>
                    <div className="form-group">
                      <label>Country Code</label>
                      <input
                        type="text"
                        value={formData.countryCode || ''}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        placeholder="e.g., US, VN"
                      />
                    </div>
                    <div className="form-group">
                      <label>Direction</label>
                      <select
                        value={formData.direction || 'LTR'}
                        onChange={(e) => setFormData({ ...formData, direction: e.target.value })}
                      >
                        <option value="LTR">Left to Right</option>
                        <option value="RTL">Right to Left</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.active !== false}
                          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        />
                        Active
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.isDefault || false}
                          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                        />
                        Default Language
                      </label>
                    </div>
                  </>
                )}

                {modalType === 'translation' && (
                  <>
                    <div className="form-group">
                      <label>Language *</label>
                      <select
                        value={formData.languageCode || selectedLanguage}
                        onChange={(e) => setFormData({ ...formData, languageCode: e.target.value })}
                        required
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select
                        value={formData.category || selectedCategory}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        <option value="common">Common</option>
                        <option value="navigation">Navigation</option>
                        <option value="dashboard">Dashboard</option>
                        <option value="properties">Properties</option>
                        <option value="tenants">Tenants</option>
                        <option value="contracts">Contracts</option>
                        <option value="invoices">Invoices</option>
                        <option value="messages">Messages</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Translation Key *</label>
                      <input
                        type="text"
                        value={formData.key || formData.translationKey || ''}
                        onChange={(e) => setFormData({ ...formData, key: e.target.value, translationKey: e.target.value })}
                        placeholder="e.g., welcome.message"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Value *</label>
                      <textarea
                        value={formData.value || ''}
                        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                        placeholder="Translation text"
                        rows={3}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Optional description"
                        rows={2}
                      />
                    </div>
                  </>
                )}

                {modalType === 'locale' && (
                  <>
                    <div className="form-group">
                      <label>Locale Code *</label>
                      <input
                        type="text"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="e.g., en-US"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., English (United States)"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Language Code *</label>
                      <input
                        type="text"
                        value={formData.languageCode || ''}
                        onChange={(e) => setFormData({ ...formData, languageCode: e.target.value })}
                        placeholder="e.g., en"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Country Code *</label>
                      <input
                        type="text"
                        value={formData.countryCode || ''}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        placeholder="e.g., US"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Currency Code</label>
                      <input
                        type="text"
                        value={formData.currencyCode || ''}
                        onChange={(e) => setFormData({ ...formData, currencyCode: e.target.value })}
                        placeholder="e.g., USD"
                      />
                    </div>
                    <div className="form-group">
                      <label>Time Zone</label>
                      <input
                        type="text"
                        value={formData.timeZone || ''}
                        onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                        placeholder="e.g., America/New_York"
                      />
                    </div>
                    <div className="form-group">
                      <label>Date Format</label>
                      <input
                        type="text"
                        value={formData.dateFormat || ''}
                        onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                        placeholder="e.g., MM/DD/YYYY"
                      />
                    </div>
                    <div className="form-group">
                      <label>Time Format</label>
                      <input
                        type="text"
                        value={formData.timeFormat || ''}
                        onChange={(e) => setFormData({ ...formData, timeFormat: e.target.value })}
                        placeholder="e.g., 12h or 24h"
                      />
                    </div>
                  </>
                )}

                {modalType === 'currency' && (
                  <>
                    <div className="form-group">
                      <label>Currency Code *</label>
                      <input
                        type="text"
                        value={formData.code || ''}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        placeholder="e.g., USD, VND"
                        required
                        maxLength={3}
                      />
                    </div>
                    <div className="form-group">
                      <label>Name *</label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., US Dollar"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Symbol *</label>
                      <input
                        type="text"
                        value={formData.symbol || ''}
                        onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                        placeholder="e.g., $, ₫"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Symbol Position</label>
                      <select
                        value={formData.symbolPosition || 'BEFORE'}
                        onChange={(e) => setFormData({ ...formData, symbolPosition: e.target.value })}
                      >
                        <option value="BEFORE">Before amount</option>
                        <option value="AFTER">After amount</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Decimal Places</label>
                      <input
                        type="number"
                        value={formData.decimalPlaces || 2}
                        onChange={(e) => setFormData({ ...formData, decimalPlaces: parseInt(e.target.value) })}
                        min="0"
                        max="4"
                      />
                    </div>
                    <div className="form-group">
                      <label>Decimal Separator</label>
                      <input
                        type="text"
                        value={formData.decimalSeparator || '.'}
                        onChange={(e) => setFormData({ ...formData, decimalSeparator: e.target.value })}
                        maxLength={1}
                      />
                    </div>
                    <div className="form-group">
                      <label>Thousands Separator</label>
                      <input
                        type="text"
                        value={formData.thousandsSeparator || ','}
                        onChange={(e) => setFormData({ ...formData, thousandsSeparator: e.target.value })}
                        maxLength={1}
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={formData.active !== false}
                          onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        />
                        Active
                      </label>
                    </div>
                  </>
                )}

                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

// Languages Tab Component
const LanguagesTab: React.FC<{
  languages: Language[];
  onAdd: () => void;
  onEdit: (lang: Language) => void;
  onDelete: (id: number) => void;
}> = ({ languages, onAdd, onEdit, onDelete }) => {
  return (
    <div className="languages-section">
      <div className="section-header">
        <h3>🌐 Supported Languages</h3>
        <button className="btn btn-primary" onClick={onAdd}>
          <span>➕</span> Add Language
          </button>
      </div>

      {languages.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <span className="empty-icon">🌐</span>
            <p>No languages found</p>
          </div>
        </div>
      ) : (
      <div className="languages-grid">
        {languages.map((language) => (
            <div key={language.id || language.code} className="language-card">
            <div className="language-header">
                <div className="language-flag">{language.flagIcon || '🌐'}</div>
              <div className="language-info">
                <h4>{language.name}</h4>
                  <p>{language.nativeName || language.name}</p>
                <span className="language-code">{language.code}</span>
              </div>
              <div className="language-status">
                {language.isDefault && <span className="default-badge">Default</span>}
                  {language.active !== false ? (
                    <span className="status-badge active">Active</span>
                ) : (
                    <span className="status-badge inactive">Inactive</span>
                )}
              </div>
            </div>

              {language.completionPercentage !== undefined && (
            <div className="completion-progress">
              <div className="progress-label">
                <span>Completion</span>
                <span>{language.completionPercentage.toFixed(1)}%</span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${language.completionPercentage}%` }}
                />
              </div>
            </div>
              )}

            <div className="language-actions">
                <button onClick={() => onEdit(language)} className="btn-icon" title="Edit">
                  ✏️
              </button>
                {language.id && (
              <button
                    onClick={() => onDelete(language.id!)}
                    className="btn-icon danger"
                    title="Delete"
              >
                    🗑️
              </button>
                )}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

// Translations Tab Component
const TranslationsTab: React.FC<{
  translations: Translation[];
  languages: Language[];
  selectedLanguage: string;
  selectedCategory: string;
  searchTerm: string;
  onLanguageChange: (lang: string) => void;
  onCategoryChange: (cat: string) => void;
  onSearchChange: (term: string) => void;
  onAdd: () => void;
  onEdit: (trans: Translation) => void;
  onDelete: (id: number) => void;
  onExport: (format: string) => void;
  loading: boolean;
}> = ({
  translations,
  languages,
  selectedLanguage,
  selectedCategory,
  searchTerm,
  onLanguageChange,
  onCategoryChange,
  onSearchChange,
  onAdd,
  onEdit,
  onDelete,
  onExport,
  loading
}) => {
  return (
    <div className="translations-section">
      <div className="section-header">
        <h3>📝 Translations Management</h3>
        <div className="header-actions">
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="language-selector"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name} ({lang.code})
              </option>
            ))}
          </select>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="category-selector"
          >
            <option value="common">Common</option>
            <option value="navigation">Navigation</option>
            <option value="dashboard">Dashboard</option>
            <option value="properties">Properties</option>
            <option value="tenants">Tenants</option>
            <option value="contracts">Contracts</option>
            <option value="invoices">Invoices</option>
            <option value="messages">Messages</option>
          </select>
        </div>
      </div>

      <div className="translations-controls">
        <div className="search-controls">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search translations..."
            value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          </div>
          <button onClick={onAdd} className="btn btn-primary">
            <span>➕</span> Add Translation
          </button>
        </div>

        <div className="import-export-controls">
          <button
            onClick={() => onExport('JSON')}
            className="btn btn-secondary"
            disabled={loading}
          >
            <span>📥</span> Export JSON
          </button>
          <button
            onClick={() => onExport('CSV')}
            className="btn btn-secondary"
            disabled={loading}
          >
            <span>📥</span> Export CSV
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {translations.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  <div className="empty-state-content">
                    <span className="empty-icon">📝</span>
                    <p>No translations found</p>
                  </div>
                </td>
              </tr>
            ) : (
              translations.map((translation) => (
                <tr key={translation.id || translation.key}>
                <td className="key-cell">{translation.key}</td>
                <td className="value-cell">{translation.value}</td>
                  <td>{translation.category}</td>
                  <td>
                  <div className="status-badges">
                    {translation.isApproved ? (
                      <span className="status-badge approved">Approved</span>
                    ) : (
                      <span className="status-badge pending">Pending</span>
                    )}
                    {translation.needsReview && (
                        <span className="status-badge review">Review</span>
                    )}
                  </div>
                </td>
                  <td>
                    <div className="action-buttons">
                  <button
                        onClick={() => onEdit(translation)}
                        className="btn-icon"
                        title="Edit"
                  >
                        ✏️
                  </button>
                      {translation.id && (
                  <button
                          onClick={() => onDelete(translation.id!)}
                          className="btn-icon danger"
                          title="Delete"
                  >
                          🗑️
                  </button>
                      )}
                    </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Locales Tab Component
const LocalesTab: React.FC<{
  locales: LocaleConfig[];
  onAdd: () => void;
  onEdit: (locale: LocaleConfig) => void;
}> = ({ locales, onAdd, onEdit }) => {
  return (
    <div className="locales-section">
      <div className="section-header">
        <h3>📍 Locale Configurations</h3>
        <button className="btn btn-primary" onClick={onAdd}>
          <span>➕</span> Add Locale
        </button>
      </div>

      {locales.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <span className="empty-icon">📍</span>
            <p>No locales found</p>
          </div>
        </div>
      ) : (
      <div className="locales-grid">
          {locales.map((locale) => (
            <div key={locale.id || locale.code} className="locale-card">
            <div className="locale-header">
              <h4>{locale.name}</h4>
              <span className="locale-code">{locale.code}</span>
            </div>

            <div className="locale-details">
              <div className="detail-row">
                <span className="label">Language:</span>
                <span className="value">{locale.languageCode}</span>
              </div>
              <div className="detail-row">
                <span className="label">Country:</span>
                <span className="value">{locale.countryCode}</span>
              </div>
                {locale.currencyCode && (
              <div className="detail-row">
                <span className="label">Currency:</span>
                <span className="value">{locale.currencyCode}</span>
              </div>
                )}
                {locale.dateFormat && (
              <div className="detail-row">
                <span className="label">Date Format:</span>
                <span className="value">{locale.dateFormat}</span>
              </div>
                )}
                {locale.timeFormat && (
              <div className="detail-row">
                <span className="label">Time Format:</span>
                <span className="value">{locale.timeFormat}</span>
              </div>
                )}
                {locale.timeZone && (
              <div className="detail-row">
                <span className="label">Time Zone:</span>
                <span className="value">{locale.timeZone}</span>
              </div>
                )}
            </div>

            <div className="locale-actions">
                <button onClick={() => onEdit(locale)} className="btn-icon" title="Edit">
                  ✏️
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

// Currencies Tab Component
const CurrenciesTab: React.FC<{
  currencies: CurrencyLocalization[];
  onAdd: () => void;
  onEdit: (currency: CurrencyLocalization) => void;
}> = ({ currencies, onAdd, onEdit }) => {
  const formatPreview = (currency: CurrencyLocalization) => {
    const amount = 1234.56;
    const formatted = amount.toFixed(currency.decimalPlaces || 2)
      .replace('.', currency.decimalSeparator || '.')
      .replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousandsSeparator || ',');
    
    if (currency.symbolPosition === 'AFTER') {
      return `${formatted}${currency.symbol}`;
    }
    return `${currency.symbol}${formatted}`;
  };

  return (
    <div className="currencies-section">
      <div className="section-header">
        <h3>💰 Currency Localization</h3>
        <button className="btn btn-primary" onClick={onAdd}>
          <span>➕</span> Add Currency
        </button>
      </div>

      {currencies.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <span className="empty-icon">💰</span>
            <p>No currencies found</p>
          </div>
        </div>
      ) : (
      <div className="currencies-grid">
        {currencies.map((currency) => (
            <div key={currency.id || currency.code} className="currency-card">
            <div className="currency-header">
              <div className="currency-symbol">{currency.symbol}</div>
              <div className="currency-info">
                <h4>{currency.name}</h4>
                <span className="currency-code">{currency.code}</span>
              </div>
                {currency.active !== false && (
                  <span className="status-badge active">Active</span>
                )}
            </div>

            <div className="currency-details">
              <div className="detail-row">
                <span className="label">Symbol Position:</span>
                  <span className="value">{currency.symbolPosition || 'BEFORE'}</span>
              </div>
              <div className="detail-row">
                <span className="label">Decimal Places:</span>
                  <span className="value">{currency.decimalPlaces || 2}</span>
              </div>
              <div className="detail-row">
                <span className="label">Decimal Separator:</span>
                  <span className="value">"{currency.decimalSeparator || '.'}"</span>
              </div>
              <div className="detail-row">
                <span className="label">Thousands Separator:</span>
                  <span className="value">"{currency.thousandsSeparator || ','}"</span>
              </div>
            </div>

            <div className="currency-preview">
              <h5>Preview:</h5>
                <div className="preview-amount">{formatPreview(currency)}</div>
            </div>

            <div className="currency-actions">
                <button onClick={() => onEdit(currency)} className="btn-icon" title="Edit">
                  ✏️
              </button>
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};

// Statistics Tab Component
const StatisticsTab: React.FC<{
  statistics: any;
  onRefresh: () => void;
}> = ({ statistics, onRefresh }) => {
  return (
    <div className="statistics-section">
      <div className="section-header">
        <h3>📊 Localization Statistics</h3>
        <button className="btn btn-secondary" onClick={onRefresh}>
          <span>🔄</span> Refresh
          </button>
      </div>

      <div className="statistics-grid">
        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">🌐</span>
            <h4>Languages</h4>
          </div>
          <div className="stat-value">{statistics.totalLanguages || 0}</div>
          <div className="stat-description">Supported languages</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">📝</span>
            <h4>Translations</h4>
          </div>
          <div className="stat-value">{statistics.totalTranslations || 0}</div>
          <div className="stat-description">Total translations</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">✅</span>
            <h4>Completion</h4>
          </div>
          <div className="stat-value">
            {statistics.completionRates?.en ? `${statistics.completionRates.en.toFixed(1)}%` : '0%'}
          </div>
          <div className="stat-description">English completion</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span className="stat-icon">🇻🇳</span>
            <h4>Vietnamese</h4>
          </div>
          <div className="stat-value">
            {statistics.completionRates?.vi ? `${statistics.completionRates.vi.toFixed(1)}%` : '0%'}
          </div>
          <div className="stat-description">Vietnamese completion</div>
        </div>
      </div>

      {statistics.completionRates && Object.keys(statistics.completionRates).length > 0 && (
      <div className="completion-chart">
        <h4>Translation Completion by Language</h4>
        <div className="chart-container">
            {Object.entries(statistics.completionRates).map(([lang, rate]: [string, any]) => (
            <div key={lang} className="completion-bar">
              <div className="bar-label">
                <span>{lang.toUpperCase()}</span>
                  <span>{rate.toFixed(1)}%</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${rate}%` }}
                />
              </div>
            </div>
          ))}
          </div>
        </div>
      )}
    </div>
  );
};
