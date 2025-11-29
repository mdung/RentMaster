package com.rentmaster.tenant;

import com.rentmaster.tenant.dto.TenantCreateDTO;
import com.rentmaster.tenant.dto.TenantDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tenants")
@CrossOrigin(origins = "*")
public class TenantController {

    @Autowired
    private TenantService tenantService;

    @GetMapping
    public ResponseEntity<List<TenantDTO>> findAll(@RequestParam(required = false) String search) {
        if (search != null && !search.trim().isEmpty()) {
            return ResponseEntity.ok(tenantService.search(search));
        }
        return ResponseEntity.ok(tenantService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TenantDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(tenantService.findById(id));
    }

    @PostMapping
    public ResponseEntity<TenantDTO> create(@Valid @RequestBody TenantCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tenantService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TenantDTO> update(@PathVariable Long id, @Valid @RequestBody TenantCreateDTO dto) {
        return ResponseEntity.ok(tenantService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        tenantService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

