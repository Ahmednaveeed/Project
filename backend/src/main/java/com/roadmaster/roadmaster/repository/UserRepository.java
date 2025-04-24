package com.roadmaster.roadmaster.repository;

import com.roadmaster.roadmaster.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    
    // Custom query to find by email and role
    Optional<User> findByEmailAndRole(String email, String role);
}
