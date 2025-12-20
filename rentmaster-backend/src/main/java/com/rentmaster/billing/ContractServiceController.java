package com.rentmaster.billing;

import com.rentmaster.billing.dto.ContractServiceCreateDTO;
import com.rentmaster.billing.dto.ContractServiceDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contract-services")
@CrossOrigin(origins = "*")
public class ContractServiceController {

    @Autowired
    private ContractServiceManagementService contractServiceManagementService;

    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<ContractServiceDTO>> getByContractId(@PathVariable Long contractId) {
        List<ContractServiceDTO> services = contractServiceManagementService.findByContractId(contractId);
        return ResponseEntity.ok(services);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContractServiceDTO> getById(@PathVariable Long id) {
        try {
            ContractServiceDTO service = contractServiceManagementService.findById(id);
            return ResponseEntity.ok(service);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ContractServiceCreateDTO dto) {
        try {
            ContractServiceDTO service = contractServiceManagementService.create(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(service);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody ContractServiceCreateDTO dto) {
        try {
            ContractServiceDTO service = contractServiceManagementService.update(id, dto);
            return ResponseEntity.ok(service);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            contractServiceManagementService.delete(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/toggle-active")
    public ResponseEntity<?> toggleActive(@PathVariable Long id) {
        try {
            ContractServiceDTO service = contractServiceManagementService.toggleActive(id);
            return ResponseEntity.ok(service);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    private static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}



