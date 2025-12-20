package com.rentmaster.document;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "*")
public class DocumentController {
    
    @Autowired
    private DocumentService documentService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    // Document Management Endpoints
    @GetMapping
    public ResponseEntity<Page<Document>> getDocuments(
            @RequestParam(required = false) String documentType,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Long tenantId,
            @RequestParam(required = false) Long propertyId,
            @RequestParam(required = false) Long folderId,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Document.DocumentType docType = documentType != null ? Document.DocumentType.valueOf(documentType) : null;
        Document.DocumentCategory docCategory = category != null ? Document.DocumentCategory.valueOf(category) : null;
        
        Page<Document> documents = documentService.getDocuments(docType, docCategory, tenantId, propertyId, folderId, search, pageable);
        return ResponseEntity.ok(documents);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocument(@PathVariable Long id) {
        return documentService.getDocumentById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("metadata") String metadataJson) {
        
        try {
            // Parse metadata JSON
            @SuppressWarnings("unchecked")
            Map<String, Object> metadata = objectMapper.readValue(metadataJson, Map.class);
            
            String name = (String) metadata.get("name");
            Document.DocumentType documentType = Document.DocumentType.valueOf((String) metadata.get("documentType"));
            Document.DocumentCategory category = Document.DocumentCategory.valueOf((String) metadata.get("category"));
            String relatedEntityType = (String) metadata.get("relatedEntityType");
            Long relatedEntityId = metadata.get("relatedEntityId") != null ? Long.valueOf(metadata.get("relatedEntityId").toString()) : null;
            Long tenantId = metadata.get("tenantId") != null ? Long.valueOf(metadata.get("tenantId").toString()) : null;
            Long propertyId = metadata.get("propertyId") != null ? Long.valueOf(metadata.get("propertyId").toString()) : null;
            Long contractId = metadata.get("contractId") != null ? Long.valueOf(metadata.get("contractId").toString()) : null;
            String description = (String) metadata.get("description");
            @SuppressWarnings("unchecked")
            List<String> tags = (List<String>) metadata.get("tags");
            Boolean isPublic = (Boolean) metadata.get("isPublic");
            Boolean requiresSignature = (Boolean) metadata.get("requiresSignature");
            String expiryDateStr = (String) metadata.get("expiryDate");
            LocalDateTime expiryDate = expiryDateStr != null ? LocalDateTime.parse(expiryDateStr) : null;
            Long folderId = metadata.get("folderId") != null ? Long.valueOf(metadata.get("folderId").toString()) : null;
            
            // For now, use hardcoded user info. In real app, get from authentication context
            Long uploadedBy = 1L;
            String uploadedByName = "Admin User";
            
            Document document = documentService.uploadDocument(file, name, documentType, category, relatedEntityType,
                relatedEntityId, tenantId, propertyId, contractId, description, tags, isPublic, requiresSignature,
                expiryDate, folderId, uploadedBy, uploadedByName);
            
            return ResponseEntity.ok(document);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            Document.DocumentType documentType = Document.DocumentType.valueOf((String) request.get("documentType"));
            Document.DocumentCategory category = Document.DocumentCategory.valueOf((String) request.get("category"));
            String description = (String) request.get("description");
            @SuppressWarnings("unchecked")
            List<String> tags = (List<String>) request.get("tags");
            Boolean isPublic = (Boolean) request.get("isPublic");
            Boolean requiresSignature = (Boolean) request.get("requiresSignature");
            String expiryDateStr = (String) request.get("expiryDate");
            LocalDateTime expiryDate = expiryDateStr != null ? LocalDateTime.parse(expiryDateStr) : null;
            Long folderId = request.get("folderId") != null ? Long.valueOf(request.get("folderId").toString()) : null;
            
            Document document = documentService.updateDocument(id, name, documentType, category, description, tags,
                isPublic, requiresSignature, expiryDate, folderId);
            
            return ResponseEntity.ok(document);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<byte[]> downloadDocument(@PathVariable Long id) {
        try {
            Document document = documentService.getDocumentById(id)
                .orElseThrow(() -> new RuntimeException("Document not found"));
            
            byte[] fileContent = documentService.downloadDocument(id);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + document.getOriginalFileName() + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileContent);
                
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/{id}/preview")
    public ResponseEntity<Map<String, String>> previewDocument(@PathVariable Long id) {
        try {
            String previewUrl = documentService.getPreviewUrl(id);
            return ResponseEntity.ok(Map.of("previewUrl", previewUrl));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Document Template Endpoints
    @GetMapping("/templates")
    public ResponseEntity<List<DocumentTemplate>> getTemplates() {
        return ResponseEntity.ok(documentService.getAllTemplates());
    }
    
    @GetMapping("/templates/{id}")
    public ResponseEntity<DocumentTemplate> getTemplate(@PathVariable Long id) {
        return documentService.getTemplateById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/templates")
    public ResponseEntity<DocumentTemplate> createTemplate(@RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            DocumentTemplate.TemplateType templateType = DocumentTemplate.TemplateType.valueOf((String) request.get("templateType"));
            String content = (String) request.get("content");
            String category = (String) request.get("category");
            String description = (String) request.get("description");
            Boolean isDefault = (Boolean) request.get("isDefault");
            Boolean active = (Boolean) request.get("active");
            
            // For now, use hardcoded user info
            Long createdBy = 1L;
            String createdByName = "Admin User";
            
            DocumentTemplate template = documentService.createTemplate(name, templateType, content, category,
                description, isDefault, active, createdBy, createdByName);
            
            return ResponseEntity.ok(template);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/templates/{id}")
    public ResponseEntity<DocumentTemplate> updateTemplate(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            DocumentTemplate.TemplateType templateType = DocumentTemplate.TemplateType.valueOf((String) request.get("templateType"));
            String content = (String) request.get("content");
            String category = (String) request.get("category");
            String description = (String) request.get("description");
            Boolean isDefault = (Boolean) request.get("isDefault");
            Boolean active = (Boolean) request.get("active");
            
            DocumentTemplate template = documentService.updateTemplate(id, name, templateType, content, category,
                description, isDefault, active);
            
            return ResponseEntity.ok(template);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/templates/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        documentService.deleteTemplate(id);
        return ResponseEntity.ok().build();
    }
    
    @PatchMapping("/templates/{id}/toggle")
    public ResponseEntity<DocumentTemplate> toggleTemplate(@PathVariable Long id) {
        DocumentTemplate template = documentService.toggleTemplate(id);
        return ResponseEntity.ok(template);
    }
    
    @PostMapping("/templates/{id}/preview")
    public ResponseEntity<Map<String, String>> previewTemplate(@PathVariable Long id, @RequestBody Map<String, Object> variables) {
        try {
            String content = documentService.previewTemplate(id, variables);
            return ResponseEntity.ok(Map.of("content", content));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/templates/{id}/generate")
    public ResponseEntity<byte[]> generateDocument(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> variables = (Map<String, Object>) request.get("variables");
            String format = (String) request.getOrDefault("format", "PDF");
            
            byte[] documentContent = documentService.generateDocumentFromTemplate(id, variables, format);
            
            String filename = "generated_document." + format.toLowerCase();
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(documentContent);
                
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Document Signature Endpoints
    @GetMapping("/{documentId}/signatures")
    public ResponseEntity<List<DocumentSignature>> getDocumentSignatures(@PathVariable Long documentId) {
        List<DocumentSignature> signatures = documentService.getDocumentSignatures(documentId);
        return ResponseEntity.ok(signatures);
    }
    
    @PostMapping("/signatures/request")
    public ResponseEntity<DocumentSignature> createSignatureRequest(@RequestBody Map<String, Object> request) {
        try {
            Long documentId = Long.valueOf(request.get("documentId").toString());
            String signerName = (String) request.get("signerName");
            String signerEmail = (String) request.get("signerEmail");
            DocumentSignature.SignerRole signerRole = DocumentSignature.SignerRole.valueOf((String) request.get("signerRole"));
            String expiresAtStr = (String) request.get("expiresAt");
            LocalDateTime expiresAt = expiresAtStr != null ? LocalDateTime.parse(expiresAtStr) : null;
            
            DocumentSignature signature = documentService.createSignatureRequest(documentId, signerName, signerEmail, signerRole, expiresAt);
            return ResponseEntity.ok(signature);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/signatures/{id}/sign")
    public ResponseEntity<DocumentSignature> signDocument(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String signatureData = request.get("signatureData");
            String ipAddress = "127.0.0.1"; // In real app, get from request
            
            DocumentSignature signature = documentService.signDocument(id, signatureData, ipAddress);
            return ResponseEntity.ok(signature);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/signatures/{id}/reject")
    public ResponseEntity<DocumentSignature> rejectSignature(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String reason = request.get("reason");
            DocumentSignature signature = documentService.rejectSignature(id, reason);
            return ResponseEntity.ok(signature);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{documentId}/signature-status")
    public ResponseEntity<Map<String, Long>> getSignatureStatus(@PathVariable Long documentId) {
        Map<String, Long> status = documentService.getSignatureStatus(documentId);
        return ResponseEntity.ok(status);
    }
    
    // Document Version Endpoints
    @GetMapping("/{documentId}/versions")
    public ResponseEntity<List<DocumentVersion>> getDocumentVersions(@PathVariable Long documentId) {
        List<DocumentVersion> versions = documentService.getDocumentVersions(documentId);
        return ResponseEntity.ok(versions);
    }
    
    @PostMapping("/{documentId}/versions")
    public ResponseEntity<DocumentVersion> uploadNewVersion(
            @PathVariable Long documentId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false) String changeDescription) {
        
        try {
            // For now, use hardcoded user info
            Long uploadedBy = 1L;
            String uploadedByName = "Admin User";
            
            DocumentVersion version = documentService.uploadNewVersion(documentId, file, changeDescription, uploadedBy, uploadedByName);
            return ResponseEntity.ok(version);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{documentId}/versions/{version}/download")
    public ResponseEntity<byte[]> downloadDocumentVersion(@PathVariable Long documentId, @PathVariable Integer version) {
        try {
            byte[] fileContent = documentService.downloadDocumentVersion(documentId, version);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"document_v" + version + "\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(fileContent);
                
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/{documentId}/versions/{version}/restore")
    public ResponseEntity<Document> restoreDocumentVersion(@PathVariable Long documentId, @PathVariable Integer version) {
        try {
            Document document = documentService.restoreDocumentVersion(documentId, version);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Bulk Document Generation Endpoints
    @GetMapping("/bulk-generation")
    public ResponseEntity<List<BulkDocumentGeneration>> getBulkGenerations() {
        return ResponseEntity.ok(documentService.getAllBulkGenerations());
    }
    
    @GetMapping("/bulk-generation/{id}")
    public ResponseEntity<BulkDocumentGeneration> getBulkGeneration(@PathVariable Long id) {
        return documentService.getBulkGenerationById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping("/bulk-generation")
    public ResponseEntity<BulkDocumentGeneration> createBulkGeneration(@RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            Long templateId = Long.valueOf(request.get("templateId").toString());
            BulkDocumentGeneration.RecipientType recipientType = BulkDocumentGeneration.RecipientType.valueOf((String) request.get("recipientType"));
            @SuppressWarnings("unchecked")
            List<Long> recipientIds = (List<Long>) request.get("recipientIds");
            @SuppressWarnings("unchecked")
            Map<String, String> variables = (Map<String, String>) request.get("variables");
            BulkDocumentGeneration.OutputFormat outputFormat = BulkDocumentGeneration.OutputFormat.valueOf((String) request.get("outputFormat"));
            
            // For now, use hardcoded user info
            Long createdBy = 1L;
            String createdByName = "Admin User";
            
            BulkDocumentGeneration bulk = documentService.createBulkGeneration(name, templateId, recipientType,
                recipientIds, variables, outputFormat, createdBy, createdByName);
            
            return ResponseEntity.ok(bulk);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/bulk-generation/{id}/start")
    public ResponseEntity<Void> startBulkGeneration(@PathVariable Long id) {
        try {
            documentService.startBulkGeneration(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/bulk-generation/{id}/download")
    public ResponseEntity<byte[]> downloadBulkGeneration(@PathVariable Long id) {
        try {
            byte[] content = documentService.downloadBulkGeneration(id);
            
            return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"bulk_generation_" + id + ".zip\"")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(content);
                
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/bulk-generation/{id}")
    public ResponseEntity<Void> deleteBulkGeneration(@PathVariable Long id) {
        documentService.deleteBulkGeneration(id);
        return ResponseEntity.ok().build();
    }
    
    // Document Folder Endpoints
    @GetMapping("/folders")
    public ResponseEntity<List<DocumentFolder>> getFolders(@RequestParam(required = false) Long parentId) {
        List<DocumentFolder> folders = documentService.getFolders(parentId);
        return ResponseEntity.ok(folders);
    }
    
    @PostMapping("/folders")
    public ResponseEntity<DocumentFolder> createFolder(@RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            Long parentFolderId = request.get("parentFolderId") != null ? Long.valueOf(request.get("parentFolderId").toString()) : null;
            String description = (String) request.get("description");
            
            // For now, use hardcoded user info
            Long createdBy = 1L;
            
            DocumentFolder folder = documentService.createFolder(name, parentFolderId, description, createdBy);
            return ResponseEntity.ok(folder);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/folders/{id}")
    public ResponseEntity<DocumentFolder> updateFolder(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String description = request.get("description");
            
            DocumentFolder folder = documentService.updateFolder(id, name, description);
            return ResponseEntity.ok(folder);
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/folders/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable Long id) {
        try {
            documentService.deleteFolder(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/{documentId}/move")
    public ResponseEntity<Document> moveDocument(@PathVariable Long documentId, @RequestBody Map<String, Object> request) {
        try {
            Long folderId = request.get("folderId") != null ? Long.valueOf(request.get("folderId").toString()) : null;
            Document document = documentService.moveDocument(documentId, folderId);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Statistics and Search Endpoints
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDocumentStats() {
        return ResponseEntity.ok(documentService.getDocumentStats());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Document>> searchDocuments(@RequestParam String query) {
        List<Document> documents = documentService.searchDocuments(query);
        return ResponseEntity.ok(documents);
    }
    
    @GetMapping("/tags")
    public ResponseEntity<List<String>> getAllTags() {
        return ResponseEntity.ok(documentService.getAllTags());
    }
    
    @PostMapping("/{documentId}/tags")
    public ResponseEntity<Document> addTag(@PathVariable Long documentId, @RequestBody Map<String, String> request) {
        try {
            String tag = request.get("tag");
            Document document = documentService.addTag(documentId, tag);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @DeleteMapping("/{documentId}/tags/{tag}")
    public ResponseEntity<Document> removeTag(@PathVariable Long documentId, @PathVariable String tag) {
        try {
            Document document = documentService.removeTag(documentId, tag);
            return ResponseEntity.ok(document);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}