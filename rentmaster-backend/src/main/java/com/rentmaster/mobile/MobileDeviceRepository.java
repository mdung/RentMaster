package com.rentmaster.mobile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface MobileDeviceRepository extends JpaRepository<MobileDevice, Long> {
    
    List<MobileDevice> findByUserId(Long userId);
    
    List<MobileDevice> findByUserIdAndIsActive(Long userId, Boolean isActive);
    
    Optional<MobileDevice> findByDeviceToken(String deviceToken);
    
    List<MobileDevice> findByPlatform(MobileDevice.Platform platform);
    
    List<MobileDevice> findByPlatformAndIsActive(MobileDevice.Platform platform, Boolean isActive);
    
    @Query("SELECT md FROM MobileDevice md WHERE md.isActive = true AND md.pushNotificationsEnabled = true")
    List<MobileDevice> findActiveDevicesWithPushEnabled();
    
    @Query("SELECT md FROM MobileDevice md WHERE md.userId = :userId AND md.isActive = true AND md.pushNotificationsEnabled = true")
    List<MobileDevice> findActiveDevicesWithPushEnabledByUserId(@Param("userId") Long userId);
    
    @Query("SELECT md FROM MobileDevice md WHERE md.lastActiveAt < :cutoffDate")
    List<MobileDevice> findInactiveDevices(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    @Query("SELECT COUNT(md) FROM MobileDevice md WHERE md.platform = :platform AND md.isActive = true")
    Long countActiveDevicesByPlatform(@Param("platform") MobileDevice.Platform platform);
    
    @Query("SELECT md.appVersion, COUNT(md) FROM MobileDevice md WHERE md.isActive = true GROUP BY md.appVersion")
    List<Object[]> getAppVersionDistribution();
    
    @Query("SELECT md FROM MobileDevice md WHERE md.userId IN :userIds AND md.isActive = true AND md.pushNotificationsEnabled = true")
    List<MobileDevice> findActiveDevicesForUsers(@Param("userIds") List<Long> userIds);
    
    void deleteByUserIdAndDeviceToken(Long userId, String deviceToken);
}