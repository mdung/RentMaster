package com.rentmaster.localization;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "locale_configs")
public class LocaleConfig {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "code", unique = true, nullable = false, length = 20)
    private String code; // e.g., "en-US", "vi-VN"
    
    @Column(name = "name", nullable = false, length = 100)
    private String name; // e.g., "English (United States)", "Vietnamese (Vietnam)"
    
    @Column(name = "language_code", nullable = false, length = 10)
    private String languageCode; // e.g., "en", "vi"
    
    @Column(name = "country_code", nullable = false, length = 10)
    private String countryCode; // e.g., "US", "VN"
    
    @Column(name = "currency_code", length = 10)
    private String currencyCode; // e.g., "USD", "VND"
    
    @Column(name = "time_zone", length = 50)
    private String timeZone; // e.g., "America/New_York", "Asia/Ho_Chi_Minh"
    
    @Column(name = "date_format", length = 50)
    private String dateFormat; // e.g., "MM/dd/yyyy", "dd/MM/yyyy"
    
    @Column(name = "time_format", length = 50)
    private String timeFormat; // e.g., "HH:mm", "h:mm a"
    
    @Column(name = "number_format", length = 50)
    private String numberFormat; // e.g., "#,##0.00", "#.##0,00"
    
    @Column(name = "decimal_separator", length = 5)
    private String decimalSeparator = ".";
    
    @Column(name = "thousands_separator", length = 5)
    private String thousandsSeparator = ",";
    
    @Column(name = "first_day_of_week")
    private Integer firstDayOfWeek = 1; // 1 = Monday, 7 = Sunday
    
    @Column(name = "weekend_days", length = 20)
    private String weekendDays = "6,7"; // Comma-separated day numbers
    
    @Column(name = "calendar_type", length = 20)
    private String calendarType = "GREGORIAN"; // GREGORIAN, LUNAR, etc.
    
    @Column(name = "measurement_system", length = 20)
    private String measurementSystem = "METRIC"; // METRIC, IMPERIAL
    
    @Column(name = "paper_size", length = 10)
    private String paperSize = "A4"; // A4, LETTER, etc.
    
    @Column(name = "active")
    private boolean active = true;
    
    @Column(name = "is_default")
    private boolean isDefault = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "updated_by")
    private String updatedBy;

    // Constructors
    public LocaleConfig() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public LocaleConfig(String code, String name, String languageCode, String countryCode) {
        this();
        this.code = code;
        this.name = name;
        this.languageCode = languageCode;
        this.countryCode = countryCode;
    }

    // Lifecycle callbacks
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLanguageCode() {
        return languageCode;
    }

    public void setLanguageCode(String languageCode) {
        this.languageCode = languageCode;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getCurrencyCode() {
        return currencyCode;
    }

    public void setCurrencyCode(String currencyCode) {
        this.currencyCode = currencyCode;
    }

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    public String getDateFormat() {
        return dateFormat;
    }

    public void setDateFormat(String dateFormat) {
        this.dateFormat = dateFormat;
    }

    public String getTimeFormat() {
        return timeFormat;
    }

    public void setTimeFormat(String timeFormat) {
        this.timeFormat = timeFormat;
    }

    public String getNumberFormat() {
        return numberFormat;
    }

    public void setNumberFormat(String numberFormat) {
        this.numberFormat = numberFormat;
    }

    public String getDecimalSeparator() {
        return decimalSeparator;
    }

    public void setDecimalSeparator(String decimalSeparator) {
        this.decimalSeparator = decimalSeparator;
    }

    public String getThousandsSeparator() {
        return thousandsSeparator;
    }

    public void setThousandsSeparator(String thousandsSeparator) {
        this.thousandsSeparator = thousandsSeparator;
    }

    public Integer getFirstDayOfWeek() {
        return firstDayOfWeek;
    }

    public void setFirstDayOfWeek(Integer firstDayOfWeek) {
        this.firstDayOfWeek = firstDayOfWeek;
    }

    public String getWeekendDays() {
        return weekendDays;
    }

    public void setWeekendDays(String weekendDays) {
        this.weekendDays = weekendDays;
    }

    public String getCalendarType() {
        return calendarType;
    }

    public void setCalendarType(String calendarType) {
        this.calendarType = calendarType;
    }

    public String getMeasurementSystem() {
        return measurementSystem;
    }

    public void setMeasurementSystem(String measurementSystem) {
        this.measurementSystem = measurementSystem;
    }

    public String getPaperSize() {
        return paperSize;
    }

    public void setPaperSize(String paperSize) {
        this.paperSize = paperSize;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean isDefault) {
        this.isDefault = isDefault;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }

    @Override
    public String toString() {
        return "LocaleConfig{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", languageCode='" + languageCode + '\'' +
                ", countryCode='" + countryCode + '\'' +
                '}';
    }
}