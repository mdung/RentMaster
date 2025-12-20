package com.rentmaster.localization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DateTimeFormatRepository extends JpaRepository<DateTimeFormat, Long> {
    
    List<DateTimeFormat> findByLocaleCode(String localeCode);
    
    List<DateTimeFormat> findByActiveTrue();
    
    Optional<DateTimeFormat> findByIsDefaultTrue();
    
    Optional<DateTimeFormat> findByLocaleCodeAndIsDefaultTrue(String localeCode);
}