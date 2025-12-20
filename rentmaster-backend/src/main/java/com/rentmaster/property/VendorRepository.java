package com.rentmaster.property;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    
    List<Vendor> findByIsActiveTrue();
    
    List<Vendor> findByIsPreferredTrueAndIsActiveTrue();
    
    @Query("SELECT v FROM Vendor v WHERE v.isActive = true ORDER BY v.rating DESC, v.totalJobs DESC")
    List<Vendor> findActiveVendorsOrderByRatingAndExperience();
    
    @Query("SELECT v FROM Vendor v WHERE v.name LIKE %:name% OR v.companyName LIKE %:name%")
    List<Vendor> findByNameContainingIgnoreCaseOrCompanyNameContainingIgnoreCase(@Param("name") String name);
}