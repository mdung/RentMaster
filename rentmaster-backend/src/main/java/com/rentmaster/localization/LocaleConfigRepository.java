package com.rentmaster.localization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocaleConfigRepository extends JpaRepository<LocaleConfig, Long> {
    
    Optional<LocaleConfig> findByCode(String code);
    
    List<LocaleConfig> findByLanguageCode(String languageCode);
    
    List<LocaleConfig> findByCountryCode(String countryCode);
    
    List<LocaleConfig> findByActiveTrue();
    
    Optional<LocaleConfig> findByIsDefaultTrue();
    
    boolean existsByCode(String code);
}