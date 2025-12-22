import apiClient from './apiClient';

export const localizationApi = {
  // Language Management
  getSupportedLanguages: async () => {
    const response = await apiClient.get('/localization/languages');
    return response.data;
  },

  getLanguage: async (code: string) => {
    const response = await apiClient.get(`/localization/languages/${code}`);
    return response.data;
  },

  createLanguage: async (language: any) => {
    const response = await apiClient.post('/localization/languages', language);
    return response.data;
  },

  updateLanguage: async (id: number, language: any) => {
    const response = await apiClient.put(`/localization/languages/${id}`, language);
    return response.data;
  },

  deleteLanguage: async (id: number) => {
    const response = await apiClient.delete(`/localization/languages/${id}`);
    return response.data;
  },

  // Translation Management
  getTranslations: async (languageCode?: string, category?: string, key?: string) => {
    const params: any = {};
    if (languageCode) params.languageCode = languageCode;
    if (category) params.category = category;
    if (key) params.key = key;
    
    const response = await apiClient.get('/localization/translations', { params });
    return response.data;
  },

  exportTranslations: async (languageCode: string, format: string = 'JSON') => {
    const response = await apiClient.get('/localization/translations/export', {
      params: { languageCode, format },
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `translations-${languageCode}.${format.toLowerCase()}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },

  importTranslations: async (importData: any) => {
    const response = await apiClient.post('/localization/translations/import', importData);
    return response.data;
  },

  createTranslation: async (translation: any) => {
    const response = await apiClient.post('/localization/translations', translation);
    return response.data;
  },

  updateTranslation: async (id: number, translation: any) => {
    const response = await apiClient.put(`/localization/translations/${id}`, translation);
    return response.data;
  },

  deleteTranslation: async (id: number) => {
    const response = await apiClient.delete(`/localization/translations/${id}`);
    return response.data;
  },

  bulkUpdateTranslations: async (translations: any[]) => {
    const response = await apiClient.post('/localization/translations/bulk', translations);
    return response.data;
  },

  // Locale Configuration
  getLocaleConfigurations: async () => {
    const response = await apiClient.get('/localization/locales');
    return response.data;
  },

  getLocaleConfiguration: async (code: string) => {
    const response = await apiClient.get(`/localization/locales/${code}`);
    return response.data;
  },

  createLocaleConfiguration: async (localeConfig: any) => {
    const response = await apiClient.post('/localization/locales', localeConfig);
    return response.data;
  },

  updateLocaleConfiguration: async (id: number, localeConfig: any) => {
    const response = await apiClient.put(`/localization/locales/${id}`, localeConfig);
    return response.data;
  },

  // Currency Localization
  getCurrencyLocalizations: async () => {
    const response = await apiClient.get('/localization/currencies');
    return response.data;
  },

  getCurrencyLocalization: async (code: string) => {
    const response = await apiClient.get(`/localization/currencies/${code}`);
    return response.data;
  },

  formatCurrency: async (formatRequest: any) => {
    const response = await apiClient.post('/localization/currencies/format', formatRequest);
    return response.data;
  },

  createCurrencyLocalization: async (currency: any) => {
    const response = await apiClient.post('/localization/currencies', currency);
    return response.data;
  },

  updateCurrencyLocalization: async (id: number, currency: any) => {
    const response = await apiClient.put(`/localization/currencies/${id}`, currency);
    return response.data;
  },

  // Date/Time Localization
  getDateTimeFormats: async () => {
    const response = await apiClient.get('/localization/datetime/formats');
    return response.data;
  },

  formatDateTime: async (formatRequest: any) => {
    const response = await apiClient.post('/localization/datetime/format', formatRequest);
    return response.data;
  },

  createDateTimeFormat: async (dateTimeFormat: any) => {
    const response = await apiClient.post('/localization/datetime/formats', dateTimeFormat);
    return response.data;
  },

  updateDateTimeFormat: async (id: number, dateTimeFormat: any) => {
    const response = await apiClient.put(`/localization/datetime/formats/${id}`, dateTimeFormat);
    return response.data;
  },

  // Regional Compliance
  getRegionalCompliance: async () => {
    const response = await apiClient.get('/localization/compliance');
    return response.data;
  },

  getRegionalComplianceByCountry: async (countryCode: string) => {
    const response = await apiClient.get(`/localization/compliance/${countryCode}`);
    return response.data;
  },

  createRegionalCompliance: async (compliance: any) => {
    const response = await apiClient.post('/localization/compliance', compliance);
    return response.data;
  },

  updateRegionalCompliance: async (id: number, compliance: any) => {
    const response = await apiClient.put(`/localization/compliance/${id}`, compliance);
    return response.data;
  },

  validateCompliance: async (countryCode: string, dataType: string, value: string) => {
    const response = await apiClient.get(`/localization/compliance/${countryCode}/validate`, {
      params: { dataType, value }
    });
    return response.data;
  },

  // User Preferences
  getUserPreferences: async (userId: number) => {
    const response = await apiClient.get(`/localization/preferences/${userId}`);
    return response.data;
  },

  createUserPreferences: async (preferences: any) => {
    const response = await apiClient.post('/localization/preferences', preferences);
    return response.data;
  },

  updateUserPreferences: async (userId: number, preferences: any) => {
    const response = await apiClient.put(`/localization/preferences/${userId}`, preferences);
    return response.data;
  },

  // Translation Statistics
  getTranslationStatistics: async () => {
    const response = await apiClient.get('/localization/statistics');
    return response.data;
  },

  getLanguageStatistics: async (languageCode: string) => {
    const response = await apiClient.get(`/localization/statistics/${languageCode}`);
    return response.data;
  },

  // Translation Validation
  validateTranslations: async (validationRequest: any) => {
    const response = await apiClient.post('/localization/validate', validationRequest);
    return response.data;
  },

  autoTranslate: async (translateRequest: any) => {
    const response = await apiClient.post('/localization/auto-translate', translateRequest);
    return response.data;
  },

  // Localization Testing
  testLocalization: async (testRequest: any) => {
    const response = await apiClient.post('/localization/test', testRequest);
    return response.data;
  },

  getMissingTranslations: async (languageCode: string, category?: string) => {
    const params: any = { languageCode };
    if (category) params.category = category;
    
    const response = await apiClient.get('/localization/missing-translations', { params });
    return response.data;
  },

  // Content Localization
  localizeContent: async (contentRequest: any) => {
    const response = await apiClient.post('/localization/content/localize', contentRequest);
    return response.data;
  },

  getLocalizedTemplates: async (languageCode?: string, templateType?: string) => {
    const params: any = {};
    if (languageCode) params.languageCode = languageCode;
    if (templateType) params.templateType = templateType;
    
    const response = await apiClient.get('/localization/content/templates', { params });
    return response.data;
  },

  createLocalizedTemplate: async (template: any) => {
    const response = await apiClient.post('/localization/content/templates', template);
    return response.data;
  },

  updateLocalizedTemplate: async (id: number, template: any) => {
    const response = await apiClient.put(`/localization/content/templates/${id}`, template);
    return response.data;
  },

  // Utility Functions
  getCurrentLocale: () => {
    return navigator.language || 'en-US';
  },

  detectUserLanguage: () => {
    const language = navigator.language || navigator.languages?.[0] || 'en';
    return language.split('-')[0]; // Extract language code (e.g., 'en' from 'en-US')
  },

  formatNumber: (value: number, locale: string = 'en-US', options?: Intl.NumberFormatOptions) => {
    return new Intl.NumberFormat(locale, options).format(value);
  },

  formatDate: (date: Date, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions) => {
    return new Intl.DateTimeFormat(locale, options).format(date);
  },

  formatCurrencyLocal: (amount: number, currency: string = 'USD', locale: string = 'en-US') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  },

  // Translation Helper Functions
  translate: async (key: string, languageCode: string, category: string = 'common', fallback?: string) => {
    try {
      const translations = await localizationApi.getTranslations(languageCode, category, key);
      if (translations.length > 0) {
        return translations[0].value;
      }
      return fallback || key;
    } catch (error) {
      console.error('Translation failed:', error);
      return fallback || key;
    }
  },

  // Batch translation for performance
  batchTranslate: async (keys: string[], languageCode: string, category: string = 'common') => {
    try {
      const translations = await localizationApi.getTranslations(languageCode, category);
      const translationMap: Record<string, string> = {};
      
      translations.forEach((t: any) => {
        translationMap[t.key] = t.value;
      });
      
      return keys.reduce((result, key) => {
        result[key] = translationMap[key] || key;
        return result;
      }, {} as Record<string, string>);
    } catch (error) {
      console.error('Batch translation failed:', error);
      return keys.reduce((result, key) => {
        result[key] = key;
        return result;
      }, {} as Record<string, string>);
    }
  },

  // Language switching helper
  switchLanguage: async (languageCode: string, userId?: number) => {
    try {
      // Update user preferences if userId provided
      if (userId) {
        const preferences = await localizationApi.getUserPreferences(userId);
        preferences.languageCode = languageCode;
        await localizationApi.updateUserPreferences(userId, preferences);
      }
      
      // Store in localStorage for persistence
      localStorage.setItem('selectedLanguage', languageCode);
      
      // Trigger language change event
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: { languageCode } }));
      
      return true;
    } catch (error) {
      console.error('Failed to switch language:', error);
      return false;
    }
  },

  // Get stored language preference
  getStoredLanguage: () => {
    return localStorage.getItem('selectedLanguage') || localizationApi.detectUserLanguage();
  }
};
