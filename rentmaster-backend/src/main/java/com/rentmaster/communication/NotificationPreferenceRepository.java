package com.rentmaster.communication;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, Long> {
    
    List<NotificationPreference> findByUserId(Long userId);
    
    List<NotificationPreference> findByNotificationType(NotificationPreference.NotificationType notificationType);
    
    Optional<NotificationPreference> findByUserIdAndNotificationType(Long userId, NotificationPreference.NotificationType notificationType);
    
    List<NotificationPreference> findByEnabledTrue();
    
    @Query("SELECT np FROM NotificationPreference np WHERE np.userId = :userId AND np.enabled = true")
    List<NotificationPreference> findEnabledByUserId(@Param("userId") Long userId);
    
    @Query("SELECT np FROM NotificationPreference np WHERE np.notificationType = :notificationType AND np.enabled = true")
    List<NotificationPreference> findEnabledByNotificationType(@Param("notificationType") NotificationPreference.NotificationType notificationType);
    
    @Query("SELECT np FROM NotificationPreference np WHERE :channel MEMBER OF np.channels AND np.enabled = true")
    List<NotificationPreference> findByChannelAndEnabled(@Param("channel") NotificationPreference.ChannelType channel);
}