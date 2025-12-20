package com.rentmaster.multitenancy;

import com.rentmaster.multitenancy.dto.OrganizationCreateDTO;
import com.rentmaster.multitenancy.dto.OrganizationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    public List<OrganizationDTO> findAll() {
        return organizationRepository.findAll().stream()
                .map(OrganizationDTO::new)
                .collect(Collectors.toList());
    }

    public OrganizationDTO findById(Long id) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        return new OrganizationDTO(org);
    }

    public OrganizationDTO findByCode(String code) {
        Organization org = organizationRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        return new OrganizationDTO(org);
    }

    public OrganizationDTO create(OrganizationCreateDTO dto) {
        if (organizationRepository.existsByCode(dto.getCode())) {
            throw new RuntimeException("Organization code already exists");
        }

        Organization org = new Organization();
        org.setCode(dto.getCode());
        org.setName(dto.getName());
        org.setDisplayName(dto.getDisplayName() != null ? dto.getDisplayName() : dto.getName());
        org.setDescription(dto.getDescription());
        org.setType(dto.getType() != null ? dto.getType() : Organization.OrganizationType.INDIVIDUAL_LANDLORD);
        org.setStatus(Organization.OrganizationStatus.ACTIVE);
        org.setContactEmail(dto.getContactEmail());
        org.setContactPhone(dto.getContactPhone());
        org.setWebsiteUrl(dto.getWebsiteUrl());
        org.setAddress(dto.getAddress());
        org.setCity(dto.getCity());
        org.setState(dto.getState());
        org.setPostalCode(dto.getPostalCode());
        org.setCountry(dto.getCountry());
        org.setSubscriptionPlan(dto.getSubscriptionPlan() != null ? dto.getSubscriptionPlan() : Organization.SubscriptionPlan.BASIC);
        org.setMaxProperties(dto.getMaxProperties());
        org.setMaxUsers(dto.getMaxUsers());
        org.setMaxTenants(dto.getMaxTenants());
        org.setLogoUrl(dto.getLogoUrl());
        org.setPrimaryColor(dto.getPrimaryColor());
        org.setSecondaryColor(dto.getSecondaryColor());
        org.setCreatedAt(LocalDateTime.now());
        org.setUpdatedAt(LocalDateTime.now());

        Organization saved = organizationRepository.save(org);
        return new OrganizationDTO(saved);
    }

    public OrganizationDTO update(Long id, OrganizationCreateDTO dto) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        if (dto.getName() != null) org.setName(dto.getName());
        if (dto.getDisplayName() != null) org.setDisplayName(dto.getDisplayName());
        if (dto.getDescription() != null) org.setDescription(dto.getDescription());
        if (dto.getContactEmail() != null) org.setContactEmail(dto.getContactEmail());
        if (dto.getContactPhone() != null) org.setContactPhone(dto.getContactPhone());
        if (dto.getWebsiteUrl() != null) org.setWebsiteUrl(dto.getWebsiteUrl());
        if (dto.getAddress() != null) org.setAddress(dto.getAddress());
        if (dto.getCity() != null) org.setCity(dto.getCity());
        if (dto.getState() != null) org.setState(dto.getState());
        if (dto.getPostalCode() != null) org.setPostalCode(dto.getPostalCode());
        if (dto.getCountry() != null) org.setCountry(dto.getCountry());
        if (dto.getLogoUrl() != null) org.setLogoUrl(dto.getLogoUrl());
        if (dto.getPrimaryColor() != null) org.setPrimaryColor(dto.getPrimaryColor());
        if (dto.getSecondaryColor() != null) org.setSecondaryColor(dto.getSecondaryColor());
        org.setUpdatedAt(LocalDateTime.now());

        Organization saved = organizationRepository.save(org);
        return new OrganizationDTO(saved);
    }

    public void delete(Long id) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        org.setStatus(Organization.OrganizationStatus.INACTIVE);
        org.setDeletedAt(LocalDateTime.now());
        organizationRepository.save(org);
    }

    public OrganizationDTO toggleStatus(Long id) {
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        if (org.getStatus() == Organization.OrganizationStatus.ACTIVE) {
            org.setStatus(Organization.OrganizationStatus.INACTIVE);
        } else {
            org.setStatus(Organization.OrganizationStatus.ACTIVE);
        }
        org.setUpdatedAt(LocalDateTime.now());
        
        Organization saved = organizationRepository.save(org);
        return new OrganizationDTO(saved);
    }
}


