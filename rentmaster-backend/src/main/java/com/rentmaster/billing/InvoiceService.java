package com.rentmaster.billing;

import com.rentmaster.billing.dto.*;
import com.rentmaster.contract.Contract;
import com.rentmaster.contract.ContractRepository;
import com.rentmaster.contract.ContractStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private ContractServiceRepository contractServiceRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    public List<InvoiceDTO> findAll() {
        return invoiceRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public InvoiceDTO findById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));
        return toDTO(invoice);
    }

    public List<InvoiceDTO> findByContractId(Long contractId) {
        return invoiceRepository.findByContractId(contractId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<InvoiceDTO> findByStatus(String status) {
        return invoiceRepository.findByStatus(InvoiceStatus.valueOf(status)).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public InvoiceDTO generateInvoice(InvoiceGenerateDTO dto) {
        Contract contract = contractRepository.findById(dto.getContractId())
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        if (contract.getStatus() != ContractStatus.ACTIVE) {
            throw new RuntimeException("Can only generate invoices for active contracts");
        }

        // Check if invoice already exists for this period
        List<Invoice> existing = invoiceRepository.findInvoicesForContractInPeriod(
                dto.getContractId(), dto.getPeriodStart(), dto.getPeriodEnd());
        if (!existing.isEmpty()) {
            throw new RuntimeException("Invoice already exists for this period");
        }

        Invoice invoice = new Invoice();
        invoice.setContract(contract);
        invoice.setPeriodStart(dto.getPeriodStart());
        invoice.setPeriodEnd(dto.getPeriodEnd());
        invoice.setIssueDate(dto.getIssueDate() != null ? dto.getIssueDate() : LocalDate.now());
        invoice.setDueDate(dto.getDueDate() != null ? dto.getDueDate() : 
                invoice.getIssueDate().plusDays(7));

        double totalAmount = 0.0;

        // Add rent item
        InvoiceItem rentItem = new InvoiceItem();
        rentItem.setInvoice(invoice);
        Service rentService = serviceRepository.findByActiveTrue().stream()
                .filter(s -> s.getType() == ServiceType.RENT)
                .findFirst()
                .orElse(null);
        if (rentService != null) {
            rentItem.setService(rentService);
            rentItem.setDescription("Tiền phòng");
        } else {
            rentItem.setDescription("Tiền phòng");
        }
        rentItem.setQuantity(1.0);
        rentItem.setUnitPrice(contract.getRentAmount());
        rentItem.setAmount(contract.getRentAmount());
        totalAmount += contract.getRentAmount();
        invoice.getItems().add(rentItem);

        // Add contract services
        List<ContractService> contractServices = contractServiceRepository.findByContractIdAndActiveTrue(dto.getContractId());
        for (ContractService cs : contractServices) {
            Service service = cs.getService();
            if (!service.isActive()) continue;

            InvoiceItem item = new InvoiceItem();
            item.setInvoice(invoice);
            item.setService(service);
            item.setDescription(service.getName());

            if (service.getPricingModel() == PricingModel.FIXED) {
                double price = cs.getCustomPrice() != null ? cs.getCustomPrice() : service.getUnitPrice();
                item.setQuantity(1.0);
                item.setUnitPrice(price);
                item.setAmount(price);
                totalAmount += price;
            } else if (service.getPricingModel() == PricingModel.PER_UNIT) {
                // For per-unit services, we'd need meter readings - simplified here
                // In real app, you'd pass current index from DTO
                item.setQuantity(1.0);
                double unitPrice = cs.getCustomPrice() != null ? cs.getCustomPrice() : service.getUnitPrice();
                item.setUnitPrice(unitPrice);
                item.setAmount(unitPrice);
                totalAmount += unitPrice;
            }

            invoice.getItems().add(item);
        }

        invoice.setTotalAmount(totalAmount);
        invoice.setStatus(InvoiceStatus.PENDING);

        Invoice saved = invoiceRepository.save(invoice);
        return toDTO(saved);
    }

    public void updateInvoiceStatus(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found"));

        Double totalPaid = paymentRepository.getTotalPaidForInvoice(invoiceId);
        if (totalPaid == null) totalPaid = 0.0;

        if (totalPaid >= invoice.getTotalAmount()) {
            invoice.setStatus(InvoiceStatus.PAID);
        } else if (totalPaid > 0) {
            invoice.setStatus(InvoiceStatus.PARTIALLY_PAID);
        } else {
            if (LocalDate.now().isAfter(invoice.getDueDate())) {
                invoice.setStatus(InvoiceStatus.OVERDUE);
            } else {
                invoice.setStatus(InvoiceStatus.PENDING);
            }
        }

        invoiceRepository.save(invoice);
    }

    private InvoiceDTO toDTO(Invoice invoice) {
        InvoiceDTO dto = new InvoiceDTO();
        dto.setId(invoice.getId());
        dto.setContractId(invoice.getContract().getId());
        dto.setContractCode(invoice.getContract().getCode());
        dto.setTenantName(invoice.getContract().getPrimaryTenant().getFullName());
        dto.setRoomCode(invoice.getContract().getRoom().getCode());
        dto.setPeriodStart(invoice.getPeriodStart());
        dto.setPeriodEnd(invoice.getPeriodEnd());
        dto.setIssueDate(invoice.getIssueDate());
        dto.setDueDate(invoice.getDueDate());
        dto.setTotalAmount(invoice.getTotalAmount());
        
        Double paidAmount = paymentRepository.getTotalPaidForInvoice(invoice.getId());
        if (paidAmount == null) paidAmount = 0.0;
        dto.setPaidAmount(paidAmount);
        dto.setRemainingAmount(invoice.getTotalAmount() - paidAmount);
        
        dto.setStatus(invoice.getStatus().name());
        dto.setCreatedAt(invoice.getCreatedAt());

        dto.setItems(invoice.getItems().stream().map(this::itemToDTO).collect(Collectors.toList()));
        dto.setPayments(invoice.getPayments().stream().map(this::paymentToDTO).collect(Collectors.toList()));

        return dto;
    }

    private InvoiceItemDTO itemToDTO(InvoiceItem item) {
        InvoiceItemDTO dto = new InvoiceItemDTO();
        dto.setId(item.getId());
        if (item.getService() != null) {
            dto.setServiceId(item.getService().getId());
            dto.setServiceName(item.getService().getName());
        }
        dto.setDescription(item.getDescription());
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setAmount(item.getAmount());
        dto.setPrevIndex(item.getPrevIndex());
        dto.setCurrentIndex(item.getCurrentIndex());
        return dto;
    }

    private PaymentDTO paymentToDTO(Payment payment) {
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

