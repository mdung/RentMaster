package com.rentmaster.document;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@Transactional
public class DocumentService {
    
    private static final Logger log = LoggerFactory.getLogger(DocumentService.class);
    
    @Value("${app.document.upload-dir:./uploads/documents}")
    private String uploadDir;
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private DocumentTemplateRepository templateRepository;
    
    @Autowired
    private DocumentSignatureRepository signatureRepository;
    
    @Autowired
    private DocumentVersionRepository versionRepository;
    
    @Autowired
    private BulkDocumentGenerationRepository bulkGenerationRepository;
    
    @Autowired
    private DocumentFolderRepository folderRepository;
    
    // Document Management Methods
    public Page<Document> getDocuments(Document.DocumentType documentType, Document.DocumentCategory category,
                                     Long tenantId, Long propertyId, Long folderId, String search, Pageable pageable) {
        return documentRepository.findWithFilters(documentType, category, tenantId, propertyId, folderId, search, pageable);
    }
    
    public Optional<Document> getDocumentById(Long id) {
        return documentRepository.findById(id);
    }
    
    public Document uploadDocument(MultipartFile file, String name, Document.DocumentType documentType,
                                 Document.DocumentCategory category, String relatedEntityType, Long relatedEntityId,
                                 Long tenantId, Long propertyId, Long contractId, String description,
                                 List<String> tags, Boolean isPublic, Boolean requiresSignature,
                                 LocalDateTime expiryDate, Long folderId, Long uploadedBy, String uploadedByName) {
        
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String uniqueFilename = System.currentTimeMillis() + "_" + UUID.randomUUID().toString() + fileExtension;
            
            // Save file to disk
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Create document entity
            Document document = new Document(name, originalFilename, filePath.toString(), 
                                           file.getSize(), file.getContentType(), documentType, category, 
                                           uploadedBy, uploadedByName);
            
            document.setRelatedEntityType(relatedEntityType);
            document.setRelatedEntityId(relatedEntityId);
            document.setTenantId(tenantId);
            document.setPropertyId(propertyId);
            document.setContractId(contractId);
            document.setDescription(description);
            document.setTags(tags != null ? tags : new ArrayList<>());
            document.setIsPublic(isPublic != null ? isPublic : false);
            document.setRequiresSignature(requiresSignature != null ? requiresSignature : false);
            document.setExpiryDate(expiryDate);
            document.setFolderId(folderId);
            
            if (requiresSignature != null && requiresSignature) {
                document.setSignatureStatus(Document.SignatureStatus.PENDING);
            }
            
            Document savedDocument = documentRepository.save(document);
            
            // Create initial version
            DocumentVersion version = new DocumentVersion(savedDocument.getId(), 1, originalFilename, 
                                                        filePath.toString(), file.getSize(), uploadedBy, uploadedByName);
            version.setChangeDescription("Initial upload");
            versionRepository.save(version);
            
            // Update folder document count
            if (folderId != null) {
                updateFolderDocumentCount(folderId);
            }
            
            log.info("Document uploaded successfully: {} (ID: {})", name, savedDocument.getId());
            return savedDocument;
            
        } catch (IOException e) {
            log.error("Failed to upload document: {}", e.getMessage());
            throw new RuntimeException("Failed to upload document: " + e.getMessage());
        }
    }
    
    public Document updateDocument(Long id, String name, Document.DocumentType documentType,
                                 Document.DocumentCategory category, String description, List<String> tags,
                                 Boolean isPublic, Boolean requiresSignature, LocalDateTime expiryDate, Long folderId) {
        
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        
        Long oldFolderId = document.getFolderId();
        
        document.setName(name);
        document.setDocumentType(documentType);
        document.setCategory(category);
        document.setDescription(description);
        document.setTags(tags);
        document.setIsPublic(isPublic);
        document.setRequiresSignature(requiresSignature);
        document.setExpiryDate(expiryDate);
        document.setFolderId(folderId);
        
        if (requiresSignature && document.getSignatureStatus() == Document.SignatureStatus.NOT_REQUIRED) {
            document.setSignatureStatus(Document.SignatureStatus.PENDING);
        } else if (!requiresSignature) {
            document.setSignatureStatus(Document.SignatureStatus.NOT_REQUIRED);
        }
        
        Document updatedDocument = documentRepository.save(document);
        
        // Update folder counts if folder changed
        if (!Objects.equals(oldFolderId, folderId)) {
            if (oldFolderId != null) {
                updateFolderDocumentCount(oldFolderId);
            }
            if (folderId != null) {
                updateFolderDocumentCount(folderId);
            }
        }
        
        return updatedDocument;
    }
    
    public void deleteDocument(Long id) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        
        try {
            // Delete physical file
            Path filePath = Paths.get(document.getFilePath());
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
            
            // Delete all versions
            List<DocumentVersion> versions = versionRepository.findByDocumentIdOrderByVersionDesc(id);
            for (DocumentVersion version : versions) {
                Path versionPath = Paths.get(version.getFilePath());
                if (Files.exists(versionPath)) {
                    Files.delete(versionPath);
                }
            }
            versionRepository.deleteAll(versions);
            
            // Delete signatures
            List<DocumentSignature> signatures = signatureRepository.findByDocumentId(id);
            signatureRepository.deleteAll(signatures);
            
            // Delete document
            documentRepository.delete(document);
            
            // Update folder document count
            if (document.getFolderId() != null) {
                updateFolderDocumentCount(document.getFolderId());
            }
            
            log.info("Document deleted successfully: {}", document.getName());
            
        } catch (IOException e) {
            log.error("Failed to delete document file: {}", e.getMessage());
            throw new RuntimeException("Failed to delete document file: " + e.getMessage());
        }
    }
    
    public byte[] downloadDocument(Long id) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        
        try {
            Path filePath = Paths.get(document.getFilePath());
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            log.error("Failed to download document: {}", e.getMessage());
            throw new RuntimeException("Failed to download document: " + e.getMessage());
        }
    }
    
    public String getPreviewUrl(Long id) {
        Document document = documentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        
        // For now, return a placeholder URL. In a real implementation, 
        // you would generate a temporary signed URL or convert to viewable format
        return "/api/documents/" + id + "/preview";
    }
    
    // Document Template Methods
    public List<DocumentTemplate> getAllTemplates() {
        return templateRepository.findAll();
    }
    
    public List<DocumentTemplate> getActiveTemplates() {
        return templateRepository.findByActiveTrue();
    }
    
    public Optional<DocumentTemplate> getTemplateById(Long id) {
        return templateRepository.findById(id);
    }
    
    public DocumentTemplate createTemplate(String name, DocumentTemplate.TemplateType templateType, String content,
                                         String category, String description, Boolean isDefault, Boolean active,
                                         Long createdBy, String createdByName) {
        
        // If setting as default, unset other defaults for this type
        if (isDefault != null && isDefault) {
            unsetDefaultTemplate(templateType);
        }
        
        DocumentTemplate template = new DocumentTemplate(name, templateType, content, category, createdBy, createdByName);
        template.setDescription(description);
        template.setIsDefault(isDefault != null ? isDefault : false);
        template.setActive(active != null ? active : true);
        
        // Extract variables from template content
        template.setVariables(extractVariables(content));
        
        return templateRepository.save(template);
    }
    
    public DocumentTemplate updateTemplate(Long id, String name, DocumentTemplate.TemplateType templateType,
                                         String content, String category, String description, Boolean isDefault, Boolean active) {
        
        DocumentTemplate template = templateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found"));
        
        // If setting as default, unset other defaults for this type
        if (isDefault != null && isDefault && !template.getIsDefault()) {
            unsetDefaultTemplate(templateType);
        }
        
        template.setName(name);
        template.setTemplateType(templateType);
        template.setContent(content);
        template.setCategory(category);
        template.setDescription(description);
        template.setIsDefault(isDefault != null ? isDefault : template.getIsDefault());
        template.setActive(active != null ? active : template.getActive());
        
        // Extract variables from template content
        template.setVariables(extractVariables(content));
        
        return templateRepository.save(template);
    }
    
    public void deleteTemplate(Long id) {
        templateRepository.deleteById(id);
    }
    
    public DocumentTemplate toggleTemplate(Long id) {
        DocumentTemplate template = templateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found"));
        
        template.setActive(!template.getActive());
        return templateRepository.save(template);
    }
    
    public String previewTemplate(Long id, Map<String, Object> variables) {
        DocumentTemplate template = templateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Template not found"));
        
        return processTemplate(template.getContent(), variables);
    }
    
    public byte[] generateDocumentFromTemplate(Long templateId, Map<String, Object> variables, String format) {
        DocumentTemplate template = templateRepository.findById(templateId)
            .orElseThrow(() -> new RuntimeException("Template not found"));
        
        String processedContent = processTemplate(template.getContent(), variables);
        
        // For now, return the processed content as bytes
        // In a real implementation, you would use libraries like iText (PDF), Apache POI (DOCX), etc.
        return processedContent.getBytes();
    }
    
    private void unsetDefaultTemplate(DocumentTemplate.TemplateType templateType) {
        templateRepository.findByTemplateTypeAndIsDefaultTrue(templateType)
            .ifPresent(template -> {
                template.setIsDefault(false);
                templateRepository.save(template);
            });
    }
    
    // Document Signature Methods
    public List<DocumentSignature> getDocumentSignatures(Long documentId) {
        return signatureRepository.findByDocumentId(documentId);
    }
    
    public DocumentSignature createSignatureRequest(Long documentId, String signerName, String signerEmail,
                                                  DocumentSignature.SignerRole signerRole, LocalDateTime expiresAt) {
        
        DocumentSignature signature = new DocumentSignature(documentId, signerName, signerEmail, signerRole);
        signature.setExpiresAt(expiresAt);
        signature.setSignatureRequestSentAt(LocalDateTime.now());
        
        DocumentSignature savedSignature = signatureRepository.save(signature);
        
        // Update document signature status
        updateDocumentSignatureStatus(documentId);
        
        log.info("Signature request created for document {} to {}", documentId, signerEmail);
        return savedSignature;
    }
    
    public DocumentSignature signDocument(Long signatureId, String signatureData, String ipAddress) {
        DocumentSignature signature = signatureRepository.findById(signatureId)
            .orElseThrow(() -> new RuntimeException("Signature request not found"));
        
        if (signature.getStatus() != DocumentSignature.SignatureStatus.PENDING) {
            throw new RuntimeException("Signature request is not pending");
        }
        
        if (signature.getExpiresAt() != null && signature.getExpiresAt().isBefore(LocalDateTime.now())) {
            signature.setStatus(DocumentSignature.SignatureStatus.EXPIRED);
            signatureRepository.save(signature);
            throw new RuntimeException("Signature request has expired");
        }
        
        signature.setSignatureData(signatureData);
        signature.setSignedAt(LocalDateTime.now());
        signature.setIpAddress(ipAddress);
        signature.setStatus(DocumentSignature.SignatureStatus.SIGNED);
        
        DocumentSignature savedSignature = signatureRepository.save(signature);
        
        // Update document signature status
        updateDocumentSignatureStatus(signature.getDocumentId());
        
        log.info("Document signed by {} for signature ID {}", signature.getSignerEmail(), signatureId);
        return savedSignature;
    }
    
    public DocumentSignature rejectSignature(Long signatureId, String reason) {
        DocumentSignature signature = signatureRepository.findById(signatureId)
            .orElseThrow(() -> new RuntimeException("Signature request not found"));
        
        signature.setStatus(DocumentSignature.SignatureStatus.REJECTED);
        signature.setRejectionReason(reason);
        
        DocumentSignature savedSignature = signatureRepository.save(signature);
        
        // Update document signature status
        updateDocumentSignatureStatus(signature.getDocumentId());
        
        log.info("Signature rejected by {} for signature ID {}: {}", signature.getSignerEmail(), signatureId, reason);
        return savedSignature;
    }
    
    public Map<String, Long> getSignatureStatus(Long documentId) {
        long totalSignatures = signatureRepository.countByDocumentId(documentId);
        long pendingSignatures = signatureRepository.countByDocumentIdAndStatus(documentId, DocumentSignature.SignatureStatus.PENDING);
        long completedSignatures = signatureRepository.countByDocumentIdAndStatus(documentId, DocumentSignature.SignatureStatus.SIGNED);
        long rejectedSignatures = signatureRepository.countByDocumentIdAndStatus(documentId, DocumentSignature.SignatureStatus.REJECTED);
        
        Map<String, Long> status = new HashMap<>();
        status.put("totalSignatures", totalSignatures);
        status.put("pendingSignatures", pendingSignatures);
        status.put("completedSignatures", completedSignatures);
        status.put("rejectedSignatures", rejectedSignatures);
        
        return status;
    }
    
    private void updateDocumentSignatureStatus(Long documentId) {
        Document document = documentRepository.findById(documentId).orElse(null);
        if (document == null || !document.getRequiresSignature()) {
            return;
        }
        
        List<DocumentSignature> signatures = signatureRepository.findByDocumentId(documentId);
        
        if (signatures.isEmpty()) {
            document.setSignatureStatus(Document.SignatureStatus.PENDING);
        } else {
            boolean allSigned = signatures.stream().allMatch(s -> s.getStatus() == DocumentSignature.SignatureStatus.SIGNED);
            boolean anyRejected = signatures.stream().anyMatch(s -> s.getStatus() == DocumentSignature.SignatureStatus.REJECTED);
            
            if (allSigned) {
                document.setSignatureStatus(Document.SignatureStatus.SIGNED);
            } else if (anyRejected) {
                document.setSignatureStatus(Document.SignatureStatus.REJECTED);
            } else {
                document.setSignatureStatus(Document.SignatureStatus.PENDING);
            }
        }
        
        documentRepository.save(document);
    }
    
    // Document Version Methods
    public List<DocumentVersion> getDocumentVersions(Long documentId) {
        return versionRepository.findByDocumentIdOrderByVersionDesc(documentId);
    }
    
    public DocumentVersion uploadNewVersion(Long documentId, MultipartFile file, String changeDescription,
                                          Long uploadedBy, String uploadedByName) {
        
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        
        try {
            // Get next version number
            Integer maxVersion = versionRepository.findMaxVersionByDocumentId(documentId);
            int nextVersion = (maxVersion != null ? maxVersion : 0) + 1;
            
            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
            String uniqueFilename = System.currentTimeMillis() + "_v" + nextVersion + "_" + UUID.randomUUID().toString() + fileExtension;
            
            // Save file to disk
            Path uploadPath = Paths.get(uploadDir);
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            
            // Create version entity
            DocumentVersion version = new DocumentVersion(documentId, nextVersion, originalFilename, 
                                                        filePath.toString(), file.getSize(), uploadedBy, uploadedByName);
            version.setChangeDescription(changeDescription);
            
            DocumentVersion savedVersion = versionRepository.save(version);
            
            // Update document with new version info
            document.setVersion(nextVersion);
            document.setFilePath(filePath.toString());
            document.setFileSize(file.getSize());
            document.setOriginalFileName(originalFilename);
            documentRepository.save(document);
            
            log.info("New version {} uploaded for document {}", nextVersion, documentId);
            return savedVersion;
            
        } catch (IOException e) {
            log.error("Failed to upload new version: {}", e.getMessage());
            throw new RuntimeException("Failed to upload new version: " + e.getMessage());
        }
    }
    
    public byte[] downloadDocumentVersion(Long documentId, Integer version) {
        DocumentVersion docVersion = versionRepository.findByDocumentIdAndVersion(documentId, version)
            .orElseThrow(() -> new RuntimeException("Document version not found"));
        
        try {
            Path filePath = Paths.get(docVersion.getFilePath());
            return Files.readAllBytes(filePath);
        } catch (IOException e) {
            log.error("Failed to download document version: {}", e.getMessage());
            throw new RuntimeException("Failed to download document version: " + e.getMessage());
        }
    }
    
    public Document restoreDocumentVersion(Long documentId, Integer version) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        
        DocumentVersion docVersion = versionRepository.findByDocumentIdAndVersion(documentId, version)
            .orElseThrow(() -> new RuntimeException("Document version not found"));
        
        // Update document to point to the restored version
        document.setVersion(version);
        document.setFilePath(docVersion.getFilePath());
        document.setFileSize(docVersion.getFileSize());
        document.setOriginalFileName(docVersion.getFileName());
        
        Document restoredDocument = documentRepository.save(document);
        
        log.info("Document {} restored to version {}", documentId, version);
        return restoredDocument;
    }
    
    // Bulk Document Generation Methods
    public List<BulkDocumentGeneration> getAllBulkGenerations() {
        return bulkGenerationRepository.findAll();
    }
    
    public Optional<BulkDocumentGeneration> getBulkGenerationById(Long id) {
        return bulkGenerationRepository.findById(id);
    }
    
    public BulkDocumentGeneration createBulkGeneration(String name, Long templateId, 
                                                     BulkDocumentGeneration.RecipientType recipientType,
                                                     List<Long> recipientIds, Map<String, String> variables,
                                                     BulkDocumentGeneration.OutputFormat outputFormat,
                                                     Long createdBy, String createdByName) {
        
        DocumentTemplate template = templateRepository.findById(templateId)
            .orElseThrow(() -> new RuntimeException("Template not found"));
        
        BulkDocumentGeneration bulk = new BulkDocumentGeneration(name, templateId, template.getName(), 
                                                               recipientType, createdBy, createdByName);
        bulk.setRecipientIds(recipientIds);
        bulk.setVariables(variables);
        bulk.setOutputFormat(outputFormat);
        bulk.setTotalDocuments(recipientIds.size());
        
        return bulkGenerationRepository.save(bulk);
    }
    
    public void startBulkGeneration(Long id) {
        BulkDocumentGeneration bulk = bulkGenerationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bulk generation not found"));
        
        if (bulk.getStatus() != BulkDocumentGeneration.GenerationStatus.DRAFT) {
            throw new RuntimeException("Bulk generation is not in draft status");
        }
        
        bulk.setStatus(BulkDocumentGeneration.GenerationStatus.GENERATING);
        bulkGenerationRepository.save(bulk);
        
        // In a real implementation, this would be processed asynchronously
        // For now, we'll simulate completion
        try {
            Thread.sleep(1000); // Simulate processing time
            
            bulk.setStatus(BulkDocumentGeneration.GenerationStatus.COMPLETED);
            bulk.setGeneratedCount(bulk.getTotalDocuments());
            bulk.setCompletedAt(LocalDateTime.now());
            bulkGenerationRepository.save(bulk);
            
            log.info("Bulk generation completed: {}", bulk.getName());
            
        } catch (InterruptedException e) {
            bulk.setStatus(BulkDocumentGeneration.GenerationStatus.FAILED);
            bulk.setErrorMessage("Generation interrupted");
            bulkGenerationRepository.save(bulk);
            
            log.error("Bulk generation failed: {}", e.getMessage());
        }
    }
    
    public byte[] downloadBulkGeneration(Long id) {
        BulkDocumentGeneration bulk = bulkGenerationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Bulk generation not found"));
        
        if (bulk.getStatus() != BulkDocumentGeneration.GenerationStatus.COMPLETED) {
            throw new RuntimeException("Bulk generation is not completed");
        }
        
        // In a real implementation, this would return a ZIP file with all generated documents
        return ("Bulk generation: " + bulk.getName() + " - " + bulk.getGeneratedCount() + " documents").getBytes();
    }
    
    public void deleteBulkGeneration(Long id) {
        bulkGenerationRepository.deleteById(id);
    }
    
    // Document Folder Methods
    public List<DocumentFolder> getFolders(Long parentId) {
        if (parentId != null) {
            return folderRepository.findByParentFolderId(parentId);
        } else {
            return folderRepository.findByParentFolderIdIsNull();
        }
    }
    
    public DocumentFolder createFolder(String name, Long parentFolderId, String description, Long createdBy) {
        // Check if folder with same name exists in parent
        boolean exists = parentFolderId != null 
            ? folderRepository.existsByNameAndParentFolderId(name, parentFolderId)
            : folderRepository.existsByNameAndParentFolderIdIsNull(name);
            
        if (exists) {
            throw new RuntimeException("Folder with this name already exists in the parent directory");
        }
        
        // Build path
        String path = "/";
        if (parentFolderId != null) {
            DocumentFolder parentFolder = folderRepository.findById(parentFolderId)
                .orElseThrow(() -> new RuntimeException("Parent folder not found"));
            path = parentFolder.getPath() + name + "/";
        } else {
            path = "/" + name + "/";
        }
        
        DocumentFolder folder = new DocumentFolder(name, path, createdBy);
        folder.setParentFolderId(parentFolderId);
        folder.setDescription(description);
        
        DocumentFolder savedFolder = folderRepository.save(folder);
        
        // Update parent folder subfolder count
        if (parentFolderId != null) {
            updateFolderSubfolderCount(parentFolderId);
        }
        
        return savedFolder;
    }
    
    public DocumentFolder updateFolder(Long id, String name, String description) {
        DocumentFolder folder = folderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Folder not found"));
        
        folder.setName(name);
        folder.setDescription(description);
        
        return folderRepository.save(folder);
    }
    
    public void deleteFolder(Long id) {
        DocumentFolder folder = folderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Folder not found"));
        
        // Check if folder has documents or subfolders
        if (folder.getDocumentCount() > 0 || folder.getSubfolderCount() > 0) {
            throw new RuntimeException("Cannot delete folder that contains documents or subfolders");
        }
        
        Long parentId = folder.getParentFolderId();
        
        folderRepository.delete(folder);
        
        // Update parent folder subfolder count
        if (parentId != null) {
            updateFolderSubfolderCount(parentId);
        }
    }
    
    public Document moveDocument(Long documentId, Long folderId) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        
        Long oldFolderId = document.getFolderId();
        document.setFolderId(folderId);
        
        Document movedDocument = documentRepository.save(document);
        
        // Update folder counts
        if (oldFolderId != null) {
            updateFolderDocumentCount(oldFolderId);
        }
        if (folderId != null) {
            updateFolderDocumentCount(folderId);
        }
        
        return movedDocument;
    }
    
    private void updateFolderDocumentCount(Long folderId) {
        DocumentFolder folder = folderRepository.findById(folderId).orElse(null);
        if (folder != null) {
            long count = documentRepository.findByFolderId(folderId, Pageable.unpaged()).getTotalElements();
            folder.setDocumentCount((int) count);
            folderRepository.save(folder);
        }
    }
    
    private void updateFolderSubfolderCount(Long folderId) {
        DocumentFolder folder = folderRepository.findById(folderId).orElse(null);
        if (folder != null) {
            long count = folderRepository.countSubfolders(folderId);
            folder.setSubfolderCount((int) count);
            folderRepository.save(folder);
        }
    }
    
    // Statistics Methods
    public Map<String, Object> getDocumentStats() {
        Map<String, Object> stats = new HashMap<>();
        
        stats.put("totalDocuments", documentRepository.countTotal());
        stats.put("totalSize", documentRepository.getTotalFileSize());
        
        // Documents by type
        Map<String, Long> documentsByType = new HashMap<>();
        List<Object[]> typeResults = documentRepository.countByDocumentType();
        for (Object[] result : typeResults) {
            documentsByType.put(result[0].toString(), (Long) result[1]);
        }
        stats.put("documentsByType", documentsByType);
        
        // Documents by category
        Map<String, Long> documentsByCategory = new HashMap<>();
        List<Object[]> categoryResults = documentRepository.countByCategory();
        for (Object[] result : categoryResults) {
            documentsByCategory.put(result[0].toString(), (Long) result[1]);
        }
        stats.put("documentsByCategory", documentsByCategory);
        
        stats.put("recentUploads", documentRepository.countRecentUploads(LocalDateTime.now().minusDays(7)));
        stats.put("pendingSignatures", documentRepository.countPendingSignatures());
        stats.put("totalTemplates", templateRepository.countTotal());
        stats.put("activeTemplates", templateRepository.countActive());
        stats.put("bulkGenerationsToday", bulkGenerationRepository.countTodaysGenerations());
        
        return stats;
    }
    
    // Search Methods
    public List<Document> searchDocuments(String query) {
        return documentRepository.searchDocuments(query);
    }
    
    // Tag Methods
    public List<String> getAllTags() {
        return documentRepository.findAllTags();
    }
    
    public Document addTag(Long documentId, String tag) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        
        if (document.getTags() == null) {
            document.setTags(new ArrayList<>());
        }
        
        if (!document.getTags().contains(tag)) {
            document.getTags().add(tag);
            return documentRepository.save(document);
        }
        
        return document;
    }
    
    public Document removeTag(Long documentId, String tag) {
        Document document = documentRepository.findById(documentId)
            .orElseThrow(() -> new RuntimeException("Document not found"));
        
        if (document.getTags() != null) {
            document.getTags().remove(tag);
            return documentRepository.save(document);
        }
        
        return document;
    }
    
    // Utility Methods
    private List<String> extractVariables(String content) {
        List<String> variables = new ArrayList<>();
        Pattern pattern = Pattern.compile("\\{\\{([^}]+)\\}\\}");
        Matcher matcher = pattern.matcher(content);
        
        while (matcher.find()) {
            String variable = matcher.group(1).trim();
            if (!variables.contains(variable)) {
                variables.add(variable);
            }
        }
        
        return variables;
    }
    
    private String processTemplate(String template, Map<String, Object> variables) {
        String processed = template;
        
        for (Map.Entry<String, Object> entry : variables.entrySet()) {
            String placeholder = "{{" + entry.getKey() + "}}";
            String value = entry.getValue() != null ? entry.getValue().toString() : "";
            processed = processed.replace(placeholder, value);
        }
        
        return processed;
    }
}