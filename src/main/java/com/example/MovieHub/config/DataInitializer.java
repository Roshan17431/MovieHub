package com.example.MovieHub.config;

import com.example.MovieHub.entity.User;
import com.example.MovieHub.entity.UserRole;
import com.example.MovieHub.repo.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner seedAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if(!userRepository.existsByEmail("admin@moviehub.local")){
                User admin = new User();
                admin.setEmail("admin@moviehub.local");
                admin.setPassword(passwordEncoder.encode("Admin123!"));
                admin.setRoles(Set.of(UserRole.ROLE_ADMIN));
                userRepository.save(admin);
            }
        };
    }
}
