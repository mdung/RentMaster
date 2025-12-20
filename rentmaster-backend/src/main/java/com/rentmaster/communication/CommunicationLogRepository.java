package com.rentmaster.communication;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommunicationLogRepository extends JpaRepository<CommunicationLog, Long> {

    Page<CommunicationLog> findByChannel(NotificationChannel.ChannelType channel, Pageable pageable);

    Page<CommunicationLog> findByStatus(CommunicationLog.CommunicationStatus status, Pageable pageable);

    Page<CommunicationLog> findByRecipientType(CommunicationLog.RecipientType recipientType, Pageable pageable);

    Page<CommunicationLog> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable);

    @Query("SELECT cl FROM CommunicationLog cl WHERE " +
            "(:channel IS NULL OR cl.channel = :channel) AND " +
            "(:status IS NULL OR cl.status = :status) AND " +
            "(:recipientType IS NULL OR cl.recipientType = :recipientType) AND " +
            "(:startDate IS NULL OR cl.createdAt >= :startDate) AND " +
            "(:endDate IS NULL OR cl.createdAt <= :endDate)")
    Page<CommunicationLog> findWithFilters(
            @Param("channel") NotificationChannel.ChannelType channel,
            @Param("status") CommunicationLog.CommunicationStatus status,
            @Param("recipientType") CommunicationLog.RecipientType recipientType,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            Pageable pageable);

    List<CommunicationLog> findByRecipientIdAndRecipientType(Long recipientId,
            CommunicationLog.RecipientType recipientType);

    List<CommunicationLog> findByStatus(CommunicationLog.CommunicationStatus status);

    @Query("SELECT COUNT(cl) FROM CommunicationLog cl WHERE CAST(cl.createdAt AS LocalDate) = CURRENT_DATE")
    long countTodaysCommunications();

    @Query("SELECT COUNT(cl) FROM CommunicationLog cl WHERE cl.status = 'DELIVERED'")
    long countDelivered();

    @Query("SELECT COUNT(cl) FROM CommunicationLog cl WHERE cl.status = 'FAILED'")
    long countFailed();

    @Query("SELECT COUNT(cl) FROM CommunicationLog cl")
    long countTotal();
}