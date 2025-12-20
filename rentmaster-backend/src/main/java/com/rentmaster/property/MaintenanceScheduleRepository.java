package com.rentmaster.property;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MaintenanceScheduleRepository extends JpaRepository<MaintenanceSchedule, Long> {

    List<MaintenanceSchedule> findByPropertyId(Long propertyId);

    List<MaintenanceSchedule> findByPropertyIdAndStatus(Long propertyId, MaintenanceSchedule.Status status);

    List<MaintenanceSchedule> findByPropertyIdOrderByNextDueDateAsc(Long propertyId);

    List<MaintenanceSchedule> findByVendorId(Long vendorId);

    List<MaintenanceSchedule> findByStatus(MaintenanceSchedule.Status status);

    List<MaintenanceSchedule> findByMaintenanceType(MaintenanceSchedule.MaintenanceType maintenanceType);

    List<MaintenanceSchedule> findByPriority(MaintenanceSchedule.Priority priority);

    Page<MaintenanceSchedule> findByPropertyId(Long propertyId, Pageable pageable);

    @Query("SELECT ms FROM MaintenanceSchedule ms WHERE ms.scheduledDate BETWEEN :startDate AND :endDate ORDER BY ms.scheduledDate ASC")
    List<MaintenanceSchedule> findByScheduledDateBetween(@Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT ms FROM MaintenanceSchedule ms WHERE ms.nextDueDate BETWEEN :startDate AND :endDate ORDER BY ms.nextDueDate ASC")
    List<MaintenanceSchedule> findByNextDueDateBetween(@Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT ms FROM MaintenanceSchedule ms WHERE ms.propertyId = :propertyId AND ms.scheduledDate BETWEEN :startDate AND :endDate")
    List<MaintenanceSchedule> findByPropertyIdAndScheduledDateBetween(@Param("propertyId") Long propertyId,
            @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT ms FROM MaintenanceSchedule ms WHERE ms.scheduledDate <= :date AND ms.status = 'SCHEDULED' ORDER BY ms.priority DESC, ms.scheduledDate ASC")
    List<MaintenanceSchedule> findOverdueMaintenances(@Param("date") LocalDate date);

    @Query("SELECT ms FROM MaintenanceSchedule ms WHERE ms.nextDueDate <= :date AND ms.recurrenceType != 'NONE' ORDER BY ms.priority DESC, ms.nextDueDate ASC")
    List<MaintenanceSchedule> findDueRecurringMaintenances(@Param("date") LocalDate date);

    @Query("SELECT COUNT(ms) FROM MaintenanceSchedule ms WHERE ms.propertyId = :propertyId AND ms.status = :status")
    Long countByPropertyIdAndStatus(@Param("propertyId") Long propertyId,
            @Param("status") MaintenanceSchedule.Status status);

    @Query("SELECT ms.status, COUNT(ms) FROM MaintenanceSchedule ms WHERE ms.propertyId = :propertyId GROUP BY ms.status")
    List<Object[]> getMaintenanceCountByStatus(@Param("propertyId") Long propertyId);

    @Query("SELECT ms.maintenanceType, COUNT(ms) FROM MaintenanceSchedule ms WHERE ms.propertyId = :propertyId GROUP BY ms.maintenanceType")
    List<Object[]> getMaintenanceCountByType(@Param("propertyId") Long propertyId);

    @Query("SELECT SUM(ms.estimatedCost) FROM MaintenanceSchedule ms WHERE ms.propertyId = :propertyId AND ms.status = 'SCHEDULED'")
    Double getTotalEstimatedCostByPropertyId(@Param("propertyId") Long propertyId);

    @Query("SELECT SUM(ms.actualCost) FROM MaintenanceSchedule ms WHERE ms.propertyId = :propertyId AND ms.status = 'COMPLETED'")
    Double getTotalActualCostByPropertyId(@Param("propertyId") Long propertyId);

    @Query("SELECT ms FROM MaintenanceSchedule ms WHERE ms.title LIKE %:title% OR ms.description LIKE %:description%")
    List<MaintenanceSchedule> findByTitleOrDescriptionContaining(@Param("title") String title,
            @Param("description") String description);

    @Query("SELECT ms FROM MaintenanceSchedule ms WHERE ms.tenantNotificationRequired = true AND ms.status = 'SCHEDULED'")
    List<MaintenanceSchedule> findScheduledMaintenancesRequiringTenantNotification();

    @Query("SELECT ms FROM MaintenanceSchedule ms WHERE ms.accessRequired = true AND ms.status = 'SCHEDULED'")
    List<MaintenanceSchedule> findScheduledMaintenancesRequiringAccess();

    @Query("SELECT AVG(ms.actualCost) FROM MaintenanceSchedule ms WHERE ms.maintenanceType = :type AND ms.status = 'COMPLETED'")
    Double getAverageCostByMaintenanceType(@Param("type") MaintenanceSchedule.MaintenanceType type);
}