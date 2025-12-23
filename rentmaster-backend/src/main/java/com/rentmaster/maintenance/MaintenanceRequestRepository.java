package com.rentmaster.maintenance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRequestRepository extends JpaRepository<MaintenanceRequest, Long> {
    List<MaintenanceRequest> findByPropertyId(Long propertyId);
    List<MaintenanceRequest> findByTenantId(Long tenantId);
    List<MaintenanceRequest> findByStatus(String status);
    List<MaintenanceRequest> findByPriority(String priority);
    List<MaintenanceRequest> findByCategory(String category);
    List<MaintenanceRequest> findByAssignedTo(Long assignedTo);
    List<MaintenanceRequest> findByPropertyIdAndStatus(Long propertyId, String status);
}

