package com.rentmaster.billing;

import com.rentmaster.billing.dto.InvoiceDTO;
import com.rentmaster.billing.dto.InvoiceGenerateDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private AutomatedInvoiceScheduler automatedInvoiceScheduler;

    @GetMapping
    public ResponseEntity<List<InvoiceDTO>> findAll(@RequestParam(required = false) String status) {
        if (status != null && !status.trim().isEmpty()) {
            return ResponseEntity.ok(invoiceService.findByStatus(status));
        }
        return ResponseEntity.ok(invoiceService.findAll());
    }

    /**
     * Basic server-side pagination for invoices.
     * This is mainly used by the Invoices page and can be extended later.
     */
    @GetMapping("/paged")
    public ResponseEntity<Map<String, Object>> findPaged(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        List<InvoiceDTO> all;
        if (status != null && !status.trim().isEmpty()) {
            all = invoiceService.findByStatus(status);
        } else {
            all = invoiceService.findAll();
        }

        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, all.size());
        List<InvoiceDTO> content = fromIndex >= all.size() ? List.of() : all.subList(fromIndex, toIndex);

        Map<String, Object> body = new java.util.HashMap<>();
        body.put("items", content);
        body.put("total", all.size());

        return ResponseEntity.ok(body);
    }

    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<InvoiceDTO>> findByContractId(@PathVariable Long contractId) {
        return ResponseEntity.ok(invoiceService.findByContractId(contractId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<InvoiceDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(invoiceService.findById(id));
    }

    @PostMapping("/generate")
    public ResponseEntity<InvoiceDTO> generateInvoice(@Valid @RequestBody InvoiceGenerateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(invoiceService.generateInvoice(dto));
    }

    /**
     * Manual trigger for automated invoice generation for today's date.
     * Useful for testing the scheduled job from the UI or Postman.
     */
    @PostMapping("/auto-generate-today")
    public ResponseEntity<Void> autoGenerateToday() {
        automatedInvoiceScheduler.generateInvoicesForDate(java.time.LocalDate.now());
        return ResponseEntity.accepted().build();
    }
}

