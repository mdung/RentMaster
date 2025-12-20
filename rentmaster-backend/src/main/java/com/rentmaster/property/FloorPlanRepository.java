package com.rentmaster.property;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FloorPlanRepository extends JpaRepository<FloorPlan, Long> {

    List<FloorPlan> findByPropertyIdAndIsActiveTrue(Long propertyId);

    List<FloorPlan> findByPropertyIdOrderByDisplayOrderAsc(Long propertyId);

    List<FloorPlan> findByPropertyIdOrderByFloorNumberAsc(Long propertyId);

    Optional<FloorPlan> findByPropertyIdAndIsPrimaryTrue(Long propertyId);

    Page<FloorPlan> findByPropertyIdAndIsActiveTrue(Long propertyId, Pageable pageable);

    @Query("SELECT fp FROM FloorPlan fp WHERE fp.propertyId = :propertyId AND fp.isActive = true ORDER BY fp.isPrimary DESC, fp.displayOrder ASC")
    List<FloorPlan> findByPropertyIdOrderByPrimaryAndDisplayOrder(@Param("propertyId") Long propertyId);

    @Query("SELECT COUNT(fp) FROM FloorPlan fp WHERE fp.propertyId = :propertyId AND fp.isActive = true")
    Long countByPropertyIdAndIsActiveTrue(@Param("propertyId") Long propertyId);

    @Query("SELECT SUM(fp.fileSize) FROM FloorPlan fp WHERE fp.propertyId = :propertyId AND fp.isActive = true")
    Long getTotalFileSizeByPropertyId(@Param("propertyId") Long propertyId);

    List<FloorPlan> findByFloorNumberAndIsActiveTrue(Integer floorNumber);

    @Query("SELECT fp FROM FloorPlan fp WHERE fp.bedrooms = :bedrooms AND fp.bathrooms = :bathrooms AND fp.isActive = true")
    List<FloorPlan> findByBedroomsAndBathrooms(@Param("bedrooms") Integer bedrooms,
            @Param("bathrooms") Integer bathrooms);

    @Query("SELECT fp FROM FloorPlan fp WHERE fp.totalArea BETWEEN :minArea AND :maxArea AND fp.isActive = true")
    List<FloorPlan> findByAreaRange(@Param("minArea") Double minArea, @Param("maxArea") Double maxArea);

    @Query("SELECT fp FROM FloorPlan fp WHERE fp.name LIKE %:name% AND fp.isActive = true")
    List<FloorPlan> findByNameContaining(@Param("name") String name);

    @Query("SELECT fp FROM FloorPlan fp WHERE fp.uploadedBy = :uploadedBy AND fp.isActive = true ORDER BY fp.uploadedAt DESC")
    List<FloorPlan> findByUploadedByOrderByUploadedAtDesc(@Param("uploadedBy") String uploadedBy);

    @Query("SELECT AVG(fp.totalArea) FROM FloorPlan fp WHERE fp.propertyId = :propertyId AND fp.isActive = true")
    Double getAverageAreaByPropertyId(@Param("propertyId") Long propertyId);

    void deleteByPropertyId(Long propertyId);
}