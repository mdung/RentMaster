package com.rentmaster.search;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface SearchAnalyticsRepository extends JpaRepository<SearchAnalytics, Long> {

    // Find search analytics by user
    List<SearchAnalytics> findByUserIdOrderByTimestampDesc(Long userId);
    
    // Find recent searches
    List<SearchAnalytics> findByTimestampAfterOrderByTimestampDesc(LocalDateTime since);
    
    // Find searches by type
    List<SearchAnalytics> findBySearchTypeOrderByTimestampDesc(String searchType);
    
    // Get popular searches
    @Query("SELECT s.query, COUNT(s) as count FROM SearchAnalytics s " +
           "WHERE s.timestamp >= :since " +
           "GROUP BY s.query " +
           "ORDER BY count DESC")
    List<Object[]> getPopularSearches(@Param("since") LocalDateTime since, @Param("limit") int limit);
    
    // Get search volume trends
    @Query("SELECT DATE(s.timestamp) as date, COUNT(s) as volume FROM SearchAnalytics s " +
           "WHERE s.timestamp >= :since " +
           "GROUP BY DATE(s.timestamp) " +
           "ORDER BY date")
    List<Object[]> getSearchVolumeTrends(@Param("since") LocalDateTime since);
    
    // Get trending queries
    @Query("SELECT s.query, COUNT(s) as count FROM SearchAnalytics s " +
           "WHERE s.timestamp >= :since " +
           "GROUP BY s.query " +
           "HAVING COUNT(s) > 1 " +
           "ORDER BY count DESC")
    List<Object[]> getTrendingQueries(@Param("since") LocalDateTime since, @Param("limit") int limit);
    
    // Get search categories
    @Query("SELECT " +
           "CASE " +
           "  WHEN LOWER(s.query) LIKE '%property%' OR LOWER(s.query) LIKE '%apartment%' THEN 'Properties' " +
           "  WHEN LOWER(s.query) LIKE '%tenant%' OR LOWER(s.query) LIKE '%renter%' THEN 'Tenants' " +
           "  WHEN LOWER(s.query) LIKE '%payment%' OR LOWER(s.query) LIKE '%rent%' THEN 'Payments' " +
           "  WHEN LOWER(s.query) LIKE '%maintenance%' OR LOWER(s.query) LIKE '%repair%' THEN 'Maintenance' " +
           "  ELSE 'General' " +
           "END as category, " +
           "COUNT(s) as count " +
           "FROM SearchAnalytics s " +
           "WHERE s.timestamp >= :since " +
           "GROUP BY category")
    Map<String, Long> getSearchCategories(@Param("since") LocalDateTime since);
    
    // Get user search behavior
    @Query("SELECT s.searchType, COUNT(s) as count FROM SearchAnalytics s " +
           "WHERE s.userId = :userId " +
           "GROUP BY s.searchType")
    List<Object[]> getUserSearchBehavior(@Param("userId") Long userId);
    
    // Get search success rate (searches that resulted in clicks)
    @Query("SELECT " +
           "COUNT(CASE WHEN s.action = 'CLICK' THEN 1 END) * 100.0 / COUNT(*) as successRate " +
           "FROM SearchAnalytics s " +
           "WHERE s.timestamp >= :since")
    Double getSearchSuccessRate(@Param("since") LocalDateTime since);
    
    // Get average response time
    @Query("SELECT AVG(s.responseTime) FROM SearchAnalytics s " +
           "WHERE s.timestamp >= :since AND s.responseTime IS NOT NULL")
    Double getAverageResponseTime(@Param("since") LocalDateTime since);
    
    // Get search frequency by hour
    @Query("SELECT HOUR(s.timestamp) as hour, COUNT(s) as count FROM SearchAnalytics s " +
           "WHERE s.timestamp >= :since " +
           "GROUP BY HOUR(s.timestamp) " +
           "ORDER BY hour")
    List<Object[]> getSearchFrequencyByHour(@Param("since") LocalDateTime since);
    
    // Get failed searches (no results)
    @Query("SELECT s.query, COUNT(s) as count FROM SearchAnalytics s " +
           "WHERE s.timestamp >= :since AND (s.resultsCount = 0 OR s.resultsCount IS NULL) " +
           "GROUP BY s.query " +
           "ORDER BY count DESC")
    List<Object[]> getFailedSearches(@Param("since") LocalDateTime since, @Param("limit") int limit);
    
    // Get search conversion rate by query
    @Query("SELECT s.query, " +
           "COUNT(CASE WHEN s.action IN ('CLICK', 'VIEW', 'CONVERT') THEN 1 END) * 100.0 / COUNT(*) as conversionRate " +
           "FROM SearchAnalytics s " +
           "WHERE s.timestamp >= :since " +
           "GROUP BY s.query " +
           "HAVING COUNT(*) >= 5 " +
           "ORDER BY conversionRate DESC")
    List<Object[]> getSearchConversionRates(@Param("since") LocalDateTime since);
    
    // Get top exit queries (searches after which users left)
    @Query("SELECT s.query, COUNT(s) as count FROM SearchAnalytics s " +
           "WHERE s.timestamp >= :since AND s.action = 'EXIT' " +
           "GROUP BY s.query " +
           "ORDER BY count DESC")
    List<Object[]> getTopExitQueries(@Param("since") LocalDateTime since, @Param("limit") int limit);
    
    // Get search refinement patterns
    @Query("SELECT s1.query as originalQuery, s2.query as refinedQuery, COUNT(*) as count " +
           "FROM SearchAnalytics s1 " +
           "JOIN SearchAnalytics s2 ON s1.sessionId = s2.sessionId " +
           "WHERE s1.timestamp < s2.timestamp " +
           "AND s2.timestamp <= s1.timestamp + INTERVAL 5 MINUTE " +
           "AND s1.query != s2.query " +
           "AND s1.timestamp >= :since " +
           "GROUP BY s1.query, s2.query " +
           "ORDER BY count DESC")
    List<Object[]> getSearchRefinementPatterns(@Param("since") LocalDateTime since, @Param("limit") int limit);
}