package com.rentmaster.automation;

import jakarta.persistence.*;
import java.util.List;

@Embeddable
public class RecurringInvoiceTemplate {
    @Column(name = "include_rent", nullable = false)
    private Boolean includeRent = true;

    @Column(name = "include_services", nullable = false)
    private Boolean includeServices = true;

    @ElementCollection
    @CollectionTable(name = "recurring_invoice_service_ids", joinColumns = @JoinColumn(name = "recurring_invoice_id"))
    @Column(name = "service_id")
    private List<Long> serviceIds;

    @ElementCollection
    @CollectionTable(name = "recurring_invoice_custom_items", joinColumns = @JoinColumn(name = "recurring_invoice_id"))
    private List<RecurringInvoiceItem> customItems;

    @Column(name = "days_until_due", nullable = false)
    private Integer daysUntilDue = 7;

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    // Constructors
    public RecurringInvoiceTemplate() {}

    public RecurringInvoiceTemplate(Boolean includeRent, Boolean includeServices, Integer daysUntilDue) {
        this.includeRent = includeRent;
        this.includeServices = includeServices;
        this.daysUntilDue = daysUntilDue;
    }

    // Getters and Setters
    public Boolean getIncludeRent() {
        return includeRent;
    }

    public void setIncludeRent(Boolean includeRent) {
        this.includeRent = includeRent;
    }

    public Boolean getIncludeServices() {
        return includeServices;
    }

    public void setIncludeServices(Boolean includeServices) {
        this.includeServices = includeServices;
    }

    public List<Long> getServiceIds() {
        return serviceIds;
    }

    public void setServiceIds(List<Long> serviceIds) {
        this.serviceIds = serviceIds;
    }

    public List<RecurringInvoiceItem> getCustomItems() {
        return customItems;
    }

    public void setCustomItems(List<RecurringInvoiceItem> customItems) {
        this.customItems = customItems;
    }

    public Integer getDaysUntilDue() {
        return daysUntilDue;
    }

    public void setDaysUntilDue(Integer daysUntilDue) {
        this.daysUntilDue = daysUntilDue;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}