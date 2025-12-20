package com.rentmaster.localization;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/localization")
@CrossOrigin(origins = "*")
public class LocalizationController {

    @Autowired
    private LocalizationService localizationService;

    // Language Management
    @GetMapping("/languages")
    public ResponseEntity<List<Language>> getSupportedLanguages() {
        List<Language> languages = localizationService.getSupportedLanguages();
        return ResponseEntity.ok(languages);
    }

    @GetMapping("/languages/{code}")
    public ResponseEntity<Language> getLanguage(@PathVariable String code) {
        Language language = localizationService.getLanguage(code);
        return ResponseEntity.ok(language);
    }

    @PostMapping("/languages")
    public ResponseEntity<Language> createLanguage(@RequestBody Language language) {
        Language created = localizationService.createLanguage(language);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/languages/{id}")
    public ResponseEntity<Language> updateLanguage(@PathVariable Long id, @RequestBody Language language) {
        Language updated = localizationService.updateLanguage(id, language);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/languages/{id}")
    public ResponseEntity<Map<String, Object>> deleteLanguage(@PathVariable Long id) {
        Map<String, Object> result = localizationService.deleteLanguage(id);
        return ResponseEntity.ok(result);
    }

    // Translation Management
    @GetMapping("/translations")
    public ResponseEntity<List<Translation>> getTranslations(
            @RequestParam(required = false) String languageCode,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String key) {
        List<Translation> translations = localizationService.getTranslations(languageCode, category, key);
        return ResponseEntity.ok(translations);
    }

    @GetMapping("/translations/export")
    public ResponseEntity<Map<String, Object>> exportTranslations(
            @RequestParam String languageCode,
            @RequestParam(defaultValue = "JSON") String format) {
        Map<String, Object> translations = localizationService.exportTranslations(languageCode, format);
        return ResponseEntity.ok(translations);
    }

    @PostMapping("/translations/import")
    public ResponseEntity<Map<String, Object>> importTranslations(@RequestBody Map<String, Object> importData) {
        Map<String, Object> result = localizationService.importTranslations(importData);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/translations")
    public ResponseEntity<Translation> createTranslation(@RequestBody Translation translation) {
        Translation created = localizationService.createTranslation(translation);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/translations/{id}")
    public ResponseEntity<Translation> updateTranslation(@PathVariable Long id, @RequestBody Translation translation) {
        Translation updated = localizationService.updateTranslation(id, translation);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/translations/{id}")
    public ResponseEntity<Map<String, Object>> deleteTranslation(@PathVariable Long id) {
        Map<String, Object> result = localizationService.deleteTranslation(id);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/translations/bulk")
    public ResponseEntity<Map<String, Object>> bulkUpdateTranslations(@RequestBody List<Translation> translations) {
        Map<String, Object> result = localizationService.bulkUpdateTranslations(translations);
        return ResponseEntity.ok(result);
    }

    // Locale Configuration
    @GetMapping("/locales")
    public ResponseEntity<List<LocaleConfig>> getLocaleConfigurations() {
        List<LocaleConfig> locales = localizationService.getLocaleConfigurations();
        return ResponseEntity.ok(locales);
    }

    @GetMapping("/locales/{code}")
    public ResponseEntity<LocaleConfig> getLocaleConfiguration(@PathVariable String code) {
        LocaleConfig locale = localizationService.getLocaleConfiguration(code);
        return ResponseEntity.ok(locale);
    }

    @PostMapping("/locales")
    public ResponseEntity<LocaleConfig> createLocaleConfiguration(@RequestBody LocaleConfig localeConfig) {
        LocaleConfig created = localizationService.createLocaleConfiguration(localeConfig);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/locales/{id}")
    public ResponseEntity<LocaleConfig> updateLocaleConfiguration(@PathVariable Long id, @RequestBody LocaleConfig localeConfig) {
        LocaleConfig updated = localizationService.updateLocaleConfiguration(id, localeConfig);
        return ResponseEntity.ok(updated);
    }

    // Currency Localization
    @GetMapping("/currencies")
    public ResponseEntity<List<CurrencyLocalization>> getCurrencyLocalizations() {
        List<CurrencyLocalization> currencies = localizationService.getCurrencyLocalizations();
        return ResponseEntity.ok(currencies);
    }

    @GetMapping("/currencies/{code}")
    public ResponseEntity<CurrencyLocalization> getCurrencyLocalization(@PathVariable String code) {
        CurrencyLocalization currency = localizationService.getCurrencyLocalization(code);
        return ResponseEntity.ok(currency);
    }

    @PostMapping("/currencies/format")
    public ResponseEntity<Map<String, Object>> formatCurrency(@RequestBody Map<String, Object> formatRequest) {
        Map<String, Object> result = localizationService.formatCurrency(formatRequest);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/currencies")
    public ResponseEntity<CurrencyLocalization> createCurrencyLocalization(@RequestBody CurrencyLocalization currency) {
        CurrencyLocalization created = localizationService.createCurrencyLocalization(currency);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/currencies/{id}")
    public ResponseEntity<CurrencyLocalization> updateCurrencyLocalization(@PathVariable Long id, @RequestBody CurrencyLocalization currency) {
        CurrencyLocalization updated = localizationService.updateCurrencyLocalization(id, currency);
        return ResponseEntity.ok(updated);
    }

    // Date/Time Localization
    @GetMapping("/datetime/formats")
    public ResponseEntity<List<DateTimeFormat>> getDateTimeFormats() {
        List<DateTimeFormat> formats = localizationService.getDateTimeFormats();
        return ResponseEntity.ok(formats);
    }

    @PostMapping("/datetime/format")
    public ResponseEntity<Map<String, Object>> formatDateTime(@RequestBody Map<String, Object> formatRequest) {
        Map<String, Object> result = localizationService.formatDateTime(formatRequest);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/datetime/formats")
    public ResponseEntity<DateTimeFormat> createDateTimeFormat(@RequestBody DateTimeFormat dateTimeFormat) {
        DateTimeFormat created = localizationService.createDateTimeFormat(dateTimeFormat);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/datetime/formats/{id}")
    public ResponseEntity<DateTimeFormat> updateDateTimeFormat(@PathVariable Long id, @RequestBody DateTimeFormat dateTimeFormat) {
        DateTimeFormat updated = localizationService.updateDateTimeFormat(id, dateTimeFormat);
        return ResponseEntity.ok(updated);
    }

    // Regional Compliance
    @GetMapping("/compliance")
    public ResponseEntity<List<RegionalCompliance>> getRegionalCompliance() {
        List<RegionalCompliance> compliance = localizationService.getRegionalCompliance();
        return ResponseEntity.ok(compliance);
    }

    @GetMapping("/compliance/{countryCode}")
    public ResponseEntity<RegionalCompliance> getRegionalCompliance(@PathVariable String countryCode) {
        RegionalCompliance compliance = localizationService.getRegionalCompliance(countryCode);
        return ResponseEntity.ok(compliance);
    }

    @PostMapping("/compliance")
    public ResponseEntity<RegionalCompliance> createRegionalCompliance(@RequestBody RegionalCompliance compliance) {
        RegionalCompliance created = localizationService.createRegionalCompliance(compliance);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/compliance/{id}")
    public ResponseEntity<RegionalCompliance> updateRegionalCompliance(@PathVariable Long id, @RequestBody RegionalCompliance compliance) {
        RegionalCompliance updated = localizationService.updateRegionalCompliance(id, compliance);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/compliance/{countryCode}/validate")
    public ResponseEntity<Map<String, Object>> validateCompliance(
            @PathVariable String countryCode,
            @RequestParam String dataType,
            @RequestParam String value) {
        Map<String, Object> result = localizationService.validateCompliance(countryCode, dataType, value);
        return ResponseEntity.ok(result);
    }

    // User Preferences
    @GetMapping("/preferences/{userId}")
    public ResponseEntity<UserLocalizationPreference> getUserPreferences(@PathVariable Long userId) {
        UserLocalizationPreference preferences = localizationService.getUserPreferences(userId);
        return ResponseEntity.ok(preferences);
    }

    @PostMapping("/preferences")
    public ResponseEntity<UserLocalizationPreference> createUserPreferences(@RequestBody UserLocalizationPreference preferences) {
        UserLocalizationPreference created = localizationService.createUserPreferences(preferences);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/preferences/{userId}")
    public ResponseEntity<UserLocalizationPreference> updateUserPreferences(@PathVariable Long userId, @RequestBody UserLocalizationPreference preferences) {
        UserLocalizationPreference updated = localizationService.updateUserPreferences(userId, preferences);
        return ResponseEntity.ok(updated);
    }

    // Translation Statistics
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getTranslationStatistics() {
        Map<String, Object> statistics = localizationService.getTranslationStatistics();
        return ResponseEntity.ok(statistics);
    }

    @GetMapping("/statistics/{languageCode}")
    public ResponseEntity<Map<String, Object>> getLanguageStatistics(@PathVariable String languageCode) {
        Map<String, Object> statistics = localizationService.getLanguageStatistics(languageCode);
        return ResponseEntity.ok(statistics);
    }

    // Translation Validation
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateTranslations(@RequestBody Map<String, Object> validationRequest) {
        Map<String, Object> result = localizationService.validateTranslations(validationRequest);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/auto-translate")
    public ResponseEntity<Map<String, Object>> autoTranslate(@RequestBody Map<String, Object> translateRequest) {
        Map<String, Object> result = localizationService.autoTranslate(translateRequest);
        return ResponseEntity.ok(result);
    }

    // Localization Testing
    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> testLocalization(@RequestBody Map<String, Object> testRequest) {
        Map<String, Object> result = localizationService.testLocalization(testRequest);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/missing-translations")
    public ResponseEntity<List<Map<String, Object>>> getMissingTranslations(
            @RequestParam String languageCode,
            @RequestParam(required = false) String category) {
        List<Map<String, Object>> missing = localizationService.getMissingTranslations(languageCode, category);
        return ResponseEntity.ok(missing);
    }

    // Content Localization
    @PostMapping("/content/localize")
    public ResponseEntity<Map<String, Object>> localizeContent(@RequestBody Map<String, Object> contentRequest) {
        Map<String, Object> result = localizationService.localizeContent(contentRequest);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/content/templates")
    public ResponseEntity<List<LocalizedTemplate>> getLocalizedTemplates(
            @RequestParam(required = false) String languageCode,
            @RequestParam(required = false) String templateType) {
        List<LocalizedTemplate> templates = localizationService.getLocalizedTemplates(languageCode, templateType);
        return ResponseEntity.ok(templates);
    }

    @PostMapping("/content/templates")
    public ResponseEntity<LocalizedTemplate> createLocalizedTemplate(@RequestBody LocalizedTemplate template) {
        LocalizedTemplate created = localizationService.createLocalizedTemplate(template);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/content/templates/{id}")
    public ResponseEntity<LocalizedTemplate> updateLocalizedTemplate(@PathVariable Long id, @RequestBody LocalizedTemplate template) {
        LocalizedTemplate updated = localizationService.updateLocalizedTemplate(id, template);
        return ResponseEntity.ok(updated);
    }
}