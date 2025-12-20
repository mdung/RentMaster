package com.rentmaster.billing;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByContractId(Long contractId);
    
    List<Invoice> findByStatus(InvoiceStatus status);
    
    @Query("SELECT i FROM Invoice i WHERE i.contract.id = :contractId " +
           "AND i.periodStart <= :endDate AND i.periodEnd >= :startDate")
    List<Invoice> findInvoicesForContractInPeriod(
        @Param("contractId") Long contractId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    Invoice findTopByContractIdOrderByPeriodEndDesc(Long contractId);
}

