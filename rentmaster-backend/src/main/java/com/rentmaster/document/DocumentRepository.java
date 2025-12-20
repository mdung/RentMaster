package com.rentmaster.document;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    
    Page<Document> findByDocumentType(Document.DocumentType documentType, Pageable pageable);
    
    Page<Document> findByCategory(Document.DocumentCategory category, Pageable pageable);
    
    Page<Document> findByTenantId(Long tenantId, Pageable pageable);
    
    Page<Document> findByPropertyId(Long propertyId, Pageable pageable);
    
    Page<Document> findByContractId(Long contractId, Pageable pageable);
    
    Page<Document> findByFolderId(Long folderId, Pageable pageable);
    
    Page<Document> findByFolderIdIsNull(Pageable pageable);
    
    List<Document> findByParentDocumentId(Long parentDocumentId);
    
    List<Document> findByRequiresSignatureTrue();
    
    List<Document> findBySignatureStatus(Document.SignatureStatus signatureStatus);
    
    List<Document> findByExpiryDateBefore(LocalDateTime date);
    
    @Query("SELECT d FROM Document d WHERE " +
           "(:documentType IS NULL OR d.documentType = :documentType) AND " +
           "(:category IS NULL OR d.category = :category) AND " +
           "(:tenantId IS NULL OR d.tenantId = :tenantId) AND " +
           "(:propertyId IS NULL OR d.propertyId = :propertyId) AND " +
           "(:folderId IS NULL OR d.folderId = :folderId) AND " +
           "(:search IS NULL OR LOWER(d.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Document> findWithFilters(
        @Param("documentType") Document.DocumentType documentType,
        @Param("category") Document.DocumentCategory category,
        @Param("tenantId") Long tenantId,
        @Param("propertyId") Long propertyId,
        @Param("folderId") Long folderId,
        @Param("search") String search,
        Pageable pageable
    );
    
    @Query("SELECT d FROM Document d JOIN d.tags t WHERE t = :tag")
    List<Document> findByTag(@Param("tag") String tag);
    
    @Query("SELECT DISTINCT t FROM Document d JOIN d.tags t")
    List<String> findAllTags();
    
    @Query("SELECT COUNT(d) FROM Document d")
    long countTotal();
    
    @Query("SELECT SUM(d.fileSize) FROM Document d")
    Long getTotalFileSize();
    
    @Query("SELECT d.documentType, COUNT(d) FROM Document d GROUP BY d.documentType")
    List<Object[]> countByDocumentType();
    
    @Query("SELECT d.category, COUNT(d) FROM Document d GROUP BY d.category")
    List<Object[]> countByCategory();
    
    @Query("SELECT COUNT(d) FROM Document d WHERE d.createdAt >= :date")
    long countRecentUploads(@Param("date") LocalDateTime date);
    
    @Query("SELECT COUNT(d) FROM Document d WHERE d.signatureStatus = 'PENDING'")
    long countPendingSignatures();
    
    @Query("SELECT d FROM Document d WHERE " +
           "LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "EXISTS (SELECT t FROM Document doc JOIN doc.tags t WHERE doc.id = d.id AND LOWER(t) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Document> searchDocuments(@Param("query") String query);
}