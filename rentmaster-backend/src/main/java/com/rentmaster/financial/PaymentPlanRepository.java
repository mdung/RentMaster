package com.rentmaster.financial;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentPlanRepository extends JpaRepository<PaymentPlan, Long> {
    List<PaymentPlan> findByStatus(PaymentPlan.PaymentPlanStatus status);
    List<PaymentPlan> findByInvoiceId(Long invoiceId);
}

