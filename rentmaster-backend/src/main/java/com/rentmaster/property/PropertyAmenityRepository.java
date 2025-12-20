package com.rentmaster.property;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyAmenityRepository extends JpaRepository<PropertyAmenity, Long> {

    List<PropertyAmenity> findByPropertyIdAndIsActiveTrue(Long propertyId);

    List<PropertyAmenity> findByPropertyIdOrderByDisplayOrderAsc(Long propertyId);

    List<PropertyAmenity> findByPropertyIdAndCategoryAndIsActiveTrue(Long propertyId,
            PropertyAmenity.AmenityCategory category);

    List<PropertyAmenity> findByPropertyIdOrderByCategoryAscNameAsc(Long propertyId);

    List<PropertyAmenity> findByPropertyIdAndIsAvailableTrueAndIsActiveTrue(Long propertyId);

    Page<PropertyAmenity> findByPropertyIdAndIsActiveTrue(Long propertyId, Pageable pageable);

    @Query("SELECT pa FROM PropertyAmenity pa WHERE pa.propertyId = :propertyId AND pa.isActive = true ORDER BY pa.category ASC, pa.displayOrder ASC")
    List<PropertyAmenity> findByPropertyIdOrderByCategoryAndDisplayOrder(@Param("propertyId") Long propertyId);

    @Query("SELECT COUNT(pa) FROM PropertyAmenity pa WHERE pa.propertyId = :propertyId AND pa.isActive = true")
    Long countByPropertyIdAndIsActiveTrue(@Param("propertyId") Long propertyId);

    @Query("SELECT pa.category, COUNT(pa) FROM PropertyAmenity pa WHERE pa.propertyId = :propertyId AND pa.isActive = true GROUP BY pa.category")
    List<Object[]> getAmenityCountByCategory(@Param("propertyId") Long propertyId);

    List<PropertyAmenity> findByCategoryAndIsActiveTrue(PropertyAmenity.AmenityCategory category);

    @Query("SELECT pa FROM PropertyAmenity pa WHERE pa.name LIKE %:name% AND pa.isActive = true")
    List<PropertyAmenity> findByNameContaining(@Param("name") String name);

    @Query("SELECT pa FROM PropertyAmenity pa WHERE pa.additionalCost > 0 AND pa.propertyId = :propertyId AND pa.isActive = true")
    List<PropertyAmenity> findPaidAmenitiesByPropertyId(@Param("propertyId") Long propertyId);

    @Query("SELECT pa FROM PropertyAmenity pa WHERE pa.bookingRequired = true AND pa.propertyId = :propertyId AND pa.isActive = true")
    List<PropertyAmenity> findBookableAmenitiesByPropertyId(@Param("propertyId") Long propertyId);

    @Query("SELECT SUM(pa.additionalCost) FROM PropertyAmenity pa WHERE pa.propertyId = :propertyId AND pa.isActive = true AND pa.costFrequency = :frequency")
    Double getTotalCostByFrequency(@Param("propertyId") Long propertyId,
            @Param("frequency") PropertyAmenity.CostFrequency frequency);

    @Query("SELECT DISTINCT pa.category FROM PropertyAmenity pa WHERE pa.isActive = true ORDER BY pa.category")
    List<PropertyAmenity.AmenityCategory> findDistinctCategories();

    void deleteByPropertyId(Long propertyId);
}