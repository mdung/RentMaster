package com.rentmaster.multitenancy;

import com.rentmaster.multitenancy.dto.OrganizationCreateDTO;
import com.rentmaster.multitenancy.dto.OrganizationDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/organizations")
@CrossOrigin(origins = "*")
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    @GetMapping
    public ResponseEntity<List<OrganizationDTO>> getAll() {
        return ResponseEntity.ok(organizationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrganizationDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(organizationService.findById(id));
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<OrganizationDTO> getByCode(@PathVariable String code) {
        return ResponseEntity.ok(organizationService.findByCode(code));
    }

    @PostMapping
    public ResponseEntity<OrganizationDTO> create(@RequestBody OrganizationCreateDTO dto) {
        return ResponseEntity.ok(organizationService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrganizationDTO> update(@PathVariable Long id, @RequestBody OrganizationCreateDTO dto) {
        return ResponseEntity.ok(organizationService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        organizationService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<OrganizationDTO> toggleStatus(@PathVariable Long id) {
        return ResponseEntity.ok(organizationService.toggleStatus(id));
    }
}


