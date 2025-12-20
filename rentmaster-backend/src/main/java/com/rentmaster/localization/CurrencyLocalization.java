package com.rentmaster.localization;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "currency_localizations")
public class CurrencyLocalization {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "code", unique = true, nullable = false, length = 10)
    private String code; // e.g., "USD", "VND", "EUR"
    
    @Column(name = "name", nullable = false, length = 100)
    private String name; // e.g., "US Dollar", "Vietnamese Dong"
    
    @Column(name = "symbol", nullable = false, length = 10)
    private String symbol; // e.g., "$", "₫", "€"
    
    @Column(name = "symbol_position", length = 10)
    private String symbolPosition = "BEFORE"; // "BEFORE" or "AFTER"
    
    @Column(name = "decimal_places")
    private Integer decimalPlaces = 2;
    
    @Column(name = "decimal_separator", length = 5)
    private String decimalSeparator = ".";
    
    @Column(name = "thousands_separator", length = 5)
    private String thousandsSeparator = ",";
    
    @Column(name = "space_between_symbol")
    private boolean spaceBetweenSymbol = false;
    
    @Column(name = "negative_format", length = 20)
    private String negativeFormat = "PARENTHESES"; // "PARENTHESES", "MINUS_SIGN"
    
    @Column(name = "rounding_mode", length = 20)
    private String roundingMode = "HALF_UP"; // HALF_UP, HALF_DOWN, etc.
    
    @Column(name = "exchange_rate")
    private Double exchangeRate = 1.0; // Rate to base currency (USD)
    
    @Column(name = "is_base_currency")
    private boolean isBaseCurrency = false;
    
    @Column(name = "active")
    private boolean active = true;
    
    @Column(name = "country_codes", length = 200)
    private String countryCodes; // Comma-separated country codes where this currency is used
    
    @Column(name = "format_template", length = 100)
    private String formatTemplate; // e.g., "{symbol}{amount}", "{amount} {symbol}"
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "updated_by")
    private String updatedBy;

    // Constructors
    public CurrencyLocalization() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public CurrencyLocalization(String code, String name, String symbol) {
        this();
        this.code = code;
        this.name = name;
        this.symbol = symbol;
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

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getSymbolPosition() {
        return symbolPosition;
    }

    public void setSymbolPosition(String symbolPosition) {
        this.symbolPosition = symbolPosition;
    }

    public Integer getDecimalPlaces() {
        return decimalPlaces;
    }

    public void setDecimalPlaces(Integer decimalPlaces) {
        this.decimalPlaces = decimalPlaces;
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

    public boolean isSpaceBetweenSymbol() {
        return spaceBetweenSymbol;
    }

    public void setSpaceBetweenSymbol(boolean spaceBetweenSymbol) {
        this.spaceBetweenSymbol = spaceBetweenSymbol;
    }

    public String getNegativeFormat() {
        return negativeFormat;
    }

    public void setNegativeFormat(String negativeFormat) {
        this.negativeFormat = negativeFormat;
    }

    public String getRoundingMode() {
        return roundingMode;
    }

    public void setRoundingMode(String roundingMode) {
        this.roundingMode = roundingMode;
    }

    public Double getExchangeRate() {
        return exchangeRate;
    }

    public void setExchangeRate(Double exchangeRate) {
        this.exchangeRate = exchangeRate;
    }

    public boolean isBaseCurrency() {
        return isBaseCurrency;
    }

    public void setBaseCurrency(boolean baseCurrency) {
        isBaseCurrency = baseCurrency;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public String getCountryCodes() {
        return countryCodes;
    }

    public void setCountryCodes(String countryCodes) {
        this.countryCodes = countryCodes;
    }

    public String getFormatTemplate() {
        return formatTemplate;
    }

    public void setFormatTemplate(String formatTemplate) {
        this.formatTemplate = formatTemplate;
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
        return "CurrencyLocalization{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", name='" + name + '\'' +
                ", symbol='" + symbol + '\'' +
                '}';
    }
}