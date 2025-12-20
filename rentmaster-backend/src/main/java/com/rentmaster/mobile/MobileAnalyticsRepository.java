package com.rentmaster.mobile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MobileAnalyticsRepository extends JpaRepository<MobileAnalytics, Long> {
    
    List<MobileAnalytics> findByUserId(Long userId);
    
    List<MobileAnalytics> findByUserIdAndEventType(Long userId, String eventType);
    
    List<MobileAnalytics> findByEventType(String eventType);
    
    List<MobileAnalytics> findByEventName(String eventName);
    
    List<MobileAnalytics> findByPlatform(String platform);
    
    @Query("SELECT ma FROM MobileAnalytics ma WHERE ma.timestamp BETWEEN :startDate AND :endDate")
    List<MobileAnalytics> findByTimestampBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT ma FROM MobileAnalytics ma WHERE ma.userId = :userId AND ma.timestamp BETWEEN :startDate AND :endDate")
    List<MobileAnalytics> findByUserIdAndTimestampBetween(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT ma.eventName, COUNT(ma) FROM MobileAnalytics ma WHERE ma.eventType = :eventType GROUP BY ma.eventName ORDER BY COUNT(ma) DESC")
    List<Object[]> getTopEventsByType(@Param("eventType") String eventType);
    
    @Query("SELECT ma.screenName, COUNT(ma) FROM MobileAnalytics ma WHERE ma.eventType = 'SCREEN_VIEW' GROUP BY ma.screenName ORDER BY COUNT(ma) DESC")
    List<Object[]> getTopScreenViews();
    
    @Query("SELECT ma.platform, COUNT(ma) FROM MobileAnalytics ma GROUP BY ma.platform")
    List<Object[]> getPlatformDistribution();
    
    @Query("SELECT ma.appVersion, COUNT(ma) FROM MobileAnalytics ma GROUP BY ma.appVersion ORDER BY ma.appVersion DESC")
    List<Object[]> getAppVersionUsage();
    
    @Query("SELECT COUNT(DISTINCT ma.userId) FROM MobileAnalytics ma WHERE ma.timestamp BETWEEN :startDate AND :endDate")
    Long getActiveUsersCount(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT COUNT(DISTINCT ma.sessionId) FROM MobileAnalytics ma WHERE ma.userId = :userId AND ma.timestamp BETWEEN :startDate AND :endDate")
    Long getUserSessionCount(@Param("userId") Long userId, @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT AVG(ma.durationMs) FROM MobileAnalytics ma WHERE ma.eventType = 'SESSION' AND ma.timestamp BETWEEN :startDate AND :endDate")
    Double getAverageSessionDuration(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT ma FROM MobileAnalytics ma WHERE ma.timestamp < :cutoffDate")
    List<MobileAnalytics> findOldAnalytics(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    void deleteByTimestampBefore(LocalDateTime cutoffDate);
}