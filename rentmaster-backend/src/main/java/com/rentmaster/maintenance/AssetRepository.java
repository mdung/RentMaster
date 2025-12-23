package com.rentmaster.maintenance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    Optional<Asset> findByAssetCode(String assetCode);
    List<Asset> findByPropertyId(Long propertyId);
    List<Asset> findByRoomId(Long roomId);
    List<Asset> findByCategory(String category);
    List<Asset> findByStatus(String status);
    List<Asset> findByCondition(String condition);
    
    @Query("SELECT a FROM Asset a WHERE a.nextMaintenanceDate <= :date AND a.status = 'ACTIVE'")
    List<Asset> findAssetsDueForMaintenance(@Param("date") LocalDate date);
    
    @Query("SELECT a FROM Asset a WHERE a.warrantyExpiryDate <= :date AND a.status = 'ACTIVE'")
    List<Asset> findAssetsWithExpiringWarranty(@Param("date") LocalDate date);
}

