package com.rentmaster.document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentFolderRepository extends JpaRepository<DocumentFolder, Long> {
    
    List<DocumentFolder> findByParentFolderIdIsNull();
    
    List<DocumentFolder> findByParentFolderId(Long parentFolderId);
    
    List<DocumentFolder> findByCreatedBy(Long createdBy);
    
    List<DocumentFolder> findByIsSystemTrue();
    
    List<DocumentFolder> findByIsSystemFalse();
    
    @Query("SELECT df FROM DocumentFolder df WHERE df.path LIKE CONCAT(:path, '%')")
    List<DocumentFolder> findByPathStartingWith(@Param("path") String path);
    
    @Query("SELECT COUNT(df) FROM DocumentFolder df WHERE df.parentFolderId = :parentId")
    long countSubfolders(@Param("parentId") Long parentId);
    
    boolean existsByNameAndParentFolderId(String name, Long parentFolderId);
    
    boolean existsByNameAndParentFolderIdIsNull(String name);
}