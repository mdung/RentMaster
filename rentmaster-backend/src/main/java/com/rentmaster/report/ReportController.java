package com.rentmaster.report;

import com.rentmaster.billing.InvoiceRepository;
import com.rentmaster.billing.InvoiceStatus;
import com.rentmaster.billing.PaymentRepository;
import com.rentmaster.contract.ContractRepository;
import com.rentmaster.contract.ContractStatus;
import com.rentmaster.property.RoomRepository;
import com.rentmaster.property.RoomStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
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

        Double totalOutstanding = invoiceRepository.findAll().stream()
                .filter(inv -> inv.getStatus() != InvoiceStatus.PAID)
                .mapToDouble(inv -> {
                    Double paid = paymentRepository.getTotalPaidForInvoice(inv.getId());
                    if (paid == null) paid = 0.0;
                    return inv.getTotalAmount() - paid;
                })
                .sum();
        dashboard.put("totalOutstanding", totalOutstanding != null ? totalOutstanding : 0.0);

        LocalDate now = LocalDate.now();
        LocalDate monthStart = now.withDayOfMonth(1);
        Double monthlyRevenue = paymentRepository.findAll().stream()
                .filter(p -> p.getPaidAt().atZone(java.time.ZoneId.systemDefault()).toLocalDate().isAfter(monthStart.minusDays(1)))
                .mapToDouble(p -> p.getAmount() != null ? p.getAmount() : 0.0)
                .sum();
        dashboard.put("monthlyRevenue", monthlyRevenue != null ? monthlyRevenue : 0.0);

        return ResponseEntity.ok(dashboard);
    }
}

