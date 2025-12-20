package com.rentmaster.billing;

import com.rentmaster.billing.dto.ContractServiceCreateDTO;
import com.rentmaster.billing.dto.ContractServiceDTO;
import com.rentmaster.contract.Contract;
import com.rentmaster.contract.ContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContractServiceManagementService {

    @Autowired
    private ContractServiceRepository contractServiceRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    public List<ContractServiceDTO> findByContractId(Long contractId) {
        return contractServiceRepository.findAll().stream()
                .filter(cs -> {
                    try {
                        return cs.getContract().getId().equals(contractId);
                    } catch (Exception e) {
                        return false;
                    }
                })
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ContractServiceDTO findById(Long id) {
        ContractService contractService = contractServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract service not found"));
        return toDTO(contractService);
    }

    public ContractServiceDTO create(ContractServiceCreateDTO dto) {
        Contract contract = contractRepository.findById(dto.getContractId())
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        com.rentmaster.billing.Service service = serviceRepository.findById(dto.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        // Check if service is already added to this contract
        List<ContractService> existing = contractServiceRepository.findAll().stream()
                .filter(cs -> {
                    try {
                        return cs.getContract().getId().equals(dto.getContractId()) &&
                               cs.getService().getId().equals(dto.getServiceId());
                    } catch (Exception e) {
                        return false;
                    }
                })
                .collect(Collectors.toList());
        
        if (!existing.isEmpty()) {
            throw new RuntimeException("Service is already added to this contract");
        }

        ContractService contractService = new ContractService();
        contractService.setContract(contract);
        contractService.setService(service);
        contractService.setCustomPrice(dto.getCustomPrice());
        contractService.setActive(dto.isActive());

        ContractService saved = contractServiceRepository.save(contractService);
        return toDTO(saved);
    }

    public ContractServiceDTO update(Long id, ContractServiceCreateDTO dto) {
        ContractService contractService = contractServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract service not found"));

        contractService.setCustomPrice(dto.getCustomPrice());
        contractService.setActive(dto.isActive());

        ContractService saved = contractServiceRepository.save(contractService);
        return toDTO(saved);
    }

    public void delete(Long id) {
        ContractService contractService = contractServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract service not found"));
        contractServiceRepository.deleteById(id);
    }

    public ContractServiceDTO toggleActive(Long id) {
        ContractService contractService = contractServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract service not found"));
        
        contractService.setActive(!contractService.isActive());
        ContractService saved = contractServiceRepository.save(contractService);
        return toDTO(saved);
    }

    private ContractServiceDTO toDTO(ContractService cs) {
        ContractServiceDTO dto = new ContractServiceDTO();
        dto.setId(cs.getId());
        try {
            dto.setContractId(cs.getContract().getId());
            dto.setContractCode(cs.getContract().getCode());
        } catch (Exception e) {
            // Handle lazy loading exception
        }
        try {
            com.rentmaster.billing.Service service = cs.getService();
            dto.setServiceId(service.getId());
            dto.setServiceName(service.getName());
            dto.setServiceType(service.getType().name());
            dto.setPricingModel(service.getPricingModel().name());
            dto.setDefaultUnitPrice(service.getUnitPrice());
            dto.setUnitName(service.getUnitName());
        } catch (Exception e) {
            // Handle lazy loading exception
        }
        dto.setCustomPrice(cs.getCustomPrice());
        dto.setActive(cs.isActive());
        return dto;
    }
}



