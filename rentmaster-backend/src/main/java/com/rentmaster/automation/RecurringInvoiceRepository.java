package com.rentmaster.automation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RecurringInvoiceRepository extends JpaRepository<RecurringInvoice, Long> {
    
    List<RecurringInvoice> findByActiveTrue();
    
    List<RecurringInvoice> findByContractId(Long contractId);
    
    @Query("SELECT ri FROM RecurringInvoice ri WHERE ri.active = true AND ri.nextGenerationDate <= :date")
    List<RecurringInvoice> findDueForGeneration(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(ri) FROM RecurringInvoice ri WHERE ri.active = true")
    long countActive();
    
    @Query("SELECT COUNT(ri) FROM RecurringInvoice ri")
    long countTotal();
}