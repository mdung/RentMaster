package com.rentmaster.maintenance;

import com.rentmaster.property.Vendor;
import com.rentmaster.property.VendorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = "*")
public class MaintenanceController {

    @Autowired
    private MaintenanceService maintenanceService;

    @Autowired
    private VendorRepository vendorRepository;

    // Maintenance Requests
    @GetMapping("/requests")
    public ResponseEntity<List<MaintenanceRequest>> getAllMaintenanceRequests(
            @RequestParam(required = false) Long propertyId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority) {
        try {
            List<MaintenanceRequest> requests;
            if (propertyId != null) {
                requests = maintenanceService.getMaintenanceRequestsByProperty(propertyId);
            } else if (status != null) {
                requests = maintenanceService.getMaintenanceRequestsByStatus(status);
            } else {
                requests = maintenanceService.getAllMaintenanceRequests();
            }
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/requests/{id}")
    public ResponseEntity<MaintenanceRequest> getMaintenanceRequest(@PathVariable Long id) {
        try {
            MaintenanceRequest request = maintenanceService.getMaintenanceRequestById(id);
            return ResponseEntity.ok(request);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @PostMapping("/requests")
    public ResponseEntity<MaintenanceRequest> createMaintenanceRequest(@RequestBody MaintenanceRequest request) {
        try {
            MaintenanceRequest created = maintenanceService.createMaintenanceRequest(request);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/requests/{id}")
    public ResponseEntity<MaintenanceRequest> updateMaintenanceRequest(
            @PathVariable Long id,
            @RequestBody MaintenanceRequest request) {
        try {
            MaintenanceRequest updated = maintenanceService.updateMaintenanceRequest(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/requests/{id}")
    public ResponseEntity<Void> deleteMaintenanceRequest(@PathVariable Long id) {
        try {
            maintenanceService.deleteMaintenanceRequest(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Work Orders
    @GetMapping("/work-orders")
    public ResponseEntity<List<WorkOrder>> getAllWorkOrders(
            @RequestParam(required = false) Long propertyId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long vendorId) {
        try {
            List<WorkOrder> workOrders;
            if (propertyId != null) {
                workOrders = maintenanceService.getWorkOrdersByProperty(propertyId);
            } else if (status != null) {
                workOrders = maintenanceService.getWorkOrdersByStatus(status);
            } else {
                workOrders = maintenanceService.getAllWorkOrders();
            }
            return ResponseEntity.ok(workOrders);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/work-orders/{id}")
    public ResponseEntity<WorkOrder> getWorkOrder(@PathVariable Long id) {
        try {
            WorkOrder workOrder = maintenanceService.getWorkOrderById(id);
            return ResponseEntity.ok(workOrder);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @PostMapping("/work-orders")
    public ResponseEntity<WorkOrder> createWorkOrder(@RequestBody WorkOrder workOrder) {
        try {
            WorkOrder created = maintenanceService.createWorkOrder(workOrder);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/work-orders/{id}")
    public ResponseEntity<WorkOrder> updateWorkOrder(
            @PathVariable Long id,
            @RequestBody WorkOrder workOrder) {
        try {
            WorkOrder updated = maintenanceService.updateWorkOrder(id, workOrder);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/work-orders/{id}")
    public ResponseEntity<Void> deleteWorkOrder(@PathVariable Long id) {
        try {
            maintenanceService.deleteWorkOrder(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Assets
    @GetMapping("/assets")
    public ResponseEntity<List<Asset>> getAllAssets(
            @RequestParam(required = false) Long propertyId,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status) {
        try {
            List<Asset> assets;
            if (propertyId != null) {
                assets = maintenanceService.getAssetsByProperty(propertyId);
            } else if (category != null) {
                assets = maintenanceService.getAssetsByCategory(category);
            } else {
                assets = maintenanceService.getAllAssets();
            }
            return ResponseEntity.ok(assets);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/assets/{id}")
    public ResponseEntity<Asset> getAsset(@PathVariable Long id) {
        try {
            Asset asset = maintenanceService.getAssetById(id);
            return ResponseEntity.ok(asset);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @PostMapping("/assets")
    public ResponseEntity<Asset> createAsset(@RequestBody Asset asset) {
        try {
            Asset created = maintenanceService.createAsset(asset);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/assets/{id}")
    public ResponseEntity<Asset> updateAsset(
            @PathVariable Long id,
            @RequestBody Asset asset) {
        try {
            Asset updated = maintenanceService.updateAsset(id, asset);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @DeleteMapping("/assets/{id}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long id) {
        try {
            maintenanceService.deleteAsset(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Vendors (delegate to existing endpoint)
    @GetMapping("/vendors")
    public ResponseEntity<List<Vendor>> getAllVendors() {
        try {
            List<Vendor> vendors = vendorRepository.findAll();
            return ResponseEntity.ok(vendors);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Maintenance History (from MaintenanceSchedule)
    @GetMapping("/history")
    public ResponseEntity<List<com.rentmaster.property.MaintenanceSchedule>> getMaintenanceHistory(
            @RequestParam(required = false) Long propertyId) {
        try {
            List<com.rentmaster.property.MaintenanceSchedule> history = maintenanceService.getMaintenanceHistory(propertyId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }
}

