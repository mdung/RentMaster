package com.rentmaster.communication;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmailTemplateRepository extends JpaRepository<EmailTemplate, Long> {
    
    List<EmailTemplate> findByActiveTrue();
    
    List<EmailTemplate> findByTemplateType(EmailTemplate.TemplateType templateType);
    
    Optional<EmailTemplate> findByTemplateTypeAndIsDefaultTrue(EmailTemplate.TemplateType templateType);
    
    @Query("SELECT et FROM EmailTemplate et WHERE et.active = true AND et.templateType = :templateType")
    List<EmailTemplate> findActiveByTemplateType(@Param("templateType") EmailTemplate.TemplateType templateType);
    
    @Query("SELECT COUNT(et) FROM EmailTemplate et WHERE et.active = true")
    long countActive();
    
    @Query("SELECT COUNT(et) FROM EmailTemplate et")
    long countTotal();
    
    boolean existsByTemplateTypeAndIsDefaultTrueAndIdNot(EmailTemplate.TemplateType templateType, Long id);
    
    boolean existsByTemplateTypeAndIsDefaultTrue(EmailTemplate.TemplateType templateType);
}