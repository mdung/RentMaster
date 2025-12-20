package com.rentmaster.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentTemplateRepository extends JpaRepository<DocumentTemplate, Long> {
    
    List<DocumentTemplate> findByActiveTrue();
    
    List<DocumentTemplate> findByTemplateType(DocumentTemplate.TemplateType templateType);
    
    List<DocumentTemplate> findByCategory(String category);
    
    Optional<DocumentTemplate> findByTemplateTypeAndIsDefaultTrue(DocumentTemplate.TemplateType templateType);
    
    @Query("SELECT dt FROM DocumentTemplate dt WHERE dt.active = true AND dt.templateType = :templateType")
    List<DocumentTemplate> findActiveByTemplateType(@Param("templateType") DocumentTemplate.TemplateType templateType);
    
    @Query("SELECT COUNT(dt) FROM DocumentTemplate dt WHERE dt.active = true")
    long countActive();
    
    @Query("SELECT COUNT(dt) FROM DocumentTemplate dt")
    long countTotal();
    
    boolean existsByTemplateTypeAndIsDefaultTrueAndIdNot(DocumentTemplate.TemplateType templateType, Long id);
    
    boolean existsByTemplateTypeAndIsDefaultTrue(DocumentTemplate.TemplateType templateType);
    
    List<DocumentTemplate> findByCreatedBy(Long createdBy);
    
    @Query("SELECT dt FROM DocumentTemplate dt WHERE " +
           "LOWER(dt.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(dt.description) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<DocumentTemplate> searchTemplates(@Param("search") String search);
}