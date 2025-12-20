package com.rentmaster.communication;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationChannelRepository extends JpaRepository<NotificationChannel, Long> {
    
    List<NotificationChannel> findByActiveTrue();
    
    List<NotificationChannel> findByType(NotificationChannel.ChannelType type);
    
    Optional<NotificationChannel> findByTypeAndIsDefaultTrue(NotificationChannel.ChannelType type);
    
    @Query("SELECT nc FROM NotificationChannel nc WHERE nc.active = true AND nc.type = :type")
    List<NotificationChannel> findActiveByType(@Param("type") NotificationChannel.ChannelType type);
    
    @Query("SELECT COUNT(nc) FROM NotificationChannel nc WHERE nc.active = true")
    long countActive();
    
    @Query("SELECT COUNT(nc) FROM NotificationChannel nc")
    long countTotal();
    
    boolean existsByTypeAndIsDefaultTrueAndIdNot(NotificationChannel.ChannelType type, Long id);
    
    boolean existsByTypeAndIsDefaultTrue(NotificationChannel.ChannelType type);
}