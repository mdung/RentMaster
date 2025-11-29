package com.rentmaster.billing;

import jakarta.persistence.*;

@Entity
@Table(name = "invoice_items")
public class InvoiceItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id")
    private Service service;

    @Column(length = 500)
    private String description;

    @Column
    private Double quantity = 1.0;

    @Column(name = "unit_price")
    private Double unitPrice;

    @Column(nullable = false)
    private Double amount;

    @Column(name = "prev_index")
    private Double prevIndex;

    @Column(name = "current_index")
    private Double currentIndex;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Invoice getInvoice() {
        return invoice;
    }

    public void setInvoice(Invoice invoice) {
        this.invoice = invoice;
    }

    public Service getService() {
        return service;
    }

    public void setService(Service service) {
        this.service = service;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getPrevIndex() {
        return prevIndex;
    }

    public void setPrevIndex(Double prevIndex) {
        this.prevIndex = prevIndex;
    }

    public Double getCurrentIndex() {
        return currentIndex;
    }

    public void setCurrentIndex(Double currentIndex) {
        this.currentIndex = currentIndex;
    }
}

