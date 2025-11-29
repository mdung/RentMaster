package com.rentmaster.property;

import com.rentmaster.property.dto.PropertyCreateDTO;
import com.rentmaster.property.dto.PropertyDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @GetMapping
    public ResponseEntity<List<PropertyDTO>> findAll() {
        return ResponseEntity.ok(propertyService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PropertyDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(propertyService.findById(id));
    }

    @PostMapping
    public ResponseEntity<PropertyDTO> create(@Valid @RequestBody PropertyCreateDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(propertyService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PropertyDTO> update(@PathVariable Long id, @Valid @RequestBody PropertyCreateDTO dto) {
        return ResponseEntity.ok(propertyService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        propertyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

