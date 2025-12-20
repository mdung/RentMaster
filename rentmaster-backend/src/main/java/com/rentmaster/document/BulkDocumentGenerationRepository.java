package com.rentmaster.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BulkDocumentGenerationRepository extends JpaRepository<BulkDocumentGeneration, Long> {
    
    List<BulkDocumentGeneration> findByStatus(BulkDocumentGeneration.GenerationStatus status);
    
    List<BulkDocumentGeneration> findByCreatedBy(Long createdBy);
    
    List<BulkDocumentGeneration> findByTemplateId(Long templateId);
    
    List<BulkDocumentGeneration> findByRecipientType(BulkDocumentGeneration.RecipientType recipientType);
    
    @Query(value = "SELECT COUNT(*) FROM bulk_document_generations WHERE DATE(created_at) = CURRENT_DATE", nativeQuery = true)
    long countTodaysGenerations();
    
    @Query("SELECT COUNT(bdg) FROM BulkDocumentGeneration bdg WHERE bdg.status = 'COMPLETED'")
    long countCompleted();
    
    @Query("SELECT COUNT(bdg) FROM BulkDocumentGeneration bdg WHERE bdg.status = 'FAILED'")
    long countFailed();
    
    @Query("SELECT bdg FROM BulkDocumentGeneration bdg WHERE bdg.createdAt >= :startDate AND bdg.createdAt <= :endDate")
    List<BulkDocumentGeneration> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}