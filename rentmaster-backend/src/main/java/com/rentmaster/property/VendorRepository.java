package com.rentmaster.property;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VendorRepository extends JpaRepository<Vendor, Long> {
    
    List<Vendor> findByActiveTrue();
    
    List<Vendor> findByCategory(String category);
    
    List<Vendor> findByCategoryAndActiveTrue(String category);
    
    List<Vendor> findByIsPreferredTrueAndActiveTrue();
    
    @Query("SELECT v FROM Vendor v WHERE v.active = true ORDER BY v.rating DESC, v.totalJobs DESC")
    List<Vendor> findActiveVendorsOrderByRatingAndExperience();
    
    @Query("SELECT v FROM Vendor v WHERE v.category = :category AND v.active = true ORDER BY v.rating DESC")
    List<Vendor> findByCategoryOrderByRating(@Param("category") String category);
    
    @Query("SELECT DISTINCT v.category FROM Vendor v WHERE v.active = true ORDER BY v.category")
    List<String> findDistinctCategories();
    
    @Query("SELECT v FROM Vendor v WHERE v.name LIKE %:name% OR v.contactPerson LIKE %:name%")
    List<Vendor> findByNameContainingIgnoreCaseOrContactPersonContainingIgnoreCase(@Param("name") String name);
    
    @Query("SELECT AVG(v.rating) FROM Vendor v WHERE v.category = :category AND v.active = true")
    Double getAverageRatingByCategory(@Param("category") String category);
    
    @Query("SELECT COUNT(v) FROM Vendor v WHERE v.category = :category AND v.active = true")
    Long countByCategoryAndActiveTrue(@Param("category") String category);
}