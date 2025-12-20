package com.rentmaster.automation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ContractRenewalReminderRepository extends JpaRepository<ContractRenewalReminder, Long> {
    
    List<ContractRenewalReminder> findByActiveTrue();
    
    List<ContractRenewalReminder> findByContractId(Long contractId);
    
    @Query("SELECT crr FROM ContractRenewalReminder crr WHERE crr.active = true AND crr.sent = false AND crr.reminderDate <= :date")
    List<ContractRenewalReminder> findDueForReminder(@Param("date") LocalDate date);
    
    @Query("SELECT COUNT(crr) FROM ContractRenewalReminder crr WHERE crr.active = true")
    long countActive();
    
    @Query("SELECT COUNT(crr) FROM ContractRenewalReminder crr")
    long countTotal();
}