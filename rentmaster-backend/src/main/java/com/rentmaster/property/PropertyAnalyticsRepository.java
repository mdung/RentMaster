package com.rentmaster.property;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyAnalyticsRepository extends JpaRepository<PropertyAnalytics, Long> {

    List<PropertyAnalytics> findByPropertyId(Long propertyId);

    @Query("SELECT pa FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId ORDER BY pa.metricDate DESC")
    List<PropertyAnalytics> findByPropertyIdOrderByMetricDateDesc(@Param("propertyId") Long propertyId);

    List<PropertyAnalytics> findByPropertyIdAndMetricType(Long propertyId, PropertyAnalytics.MetricType metricType);

    List<PropertyAnalytics> findByPropertyIdAndPeriodType(Long propertyId, PropertyAnalytics.PeriodType periodType);

    Page<PropertyAnalytics> findByPropertyId(Long propertyId, Pageable pageable);

    @Query("SELECT pa FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId AND pa.metricDate >= :startDate AND pa.metricDate <= :endDate ORDER BY pa.metricDate ASC")
    List<PropertyAnalytics> findByPropertyIdAndDateRange(@Param("propertyId") Long propertyId,
            @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT pa FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId AND pa.metricType = :metricType AND pa.metricDate >= :startDate AND pa.metricDate <= :endDate ORDER BY pa.metricDate ASC")
    List<PropertyAnalytics> findByPropertyIdAndMetricTypeAndDateRange(@Param("propertyId") Long propertyId,
            @Param("metricType") PropertyAnalytics.MetricType metricType, @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT pa FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId AND pa.year = :year ORDER BY pa.month ASC")
    List<PropertyAnalytics> findByPropertyIdAndYear(@Param("propertyId") Long propertyId, @Param("year") Integer year);

    @Query("SELECT pa FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId AND pa.year = :year AND pa.month = :month")
    List<PropertyAnalytics> findByPropertyIdAndYearAndMonth(@Param("propertyId") Long propertyId,
            @Param("year") Integer year, @Param("month") Integer month);

    @Query("SELECT pa FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId AND pa.year = :year AND pa.quarter = :quarter")
    List<PropertyAnalytics> findByPropertyIdAndYearAndQuarter(@Param("propertyId") Long propertyId,
            @Param("year") Integer year, @Param("quarter") Integer quarter);

    @Query(value = "SELECT * FROM property_analytics WHERE property_id = :propertyId AND metric_type = :metricType ORDER BY metric_date DESC LIMIT 1", nativeQuery = true)
    Optional<PropertyAnalytics> findTopByPropertyIdAndMetricTypeOrderByMetricDateDesc(@Param("propertyId") Long propertyId,
            @Param("metricType") PropertyAnalytics.MetricType metricType);

    @Query("SELECT AVG(pa.value) FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId AND pa.metricType = :metricType")
    Double getAverageValueByMetricType(@Param("propertyId") Long propertyId,
            @Param("metricType") PropertyAnalytics.MetricType metricType);

    @Query("SELECT SUM(pa.value) FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId AND pa.metricType = :metricType AND pa.year = :year")
    Double getSumValueByMetricTypeAndYear(@Param("propertyId") Long propertyId,
            @Param("metricType") PropertyAnalytics.MetricType metricType, @Param("year") Integer year);

    @Query("SELECT MAX(pa.value) FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId AND pa.metricType = :metricType")
    Double getMaxValueByMetricType(@Param("propertyId") Long propertyId,
            @Param("metricType") PropertyAnalytics.MetricType metricType);

    @Query("SELECT MIN(pa.value) FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId AND pa.metricType = :metricType")
    Double getMinValueByMetricType(@Param("propertyId") Long propertyId,
            @Param("metricType") PropertyAnalytics.MetricType metricType);

    @Query("SELECT pa.metricType, COUNT(pa) FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId GROUP BY pa.metricType")
    List<Object[]> getMetricCountByType(@Param("propertyId") Long propertyId);

    @Query("SELECT pa.year, pa.month, AVG(pa.value) FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId AND pa.metricType = :metricType GROUP BY pa.year, pa.month ORDER BY pa.year, pa.month")
    List<Object[]> getMonthlyAverageByMetricType(@Param("propertyId") Long propertyId,
            @Param("metricType") PropertyAnalytics.MetricType metricType);

    @Query("SELECT pa.year, AVG(pa.value) FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId AND pa.metricType = :metricType GROUP BY pa.year ORDER BY pa.year")
    List<Object[]> getYearlyAverageByMetricType(@Param("propertyId") Long propertyId,
            @Param("metricType") PropertyAnalytics.MetricType metricType);

    @Query("SELECT DISTINCT pa.year FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId ORDER BY pa.year DESC")
    List<Integer> findDistinctYearsByPropertyId(@Param("propertyId") Long propertyId);

    @Query("SELECT DISTINCT pa.metricType FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId ORDER BY pa.metricType")
    List<PropertyAnalytics.MetricType> findDistinctMetricTypesByPropertyId(@Param("propertyId") Long propertyId);

    @Query("SELECT COUNT(pa) FROM PropertyAnalytics pa WHERE pa.propertyId = :propertyId")
    Long countByPropertyId(@Param("propertyId") Long propertyId);

    void deleteByPropertyId(Long propertyId);
}