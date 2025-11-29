package com.rentmaster.property.dto;

import java.time.Instant;

public class PropertyDTO {
    private Long id;
    private String name;
    private String address;
    private String description;
    private Instant createdAt;

    public PropertyDTO() {
    }

    public PropertyDTO(Long id, String name, String address, String description, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.description = description;
        this.createdAt = createdAt;
    }

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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

