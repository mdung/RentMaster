import React, { useState, useEffect } from 'react';
import {
  Globe,
  Languages,
  DollarSign,
  Calendar,
  MapPin,
  Settings,
  Download,
  Upload,
  Check,
  X,
  Edit,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  Flag,
  Clock
} from 'lucide-react';
import './LocalizationPage.css';
import { localizationApi } from '../services/api/localizationApi';

interface Language {
  id: number;
  code: string;
  name: string;
  nativeName: string;
  countryCode: string;
  direction: string;
  active: boolean;
  isDefault: boolean;
  completionPercentage: number;
  flagIcon: string;
}

interface Translation {
  id: number;
  languageCode: string;
  category: string;
  key: string;
  value: string;
  description: string;
  isApproved: boolean;
  needsReview: boolean;
}

interface LocaleConfig {
  id: number;
  code: string;
  name: string;
  languageCode: string;
  countryCode: string;
  currencyCode: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
}

interface CurrencyLocalization {
  id: number;
  code: string;
  name: string;
  symbol: string;
  symbolPosition: string;
  decimalPlaces: number;
  decimalSeparator: string;
  thousandsSeparator: string;
}

export const LocalizationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('languages');
  const [languages, setLanguages] = useState<Language[]>([]);
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [localeConfigs, setLocaleConfigs] = useState<LocaleConfig[]>([]);
  const [currencies, setCurrencies] = useState<CurrencyLocalization[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCategory, setSelectedCategory] = useState('common');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>({});

  // Load initial data
  useEffect(() => {
    loadLanguages();
    loadLocaleConfigs();
    loadCurrencies();
    loadStatistics();
  }, []);

  // Load translations when language or category changes
  useEffect(() => {
    if (activeTab === 'translations') {
      loadTranslations();
    }
  }, [activeTab, selectedLanguage, selectedCategory]);

  const loadLanguages = async () => {
    try {
      const data = await localizationApi.getSupportedLanguages();
      setLanguages(data);
    } catch (error) {
      console.error('Failed to load languages:', error);
    }
  };

  const loadTranslations = async () => {
    try {
      setLoading(true);
      const data = await localizationApi.getTranslations(selectedLanguage, selectedCategory);
      setTranslations(data);
    } catch (error) {
      console.error('Failed to load translations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocaleConfigs = async () => {
    try {
      const data = await localizationApi.getLocaleConfigurations();
      setLocaleConfigs(data);
    } catch (error) {
      console.error('Failed to load locale configs:', error);
    }
  };

  const loadCurrencies = async () => {
    try {
      const data = await localizationApi.getCurrencyLocalizations();
      setCurrencies(data);
    } catch (error) {
      console.error('Failed to load currencies:', error);
    }
  };

  const loadStatistics = async () => {
    try {
      const data = await localizationApi.getTranslationStatistics();
      setStatistics(data);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleExportTranslations = async (format: string) => {
    try {
      setLoading(true);
      await localizationApi.exportTranslations(selectedLanguage, format);
    } catch (error) {
      console.error('Failed to export translations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImportTranslations = async (file: File) => {
    try {
      setLoading(true);
      // In a real implementation, you would read the file and send its content
      const importData = {
        languageCode: selectedLanguage,
        format: 'JSON',
        data: {} // File content would go here
      };
      await localizationApi.importTranslations(importData);
      loadTranslations();
    } catch (error) {
      console.error('Failed to import translations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTranslation = async (translation: Translation) => {
    try {
      if (translation.id) {
        await localizationApi.updateTranslation(translation.id, translation);
      } else {
        await localizationApi.createTranslation(translation);
      }
      loadTranslations();
      setEditingItem(null);
    } catch (error) {
      console.error('Failed to save translation:', error);
    }
  };

  const handleDeleteTranslation = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this translation?')) {
      try {
        await localizationApi.deleteTranslation(id);
        loadTranslations();
      } catch (error) {
        console.error('Failed to delete translation:', error);
      }
    }
  };

  const handleTestLocalization = async () => {
    try {
      setLoading(true);
      const result = await localizationApi.testLocalization({
        languageCode: selectedLanguage,
        localeCode: `${selectedLanguage}-${selectedLanguage === 'en' ? 'US' : 'VN'}`
      });
      alert(`Localization test completed. Results: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error('Failed to test localization:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTranslations = translations.filter(t =>
    t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderLanguagesTab = () => (
    <div className="languages-section">
      <div className="section-header">
        <h3><Languages className="section-icon" />Supported Languages</h3>
        <div className="header-actions">
          <button onClick={() => setShowAddModal(true)} className="add-button">
            <Plus /> Add Language
          </button>
        </div>
      </div>

      <div className="languages-grid">
        {languages.map((language) => (
          <div key={language.id} className="language-card">
            <div className="language-header">
              <div className="language-flag">
                <Flag className="flag-icon" />
              </div>
              <div className="language-info">
                <h4>{language.name}</h4>
                <p>{language.nativeName}</p>
                <span className="language-code">{language.code}</span>
              </div>
              <div className="language-status">
                {language.isDefault && <span className="default-badge">Default</span>}
                {language.active ? (
                  <Check className="status-icon active" />
                ) : (
                  <X className="status-icon inactive" />
                )}
              </div>
            </div>

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

            <div className="language-actions">
              <button onClick={() => setEditingItem(language)} className="action-button">
                <Edit /> Edit
              </button>
              <button
                onClick={() => setSelectedLanguage(language.code)}
                className="action-button"
              >
                <Eye /> View Translations
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTranslationsTab = () => (
    <div className="translations-section">
      <div className="section-header">
        <h3><Globe className="section-icon" />Translations Management</h3>
        <div className="header-actions">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
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
            onChange={(e) => setSelectedCategory(e.target.value)}
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
          <input
            type="text"
            placeholder="Search translations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={() => setShowAddModal(true)} className="add-button">
            <Plus /> Add Translation
          </button>
        </div>

        <div className="import-export-controls">
          <button
            onClick={() => handleExportTranslations('JSON')}
            className="export-button"
            disabled={loading}
          >
            <Download /> Export JSON
          </button>
          <button
            onClick={() => handleExportTranslations('CSV')}
            className="export-button"
            disabled={loading}
          >
            <Download /> Export CSV
          </button>
          <label className="import-button">
            <Upload /> Import
            <input
              type="file"
              accept=".json,.csv"
              onChange={(e) => e.target.files?.[0] && handleImportTranslations(e.target.files[0])}
              style={{ display: 'none' }}
            />
          </label>
        </div>
      </div>

      <div className="translations-table">
        <table>
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTranslations.map((translation) => (
              <tr key={translation.id}>
                <td className="key-cell">{translation.key}</td>
                <td className="value-cell">{translation.value}</td>
                <td className="description-cell">{translation.description}</td>
                <td className="status-cell">
                  <div className="status-badges">
                    {translation.isApproved ? (
                      <span className="status-badge approved">Approved</span>
                    ) : (
                      <span className="status-badge pending">Pending</span>
                    )}
                    {translation.needsReview && (
                      <span className="status-badge review">Needs Review</span>
                    )}
                  </div>
                </td>
                <td className="actions-cell">
                  <button
                    onClick={() => setEditingItem(translation)}
                    className="action-button"
                  >
                    <Edit />
                  </button>
                  <button
                    onClick={() => handleDeleteTranslation(translation.id)}
                    className="action-button delete"
                  >
                    <Trash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderLocalesTab = () => (
    <div className="locales-section">
      <div className="section-header">
        <h3><MapPin className="section-icon" />Locale Configurations</h3>
        <button onClick={() => setShowAddModal(true)} className="add-button">
          <Plus /> Add Locale
        </button>
      </div>

      <div className="locales-grid">
        {localeConfigs.map((locale) => (
          <div key={locale.id} className="locale-card">
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
              <div className="detail-row">
                <span className="label">Currency:</span>
                <span className="value">{locale.currencyCode}</span>
              </div>
              <div className="detail-row">
                <span className="label">Date Format:</span>
                <span className="value">{locale.dateFormat}</span>
              </div>
              <div className="detail-row">
                <span className="label">Time Format:</span>
                <span className="value">{locale.timeFormat}</span>
              </div>
              <div className="detail-row">
                <span className="label">Time Zone:</span>
                <span className="value">{locale.timeZone}</span>
              </div>
            </div>

            <div className="locale-actions">
              <button onClick={() => setEditingItem(locale)} className="action-button">
                <Edit /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCurrenciesTab = () => (
    <div className="currencies-section">
      <div className="section-header">
        <h3><DollarSign className="section-icon" />Currency Localization</h3>
        <button onClick={() => setShowAddModal(true)} className="add-button">
          <Plus /> Add Currency
        </button>
      </div>

      <div className="currencies-grid">
        {currencies.map((currency) => (
          <div key={currency.id} className="currency-card">
            <div className="currency-header">
              <div className="currency-symbol">{currency.symbol}</div>
              <div className="currency-info">
                <h4>{currency.name}</h4>
                <span className="currency-code">{currency.code}</span>
              </div>
            </div>

            <div className="currency-details">
              <div className="detail-row">
                <span className="label">Symbol Position:</span>
                <span className="value">{currency.symbolPosition}</span>
              </div>
              <div className="detail-row">
                <span className="label">Decimal Places:</span>
                <span className="value">{currency.decimalPlaces}</span>
              </div>
              <div className="detail-row">
                <span className="label">Decimal Separator:</span>
                <span className="value">"{currency.decimalSeparator}"</span>
              </div>
              <div className="detail-row">
                <span className="label">Thousands Separator:</span>
                <span className="value">"{currency.thousandsSeparator}"</span>
              </div>
            </div>

            <div className="currency-preview">
              <h5>Preview:</h5>
              <div className="preview-amounts">
                <div>1,234.56 → {currency.symbolPosition === 'BEFORE' ? currency.symbol : ''}1{currency.thousandsSeparator}234{currency.decimalSeparator}56{currency.symbolPosition === 'AFTER' ? currency.symbol : ''}</div>
              </div>
            </div>

            <div className="currency-actions">
              <button onClick={() => setEditingItem(currency)} className="action-button">
                <Edit /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStatisticsTab = () => (
    <div className="statistics-section">
      <div className="section-header">
        <h3><Settings className="section-icon" />Localization Statistics</h3>
        <div className="header-actions">
          <button onClick={loadStatistics} className="refresh-button">
            <RefreshCw /> Refresh
          </button>
          <button onClick={handleTestLocalization} className="test-button" disabled={loading}>
            <Check /> Test Localization
          </button>
        </div>
      </div>

      <div className="statistics-grid">
        <div className="stat-card">
          <div className="stat-header">
            <Languages className="stat-icon" />
            <h4>Languages</h4>
          </div>
          <div className="stat-value">{statistics.totalLanguages || 0}</div>
          <div className="stat-description">Supported languages</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <Globe className="stat-icon" />
            <h4>Translations</h4>
          </div>
          <div className="stat-value">{statistics.totalTranslations || 0}</div>
          <div className="stat-description">Total translations</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <Check className="stat-icon" />
            <h4>Completion</h4>
          </div>
          <div className="stat-value">
            {statistics.completionRates?.en ? `${statistics.completionRates.en.toFixed(1)}%` : '0%'}
          </div>
          <div className="stat-description">English completion</div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <Flag className="stat-icon" />
            <h4>Vietnamese</h4>
          </div>
          <div className="stat-value">
            {statistics.completionRates?.vi ? `${statistics.completionRates.vi.toFixed(1)}%` : '0%'}
          </div>
          <div className="stat-description">Vietnamese completion</div>
        </div>
      </div>

      <div className="completion-chart">
        <h4>Translation Completion by Language</h4>
        <div className="chart-container">
          {Object.entries(statistics.completionRates || {}).map(([lang, rate]) => (
            <div key={lang} className="completion-bar">
              <div className="bar-label">
                <span>{lang.toUpperCase()}</span>
                <span>{(rate as number).toFixed(1)}%</span>
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

      <div className="translations-by-category">
        <h4>Translations by Category</h4>
        <div className="category-stats">
          {Object.entries(statistics.translationsByLanguage || {}).map(([lang, count]) => (
            <div key={lang} className="category-stat">
              <span className="category-name">{lang.toUpperCase()}</span>
              <span className="category-count">{count as number}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="localization-page">
      <div className="localization-tabs">
        <button
          className={`tab ${activeTab === 'languages' ? 'active' : ''}`}
          onClick={() => setActiveTab('languages')}
        >
          <Languages className="tab-icon" />
          Languages
        </button>
        <button
          className={`tab ${activeTab === 'translations' ? 'active' : ''}`}
          onClick={() => setActiveTab('translations')}
        >
          <Globe className="tab-icon" />
          Translations
        </button>
        <button
          className={`tab ${activeTab === 'locales' ? 'active' : ''}`}
          onClick={() => setActiveTab('locales')}
        >
          <MapPin className="tab-icon" />
          Locales
        </button>
        <button
          className={`tab ${activeTab === 'currencies' ? 'active' : ''}`}
          onClick={() => setActiveTab('currencies')}
        >
          <DollarSign className="tab-icon" />
          Currencies
        </button>
        <button
          className={`tab ${activeTab === 'statistics' ? 'active' : ''}`}
          onClick={() => setActiveTab('statistics')}
        >
          <Settings className="tab-icon" />
          Statistics
        </button>
      </div>

      <div className="localization-content">
        {activeTab === 'languages' && renderLanguagesTab()}
        {activeTab === 'translations' && renderTranslationsTab()}
        {activeTab === 'locales' && renderLocalesTab()}
        {activeTab === 'currencies' && renderCurrenciesTab()}
        {activeTab === 'statistics' && renderStatisticsTab()}
      </div>

      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <RefreshCw className="spinning" />
            <span>Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
};

