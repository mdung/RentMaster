package com.rentmaster.localization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserLocalizationPreferenceRepository extends JpaRepository<UserLocalizationPreference, Long> {
    
    Optional<UserLocalizationPreference> findByUserId(Long userId);
    
    List<UserLocalizationPreference> findByLanguageCode(String languageCode);
    
    List<UserLocalizationPreference> findByLocaleCode(String localeCode);
    
    List<UserLocalizationPreference> findByCurrencyCode(String currencyCode);
    
    boolean existsByUserId(Long userId);
}