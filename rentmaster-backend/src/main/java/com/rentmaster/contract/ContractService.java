package com.rentmaster.contract;

import com.rentmaster.contract.dto.ContractCreateDTO;
import com.rentmaster.contract.dto.ContractDTO;
import com.rentmaster.property.Room;
import com.rentmaster.property.RoomRepository;
import com.rentmaster.property.RoomStatus;
import com.rentmaster.tenant.Tenant;
import com.rentmaster.tenant.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ContractService {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private TenantRepository tenantRepository;

    public List<ContractDTO> findAll() {
        return contractRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ContractDTO findById(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        return toDTO(contract);
    }

    public List<ContractDTO> findByStatus(String status) {
        return contractRepository.findByStatus(ContractStatus.valueOf(status)).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ContractDTO create(ContractCreateDTO dto) {
        if (contractRepository.findByCode(dto.getCode()).isPresent()) {
            throw new RuntimeException("Contract code already exists");
        }

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Tenant primaryTenant = tenantRepository.findById(dto.getPrimaryTenantId())
                .orElseThrow(() -> new RuntimeException("Primary tenant not found"));

        // Check for overlapping active contracts
        if (ContractStatus.valueOf(dto.getStatus()) == ContractStatus.ACTIVE) {
            LocalDate endDate = dto.getEndDate() != null ? dto.getEndDate() : LocalDate.now().plusYears(10);
            List<Contract> overlapping = contractRepository.findActiveContractsForRoomInPeriod(
                    dto.getRoomId(), dto.getStartDate(), endDate);
            if (!overlapping.isEmpty()) {
                throw new RuntimeException("Room already has an active contract in this period");
            }
        }

        Contract contract = new Contract();
        contract.setCode(dto.getCode());
        contract.setRoom(room);
        contract.setPrimaryTenant(primaryTenant);
        contract.setStartDate(dto.getStartDate());
        contract.setEndDate(dto.getEndDate());
        contract.setRentAmount(dto.getRentAmount());
        contract.setDepositAmount(dto.getDepositAmount());
        contract.setBillingCycle(BillingCycle.valueOf(dto.getBillingCycle()));
        contract.setStatus(ContractStatus.valueOf(dto.getStatus()));

        if (dto.getTenantIds() != null && !dto.getTenantIds().isEmpty()) {
            for (Long tenantId : dto.getTenantIds()) {
                Tenant tenant = tenantRepository.findById(tenantId)
                        .orElseThrow(() -> new RuntimeException("Tenant not found: " + tenantId));
                contract.getTenants().add(tenant);
            }
        }
        contract.getTenants().add(primaryTenant); // Always include primary tenant

        Contract saved = contractRepository.save(contract);

        // Update room status if contract is active
        if (saved.getStatus() == ContractStatus.ACTIVE) {
            room.setStatus(RoomStatus.OCCUPIED);
            roomRepository.save(room);
        }

        return toDTO(saved);
    }

    public ContractDTO update(Long id, ContractCreateDTO dto) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        if (!contract.getCode().equals(dto.getCode()) &&
            contractRepository.findByCode(dto.getCode()).isPresent()) {
            throw new RuntimeException("Contract code already exists");
        }

        Room room = roomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));

        Tenant primaryTenant = tenantRepository.findById(dto.getPrimaryTenantId())
                .orElseThrow(() -> new RuntimeException("Primary tenant not found"));

        ContractStatus newStatus = ContractStatus.valueOf(dto.getStatus());
        if (newStatus == ContractStatus.ACTIVE && contract.getStatus() != ContractStatus.ACTIVE) {
            LocalDate endDate = dto.getEndDate() != null ? dto.getEndDate() : LocalDate.now().plusYears(10);
            List<Contract> overlapping = contractRepository.findActiveContractsForRoomInPeriod(
                    dto.getRoomId(), dto.getStartDate(), endDate);
            overlapping.removeIf(c -> c.getId().equals(id));
            if (!overlapping.isEmpty()) {
                throw new RuntimeException("Room already has an active contract in this period");
            }
        }

        contract.setCode(dto.getCode());
        contract.setRoom(room);
        contract.setPrimaryTenant(primaryTenant);
        contract.setStartDate(dto.getStartDate());
        contract.setEndDate(dto.getEndDate());
        contract.setRentAmount(dto.getRentAmount());
        contract.setDepositAmount(dto.getDepositAmount());
        contract.setBillingCycle(BillingCycle.valueOf(dto.getBillingCycle()));
        contract.setStatus(newStatus);

        contract.getTenants().clear();
        if (dto.getTenantIds() != null && !dto.getTenantIds().isEmpty()) {
            for (Long tenantId : dto.getTenantIds()) {
                Tenant tenant = tenantRepository.findById(tenantId)
                        .orElseThrow(() -> new RuntimeException("Tenant not found: " + tenantId));
                contract.getTenants().add(tenant);
            }
        }
        contract.getTenants().add(primaryTenant);

        Contract saved = contractRepository.save(contract);

        // Update room status based on contract status
        if (saved.getStatus() == ContractStatus.ACTIVE) {
            room.setStatus(RoomStatus.OCCUPIED);
        } else if (saved.getStatus() == ContractStatus.TERMINATED || saved.getStatus() == ContractStatus.EXPIRED) {
            room.setStatus(RoomStatus.AVAILABLE);
        }
        roomRepository.save(room);

        return toDTO(saved);
    }

    public void delete(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        Room room = contract.getRoom();
        contractRepository.deleteById(id);
        // Update room status if needed
        List<Contract> activeContracts = contractRepository.findActiveContractsForRoomInPeriod(
                room.getId(), LocalDate.now().minusYears(1), LocalDate.now().plusYears(1));
        if (activeContracts.isEmpty()) {
            room.setStatus(RoomStatus.AVAILABLE);
            roomRepository.save(room);
        }
    }

    private ContractDTO toDTO(Contract contract) {
        ContractDTO dto = new ContractDTO();
        dto.setId(contract.getId());
        dto.setCode(contract.getCode());
        dto.setRoomId(contract.getRoom().getId());
        dto.setRoomCode(contract.getRoom().getCode());
        dto.setPropertyName(contract.getRoom().getProperty().getName());
        dto.setPrimaryTenantId(contract.getPrimaryTenant().getId());
        dto.setPrimaryTenantName(contract.getPrimaryTenant().getFullName());
        dto.setTenantIds(contract.getTenants().stream().map(Tenant::getId).collect(Collectors.toList()));
        dto.setStartDate(contract.getStartDate());
        dto.setEndDate(contract.getEndDate());
        dto.setRentAmount(contract.getRentAmount());
        dto.setDepositAmount(contract.getDepositAmount());
        dto.setBillingCycle(contract.getBillingCycle().name());
        dto.setStatus(contract.getStatus().name());
        dto.setCreatedAt(contract.getCreatedAt());
        return dto;
    }
}

