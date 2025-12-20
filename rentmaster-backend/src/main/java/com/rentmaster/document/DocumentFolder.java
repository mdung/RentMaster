package com.rentmaster.document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "document_folders")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class DocumentFolder {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "parent_folder_id")
    private Long parentFolderId;
    
    @Column(name = "path", nullable = false)
    private String path;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "is_system", nullable = false)
    private Boolean isSystem = false;
    
    @Embedded
    private FolderPermissions permissions;
    
    @Column(name = "document_count", nullable = false)
    private Integer documentCount = 0;
    
    @Column(name = "subfolder_count", nullable = false)
    private Integer subfolderCount = 0;
    
    @Column(name = "created_by", nullable = false)
    private Long createdBy;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @Embeddable
    public static class FolderPermissions {
        @Column(name = "can_read")
        private Boolean canRead = true;
        
        @Column(name = "can_write")
        private Boolean canWrite = true;
        
        @Column(name = "can_delete")
        private Boolean canDelete = true;
        
        // Constructors
        public FolderPermissions() {}
        
        public FolderPermissions(Boolean canRead, Boolean canWrite, Boolean canDelete) {
            this.canRead = canRead;
            this.canWrite = canWrite;
            this.canDelete = canDelete;
        }
        
        // Getters and Setters
        public Boolean getCanRead() {
            return canRead;
        }
        
        public void setCanRead(Boolean canRead) {
            this.canRead = canRead;
        }
        
        public Boolean getCanWrite() {
            return canWrite;
        }
        
        public void setCanWrite(Boolean canWrite) {
            this.canWrite = canWrite;
        }
        
        public Boolean getCanDelete() {
            return canDelete;
        }
        
        public void setCanDelete(Boolean canDelete) {
            this.canDelete = canDelete;
        }
    }
    
    // Constructors
    public DocumentFolder() {
        this.createdAt = LocalDateTime.now();
        this.permissions = new FolderPermissions();
    }
    
    public DocumentFolder(String name, String path, Long createdBy) {
        this();
        this.name = name;
        this.path = path;
        this.createdBy = createdBy;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public Long getParentFolderId() {
        return parentFolderId;
    }
    
    public void setParentFolderId(Long parentFolderId) {
        this.parentFolderId = parentFolderId;
    }
    
    public String getPath() {
        return path;
    }
    
    public void setPath(String path) {
        this.path = path;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Boolean getIsSystem() {
        return isSystem;
    }
    
    public void setIsSystem(Boolean isSystem) {
        this.isSystem = isSystem;
    }
    
    public FolderPermissions getPermissions() {
        return permissions;
    }
    
    public void setPermissions(FolderPermissions permissions) {
        this.permissions = permissions;
    }
    
    public Integer getDocumentCount() {
        return documentCount;
    }
    
    public void setDocumentCount(Integer documentCount) {
        this.documentCount = documentCount;
    }
    
    public Integer getSubfolderCount() {
        return subfolderCount;
    }
    
    public void setSubfolderCount(Integer subfolderCount) {
        this.subfolderCount = subfolderCount;
    }
    
    public Long getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}