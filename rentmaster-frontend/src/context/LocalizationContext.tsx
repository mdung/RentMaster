import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { localizationApi } from '../services/api/localizationApi';

interface LocalizationContextType {
  currentLanguage: string;
  currentLocale: string;
  translations: Record<string, string>;
  loading: boolean;
  switchLanguage: (languageCode: string) => Promise<void>;
  translate: (key: string, fallback?: string) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  isRTL: boolean;
  supportedLanguages: any[];
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

interface LocalizationProviderProps {
  children: ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [currentLocale, setCurrentLocale] = useState<string>('en-US');
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [supportedLanguages, setSupportedLanguages] = useState<any[]>([]);
  const [isRTL, setIsRTL] = useState<boolean>(false);

  // Initialize localization
  useEffect(() => {
    initializeLocalization();
    loadSupportedLanguages();
  }, []);

  // Listen for language change events
  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      const { languageCode } = event.detail;
      loadLanguageData(languageCode);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  const initializeLocalization = async () => {
    try {
      setLoading(true);
      
      // Get stored language or detect from browser
      const storedLanguage = localizationApi.getStoredLanguage();
      
      // Load language data
      await loadLanguageData(storedLanguage);
    } catch (error) {
      console.error('Failed to initialize localization:', error);
      // Fallback to English
      setCurrentLanguage('en');
      setCurrentLocale('en-US');
      setIsRTL(false);
    } finally {
      setLoading(false);
    }
  };

  const loadSupportedLanguages = async () => {
    try {
      const languages = await localizationApi.getSupportedLanguages();
      setSupportedLanguages(languages);
    } catch (error) {
      console.error('Failed to load supported languages:', error);
    }
  };

  const loadLanguageData = async (languageCode: string) => {
    try {
      setLoading(true);
      
      // Set current language
      setCurrentLanguage(languageCode);
      
      // Determine locale based on language
      const locale = getLocaleForLanguage(languageCode);
      setCurrentLocale(locale);
      
      // Check if language is RTL
      const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
      setIsRTL(rtlLanguages.includes(languageCode));
      
      // Load all translations for the language
      const allTranslations = await loadAllTranslations(languageCode);
      setTranslations(allTranslations);
      
      // Update document language and direction
      document.documentElement.lang = languageCode;
      document.documentElement.dir = rtlLanguages.includes(languageCode) ? 'rtl' : 'ltr';
      
    } catch (error) {
      console.error('Failed to load language data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllTranslations = async (languageCode: string): Promise<Record<string, string>> => {
    try {
      // Load translations from all categories
      const categories = ['common', 'navigation', 'dashboard', 'properties', 'tenants', 'contracts', 'invoices', 'messages', 'status'];
      const translationPromises = categories.map(category => 
        localizationApi.getTranslations(languageCode, category)
      );
      
      const categoryTranslations = await Promise.all(translationPromises);
      
      // Flatten all translations into a single object
      const allTranslations: Record<string, string> = {};
      
      categoryTranslations.forEach((translations, index) => {
        const category = categories[index];
        translations.forEach((translation: any) => {
          // Use category.key format for namespacing
          const key = `${category}.${translation.key}`;
          allTranslations[key] = translation.value;
          
          // Also add without category prefix for backward compatibility
          allTranslations[translation.key] = translation.value;
        });
      });
      
      return allTranslations;
    } catch (error) {
      console.error('Failed to load translations:', error);
      return {};
    }
  };

  const getLocaleForLanguage = (languageCode: string): string => {
    const localeMap: Record<string, string> = {
      'en': 'en-US',
      'vi': 'vi-VN',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN',
      'ar': 'ar-SA',
      'he': 'he-IL'
    };
    
    return localeMap[languageCode] || `${languageCode}-${languageCode.toUpperCase()}`;
  };

  const switchLanguage = async (languageCode: string) => {
    try {
      // Update user preferences if user is logged in
      const userId = getCurrentUserId(); // You'll need to implement this
      if (userId) {
        await localizationApi.switchLanguage(languageCode, userId);
      } else {
        await localizationApi.switchLanguage(languageCode);
      }
      
      // Load new language data
      await loadLanguageData(languageCode);
    } catch (error) {
      console.error('Failed to switch language:', error);
      throw error;
    }
  };

  const translate = (key: string, fallback?: string): string => {
    // Try to find translation with the key
    let translation = translations[key];
    
    // If not found and key contains dots, try without category prefix
    if (!translation && key.includes('.')) {
      const keyWithoutCategory = key.split('.').pop();
      if (keyWithoutCategory) {
        translation = translations[keyWithoutCategory];
      }
    }
    
    // Return translation, fallback, or key
    return translation || fallback || key;
  };

  const formatCurrency = (amount: number, currency?: string): string => {
    try {
      const currencyCode = currency || getCurrencyForLocale(currentLocale);
      return localizationApi.formatCurrencyLocal(amount, currencyCode, currentLocale);
    } catch (error) {
      console.error('Failed to format currency:', error);
      return amount.toString();
    }
  };

  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions): string => {
    try {
      return localizationApi.formatDate(date, currentLocale, options);
    } catch (error) {
      console.error('Failed to format date:', error);
      return date.toString();
    }
  };

  const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
    try {
      return localizationApi.formatNumber(value, currentLocale, options);
    } catch (error) {
      console.error('Failed to format number:', error);
      return value.toString();
    }
  };

  const getCurrencyForLocale = (locale: string): string => {
    const currencyMap: Record<string, string> = {
      'en-US': 'USD',
      'vi-VN': 'VND',
      'es-ES': 'EUR',
      'fr-FR': 'EUR',
      'de-DE': 'EUR',
      'ja-JP': 'JPY',
      'ko-KR': 'KRW',
      'zh-CN': 'CNY',
      'ar-SA': 'SAR',
      'he-IL': 'ILS'
    };
    
    return currencyMap[locale] || 'USD';
  };

  const getCurrentUserId = (): number | null => {
    // This should be implemented based on your authentication system
    // For now, return null or get from localStorage/context
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id;
      } catch {
        return null;
      }
    }
    return null;
  };

  const contextValue: LocalizationContextType = {
    currentLanguage,
    currentLocale,
    translations,
    loading,
    switchLanguage,
    translate,
    formatCurrency,
    formatDate,
    formatNumber,
    isRTL,
    supportedLanguages
  };

  return (
    <LocalizationContext.Provider value={contextValue}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (context === undefined) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

// Custom hook for translation with shorter syntax
export const useTranslation = () => {
  const { translate } = useLocalization();
  
  return {
    t: translate,
    translate
  };
};

// Custom hook for formatting
export const useFormatting = () => {
  const { formatCurrency, formatDate, formatNumber, currentLocale } = useLocalization();
  
  return {
    formatCurrency,
    formatDate,
    formatNumber,
    currentLocale
  };
};