package com.rentmaster.localization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocalizedTemplateRepository extends JpaRepository<LocalizedTemplate, Long> {
    
    List<LocalizedTemplate> findByLanguageCode(String languageCode);
    
    List<LocalizedTemplate> findByTemplateType(String templateType);
    
    List<LocalizedTemplate> findByLanguageCodeAndTemplateType(String languageCode, String templateType);
    
    List<LocalizedTemplate> findByCategory(String category);
    
    List<LocalizedTemplate> findByLanguageCodeAndCategory(String languageCode, String category);
    
    List<LocalizedTemplate> findByActiveTrue();
    
    List<LocalizedTemplate> findByLanguageCodeAndActiveTrue(String languageCode);
    
    Optional<LocalizedTemplate> findByLanguageCodeAndTemplateTypeAndIsDefaultTrue(String languageCode, String templateType);
    
    List<LocalizedTemplate> findByApprovalStatus(String approvalStatus);
    
    List<LocalizedTemplate> findByParentTemplateId(Long parentTemplateId);
}