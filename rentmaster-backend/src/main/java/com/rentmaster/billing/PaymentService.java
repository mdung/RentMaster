package com.rentmaster.billing;

import com.rentmaster.billing.dto.PaymentCreateDTO;
import com.rentmaster.billing.dto.PaymentDTO;
import com.rentmaster.billing.dto.PaymentUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InvoiceService invoiceService;

    public List<PaymentDTO> findAll() {
        return paymentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PaymentDTO findById(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        return toDTO(payment);
    }

    public List<PaymentDTO> findByInvoiceId(Long invoiceId) {
        return paymentRepository.findByInvoiceId(invoiceId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PaymentDTO create(PaymentCreateDTO dto) {
        Invoice invoice = invoiceRepository.findById(dto.getInvoiceId())
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        BigDecimal totalPaid = paymentRepository.getTotalPaidForInvoice(dto.getInvoiceId());
        if (totalPaid == null)
            totalPaid = BigDecimal.ZERO;

        if (totalPaid.add(dto.getAmount()).compareTo(invoice.getTotalAmount()) > 0) {
            throw new RuntimeException("Payment amount exceeds invoice total");
        }

        Payment payment = new Payment();
        payment.setInvoice(invoice);
        payment.setAmount(dto.getAmount());
        payment.setMethod(dto.getMethod());
        payment.setNote(dto.getNote());

        Payment saved = paymentRepository.save(payment);

        // Update invoice status
        invoiceService.updateInvoiceStatus(dto.getInvoiceId());

        return toDTO(saved);
    }

    public void delete(Long id) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        Long invoiceId = payment.getInvoice().getId();
        paymentRepository.deleteById(id);
        invoiceService.updateInvoiceStatus(invoiceId);
    }

    public PaymentDTO update(Long id, PaymentUpdateDTO dto) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        Invoice invoice = payment.getInvoice();

        // Recalculate total paid excluding this payment
        BigDecimal totalPaid = paymentRepository.getTotalPaidForInvoice(invoice.getId());
        if (totalPaid == null)
            totalPaid = BigDecimal.ZERO;
        totalPaid = totalPaid.subtract(payment.getAmount());
        if (totalPaid.compareTo(BigDecimal.ZERO) < 0)
            totalPaid = BigDecimal.ZERO;

        BigDecimal newAmount = dto.getAmount() != null ? dto.getAmount() : payment.getAmount();
        if (totalPaid.add(newAmount).compareTo(invoice.getTotalAmount()) > 0) {
            throw new RuntimeException("Updated payment amount exceeds invoice total");
        }

        payment.setAmount(newAmount);
        if (dto.getMethod() != null) {
            payment.setMethod(dto.getMethod());
        }
        if (dto.getNote() != null) {
            payment.setNote(dto.getNote());
        }

        Payment saved = paymentRepository.save(payment);

        // Update invoice status after change
        invoiceService.updateInvoiceStatus(invoice.getId());

        return toDTO(saved);
    }

    private PaymentDTO toDTO(Payment payment) {
        PaymentDTO dto = new PaymentDTO();
        dto.setId(payment.getId());
        dto.setInvoiceId(payment.getInvoice().getId());
        dto.setAmount(payment.getAmount());
        dto.setPaidAt(payment.getPaidAt());
        dto.setMethod(payment.getMethod());
        dto.setNote(payment.getNote());
        return dto;
    }
}
