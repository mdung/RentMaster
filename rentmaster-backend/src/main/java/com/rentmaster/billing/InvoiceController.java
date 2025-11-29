package com.rentmaster.billing;

import com.rentmaster.billing.dto.InvoiceDTO;
import com.rentmaster.billing.dto.InvoiceGenerateDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invoices")
@CrossOrigin(origins = "*")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @GetMapping
    public ResponseEntity<List<InvoiceDTO>> findAll(@RequestParam(required = false) String status) {
        if (status != null && !status.trim().isEmpty()) {
            return ResponseEntity.ok(invoiceService.findByStatus(status));
        }
        return ResponseEntity.ok(invoiceService.findAll());
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
}

