package com.rentmaster.localization;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TranslationRepository extends JpaRepository<Translation, Long> {
    
    List<Translation> findByLanguageCode(String languageCode);
    
    List<Translation> findByLanguageCodeAndCategory(String languageCode, String category);
    
    List<Translation> findByLanguageCodeAndCategoryAndKey(String languageCode, String category, String key);
    
    List<Translation> findByCategory(String category);
    
    List<Translation> findByKey(String key);
    
    long countByLanguageCode(String languageCode);
    
    @Query("SELECT COUNT(t) FROM Translation t WHERE t.languageCode = :languageCode AND (t.value IS NULL OR t.value = '')")
    long countByLanguageCodeAndValueIsEmpty(@Param("languageCode") String languageCode);
    
    @Query("SELECT t.category, COUNT(t) FROM Translation t WHERE t.languageCode = :languageCode GROUP BY t.category")
    List<Object[]> getTranslationCountByCategory(@Param("languageCode") String languageCode);
    
    @Query("SELECT t FROM Translation t WHERE t.languageCode = :languageCode AND t.needsReview = true")
    List<Translation> findTranslationsNeedingReview(@Param("languageCode") String languageCode);
    
    @Query("SELECT t FROM Translation t WHERE t.languageCode = :languageCode AND t.isApproved = false")
    List<Translation> findUnapprovedTranslations(@Param("languageCode") String languageCode);
    
    @Query("SELECT t FROM Translation t WHERE t.languageCode = :languageCode AND t.isAutoTranslated = true")
    List<Translation> findAutoTranslatedTranslations(@Param("languageCode") String languageCode);
    
    @Query("SELECT DISTINCT t.category FROM Translation t WHERE t.languageCode = :languageCode ORDER BY t.category")
    List<String> findCategoriesByLanguageCode(@Param("languageCode") String languageCode);
    
    @Query("SELECT t FROM Translation t WHERE t.languageCode = :languageCode AND t.characterLimit IS NOT NULL AND LENGTH(t.value) > t.characterLimit")
    List<Translation> findTranslationsExceedingCharacterLimit(@Param("languageCode") String languageCode);
    
    @Query("SELECT t FROM Translation t WHERE t.value LIKE %:searchTerm% OR t.key LIKE %:searchTerm%")
    List<Translation> searchTranslations(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT t FROM Translation t WHERE t.languageCode = :languageCode AND (t.value LIKE %:searchTerm% OR t.key LIKE %:searchTerm%)")
    List<Translation> searchTranslationsByLanguage(@Param("languageCode") String languageCode, @Param("searchTerm") String searchTerm);
}