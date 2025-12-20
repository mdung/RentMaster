package com.rentmaster.messaging;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    
    // Find messages by recipient
    List<Message> findByRecipientIdAndIsDeletedFalseOrderByCreatedAtDesc(Long recipientId);
    
    // Find messages by sender
    List<Message> findBySenderIdAndIsDeletedFalseOrderByCreatedAtDesc(Long senderId);
    
    // Find conversation between two users
    @Query("SELECT m FROM Message m WHERE " +
           "((m.senderId = :userId1 AND m.recipientId = :userId2) OR " +
           "(m.senderId = :userId2 AND m.recipientId = :userId1)) AND " +
           "m.isDeleted = false ORDER BY m.createdAt ASC")
    List<Message> findConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
    
    // Find messages by thread
    List<Message> findByThreadIdAndIsDeletedFalseOrderByCreatedAtAsc(Long threadId);
    
    // Find unread messages
    List<Message> findByRecipientIdAndIsReadFalseAndIsDeletedFalseOrderByCreatedAtDesc(Long recipientId);
    
    // Count unread messages
    long countByRecipientIdAndIsReadFalseAndIsDeletedFalse(Long recipientId);
    
    // Find messages by property
    List<Message> findByPropertyIdAndIsDeletedFalseOrderByCreatedAtDesc(Long propertyId);
    
    // Find messages by contract
    List<Message> findByContractIdAndIsDeletedFalseOrderByCreatedAtDesc(Long contractId);
    
    // Find messages by type
    List<Message> findByMessageTypeAndIsDeletedFalseOrderByCreatedAtDesc(String messageType);
    
    // Find messages by priority
    List<Message> findByPriorityAndIsDeletedFalseOrderByCreatedAtDesc(String priority);
    
    // Find archived messages
    List<Message> findByRecipientIdAndIsArchivedTrueAndIsDeletedFalseOrderByCreatedAtDesc(Long recipientId);
    
    // Find messages by date range
    @Query("SELECT m FROM Message m WHERE m.createdAt BETWEEN :startDate AND :endDate AND m.isDeleted = false ORDER BY m.createdAt DESC")
    List<Message> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    // Find messages with attachments
    @Query("SELECT m FROM Message m WHERE SIZE(m.attachments) > 0 AND m.isDeleted = false ORDER BY m.createdAt DESC")
    List<Message> findMessagesWithAttachments();
    
    // Search messages by content
    @Query("SELECT m FROM Message m WHERE " +
           "(LOWER(m.subject) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(m.content) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) AND " +
           "m.isDeleted = false ORDER BY m.createdAt DESC")
    List<Message> searchMessages(@Param("searchTerm") String searchTerm);
    
    // Find messages by tag
    @Query("SELECT m FROM Message m JOIN m.tags t WHERE t = :tag AND m.isDeleted = false ORDER BY m.createdAt DESC")
    List<Message> findByTag(@Param("tag") String tag);
    
    // Get message statistics
    @Query("SELECT m.messageType, COUNT(m) FROM Message m WHERE m.isDeleted = false GROUP BY m.messageType")
    List<Object[]> getMessageStatsByType();
    
    @Query("SELECT m.priority, COUNT(m) FROM Message m WHERE m.isDeleted = false GROUP BY m.priority")
    List<Object[]> getMessageStatsByPriority();
    
    // Find recent messages for user
    @Query("SELECT m FROM Message m WHERE " +
           "(m.senderId = :userId OR m.recipientId = :userId) AND " +
           "m.isDeleted = false AND m.createdAt >= :since ORDER BY m.createdAt DESC")
    List<Message> findRecentMessagesForUser(@Param("userId") Long userId, @Param("since") LocalDateTime since);
}