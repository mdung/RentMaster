package com.rentmaster.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentIntentRepository extends JpaRepository<PaymentIntent, String> {
    
    List<PaymentIntent> findByStatus(PaymentIntent.PaymentIntentStatus status);
    
    List<PaymentIntent> findByPaymentMethodId(String paymentMethodId);
    
    @Query("SELECT pi FROM PaymentIntent pi WHERE pi.createdAt BETWEEN :startDate AND :endDate")
    List<PaymentIntent> findByCreatedAtBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT pi FROM PaymentIntent pi WHERE pi.status = :status AND pi.createdAt < :cutoffDate")
    List<PaymentIntent> findExpiredIntents(@Param("status") PaymentIntent.PaymentIntentStatus status, @Param("cutoffDate") LocalDateTime cutoffDate);
    
    @Query("SELECT COUNT(pi) FROM PaymentIntent pi WHERE pi.status = :status")
    Long countByStatus(@Param("status") PaymentIntent.PaymentIntentStatus status);
    
    @Query("SELECT SUM(pi.amount) FROM PaymentIntent pi WHERE pi.status = 'SUCCEEDED' AND pi.createdAt BETWEEN :startDate AND :endDate")
    Double getTotalSuccessfulAmount(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT pi.currency, COUNT(pi), SUM(pi.amount) FROM PaymentIntent pi WHERE pi.status = 'SUCCEEDED' GROUP BY pi.currency")
    List<Object[]> getSuccessfulPaymentsByCurrency();
}