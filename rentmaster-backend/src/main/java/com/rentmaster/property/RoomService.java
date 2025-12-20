package com.rentmaster.property;

import java.math.BigDecimal;

import com.rentmaster.property.dto.RoomCreateDTO;
import com.rentmaster.property.dto.RoomDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    public List<RoomDTO> findAll() {
        return roomRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<RoomDTO> findByPropertyId(Long propertyId) {
        return roomRepository.findByPropertyId(propertyId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public RoomDTO findById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return toDTO(room);
    }

    public RoomDTO create(RoomCreateDTO dto) {
        Property property = propertyRepository.findById(dto.getPropertyId())
                .orElseThrow(() -> new RuntimeException("Property not found"));

        if (roomRepository.existsByPropertyIdAndCode(dto.getPropertyId(), dto.getCode())) {
            throw new RuntimeException("Room code already exists for this property");
        }

        Room room = new Room();
        room.setProperty(property);
        room.setCode(dto.getCode());
        room.setFloor(dto.getFloor());
        room.setType(dto.getType());
        room.setSizeM2(dto.getSizeM2());
        room.setStatus(RoomStatus.valueOf(dto.getStatus()));
        room.setBaseRent(dto.getBaseRent());
        room.setCapacity(dto.getCapacity());
        room.setNotes(dto.getNotes());

        Room saved = roomRepository.save(room);
        return toDTO(saved);
    }

    public RoomDTO update(Long id, RoomCreateDTO dto) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getProperty().getId().equals(dto.getPropertyId())) {
            Property property = propertyRepository.findById(dto.getPropertyId())
                    .orElseThrow(() -> new RuntimeException("Property not found"));
            room.setProperty(property);
        }

        if (!room.getCode().equals(dto.getCode()) &&
                roomRepository.existsByPropertyIdAndCode(dto.getPropertyId(), dto.getCode())) {
            throw new RuntimeException("Room code already exists for this property");
        }

        room.setCode(dto.getCode());
        room.setFloor(dto.getFloor());
        room.setType(dto.getType());
        room.setSizeM2(dto.getSizeM2());
        room.setStatus(RoomStatus.valueOf(dto.getStatus()));
        room.setBaseRent(dto.getBaseRent());
        room.setCapacity(dto.getCapacity());
        room.setNotes(dto.getNotes());

        Room saved = roomRepository.save(room);
        return toDTO(saved);
    }

    public void delete(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found");
        }
        roomRepository.deleteById(id);
    }

    private RoomDTO toDTO(Room room) {
        RoomDTO dto = new RoomDTO();
        dto.setId(room.getId());
        dto.setPropertyId(room.getProperty().getId());
        dto.setPropertyName(room.getProperty().getName());
        dto.setCode(room.getCode());
        dto.setFloor(room.getFloor());
        dto.setType(room.getType());
        dto.setSizeM2(room.getSizeM2());
        dto.setStatus(room.getStatus().name());
        dto.setBaseRent(room.getBaseRent());
        dto.setCapacity(room.getCapacity());
        dto.setNotes(room.getNotes());
        return dto;
    }
}
