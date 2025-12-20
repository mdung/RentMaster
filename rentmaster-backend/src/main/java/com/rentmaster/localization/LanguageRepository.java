package com.rentmaster.localization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LanguageRepository extends JpaRepository<Language, Long> {
    
    Optional<Language> findByCode(String code);
    
    List<Language> findByActiveTrue();
    
    List<Language> findByActiveTrueOrderBySortOrder();
    
    Optional<Language> findByIsDefaultTrue();
    
    List<Language> findByCountryCode(String countryCode);
    
    boolean existsByCode(String code);
    
    @Query("SELECT l FROM Language l WHERE l.active = true AND l.completionPercentage >= :minCompletion ORDER BY l.sortOrder")
    List<Language> findActiveLanguagesWithMinCompletion(Double minCompletion);
    
    @Query("SELECT COUNT(l) FROM Language l WHERE l.active = true")
    long countActiveLanguages();
}