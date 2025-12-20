package com.rentmaster.communication;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SMSTemplateRepository extends JpaRepository<SMSTemplate, Long> {
    
    List<SMSTemplate> findByActiveTrue();
    
    List<SMSTemplate> findByTemplateType(SMSTemplate.TemplateType templateType);
    
    @Query("SELECT st FROM SMSTemplate st WHERE st.active = true AND st.templateType = :templateType")
    List<SMSTemplate> findActiveByTemplateType(@Param("templateType") SMSTemplate.TemplateType templateType);
    
    @Query("SELECT COUNT(st) FROM SMSTemplate st WHERE st.active = true")
    long countActive();
    
    @Query("SELECT COUNT(st) FROM SMSTemplate st")
    long countTotal();
}