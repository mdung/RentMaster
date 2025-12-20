package com.rentmaster.communication;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BulkCommunicationRepository extends JpaRepository<BulkCommunication, Long> {
    
    List<BulkCommunication> findByStatus(BulkCommunication.BulkStatus status);
    
    List<BulkCommunication> findByRecipientType(BulkCommunication.RecipientType recipientType);
    
    @Query("SELECT bc FROM BulkCommunication bc WHERE bc.status = 'SCHEDULED' AND bc.scheduledAt <= CURRENT_TIMESTAMP")
    List<BulkCommunication> findScheduledForExecution();
    
    @Query("SELECT COUNT(bc) FROM BulkCommunication bc WHERE bc.status = 'COMPLETED'")
    long countCompleted();
    
    @Query("SELECT COUNT(bc) FROM BulkCommunication bc WHERE bc.status = 'FAILED'")
    long countFailed();
}