package com.rentmaster.localization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CurrencyLocalizationRepository extends JpaRepository<CurrencyLocalization, Long> {
    
    Optional<CurrencyLocalization> findByCode(String code);
    
    List<CurrencyLocalization> findByActiveTrue();
    
    Optional<CurrencyLocalization> findByIsBaseCurrencyTrue();
    
    List<CurrencyLocalization> findByCountryCodesContaining(String countryCode);
    
    boolean existsByCode(String code);
}