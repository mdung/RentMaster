package com.rentmaster.messaging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    
    // Find active announcements
    List<Announcement> findByIsActiveTrueOrderByIsPinnedDescPublishDateDesc();
    
    // Find announcements by type
    List<Announcement> findByTypeAndIsActiveTrueOrderByPublishDateDesc(String type);
    
    // Find announcements by priority
    List<Announcement> findByPriorityAndIsActiveTrueOrderByPublishDateDesc(String priority);
    
    // Find announcements by author
    List<Announcement> findByAuthorIdOrderByPublishDateDesc(Long authorId);
    
    // Find pinned announcements
    List<Announcement> findByIsPinnedTrueAndIsActiveTrueOrderByPublishDateDesc();
    
    // Find announcements for specific property
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.targetAudience = 'ALL_TENANTS' OR " +
           "(a.targetAudience = 'PROPERTY_TENANTS' AND :propertyId MEMBER OF a.propertyIds)) AND " +
           "a.isActive = true ORDER BY a.isPinned DESC, a.publishDate DESC")
    List<Announcement> findAnnouncementsForProperty(@Param("propertyId") Long propertyId);
    
    // Find announcements for specific tenant
    @Query("SELECT a FROM Announcement a WHERE " +
           "(a.targetAudience = 'ALL_TENANTS' OR " +
           "(a.targetAudience = 'SPECIFIC_TENANTS' AND :tenantId MEMBER OF a.tenantIds)) AND " +
           "a.isActive = true ORDER BY a.isPinned DESC, a.publishDate DESC")
    List<Announcement> findAnnouncementsForTenant(@Param("tenantId") Long tenantId);
    
    // Find unread announcements for user
    @Query("SELECT a FROM Announcement a WHERE " +
           "a.isActive = true AND :userId NOT MEMBER OF a.readBy " +
           "ORDER BY a.isPinned DESC, a.publishDate DESC")
    List<Announcement> findUnreadAnnouncementsForUser(@Param("userId") Long userId);
    
    // Find announcements requiring acknowledgment
    @Query("SELECT a FROM Announcement a WHERE " +
           "a.requiresAcknowledgment = true AND a.isActive = true AND " +
           ":userId NOT MEMBER OF a.acknowledgedBy " +
           "ORDER BY a.priority DESC, a.publishDate DESC")
    List<Announcement> findAnnouncementsRequiringAcknowledgment(@Param("userId") Long userId);
    
    // Find expired announcements
    @Query("SELECT a FROM Announcement a WHERE " +
           "a.expiryDate IS NOT NULL AND a.expiryDate < :now AND a.isActive = true")
    List<Announcement> findExpiredAnnouncements(@Param("now") LocalDateTime now);
    
    // Find announcements by date range
    @Query("SELECT a FROM Announcement a WHERE " +
           "a.publishDate BETWEEN :startDate AND :endDate AND a.isActive = true " +
           "ORDER BY a.publishDate DESC")
    List<Announcement> findByDateRange(@Param("startDate") LocalDateTime startDate, 
                                     @Param("endDate") LocalDateTime endDate);
    
    // Search announcements
    @Query("SELECT a FROM Announcement a WHERE " +
           "(LOWER(a.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "a.isActive = true ORDER BY a.publishDate DESC")
    List<Announcement> searchAnnouncements(@Param("searchTerm") String searchTerm);
    
    // Find announcements by tag
    @Query("SELECT a FROM Announcement a JOIN a.tags t WHERE " +
           "t = :tag AND a.isActive = true ORDER BY a.publishDate DESC")
    List<Announcement> findByTag(@Param("tag") String tag);
    
    // Get announcement statistics
    @Query("SELECT a.type, COUNT(a) FROM Announcement a WHERE a.isActive = true GROUP BY a.type")
    List<Object[]> getAnnouncementStatsByType();
    
    @Query("SELECT a.priority, COUNT(a) FROM Announcement a WHERE a.isActive = true GROUP BY a.priority")
    List<Object[]> getAnnouncementStatsByPriority();
    
    @Query("SELECT a.targetAudience, COUNT(a) FROM Announcement a WHERE a.isActive = true GROUP BY a.targetAudience")
    List<Object[]> getAnnouncementStatsByAudience();
    
    // Find recent announcements
    @Query("SELECT a FROM Announcement a WHERE " +
           "a.isActive = true AND a.publishDate >= :since " +
           "ORDER BY a.isPinned DESC, a.publishDate DESC")
    List<Announcement> findRecentAnnouncements(@Param("since") LocalDateTime since);
}