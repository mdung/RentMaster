package com.rentmaster.property;

import com.rentmaster.property.dto.PropertyCreateDTO;
import com.rentmaster.property.dto.PropertyDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    public List<PropertyDTO> findAll() {
        return propertyRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PropertyDTO findById(Long id) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        return toDTO(property);
    }

    public PropertyDTO create(PropertyCreateDTO dto) {
        Property property = new Property();
        property.setName(dto.getName());
        property.setAddress(dto.getAddress());
        property.setDescription(dto.getDescription());
        Property saved = propertyRepository.save(property);
        return toDTO(saved);
    }

    public PropertyDTO update(Long id, PropertyCreateDTO dto) {
        Property property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        property.setName(dto.getName());
        property.setAddress(dto.getAddress());
        property.setDescription(dto.getDescription());
        Property saved = propertyRepository.save(property);
        return toDTO(saved);
    }

    public void delete(Long id) {
        if (!propertyRepository.existsById(id)) {
            throw new RuntimeException("Property not found");
        }
        propertyRepository.deleteById(id);
    }

    private PropertyDTO toDTO(Property property) {
        return new PropertyDTO(
                property.getId(),
                property.getName(),
                property.getAddress(),
                property.getDescription(),
                property.getCreatedAt()
        );
    }
}

