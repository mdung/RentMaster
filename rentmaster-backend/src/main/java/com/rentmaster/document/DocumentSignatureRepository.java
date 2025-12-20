package com.rentmaster.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DocumentSignatureRepository extends JpaRepository<DocumentSignature, Long> {
    
    List<DocumentSignature> findByDocumentId(Long documentId);
    
    List<DocumentSignature> findByStatus(DocumentSignature.SignatureStatus status);
    
    List<DocumentSignature> findBySignerEmail(String signerEmail);
    
    List<DocumentSignature> findBySignerRole(DocumentSignature.SignerRole signerRole);
    
    List<DocumentSignature> findByExpiresAtBefore(LocalDateTime date);
    
    @Query("SELECT COUNT(ds) FROM DocumentSignature ds WHERE ds.documentId = :documentId")
    long countByDocumentId(@Param("documentId") Long documentId);
    
    @Query("SELECT COUNT(ds) FROM DocumentSignature ds WHERE ds.documentId = :documentId AND ds.status = :status")
    long countByDocumentIdAndStatus(@Param("documentId") Long documentId, @Param("status") DocumentSignature.SignatureStatus status);
    
    @Query("SELECT COUNT(ds) FROM DocumentSignature ds WHERE ds.status = 'PENDING'")
    long countPendingSignatures();
    
    @Query("SELECT COUNT(ds) FROM DocumentSignature ds WHERE ds.status = 'SIGNED'")
    long countCompletedSignatures();
    
    @Query("SELECT COUNT(ds) FROM DocumentSignature ds WHERE ds.status = 'REJECTED'")
    long countRejectedSignatures();
    
    boolean existsByDocumentIdAndSignerEmailAndStatus(Long documentId, String signerEmail, DocumentSignature.SignatureStatus status);
}