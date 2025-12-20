package com.rentmaster.user;

import com.rentmaster.user.dto.PasswordChangeDTO;
import com.rentmaster.user.dto.UserCreateDTO;
import com.rentmaster.user.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserDTO> findAll() {
        return userRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public UserDTO findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toDTO(user);
    }

    public UserDTO findByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return toDTO(user);
    }

    public UserDTO create(UserCreateDTO dto) {
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        if (dto.getEmail() != null && !dto.getEmail().isEmpty()) {
            userRepository.findAll().stream()
                    .filter(u -> dto.getEmail().equals(u.getEmail()))
                    .findFirst()
                    .ifPresent(u -> {
                        throw new RuntimeException("Email already exists");
                    });
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setRole(UserRole.valueOf(dto.getRole()));
        user.setActive(dto.isActive());

        User saved = userRepository.save(user);
        return toDTO(saved);
    }

    public UserDTO update(Long id, UserCreateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check username uniqueness
        if (!user.getUsername().equals(dto.getUsername()) &&
            userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Check email uniqueness
        if (dto.getEmail() != null && !dto.getEmail().isEmpty() &&
            !dto.getEmail().equals(user.getEmail())) {
            userRepository.findAll().stream()
                    .filter(u -> !u.getId().equals(id) && dto.getEmail().equals(u.getEmail()))
                    .findFirst()
                    .ifPresent(u -> {
                        throw new RuntimeException("Email already exists");
                    });
        }

        user.setUsername(dto.getUsername());
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setRole(UserRole.valueOf(dto.getRole()));
        user.setActive(dto.isActive());

        // Update password if provided
        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }

        User saved = userRepository.save(user);
        return toDTO(saved);
    }

    public void changePassword(Long id, PasswordChangeDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("New password and confirm password do not match");
        }

        if (dto.getNewPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters long");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

    public void delete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Prevent deleting the last admin user
        if (user.getRole() == UserRole.ADMIN) {
            long adminCount = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == UserRole.ADMIN && u.isActive())
                    .count();
            if (adminCount <= 1) {
                throw new RuntimeException("Cannot delete the last active admin user");
            }
        }
        
        userRepository.deleteById(id);
    }

    public UserDTO toggleActive(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Prevent deactivating the last admin user
        if (user.getRole() == UserRole.ADMIN && user.isActive()) {
            long activeAdminCount = userRepository.findAll().stream()
                    .filter(u -> u.getRole() == UserRole.ADMIN && u.isActive())
                    .count();
            if (activeAdminCount <= 1) {
                throw new RuntimeException("Cannot deactivate the last active admin user");
            }
        }
        
        user.setActive(!user.isActive());
        User saved = userRepository.save(user);
        return toDTO(saved);
    }

    private UserDTO toDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole().name());
        dto.setActive(user.isActive());
        dto.setCreatedAt(user.getCreatedAt());
        return dto;
    }
}



