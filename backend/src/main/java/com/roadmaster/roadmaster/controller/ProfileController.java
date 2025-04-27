package com.roadmaster.roadmaster.controller;

import com.roadmaster.roadmaster.entity.Instructor;
import com.roadmaster.roadmaster.entity.Learner;
import com.roadmaster.roadmaster.entity.User;
import com.roadmaster.roadmaster.service.UserService;
import com.roadmaster.roadmaster.repository.InstructorRepository;
import com.roadmaster.roadmaster.repository.LearnerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000") // allow frontend requests
public class ProfileController {

    @Autowired
    private UserService userService;

    @Autowired
    private InstructorRepository instructorRepository;

    @Autowired
    private LearnerRepository learnerRepository;

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestParam String email, @RequestParam String role) {
        Optional<User> optionalUser = userService.findByEmail(email);

        if (optionalUser.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = optionalUser.get();

        if (role.equalsIgnoreCase("learner")) {
            Optional<Learner> learner = learnerRepository.findByUserId(user.getId());
            return learner.<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.badRequest().body("Learner profile not found"));
        } else if (role.equalsIgnoreCase("instructor")) {
            Optional<Instructor> instructor = instructorRepository.findByUserId(user.getId());
            return instructor.<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.badRequest().body("Instructor profile not found"));
        } else {
            return ResponseEntity.badRequest().body("Invalid role");
        }
    }
}
