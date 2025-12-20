package com.rentmaster.localization;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "datetime_formats")
public class DateTimeFormat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, length = 100)
    private String name; // e.g., "US Format", "Vietnamese Format"
    
    @Column(name = "locale_code", nullable = false, length = 20)
    private String localeCode; // e.g., "en-US", "vi-VN"
    
    @Column(name = "date_pattern", nullable = false, length = 50)
    private String datePattern; // e.g., "MM/dd/yyyy", "dd/MM/yyyy"
    
    @Column(name = "time_pattern", nullable = false, length = 50)
    private String timePattern; // e.g., "HH:mm:ss", "h:mm:ss a"
    
    @Column(name = "datetime_pattern", nullable = false, length = 100)
    private String dateTimePattern; // e.g., "MM/dd/yyyy HH:mm:ss"
    
    @Column(name = "short_date_pattern", length = 50)
    private String shortDatePattern; // e.g., "M/d/yy"
    
    @Column(name = "long_date_pattern", length = 100)
    private String longDatePattern; // e.g., "EEEE, MMMM d, yyyy"
    
    @Column(name = "short_time_pattern", length = 50)
    private String shortTimePattern; // e.g., "HH:mm"
    
    @Column(name = "long_time_pattern", length = 50)
    private String longTimePattern; // e.g., "HH:mm:ss z"
    
    @Column(name = "month_names", columnDefinition = "TEXT")
    private String monthNames; // JSON array of month names
    
    @Column(name = "short_month_names", columnDefinition = "TEXT")
    private String shortMonthNames; // JSON array of short month names
    
    @Column(name = "day_names", columnDefinition = "TEXT")
    private String dayNames; // JSON array of day names
    
    @Column(name = "short_day_names", columnDefinition = "TEXT")
    private String shortDayNames; // JSON array of short day names
    
    @Column(name = "am_pm_designators", length = 50)
    private String amPmDesignators; // e.g., "AM,PM" or "SA,CH"
    
    @Column(name = "first_day_of_week")
    private Integer firstDayOfWeek = 1; // 1 = Monday, 7 = Sunday
    
    @Column(name = "calendar_week_rule", length = 20)
    private String calendarWeekRule = "FIRST_DAY"; // FIRST_DAY, FIRST_FULL_WEEK, etc.
    
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
    public DateTimeFormat() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public DateTimeFormat(String name, String localeCode, String datePattern, String timePattern) {
        this();
        this.name = name;
        this.localeCode = localeCode;
        this.datePattern = datePattern;
        this.timePattern = timePattern;
        this.dateTimePattern = datePattern + " " + timePattern;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocaleCode() {
        return localeCode;
    }

    public void setLocaleCode(String localeCode) {
        this.localeCode = localeCode;
    }

    public String getDatePattern() {
        return datePattern;
    }

    public void setDatePattern(String datePattern) {
        this.datePattern = datePattern;
    }

    public String getTimePattern() {
        return timePattern;
    }

    public void setTimePattern(String timePattern) {
        this.timePattern = timePattern;
    }

    public String getDateTimePattern() {
        return dateTimePattern;
    }

    public void setDateTimePattern(String dateTimePattern) {
        this.dateTimePattern = dateTimePattern;
    }

    public String getShortDatePattern() {
        return shortDatePattern;
    }

    public void setShortDatePattern(String shortDatePattern) {
        this.shortDatePattern = shortDatePattern;
    }

    public String getLongDatePattern() {
        return longDatePattern;
    }

    public void setLongDatePattern(String longDatePattern) {
        this.longDatePattern = longDatePattern;
    }

    public String getShortTimePattern() {
        return shortTimePattern;
    }

    public void setShortTimePattern(String shortTimePattern) {
        this.shortTimePattern = shortTimePattern;
    }

    public String getLongTimePattern() {
        return longTimePattern;
    }

    public void setLongTimePattern(String longTimePattern) {
        this.longTimePattern = longTimePattern;
    }

    public String getMonthNames() {
        return monthNames;
    }

    public void setMonthNames(String monthNames) {
        this.monthNames = monthNames;
    }

    public String getShortMonthNames() {
        return shortMonthNames;
    }

    public void setShortMonthNames(String shortMonthNames) {
        this.shortMonthNames = shortMonthNames;
    }

    public String getDayNames() {
        return dayNames;
    }

    public void setDayNames(String dayNames) {
        this.dayNames = dayNames;
    }

    public String getShortDayNames() {
        return shortDayNames;
    }

    public void setShortDayNames(String shortDayNames) {
        this.shortDayNames = shortDayNames;
    }

    public String getAmPmDesignators() {
        return amPmDesignators;
    }

    public void setAmPmDesignators(String amPmDesignators) {
        this.amPmDesignators = amPmDesignators;
    }

    public Integer getFirstDayOfWeek() {
        return firstDayOfWeek;
    }

    public void setFirstDayOfWeek(Integer firstDayOfWeek) {
        this.firstDayOfWeek = firstDayOfWeek;
    }

    public String getCalendarWeekRule() {
        return calendarWeekRule;
    }

    public void setCalendarWeekRule(String calendarWeekRule) {
        this.calendarWeekRule = calendarWeekRule;
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
        return "DateTimeFormat{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", localeCode='" + localeCode + '\'' +
                ", datePattern='" + datePattern + '\'' +
                ", timePattern='" + timePattern + '\'' +
                '}';
    }
}