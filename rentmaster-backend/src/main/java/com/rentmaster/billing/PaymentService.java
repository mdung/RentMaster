package com.rentmaster.billing;

import com.rentmaster.billing.dto.PaymentCreateDTO;
import com.rentmaster.billing.dto.PaymentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        Double totalPaid = paymentRepository.getTotalPaidForInvoice(dto.getInvoiceId());
        if (totalPaid == null) totalPaid = 0.0;

        if (totalPaid + dto.getAmount() > invoice.getTotalAmount()) {
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

