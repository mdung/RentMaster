package com.rentmaster.property;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PropertyImageRepository extends JpaRepository<PropertyImage, Long> {
    
    List<PropertyImage> findByPropertyIdOrderByIsPrimaryDescUploadedAtDesc(Long propertyId);
    
    List<PropertyImage> findByPropertyIdAndCategory(Long propertyId, String category);
    
    PropertyImage findByPropertyIdAndIsPrimaryTrue(Long propertyId);
    
    @Modifying
    @Query("UPDATE PropertyImage pi SET pi.isPrimary = false WHERE pi.propertyId = :propertyId")
    void clearPrimaryImages(@Param("propertyId") Long propertyId);
    
    @Query("SELECT COUNT(pi) FROM PropertyImage pi WHERE pi.propertyId = :propertyId")
    Long countByPropertyId(@Param("propertyId") Long propertyId);
    
    @Query("SELECT SUM(pi.fileSize) FROM PropertyImage pi WHERE pi.propertyId = :propertyId")
    Long getTotalFileSizeByPropertyId(@Param("propertyId") Long propertyId);
    
    void deleteByPropertyId(Long propertyId);
}