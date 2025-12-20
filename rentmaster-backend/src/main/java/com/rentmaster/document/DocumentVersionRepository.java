package com.rentmaster.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentVersionRepository extends JpaRepository<DocumentVersion, Long> {
    
    List<DocumentVersion> findByDocumentIdOrderByVersionDesc(Long documentId);
    
    Optional<DocumentVersion> findByDocumentIdAndVersion(Long documentId, Integer version);
    
    @Query("SELECT MAX(dv.version) FROM DocumentVersion dv WHERE dv.documentId = :documentId")
    Integer findMaxVersionByDocumentId(@Param("documentId") Long documentId);
    
    @Query("SELECT COUNT(dv) FROM DocumentVersion dv WHERE dv.documentId = :documentId")
    long countByDocumentId(@Param("documentId") Long documentId);
    
    List<DocumentVersion> findByUploadedBy(Long uploadedBy);
}