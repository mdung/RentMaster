package com.rentmaster.mobile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OfflineActionRepository extends JpaRepository<OfflineAction, Long> {
    
    List<OfflineAction> findByUserId(Long userId);
    
    List<OfflineAction> findByUserIdAndStatus(Long userId, OfflineAction.Status status);
    
    List<OfflineAction> findByStatus(OfflineAction.Status status);
    
    List<OfflineAction> findByActionType(String actionType);
    
    @Query("SELECT oa FROM OfflineAction oa WHERE oa.status = 'QUEUED' ORDER BY oa.syncPriority DESC, oa.createdAt ASC")
    List<OfflineAction> findQueuedActionsOrderedByPriority();
    
    @Query("SELECT oa FROM OfflineAction oa WHERE oa.status = 'FAILED' AND oa.retryCount < oa.maxRetries")
    List<OfflineAction> findRetryableActions();
    
    @Query("SELECT oa FROM OfflineAction oa WHERE oa.userId = :userId AND oa.status IN ('QUEUED', 'PROCESSING')")
    List<OfflineAction> findPendingActionsByUserId(@Param("userId") Long userId);
    
    @Query("SELECT oa FROM OfflineAction oa WHERE oa.createdAt < :cutoffDate AND oa.status IN ('COMPLETED', 'FAILED')")
    List<OfflineAction> findOldActions(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    @Query("SELECT COUNT(oa) FROM OfflineAction oa WHERE oa.userId = :userId AND oa.status = :status")
    Long countByUserIdAndStatus(@Param("userId") Long userId, @Param("status") OfflineAction.Status status);
    
    @Query("SELECT oa.actionType, COUNT(oa) FROM OfflineAction oa WHERE oa.status = 'COMPLETED' GROUP BY oa.actionType")
    List<Object[]> getActionTypeStatistics();
    
    @Query("SELECT oa FROM OfflineAction oa WHERE oa.deviceId = :deviceId AND oa.status IN ('QUEUED', 'PROCESSING')")
    List<OfflineAction> findPendingActionsByDeviceId(@Param("deviceId") String deviceId);
    
    void deleteByUserIdAndStatus(Long userId, OfflineAction.Status status);
}