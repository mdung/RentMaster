package com.rentmaster.localization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.text.NumberFormat;
import java.text.DecimalFormat;
import java.util.regex.Pattern;

@Service
public class LocalizationService {

    @Autowired
    private LanguageRepository languageRepository;
    
    @Autowired
    private TranslationRepository translationRepository;
    
    @Autowired
    private LocaleConfigRepository localeConfigRepository;
    
    @Autowired
    private CurrencyLocalizationRepository currencyLocalizationRepository;
    
    @Autowired
    private DateTimeFormatRepository dateTimeFormatRepository;
    
    @Autowired
    private RegionalComplianceRepository regionalComplianceRepository;
    
    @Autowired
    private UserLocalizationPreferenceRepository userPreferenceRepository;
    
    @Autowired
    private LocalizedTemplateRepository localizedTemplateRepository;

    // Language Management
    public List<Language> getSupportedLanguages() {
        return languageRepository.findByActiveTrue();
    }

    public Language getLanguage(String code) {
        return languageRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Language not found: " + code));
    }

    public Language createLanguage(Language language) {
        language.setCreatedAt(LocalDateTime.now());
        language.setUpdatedAt(LocalDateTime.now());
        return languageRepository.save(language);
    }

    public Language updateLanguage(Long id, Language language) {
        Language existing = languageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Language not found"));
        
        existing.setName(language.getName());
        existing.setNativeName(language.getNativeName());
        existing.setCode(language.getCode());
        existing.setCountryCode(language.getCountryCode());
        existing.setDirection(language.getDirection());
        existing.setActive(language.isActive());
        existing.setUpdatedAt(LocalDateTime.now());
        
        return languageRepository.save(existing);
    }

    public Map<String, Object> deleteLanguage(Long id) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            Language language = languageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Language not found"));
            
            // Check if language is being used
            long translationCount = translationRepository.countByLanguageCode(language.getCode());
            if (translationCount > 0) {
                result.put("success", false);
                result.put("error", "Cannot delete language with existing translations");
                return result;
            }
            
            languageRepository.delete(language);
            result.put("success", true);
            result.put("message", "Language deleted successfully");
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to delete language: " + e.getMessage());
        }
        
        return result;
    }

    // Translation Management
    public List<Translation> getTranslations(String languageCode, String category, String key) {
        if (languageCode != null && category != null && key != null) {
            return translationRepository.findByLanguageCodeAndCategoryAndKey(languageCode, category, key);
        } else if (languageCode != null && category != null) {
            return translationRepository.findByLanguageCodeAndCategory(languageCode, category);
        } else if (languageCode != null) {
            return translationRepository.findByLanguageCode(languageCode);
        } else {
            return translationRepository.findAll();
        }
    }

    public Map<String, Object> exportTranslations(String languageCode, String format) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            List<Translation> translations = translationRepository.findByLanguageCode(languageCode);
            
            if ("JSON".equals(format)) {
                Map<String, Map<String, String>> exportData = new HashMap<>();
                
                for (Translation translation : translations) {
                    exportData.computeIfAbsent(translation.getCategory(), k -> new HashMap<>())
                        .put(translation.getKey(), translation.getValue());
                }
                
                result.put("success", true);
                result.put("data", exportData);
                result.put("format", "JSON");
                result.put("languageCode", languageCode);
                result.put("count", translations.size());
                
            } else if ("CSV".equals(format)) {
                StringBuilder csv = new StringBuilder();
                csv.append("Category,Key,Value,Description\n");
                
                for (Translation translation : translations) {
                    csv.append(String.format("%s,%s,\"%s\",\"%s\"\n",
                        translation.getCategory(),
                        translation.getKey(),
                        translation.getValue().replace("\"", "\"\""),
                        translation.getDescription() != null ? translation.getDescription().replace("\"", "\"\"") : ""
                    ));
                }
                
                result.put("success", true);
                result.put("data", csv.toString());
                result.put("format", "CSV");
                result.put("languageCode", languageCode);
                result.put("count", translations.size());
            }
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to export translations: " + e.getMessage());
        }
        
        return result;
    }

    public Map<String, Object> importTranslations(Map<String, Object> importData) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String languageCode = (String) importData.get("languageCode");
            String format = (String) importData.get("format");
            Object data = importData.get("data");
            
            int imported = 0;
            int updated = 0;
            int errors = 0;
            
            if ("JSON".equals(format) && data instanceof Map) {
                Map<String, Map<String, String>> translationData = (Map<String, Map<String, String>>) data;
                
                for (Map.Entry<String, Map<String, String>> categoryEntry : translationData.entrySet()) {
                    String category = categoryEntry.getKey();
                    
                    for (Map.Entry<String, String> translationEntry : categoryEntry.getValue().entrySet()) {
                        String key = translationEntry.getKey();
                        String value = translationEntry.getValue();
                        
                        try {
                            Optional<Translation> existing = translationRepository
                                .findByLanguageCodeAndCategoryAndKey(languageCode, category, key)
                                .stream().findFirst();
                            
                            if (existing.isPresent()) {
                                Translation translation = existing.get();
                                translation.setValue(value);
                                translation.setUpdatedAt(LocalDateTime.now());
                                translationRepository.save(translation);
                                updated++;
                            } else {
                                Translation translation = new Translation();
                                translation.setLanguageCode(languageCode);
                                translation.setCategory(category);
                                translation.setKey(key);
                                translation.setValue(value);
                                translation.setCreatedAt(LocalDateTime.now());
                                translation.setUpdatedAt(LocalDateTime.now());
                                translationRepository.save(translation);
                                imported++;
                            }
                        } catch (Exception e) {
                            errors++;
                        }
                    }
                }
            }
            
            result.put("success", true);
            result.put("imported", imported);
            result.put("updated", updated);
            result.put("errors", errors);
            result.put("total", imported + updated);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to import translations: " + e.getMessage());
        }
        
        return result;
    }

    public Translation createTranslation(Translation translation) {
        translation.setCreatedAt(LocalDateTime.now());
        translation.setUpdatedAt(LocalDateTime.now());
        return translationRepository.save(translation);
    }

    public Translation updateTranslation(Long id, Translation translation) {
        Translation existing = translationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Translation not found"));
        
        existing.setValue(translation.getValue());
        existing.setDescription(translation.getDescription());
        existing.setContext(translation.getContext());
        existing.setUpdatedAt(LocalDateTime.now());
        
        return translationRepository.save(existing);
    }

    public Map<String, Object> deleteTranslation(Long id) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            translationRepository.deleteById(id);
            result.put("success", true);
            result.put("message", "Translation deleted successfully");
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to delete translation: " + e.getMessage());
        }
        
        return result;
    }

    public Map<String, Object> bulkUpdateTranslations(List<Translation> translations) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            int updated = 0;
            int errors = 0;
            
            for (Translation translation : translations) {
                try {
                    if (translation.getId() != null) {
                        updateTranslation(translation.getId(), translation);
                        updated++;
                    } else {
                        createTranslation(translation);
                        updated++;
                    }
                } catch (Exception e) {
                    errors++;
                }
            }
            
            result.put("success", true);
            result.put("updated", updated);
            result.put("errors", errors);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to bulk update translations: " + e.getMessage());
        }
        
        return result;
    }

    // Locale Configuration
    public List<LocaleConfig> getLocaleConfigurations() {
        return localeConfigRepository.findAll();
    }

    public LocaleConfig getLocaleConfiguration(String code) {
        return localeConfigRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Locale configuration not found: " + code));
    }

    public LocaleConfig createLocaleConfiguration(LocaleConfig localeConfig) {
        localeConfig.setCreatedAt(LocalDateTime.now());
        localeConfig.setUpdatedAt(LocalDateTime.now());
        return localeConfigRepository.save(localeConfig);
    }

    public LocaleConfig updateLocaleConfiguration(Long id, LocaleConfig localeConfig) {
        LocaleConfig existing = localeConfigRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Locale configuration not found"));
        
        existing.setName(localeConfig.getName());
        existing.setCode(localeConfig.getCode());
        existing.setLanguageCode(localeConfig.getLanguageCode());
        existing.setCountryCode(localeConfig.getCountryCode());
        existing.setCurrencyCode(localeConfig.getCurrencyCode());
        existing.setTimeZone(localeConfig.getTimeZone());
        existing.setDateFormat(localeConfig.getDateFormat());
        existing.setTimeFormat(localeConfig.getTimeFormat());
        existing.setNumberFormat(localeConfig.getNumberFormat());
        existing.setUpdatedAt(LocalDateTime.now());
        
        return localeConfigRepository.save(existing);
    }

    // Currency Localization
    public List<CurrencyLocalization> getCurrencyLocalizations() {
        return currencyLocalizationRepository.findAll();
    }

    public CurrencyLocalization getCurrencyLocalization(String code) {
        return currencyLocalizationRepository.findByCode(code)
            .orElseThrow(() -> new RuntimeException("Currency localization not found: " + code));
    }

    public Map<String, Object> formatCurrency(Map<String, Object> formatRequest) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String currencyCode = (String) formatRequest.get("currencyCode");
            String localeCode = (String) formatRequest.get("localeCode");
            Double amount = ((Number) formatRequest.get("amount")).doubleValue();
            
            CurrencyLocalization currency = getCurrencyLocalization(currencyCode);
            LocaleConfig locale = getLocaleConfiguration(localeCode);
            
            // Format currency based on locale settings
            String formattedAmount = formatCurrencyAmount(amount, currency, locale);
            
            result.put("success", true);
            result.put("formattedAmount", formattedAmount);
            result.put("currencyCode", currencyCode);
            result.put("localeCode", localeCode);
            result.put("originalAmount", amount);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to format currency: " + e.getMessage());
        }
        
        return result;
    }

    public CurrencyLocalization createCurrencyLocalization(CurrencyLocalization currency) {
        currency.setCreatedAt(LocalDateTime.now());
        currency.setUpdatedAt(LocalDateTime.now());
        return currencyLocalizationRepository.save(currency);
    }

    public CurrencyLocalization updateCurrencyLocalization(Long id, CurrencyLocalization currency) {
        CurrencyLocalization existing = currencyLocalizationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Currency localization not found"));
        
        existing.setName(currency.getName());
        existing.setSymbol(currency.getSymbol());
        existing.setSymbolPosition(currency.getSymbolPosition());
        existing.setDecimalPlaces(currency.getDecimalPlaces());
        existing.setDecimalSeparator(currency.getDecimalSeparator());
        existing.setThousandsSeparator(currency.getThousandsSeparator());
        existing.setUpdatedAt(LocalDateTime.now());
        
        return currencyLocalizationRepository.save(existing);
    }

    // Date/Time Localization
    public List<DateTimeFormat> getDateTimeFormats() {
        return dateTimeFormatRepository.findAll();
    }

    public Map<String, Object> formatDateTime(Map<String, Object> formatRequest) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String localeCode = (String) formatRequest.get("localeCode");
            String dateTimeString = (String) formatRequest.get("dateTime");
            String formatType = (String) formatRequest.get("formatType"); // "DATE", "TIME", "DATETIME"
            
            LocaleConfig locale = getLocaleConfiguration(localeCode);
            LocalDateTime dateTime = LocalDateTime.parse(dateTimeString);
            
            String formatted = formatDateTimeValue(dateTime, locale, formatType);
            
            result.put("success", true);
            result.put("formatted", formatted);
            result.put("localeCode", localeCode);
            result.put("formatType", formatType);
            result.put("original", dateTimeString);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to format date/time: " + e.getMessage());
        }
        
        return result;
    }

    public DateTimeFormat createDateTimeFormat(DateTimeFormat dateTimeFormat) {
        dateTimeFormat.setCreatedAt(LocalDateTime.now());
        dateTimeFormat.setUpdatedAt(LocalDateTime.now());
        return dateTimeFormatRepository.save(dateTimeFormat);
    }

    public DateTimeFormat updateDateTimeFormat(Long id, DateTimeFormat dateTimeFormat) {
        DateTimeFormat existing = dateTimeFormatRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("DateTime format not found"));
        
        existing.setName(dateTimeFormat.getName());
        existing.setLocaleCode(dateTimeFormat.getLocaleCode());
        existing.setDatePattern(dateTimeFormat.getDatePattern());
        existing.setTimePattern(dateTimeFormat.getTimePattern());
        existing.setDateTimePattern(dateTimeFormat.getDateTimePattern());
        existing.setUpdatedAt(LocalDateTime.now());
        
        return dateTimeFormatRepository.save(existing);
    }

    // Regional Compliance
    public List<RegionalCompliance> getRegionalCompliance() {
        return regionalComplianceRepository.findAll();
    }

    public RegionalCompliance getRegionalCompliance(String countryCode) {
        return regionalComplianceRepository.findByCountryCode(countryCode)
            .orElseThrow(() -> new RuntimeException("Regional compliance not found: " + countryCode));
    }

    public RegionalCompliance createRegionalCompliance(RegionalCompliance compliance) {
        compliance.setCreatedAt(LocalDateTime.now());
        compliance.setUpdatedAt(LocalDateTime.now());
        return regionalComplianceRepository.save(compliance);
    }

    public RegionalCompliance updateRegionalCompliance(Long id, RegionalCompliance compliance) {
        RegionalCompliance existing = regionalComplianceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Regional compliance not found"));
        
        existing.setCountryName(compliance.getCountryName());
        existing.setTaxIdFormat(compliance.getTaxIdFormat());
        existing.setPhoneFormat(compliance.getPhoneFormat());
        existing.setPostalCodeFormat(compliance.getPostalCodeFormat());
        existing.setAddressFormat(compliance.getAddressFormat());
        existing.setLegalRequirements(compliance.getLegalRequirements());
        existing.setDataProtectionRules(compliance.getDataProtectionRules());
        existing.setUpdatedAt(LocalDateTime.now());
        
        return regionalComplianceRepository.save(existing);
    }

    public Map<String, Object> validateCompliance(String countryCode, String dataType, String value) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            RegionalCompliance compliance = getRegionalCompliance(countryCode);
            boolean isValid = false;
            String errorMessage = null;
            
            switch (dataType.toUpperCase()) {
                case "TAX_ID":
                    isValid = validateTaxId(value, compliance.getTaxIdFormat());
                    break;
                case "PHONE":
                    isValid = validatePhone(value, compliance.getPhoneFormat());
                    break;
                case "POSTAL_CODE":
                    isValid = validatePostalCode(value, compliance.getPostalCodeFormat());
                    break;
                default:
                    errorMessage = "Unknown data type: " + dataType;
            }
            
            result.put("success", true);
            result.put("valid", isValid);
            result.put("countryCode", countryCode);
            result.put("dataType", dataType);
            result.put("value", value);
            
            if (errorMessage != null) {
                result.put("error", errorMessage);
            }
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to validate compliance: " + e.getMessage());
        }
        
        return result;
    }

    // User Preferences
    public UserLocalizationPreference getUserPreferences(Long userId) {
        return userPreferenceRepository.findByUserId(userId)
            .orElse(createDefaultUserPreferences(userId));
    }

    public UserLocalizationPreference createUserPreferences(UserLocalizationPreference preferences) {
        preferences.setCreatedAt(Instant.now());
        preferences.setUpdatedAt(Instant.now());
        return userPreferenceRepository.save(preferences);
    }

    public UserLocalizationPreference updateUserPreferences(Long userId, UserLocalizationPreference preferences) {
        UserLocalizationPreference existing = getUserPreferences(userId);
        
        existing.setLanguageCode(preferences.getLanguageCode());
        existing.setLocaleCode(preferences.getLocaleCode());
        existing.setCurrencyCode(preferences.getCurrencyCode());
        existing.setTimeZone(preferences.getTimeZone());
        existing.setDateFormat(preferences.getDateFormat());
        existing.setTimeFormat(preferences.getTimeFormat());
        existing.setNumberFormat(preferences.getNumberFormat());
        existing.setUpdatedAt(Instant.now());
        
        return userPreferenceRepository.save(existing);
    }

    // Translation Statistics
    public Map<String, Object> getTranslationStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        List<Language> languages = getSupportedLanguages();
        long totalTranslations = translationRepository.count();
        
        Map<String, Long> translationsByLanguage = new HashMap<>();
        Map<String, Double> completionRates = new HashMap<>();
        
        for (Language language : languages) {
            long count = translationRepository.countByLanguageCode(language.getCode());
            translationsByLanguage.put(language.getCode(), count);
            
            // Calculate completion rate (assuming English as base language)
            long englishCount = translationRepository.countByLanguageCode("en");
            double completionRate = englishCount > 0 ? (double) count / englishCount * 100 : 0;
            completionRates.put(language.getCode(), completionRate);
        }
        
        statistics.put("totalLanguages", languages.size());
        statistics.put("totalTranslations", totalTranslations);
        statistics.put("translationsByLanguage", translationsByLanguage);
        statistics.put("completionRates", completionRates);
        
        return statistics;
    }

    public Map<String, Object> getLanguageStatistics(String languageCode) {
        Map<String, Object> statistics = new HashMap<>();
        
        long totalTranslations = translationRepository.countByLanguageCode(languageCode);
        
        // Get translations by category
        List<Object[]> categoryStats = translationRepository.getTranslationCountByCategory(languageCode);
        Map<String, Long> translationsByCategory = new HashMap<>();
        
        for (Object[] stat : categoryStats) {
            translationsByCategory.put((String) stat[0], (Long) stat[1]);
        }
        
        statistics.put("languageCode", languageCode);
        statistics.put("totalTranslations", totalTranslations);
        statistics.put("translationsByCategory", translationsByCategory);
        
        return statistics;
    }

    // Translation Validation
    public Map<String, Object> validateTranslations(Map<String, Object> validationRequest) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String languageCode = (String) validationRequest.get("languageCode");
            List<Translation> translations = translationRepository.findByLanguageCode(languageCode);
            
            List<Map<String, Object>> issues = new ArrayList<>();
            
            for (Translation translation : translations) {
                Map<String, Object> issue = validateTranslation(translation);
                if (issue != null) {
                    issues.add(issue);
                }
            }
            
            result.put("success", true);
            result.put("languageCode", languageCode);
            result.put("totalTranslations", translations.size());
            result.put("issuesFound", issues.size());
            result.put("issues", issues);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to validate translations: " + e.getMessage());
        }
        
        return result;
    }

    public Map<String, Object> autoTranslate(Map<String, Object> translateRequest) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String sourceLanguage = (String) translateRequest.get("sourceLanguage");
            String targetLanguage = (String) translateRequest.get("targetLanguage");
            String text = (String) translateRequest.get("text");
            
            // In a real implementation, integrate with translation services like Google Translate
            String translatedText = performAutoTranslation(text, sourceLanguage, targetLanguage);
            
            result.put("success", true);
            result.put("sourceLanguage", sourceLanguage);
            result.put("targetLanguage", targetLanguage);
            result.put("originalText", text);
            result.put("translatedText", translatedText);
            result.put("confidence", 0.85); // Mock confidence score
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to auto-translate: " + e.getMessage());
        }
        
        return result;
    }

    // Localization Testing
    public Map<String, Object> testLocalization(Map<String, Object> testRequest) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String languageCode = (String) testRequest.get("languageCode");
            String localeCode = (String) testRequest.get("localeCode");
            
            // Test various localization aspects
            Map<String, Object> tests = new HashMap<>();
            
            // Test translations
            tests.put("translations", testTranslations(languageCode));
            
            // Test currency formatting
            tests.put("currency", testCurrencyFormatting(localeCode));
            
            // Test date/time formatting
            tests.put("dateTime", testDateTimeFormatting(localeCode));
            
            // Test regional compliance
            tests.put("compliance", testRegionalCompliance(localeCode));
            
            result.put("success", true);
            result.put("languageCode", languageCode);
            result.put("localeCode", localeCode);
            result.put("tests", tests);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to test localization: " + e.getMessage());
        }
        
        return result;
    }

    public List<Map<String, Object>> getMissingTranslations(String languageCode, String category) {
        List<Map<String, Object>> missing = new ArrayList<>();
        
        // Get all English translations as reference
        List<Translation> englishTranslations = category != null 
            ? translationRepository.findByLanguageCodeAndCategory("en", category)
            : translationRepository.findByLanguageCode("en");
        
        // Check which translations are missing in target language
        for (Translation englishTranslation : englishTranslations) {
            List<Translation> existing = translationRepository.findByLanguageCodeAndCategoryAndKey(
                languageCode, englishTranslation.getCategory(), englishTranslation.getKey());
            
            if (existing.isEmpty()) {
                Map<String, Object> missingTranslation = new HashMap<>();
                missingTranslation.put("category", englishTranslation.getCategory());
                missingTranslation.put("key", englishTranslation.getKey());
                missingTranslation.put("englishValue", englishTranslation.getValue());
                missingTranslation.put("description", englishTranslation.getDescription());
                missing.add(missingTranslation);
            }
        }
        
        return missing;
    }

    // Content Localization
    public Map<String, Object> localizeContent(Map<String, Object> contentRequest) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            String languageCode = (String) contentRequest.get("languageCode");
            String contentType = (String) contentRequest.get("contentType");
            Map<String, Object> content = (Map<String, Object>) contentRequest.get("content");
            
            Map<String, Object> localizedContent = new HashMap<>();
            
            for (Map.Entry<String, Object> entry : content.entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();
                
                if (value instanceof String) {
                    // Try to find translation
                    List<Translation> translations = translationRepository
                        .findByLanguageCodeAndCategoryAndKey(languageCode, contentType, key);
                    
                    if (!translations.isEmpty()) {
                        localizedContent.put(key, translations.get(0).getValue());
                    } else {
                        localizedContent.put(key, value); // Fallback to original
                    }
                } else {
                    localizedContent.put(key, value);
                }
            }
            
            result.put("success", true);
            result.put("languageCode", languageCode);
            result.put("contentType", contentType);
            result.put("localizedContent", localizedContent);
            
        } catch (Exception e) {
            result.put("success", false);
            result.put("error", "Failed to localize content: " + e.getMessage());
        }
        
        return result;
    }

    public List<LocalizedTemplate> getLocalizedTemplates(String languageCode, String templateType) {
        if (languageCode != null && templateType != null) {
            return localizedTemplateRepository.findByLanguageCodeAndTemplateType(languageCode, templateType);
        } else if (languageCode != null) {
            return localizedTemplateRepository.findByLanguageCode(languageCode);
        } else if (templateType != null) {
            return localizedTemplateRepository.findByTemplateType(templateType);
        } else {
            return localizedTemplateRepository.findAll();
        }
    }

    public LocalizedTemplate createLocalizedTemplate(LocalizedTemplate template) {
        template.setCreatedAt(LocalDateTime.now());
        template.setUpdatedAt(LocalDateTime.now());
        return localizedTemplateRepository.save(template);
    }

    public LocalizedTemplate updateLocalizedTemplate(Long id, LocalizedTemplate template) {
        LocalizedTemplate existing = localizedTemplateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Localized template not found"));
        
        existing.setName(template.getName());
        existing.setContent(template.getContent());
        existing.setVariables(template.getVariables());
        existing.setUpdatedAt(LocalDateTime.now());
        
        return localizedTemplateRepository.save(existing);
    }

    // Helper Methods
    private String formatCurrencyAmount(Double amount, CurrencyLocalization currency, LocaleConfig locale) {
        DecimalFormat formatter = new DecimalFormat();
        formatter.setMaximumFractionDigits(currency.getDecimalPlaces());
        formatter.setMinimumFractionDigits(currency.getDecimalPlaces());
        
        String formattedNumber = formatter.format(amount);
        
        // Apply currency symbol and position
        if ("BEFORE".equals(currency.getSymbolPosition())) {
            return currency.getSymbol() + formattedNumber;
        } else {
            return formattedNumber + currency.getSymbol();
        }
    }

    private String formatDateTimeValue(LocalDateTime dateTime, LocaleConfig locale, String formatType) {
        DateTimeFormatter formatter;
        
        switch (formatType.toUpperCase()) {
            case "DATE":
                formatter = DateTimeFormatter.ofPattern(locale.getDateFormat());
                return dateTime.toLocalDate().format(formatter);
            case "TIME":
                formatter = DateTimeFormatter.ofPattern(locale.getTimeFormat());
                return dateTime.toLocalTime().format(formatter);
            case "DATETIME":
                formatter = DateTimeFormatter.ofPattern(locale.getDateFormat() + " " + locale.getTimeFormat());
                return dateTime.format(formatter);
            default:
                return dateTime.toString();
        }
    }

    private boolean validateTaxId(String value, String format) {
        if (format == null || value == null) return false;
        return Pattern.matches(format, value);
    }

    private boolean validatePhone(String value, String format) {
        if (format == null || value == null) return false;
        return Pattern.matches(format, value);
    }

    private boolean validatePostalCode(String value, String format) {
        if (format == null || value == null) return false;
        return Pattern.matches(format, value);
    }

    private UserLocalizationPreference createDefaultUserPreferences(Long userId) {
        UserLocalizationPreference preferences = new UserLocalizationPreference();
        preferences.setUserId(userId);
        preferences.setLanguageCode("en");
        preferences.setLocaleCode("en-US");
        preferences.setCurrencyCode("USD");
        preferences.setTimeZone("UTC");
        preferences.setDateFormat("MM/dd/yyyy");
        preferences.setTimeFormat("HH:mm");
        preferences.setNumberFormat("#,##0.00");
        preferences.setCreatedAt(Instant.now());
        preferences.setUpdatedAt(Instant.now());
        
        return userPreferenceRepository.save(preferences);
    }

    private Map<String, Object> validateTranslation(Translation translation) {
        // Check for common translation issues
        if (translation.getValue() == null || translation.getValue().trim().isEmpty()) {
            Map<String, Object> issue = new HashMap<>();
            issue.put("type", "EMPTY_TRANSLATION");
            issue.put("category", translation.getCategory());
            issue.put("key", translation.getKey());
            issue.put("message", "Translation value is empty");
            return issue;
        }
        
        // Check for placeholder mismatches
        String value = translation.getValue();
        if (value.contains("{") && !value.contains("}")) {
            Map<String, Object> issue = new HashMap<>();
            issue.put("type", "MALFORMED_PLACEHOLDER");
            issue.put("category", translation.getCategory());
            issue.put("key", translation.getKey());
            issue.put("message", "Malformed placeholder in translation");
            return issue;
        }
        
        return null; // No issues found
    }

    private String performAutoTranslation(String text, String sourceLanguage, String targetLanguage) {
        // Mock auto-translation - in real implementation, integrate with translation services
        if ("en".equals(sourceLanguage) && "vi".equals(targetLanguage)) {
            // Simple English to Vietnamese translations for demo
            Map<String, String> translations = Map.of(
                "Dashboard", "Bảng điều khiển",
                "Properties", "Bất động sản",
                "Tenants", "Người thuê",
                "Contracts", "Hợp đồng",
                "Invoices", "Hóa đơn",
                "Payments", "Thanh toán",
                "Settings", "Cài đặt",
                "Profile", "Hồ sơ",
                "Logout", "Đăng xuất"
            );
            
            return translations.getOrDefault(text, "[AUTO] " + text);
        }
        
        return "[AUTO] " + text; // Fallback
    }

    private Map<String, Object> testTranslations(String languageCode) {
        Map<String, Object> test = new HashMap<>();
        
        long totalTranslations = translationRepository.countByLanguageCode(languageCode);
        long emptyTranslations = translationRepository.countByLanguageCodeAndValueIsEmpty(languageCode);
        
        test.put("totalTranslations", totalTranslations);
        test.put("emptyTranslations", emptyTranslations);
        test.put("completionRate", totalTranslations > 0 ? (double)(totalTranslations - emptyTranslations) / totalTranslations * 100 : 0);
        test.put("status", emptyTranslations == 0 ? "PASS" : "FAIL");
        
        return test;
    }

    private Map<String, Object> testCurrencyFormatting(String localeCode) {
        Map<String, Object> test = new HashMap<>();
        
        try {
            LocaleConfig locale = getLocaleConfiguration(localeCode);
            CurrencyLocalization currency = getCurrencyLocalization(locale.getCurrencyCode());
            
            String formatted = formatCurrencyAmount(1234.56, currency, locale);
            
            test.put("testAmount", 1234.56);
            test.put("formattedAmount", formatted);
            test.put("currencyCode", currency.getCode());
            test.put("status", "PASS");
            
        } catch (Exception e) {
            test.put("status", "FAIL");
            test.put("error", e.getMessage());
        }
        
        return test;
    }

    private Map<String, Object> testDateTimeFormatting(String localeCode) {
        Map<String, Object> test = new HashMap<>();
        
        try {
            LocaleConfig locale = getLocaleConfiguration(localeCode);
            LocalDateTime now = LocalDateTime.now();
            
            String formattedDate = formatDateTimeValue(now, locale, "DATE");
            String formattedTime = formatDateTimeValue(now, locale, "TIME");
            String formattedDateTime = formatDateTimeValue(now, locale, "DATETIME");
            
            test.put("testDateTime", now.toString());
            test.put("formattedDate", formattedDate);
            test.put("formattedTime", formattedTime);
            test.put("formattedDateTime", formattedDateTime);
            test.put("status", "PASS");
            
        } catch (Exception e) {
            test.put("status", "FAIL");
            test.put("error", e.getMessage());
        }
        
        return test;
    }

    private Map<String, Object> testRegionalCompliance(String localeCode) {
        Map<String, Object> test = new HashMap<>();
        
        try {
            LocaleConfig locale = getLocaleConfiguration(localeCode);
            RegionalCompliance compliance = getRegionalCompliance(locale.getCountryCode());
            
            test.put("countryCode", compliance.getCountryCode());
            test.put("countryName", compliance.getCountryName());
            test.put("hasComplianceRules", compliance.getLegalRequirements() != null && !compliance.getLegalRequirements().isEmpty());
            test.put("status", "PASS");
            
        } catch (Exception e) {
            test.put("status", "FAIL");
            test.put("error", e.getMessage());
        }
        
        return test;
    }
}