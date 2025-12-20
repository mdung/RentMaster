package com.rentmaster.auth;

import com.rentmaster.user.User;
import com.rentmaster.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminPasswordResetRunner implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        userRepository.findByUsername("admin").ifPresent(user -> {
            // Reset password to admin123
            // Hash for admin123 is roughly
            // $2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iwK8p6wO
            // But we will use the encoder to be sure
            user.setPassword(passwordEncoder.encode("admin123"));
            user.setFailedLoginAttempts(0);
            user.setAccountLockedUntil(null);
            user.setActive(true); // Ensure active
            userRepository.save(user);
            System.out.println("----------------------------------------");
            System.out.println("ADMIN PASSWORD RESET TO 'admin123'");
            System.out.println("----------------------------------------");
        });
    }
}
