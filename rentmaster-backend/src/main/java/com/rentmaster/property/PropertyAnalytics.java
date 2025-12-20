package com.rentmaster.property;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "property_analytics")
public class PropertyAnalytics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "property_id", nullable = false)
    private Long propertyId;

    @Column(name = "metric_type")
    @Enumerated(EnumType.STRING)
    private MetricType metricType;

    @Column(name = "metric_date")
    private LocalDate metricDate;

    @Column(name = "value")
    private Double value;

    @Column(name = "unit")
    private String unit;

    @Column(name = "period_type")
    @Enumerated(EnumType.STRING)
    private PeriodType periodType;

    @Column(name = "year")
    private Integer year;

    @Column(name = "month")
    private Integer month;

    @Column(name = "quarter")
    private Integer quarter;

    @Column(name = "notes")
    private String notes;

    @Column(name = "calculated_at")
    private LocalDateTime calculatedAt;

    @Column(name = "calculated_by")
    private String calculatedBy;

    public enum MetricType {
        OCCUPANCY_RATE, RENTAL_INCOME, MAINTENANCE_COST, 
        VACANCY_DAYS, TENANT_TURNOVER, ROI, NOI, 
        CASH_FLOW, EXPENSE_RATIO, RENT_PER_SQFT, 
        UTILITY_COST, INSURANCE_COST, TAX_COST, 
        MARKETING_COST, REPAIR_COST, PROFIT_MARGIN,
        AVERAGE_RENT, MARKET_RENT, RENT_GROWTH,
        TENANT_SATISFACTION, MAINTENANCE_REQUESTS,
        ENERGY_EFFICIENCY, PROPERTY_VALUE
    }

    public enum PeriodType {
        DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY
    }

    // Constructors
    public PropertyAnalytics() {
        this.calculatedAt = LocalDateTime.now();
        this.metricDate = LocalDate.now();
    }

    public PropertyAnalytics(Long propertyId, MetricType metricType, Double value) {
        this();
        this.propertyId = propertyId;
        this.metricType = metricType;
        this.value = value;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPropertyId() { return propertyId; }
    public void setPropertyId(Long propertyId) { this.propertyId = propertyId; }

    public MetricType getMetricType() { return metricType; }
    public void setMetricType(MetricType metricType) { this.metricType = metricType; }

    public LocalDate getMetricDate() { return metricDate; }
    public void setMetricDate(LocalDate metricDate) { this.metricDate = metricDate; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public PeriodType getPeriodType() { return periodType; }
    public void setPeriodType(PeriodType periodType) { this.periodType = periodType; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Integer getMonth() { return month; }
    public void setMonth(Integer month) { this.month = month; }

    public Integer getQuarter() { return quarter; }
    public void setQuarter(Integer quarter) { this.quarter = quarter; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(LocalDateTime calculatedAt) { this.calculatedAt = calculatedAt; }

    public String getCalculatedBy() { return calculatedBy; }
    public void setCalculatedBy(String calculatedBy) { this.calculatedBy = calculatedBy; }
}