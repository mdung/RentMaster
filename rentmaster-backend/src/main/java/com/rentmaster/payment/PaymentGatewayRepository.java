package com.rentmaster.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentGatewayRepository extends JpaRepository<PaymentGateway, Long> {
    
    List<PaymentGateway> findByIsActive(Boolean isActive);
    
    List<PaymentGateway> findByType(PaymentGateway.GatewayType type);
    
    List<PaymentGateway> findByTypeAndIsActive(PaymentGateway.GatewayType type, Boolean isActive);
    
    Optional<PaymentGateway> findByNameIgnoreCase(String name);
    
    @Query("SELECT pg FROM PaymentGateway pg WHERE pg.isActive = true ORDER BY pg.processingFee ASC")
    List<PaymentGateway> findActiveGatewaysOrderByFee();
    
    @Query("SELECT pg FROM PaymentGateway pg WHERE pg.currency = :currency AND pg.isActive = true")
    List<PaymentGateway> findByCurrencyAndActive(@Param("currency") String currency);
    
    @Query("SELECT COUNT(pg) FROM PaymentGateway pg WHERE pg.isActive = true")
    Long countActiveGateways();
    
    @Query("SELECT DISTINCT pg.currency FROM PaymentGateway pg WHERE pg.isActive = true")
    List<String> findDistinctActiveCurrencies();
}