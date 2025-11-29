package com.rentmaster.contract;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    Optional<Contract> findByCode(String code);
    
    List<Contract> findByStatus(ContractStatus status);
    
    @Query("SELECT c FROM Contract c WHERE c.room.id = :roomId AND c.status = 'ACTIVE' " +
           "AND ((c.startDate <= :endDate AND (c.endDate IS NULL OR c.endDate >= :startDate)))")
    List<Contract> findActiveContractsForRoomInPeriod(
        @Param("roomId") Long roomId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT c FROM Contract c WHERE c.primaryTenant.id = :tenantId")
    List<Contract> findByTenantId(@Param("tenantId") Long tenantId);
    
    long countByStatus(ContractStatus status);
}

