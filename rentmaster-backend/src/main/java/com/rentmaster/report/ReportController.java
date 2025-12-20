package com.rentmaster.report;

import com.rentmaster.billing.InvoiceRepository;
import com.rentmaster.billing.InvoiceStatus;
import com.rentmaster.billing.PaymentRepository;
import com.rentmaster.contract.ContractRepository;
import com.rentmaster.contract.ContractStatus;
import com.rentmaster.property.RoomRepository;
import com.rentmaster.property.RoomStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class ReportController {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();

        long totalRooms = roomRepository.count();
        long occupiedRooms = roomRepository.countByStatus(RoomStatus.OCCUPIED);
        long availableRooms = roomRepository.countByStatus(RoomStatus.AVAILABLE);
        long maintenanceRooms = roomRepository.countByStatus(RoomStatus.MAINTENANCE);

        dashboard.put("totalRooms", totalRooms);
        dashboard.put("occupiedRooms", occupiedRooms);
        dashboard.put("availableRooms", availableRooms);
        dashboard.put("maintenanceRooms", maintenanceRooms);

        long activeContracts = contractRepository.countByStatus(ContractStatus.ACTIVE);
        dashboard.put("activeContracts", activeContracts);

        BigDecimal totalOutstanding = invoiceRepository.findAll().stream()
                .filter(inv -> inv.getStatus() != InvoiceStatus.PAID)
                .map(inv -> {
                    BigDecimal paid = paymentRepository.getTotalPaidForInvoice(inv.getId());
                    if (paid == null)
                        paid = BigDecimal.ZERO;
                    return inv.getTotalAmount().subtract(paid);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.put("totalOutstanding", totalOutstanding);

        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        BigDecimal monthlyRevenue = paymentRepository.findAll().stream()
                .filter(p -> p.getPaidAt().atZone(java.time.ZoneId.systemDefault()).toLocalDate()
                        .isAfter(monthStart.minusDays(1)))
                .map(p -> p.getAmount() != null ? p.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dashboard.put("monthlyRevenue", monthlyRevenue);

        return ResponseEntity.ok(dashboard);
    }

    /**
     * Outstanding invoices report (JSON).
     */
    @GetMapping("/outstanding-invoices")
    public ResponseEntity<List<Map<String, Object>>> getOutstandingInvoices() {
        List<Map<String, Object>> result = invoiceRepository.findAll().stream()
                .filter(inv -> inv.getStatus() != InvoiceStatus.PAID)
                .map(inv -> {
                    Map<String, Object> row = new HashMap<>();
                    row.put("invoiceId", inv.getId());
                    row.put("contractId", inv.getContract().getId());
                    row.put("contractCode", inv.getContract().getCode());
                    row.put("tenantName", inv.getContract().getPrimaryTenant().getFullName());
                    row.put("roomCode", inv.getContract().getRoom().getCode());
                    row.put("issueDate", inv.getIssueDate());
                    row.put("dueDate", inv.getDueDate());
                    row.put("totalAmount", inv.getTotalAmount());
                    BigDecimal paid = paymentRepository.getTotalPaidForInvoice(inv.getId());
                    if (paid == null)
                        paid = BigDecimal.ZERO;
                    row.put("paidAmount", paid);
                    row.put("remainingAmount", inv.getTotalAmount().subtract(paid));
                    row.put("status", inv.getStatus().name());
                    return row;
                })
                .toList();

        return ResponseEntity.ok(result);
    }

    /**
     * Outstanding invoices report as CSV (for Excel).
     */
    @GetMapping("/outstanding-invoices.csv")
    public ResponseEntity<byte[]> downloadOutstandingInvoicesCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append(
                "Invoice ID,Contract Code,Tenant,Room,Issue Date,Due Date,Total Amount,Paid Amount,Remaining,Status\n");

        invoiceRepository.findAll().stream()
                .filter(inv -> inv.getStatus() != InvoiceStatus.PAID)
                .forEach(inv -> {
                    BigDecimal paid = paymentRepository.getTotalPaidForInvoice(inv.getId());
                    if (paid == null)
                        paid = BigDecimal.ZERO;
                    BigDecimal remaining = inv.getTotalAmount().subtract(paid);
                    sb.append(inv.getId()).append(',');
                    sb.append(safe(inv.getContract().getCode())).append(',');
                    sb.append(safe(inv.getContract().getPrimaryTenant().getFullName())).append(',');
                    sb.append(safe(inv.getContract().getRoom().getCode())).append(',');
                    sb.append(inv.getIssueDate()).append(',');
                    sb.append(inv.getDueDate()).append(',');
                    sb.append(inv.getTotalAmount()).append(',');
                    sb.append(paid).append(',');
                    sb.append(remaining).append(',');
                    sb.append(inv.getStatus().name()).append('\n');
                });

        byte[] bytes = sb.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"outstanding-invoices.csv\"");
        headers.setContentLength(bytes.length);

        return ResponseEntity.ok()
                .headers(headers)
                .body(bytes);
    }

    private String safe(String value) {
        if (value == null)
            return "";
        String escaped = value.replace("\"", "\"\"");
        if (escaped.contains(",") || escaped.contains("\"")) {
            return "\"" + escaped + "\"";
        }
        return escaped;
    }
}
