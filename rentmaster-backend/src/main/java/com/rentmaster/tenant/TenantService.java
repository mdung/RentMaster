package com.rentmaster.tenant;

import com.rentmaster.tenant.dto.TenantCreateDTO;
import com.rentmaster.tenant.dto.TenantDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TenantService {

    @Autowired
    private TenantRepository tenantRepository;

    public List<TenantDTO> findAll() {
        return tenantRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TenantDTO findById(Long id) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        return toDTO(tenant);
    }

    public List<TenantDTO> search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return findAll();
        }
        return tenantRepository.findByFullNameContainingIgnoreCase(query).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public TenantDTO create(TenantCreateDTO dto) {
        Tenant tenant = new Tenant();
        tenant.setFullName(dto.getFullName());
        tenant.setPhone(dto.getPhone());
        tenant.setEmail(dto.getEmail());
        tenant.setIdNumber(dto.getIdNumber());
        tenant.setAddress(dto.getAddress());
        tenant.setEmergencyContact(dto.getEmergencyContact());
        Tenant saved = tenantRepository.save(tenant);
        return toDTO(saved);
    }

    public TenantDTO update(Long id, TenantCreateDTO dto) {
        Tenant tenant = tenantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tenant not found"));
        tenant.setFullName(dto.getFullName());
        tenant.setPhone(dto.getPhone());
        tenant.setEmail(dto.getEmail());
        tenant.setIdNumber(dto.getIdNumber());
        tenant.setAddress(dto.getAddress());
        tenant.setEmergencyContact(dto.getEmergencyContact());
        Tenant saved = tenantRepository.save(tenant);
        return toDTO(saved);
    }

    public void delete(Long id) {
        if (!tenantRepository.existsById(id)) {
            throw new RuntimeException("Tenant not found");
        }
        tenantRepository.deleteById(id);
    }

    private TenantDTO toDTO(Tenant tenant) {
        TenantDTO dto = new TenantDTO();
        dto.setId(tenant.getId());
        dto.setFullName(tenant.getFullName());
        dto.setPhone(tenant.getPhone());
        dto.setEmail(tenant.getEmail());
        dto.setIdNumber(tenant.getIdNumber());
        dto.setAddress(tenant.getAddress());
        dto.setEmergencyContact(tenant.getEmergencyContact());
        dto.setCreatedAt(tenant.getCreatedAt());
        return dto;
    }
}

