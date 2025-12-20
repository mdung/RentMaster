package com.rentmaster.messaging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TenantFeedbackRepository extends JpaRepository<TenantFeedback, Long> {
    
    // Find feedback by tenant
    List<TenantFeedback> findByTenantIdOrderByCreatedAtDesc(Long tenantId);
    
    // Find feedback by property
    List<TenantFeedback> findByPropertyIdOrderByCreatedAtDesc(Long propertyId);
    
    // Find feedback by status
    List<TenantFeedback> findByStatusOrderByCreatedAtDesc(String status);
    
    // Find feedback by type
    List<TenantFeedback> findByTypeOrderByCreatedAtDesc(String type);
    
    // Find feedback by category
    List<TenantFeedback> findByCategoryOrderByCreatedAtDesc(String category);
    
    // Find feedback by priority
    List<TenantFeedback> findByPriorityOrderByCreatedAtDesc(String priority);
    
    // Find pending feedback (submitted, acknowledged, in_review)
    @Query("SELECT f FROM TenantFeedback f WHERE " +
           "f.status IN ('SUBMITTED', 'ACKNOWLEDGED', 'IN_REVIEW') " +
           "ORDER BY f.priority DESC, f.createdAt ASC")
    List<TenantFeedback> findPendingFeedback();
    
    // Find feedback requiring action
    List<TenantFeedback> findByRequiresActionTrueOrderByActionDueDateAsc();
    
    // Find overdue feedback
    @Query("SELECT f FROM TenantFeedback f WHERE " +
           "f.requiresAction = true AND f.actionDueDate < :now AND " +
           "f.status NOT IN ('RESOLVED', 'CLOSED') " +
           "ORDER BY f.actionDueDate ASC")
    List<TenantFeedback> findOverdueFeedback(@Param("now") LocalDateTime now);
    
    // Find feedback assigned to user
    List<TenantFeedback> findByAssignedToOrderByActionDueDateAsc(Long assignedTo);
    
    // Find feedback by rating range
    @Query("SELECT f FROM TenantFeedback f WHERE " +
           "f.rating BETWEEN :minRating AND :maxRating " +
           "ORDER BY f.createdAt DESC")
    List<TenantFeedback> findByRatingRange(@Param("minRating") Integer minRating, 
                                         @Param("maxRating") Integer maxRating);
    
    // Find public feedback
    List<TenantFeedback> findByIsPublicTrueOrderByCreatedAtDesc();
    
    // Find anonymous feedback
    List<TenantFeedback> findByIsAnonymousTrueOrderByCreatedAtDesc();
    
    // Find feedback by date range
    @Query("SELECT f FROM TenantFeedback f WHERE " +
           "f.createdAt BETWEEN :startDate AND :endDate " +
           "ORDER BY f.createdAt DESC")
    List<TenantFeedback> findByDateRange(@Param("startDate") LocalDateTime startDate,
                                       @Param("endDate") LocalDateTime endDate);
    
    // Search feedback
    @Query("SELECT f FROM TenantFeedback f WHERE " +
           "(LOWER(f.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(f.message) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY f.createdAt DESC")
    List<TenantFeedback> searchFeedback(@Param("searchTerm") String searchTerm);
    
    // Find feedback by tag
    @Query("SELECT f FROM TenantFeedback f JOIN f.tags t WHERE " +
           "t = :tag ORDER BY f.createdAt DESC")
    List<TenantFeedback> findByTag(@Param("tag") String tag);
    
    // Find feedback with attachments
    @Query("SELECT f FROM TenantFeedback f WHERE " +
           "SIZE(f.attachments) > 0 ORDER BY f.createdAt DESC")
    List<TenantFeedback> findFeedbackWithAttachments();
    
    // Get feedback statistics
    @Query("SELECT f.type, COUNT(f) FROM TenantFeedback f GROUP BY f.type")
    List<Object[]> getFeedbackStatsByType();
    
    @Query("SELECT f.status, COUNT(f) FROM TenantFeedback f GROUP BY f.status")
    List<Object[]> getFeedbackStatsByStatus();
    
    @Query("SELECT f.priority, COUNT(f) FROM TenantFeedback f GROUP BY f.priority")
    List<Object[]> getFeedbackStatsByPriority();
    
    @Query("SELECT f.category, COUNT(f) FROM TenantFeedback f GROUP BY f.category")
    List<Object[]> getFeedbackStatsByCategory();
    
    // Get average ratings
    @Query("SELECT AVG(f.rating) FROM TenantFeedback f WHERE f.rating IS NOT NULL")
    Double getAverageRating();
    
    @Query("SELECT AVG(f.rating) FROM TenantFeedback f WHERE " +
           "f.propertyId = :propertyId AND f.rating IS NOT NULL")
    Double getAverageRatingByProperty(@Param("propertyId") Long propertyId);
    
    @Query("SELECT AVG(f.satisfactionRating) FROM TenantFeedback f WHERE " +
           "f.satisfactionRating IS NOT NULL")
    Double getAverageSatisfactionRating();
    
    // Count feedback by status for property
    @Query("SELECT COUNT(f) FROM TenantFeedback f WHERE " +
           "f.propertyId = :propertyId AND f.status = :status")
    long countByPropertyAndStatus(@Param("propertyId") Long propertyId, @Param("status") String status);
    
    // Find recent feedback
    @Query("SELECT f FROM TenantFeedback f WHERE " +
           "f.createdAt >= :since ORDER BY f.createdAt DESC")
    List<TenantFeedback> findRecentFeedback(@Param("since") LocalDateTime since);
    
    // Find feedback needing follow-up
    @Query("SELECT f FROM TenantFeedback f WHERE " +
           "f.allowFollowUp = true AND f.status = 'RESOLVED' AND " +
           "f.satisfactionRating IS NULL AND " +
           "f.resolvedAt < :followUpDate")
    List<TenantFeedback> findFeedbackNeedingFollowUp(@Param("followUpDate") LocalDateTime followUpDate);
}