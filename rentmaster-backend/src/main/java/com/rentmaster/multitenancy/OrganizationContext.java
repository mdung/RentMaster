package com.rentmaster.multitenancy;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Component
@RequestScope
public class OrganizationContext {
    private Long organizationId;
    private Organization organization;

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
        if (organization != null) {
            this.organizationId = organization.getId();
        }
    }

    public void clear() {
        this.organizationId = null;
        this.organization = null;
    }
}


