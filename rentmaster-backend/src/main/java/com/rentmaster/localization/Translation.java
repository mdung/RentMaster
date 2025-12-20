package com.rentmaster.localization;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "translations", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"language_code", "category", "translation_key"}))
public class Translation {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "language_code", nullable = false, length = 10)
    private String languageCode;
    
    @Column(name = "category", nullable = false, length = 100)
    private String category; // e.g., "common", "dashboard", "properties", "tenants"
    
    @Column(name = "translation_key", nullable = false, length = 200)
    private String key; // e.g., "dashboard.title", "common.save", "properties.add"
    
    @Column(name = "value", columnDefinition = "TEXT")
    private String value; // The translated text
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description; // Context or description for translators
    
    @Column(name = "context", columnDefinition = "TEXT")
    private String context; // Additional context information
    
    @Column(name = "is_plural")
    private boolean isPlural = false;
    
    @Column(name = "plural_forms", columnDefinition = "TEXT")
    private String pluralForms; // JSON string for plural forms
    
    @Column(name = "is_approved")
    private boolean isApproved = false;
    
    @Column(name = "needs_review")
    private boolean needsReview = false;
    
    @Column(name = "is_auto_translated")
    private boolean isAutoTranslated = false;
    
    @Column(name = "source_text", columnDefinition = "TEXT")
    private String sourceText; // Original text in source language
    
    @Column(name = "translator_notes", columnDefinition = "TEXT")
    private String translatorNotes;
    
    @Column(name = "character_limit")
    private Integer characterLimit;
    
    @Column(name = "tags")
    private String tags; // Comma-separated tags
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "updated_by")
    private String updatedBy;
    
    @Column(name = "approved_by")
    private String approvedBy;
    
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    // Constructors
    public Translation() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Translation(String languageCode, String category, String key, String value) {
        this();
        this.languageCode = languageCode;
        this.category = category;
        this.key = key;
        this.value = value;
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

    public String getLanguageCode() {
        return languageCode;
    }

    public void setLanguageCode(String languageCode) {
        this.languageCode = languageCode;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }

    public boolean isPlural() {
        return isPlural;
    }

    public void setPlural(boolean plural) {
        isPlural = plural;
    }

    public String getPluralForms() {
        return pluralForms;
    }

    public void setPluralForms(String pluralForms) {
        this.pluralForms = pluralForms;
    }

    public boolean isApproved() {
        return isApproved;
    }

    public void setApproved(boolean approved) {
        isApproved = approved;
    }

    public boolean isNeedsReview() {
        return needsReview;
    }

    public void setNeedsReview(boolean needsReview) {
        this.needsReview = needsReview;
    }

    public boolean isAutoTranslated() {
        return isAutoTranslated;
    }

    public void setAutoTranslated(boolean autoTranslated) {
        isAutoTranslated = autoTranslated;
    }

    public String getSourceText() {
        return sourceText;
    }

    public void setSourceText(String sourceText) {
        this.sourceText = sourceText;
    }

    public String getTranslatorNotes() {
        return translatorNotes;
    }

    public void setTranslatorNotes(String translatorNotes) {
        this.translatorNotes = translatorNotes;
    }

    public Integer getCharacterLimit() {
        return characterLimit;
    }

    public void setCharacterLimit(Integer characterLimit) {
        this.characterLimit = characterLimit;
    }

    public String getTags() {
        return tags;
    }

    public void setTags(String tags) {
        this.tags = tags;
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

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public LocalDateTime getApprovedAt() {
        return approvedAt;
    }

    public void setApprovedAt(LocalDateTime approvedAt) {
        this.approvedAt = approvedAt;
    }

    @Override
    public String toString() {
        return "Translation{" +
                "id=" + id +
                ", languageCode='" + languageCode + '\'' +
                ", category='" + category + '\'' +
                ", key='" + key + '\'' +
                ", value='" + value + '\'' +
                '}';
    }
}