package com.rentmaster.maintenance;

import com.rentmaster.property.Vendor;
import com.rentmaster.property.VendorRepository;
import com.rentmaster.property.MaintenanceSchedule;
import com.rentmaster.property.MaintenanceScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MaintenanceService {

    @Autowired
    private MaintenanceRequestRepository maintenanceRequestRepository;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired(required = false)
    private com.rentmaster.property.MaintenanceScheduleRepository maintenanceScheduleRepository;

    // Maintenance Requests
    public List<MaintenanceRequest> getAllMaintenanceRequests() {
        return maintenanceRequestRepository.findAll();
    }

    public List<MaintenanceRequest> getMaintenanceRequestsByProperty(Long propertyId) {
        return maintenanceRequestRepository.findByPropertyId(propertyId);
    }

    public List<MaintenanceRequest> getMaintenanceRequestsByStatus(String status) {
        return maintenanceRequestRepository.findByStatus(status);
    }

    public MaintenanceRequest getMaintenanceRequestById(Long id) {
        return maintenanceRequestRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Maintenance request not found"));
    }

    public MaintenanceRequest createMaintenanceRequest(MaintenanceRequest request) {
        request.setCreatedAt(LocalDateTime.now());
        request.setSubmittedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());
        if (request.getStatus() == null) {
            request.setStatus("SUBMITTED");
        }
        return maintenanceRequestRepository.save(request);
    }

    public MaintenanceRequest updateMaintenanceRequest(Long id, MaintenanceRequest request) {
        MaintenanceRequest existing = getMaintenanceRequestById(id);
        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setCategory(request.getCategory());
        existing.setPriority(request.getPriority());
        existing.setStatus(request.getStatus());
        existing.setLocation(request.getLocation());
        existing.setPreferredTime(request.getPreferredTime());
        existing.setAllowEntry(request.getAllowEntry());
        existing.setAssignedTo(request.getAssignedTo());
        existing.setEstimatedCost(request.getEstimatedCost());
        existing.setActualCost(request.getActualCost());
        if (request.getStatus() != null && request.getStatus().equals("COMPLETED") && existing.getCompletedDate() == null) {
            existing.setCompletedDate(LocalDateTime.now());
        }
        existing.setCompletionNotes(request.getCompletionNotes());
        existing.setUpdatedAt(LocalDateTime.now());
        return maintenanceRequestRepository.save(existing);
    }

    public void deleteMaintenanceRequest(Long id) {
        maintenanceRequestRepository.deleteById(id);
    }

    // Work Orders
    public List<WorkOrder> getAllWorkOrders() {
        return workOrderRepository.findAll();
    }

    public List<WorkOrder> getWorkOrdersByProperty(Long propertyId) {
        return workOrderRepository.findByPropertyId(propertyId);
    }

    public List<WorkOrder> getWorkOrdersByStatus(String status) {
        return workOrderRepository.findByStatus(status);
    }

    public WorkOrder getWorkOrderById(Long id) {
        return workOrderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Work order not found"));
    }

    public WorkOrder createWorkOrder(WorkOrder workOrder) {
        workOrder.setCreatedAt(LocalDateTime.now());
        workOrder.setUpdatedAt(LocalDateTime.now());
        if (workOrder.getStatus() == null) {
            workOrder.setStatus("PENDING");
        }
        if (workOrder.getWorkOrderNumber() == null) {
            workOrder.setWorkOrderNumber("WO-" + System.currentTimeMillis());
        }
        return workOrderRepository.save(workOrder);
    }

    public WorkOrder updateWorkOrder(Long id, WorkOrder workOrder) {
        WorkOrder existing = getWorkOrderById(id);
        existing.setTitle(workOrder.getTitle());
        existing.setDescription(workOrder.getDescription());
        existing.setWorkType(workOrder.getWorkType());
        existing.setPriority(workOrder.getPriority());
        existing.setStatus(workOrder.getStatus());
        existing.setVendorId(workOrder.getVendorId());
        existing.setAssignedTo(workOrder.getAssignedTo());
        existing.setScheduledDate(workOrder.getScheduledDate());
        existing.setEstimatedDuration(workOrder.getEstimatedDuration());
        existing.setEstimatedCost(workOrder.getEstimatedCost());
        existing.setActualCost(workOrder.getActualCost());
        existing.setLocation(workOrder.getLocation());
        existing.setSpecialInstructions(workOrder.getSpecialInstructions());
        if (workOrder.getStatus() != null && workOrder.getStatus().equals("IN_PROGRESS") && existing.getStartedDate() == null) {
            existing.setStartedDate(LocalDateTime.now());
        }
        if (workOrder.getStatus() != null && workOrder.getStatus().equals("COMPLETED") && existing.getCompletedDate() == null) {
            existing.setCompletedDate(LocalDateTime.now());
            existing.setActualDuration(workOrder.getActualDuration());
        }
        existing.setCompletionNotes(workOrder.getCompletionNotes());
        existing.setTenantSatisfactionRating(workOrder.getTenantSatisfactionRating());
        existing.setUpdatedAt(LocalDateTime.now());
        return workOrderRepository.save(existing);
    }

    public void deleteWorkOrder(Long id) {
        workOrderRepository.deleteById(id);
    }

    // Assets
    public List<Asset> getAllAssets() {
        return assetRepository.findAll();
    }

    public List<Asset> getAssetsByProperty(Long propertyId) {
        return assetRepository.findByPropertyId(propertyId);
    }

    public List<Asset> getAssetsByCategory(String category) {
        return assetRepository.findByCategory(category);
    }

    public Asset getAssetById(Long id) {
        return assetRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Asset not found"));
    }

    public Asset createAsset(Asset asset) {
        asset.setCreatedAt(LocalDateTime.now());
        asset.setUpdatedAt(LocalDateTime.now());
        if (asset.getStatus() == null) {
            asset.setStatus("ACTIVE");
        }
        return assetRepository.save(asset);
    }

    public Asset updateAsset(Long id, Asset asset) {
        Asset existing = getAssetById(id);
        existing.setName(asset.getName());
        existing.setCategory(asset.getCategory());
        existing.setBrand(asset.getBrand());
        existing.setModel(asset.getModel());
        existing.setSerialNumber(asset.getSerialNumber());
        existing.setPurchaseDate(asset.getPurchaseDate());
        existing.setPurchasePrice(asset.getPurchasePrice());
        existing.setWarrantyExpiryDate(asset.getWarrantyExpiryDate());
        existing.setCurrentValue(asset.getCurrentValue());
        existing.setDepreciationRate(asset.getDepreciationRate());
        existing.setLocation(asset.getLocation());
        existing.setStatus(asset.getStatus());
        existing.setCondition(asset.getCondition());
        existing.setLastMaintenanceDate(asset.getLastMaintenanceDate());
        existing.setNextMaintenanceDate(asset.getNextMaintenanceDate());
        existing.setMaintenanceIntervalDays(asset.getMaintenanceIntervalDays());
        existing.setNotes(asset.getNotes());
        existing.setUpdatedAt(LocalDateTime.now());
        return assetRepository.save(existing);
    }

    public void deleteAsset(Long id) {
        assetRepository.deleteById(id);
    }

    // Maintenance History (from MaintenanceSchedule)
    public List<com.rentmaster.property.MaintenanceSchedule> getMaintenanceHistory(Long propertyId) {
        if (maintenanceScheduleRepository != null) {
            if (propertyId != null) {
                return maintenanceScheduleRepository.findByPropertyId(propertyId);
            }
            return maintenanceScheduleRepository.findAll();
        }
        return List.of();
    }
}

