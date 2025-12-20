package com.rentmaster.billing;

import com.rentmaster.billing.dto.ServiceCreateDTO;
import com.rentmaster.billing.dto.ServiceDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ServiceService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private ContractServiceRepository contractServiceRepository;

    public List<ServiceDTO> findAll() {
        return serviceRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ServiceDTO> findActive() {
        return serviceRepository.findByActiveTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ServiceDTO findById(Long id) {
        com.rentmaster.billing.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        return toDTO(service);
    }

    public ServiceDTO create(ServiceCreateDTO dto) {
        com.rentmaster.billing.Service service = new com.rentmaster.billing.Service();
        service.setName(dto.getName());
        service.setType(ServiceType.valueOf(dto.getType()));
        service.setPricingModel(PricingModel.valueOf(dto.getPricingModel()));
        service.setUnitPrice(dto.getUnitPrice());
        service.setUnitName(dto.getUnitName());
        service.setActive(dto.isActive());

        com.rentmaster.billing.Service saved = serviceRepository.save(service);
        return toDTO(saved);
    }

    public ServiceDTO update(Long id, ServiceCreateDTO dto) {
        com.rentmaster.billing.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Check if service is being used in active contracts
        if (!dto.isActive() && service.isActive()) {
            List<ContractService> allContractServices = contractServiceRepository.findAll();
            long activeContractServices = allContractServices.stream()
                    .filter(cs -> {
                        try {
                            return cs.getService().getId().equals(id) && cs.isActive();
                        } catch (Exception e) {
                            return false;
                        }
                    })
                    .count();
            if (activeContractServices > 0) {
                throw new RuntimeException("Cannot deactivate service that is used in active contracts");
            }
        }

        service.setName(dto.getName());
        service.setType(ServiceType.valueOf(dto.getType()));
        service.setPricingModel(PricingModel.valueOf(dto.getPricingModel()));
        service.setUnitPrice(dto.getUnitPrice());
        service.setUnitName(dto.getUnitName());
        service.setActive(dto.isActive());

        com.rentmaster.billing.Service saved = serviceRepository.save(service);
        return toDTO(saved);
    }

    public void delete(Long id) {
        com.rentmaster.billing.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Check if service is being used
        List<ContractService> allContractServices = contractServiceRepository.findAll();
        long contractServicesCount = allContractServices.stream()
                .filter(cs -> {
                    try {
                        return cs.getService().getId().equals(id);
                    } catch (Exception e) {
                        return false;
                    }
                })
                .count();
        if (contractServicesCount > 0) {
            throw new RuntimeException("Cannot delete service that is used in contracts");
        }

        serviceRepository.deleteById(id);
    }

    public ServiceDTO toggleActive(Long id) {
        com.rentmaster.billing.Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        if (!service.isActive()) {
            // Activating - no restrictions
            service.setActive(true);
        } else {
            // Deactivating - check if used in active contracts
            List<ContractService> allContractServices = contractServiceRepository.findAll();
            long activeContractServices = allContractServices.stream()
                    .filter(cs -> {
                        try {
                            return cs.getService().getId().equals(id) && cs.isActive();
                        } catch (Exception e) {
                            return false;
                        }
                    })
                    .count();
            if (activeContractServices > 0) {
                throw new RuntimeException("Cannot deactivate service that is used in active contracts");
            }
            service.setActive(false);
        }

        com.rentmaster.billing.Service saved = serviceRepository.save(service);
        return toDTO(saved);
    }

    private ServiceDTO toDTO(com.rentmaster.billing.Service service) {
        ServiceDTO dto = new ServiceDTO();
        dto.setId(service.getId());
        dto.setName(service.getName());
        dto.setType(service.getType().name());
        dto.setPricingModel(service.getPricingModel().name());
        dto.setUnitPrice(service.getUnitPrice());
        dto.setUnitName(service.getUnitName());
        dto.setActive(service.isActive());
        return dto;
    }
}

