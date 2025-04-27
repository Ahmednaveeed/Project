package com.roadmaster.roadmaster.service;

import com.roadmaster.roadmaster.entity.User;
import com.roadmaster.roadmaster.entity.Learner;
import com.roadmaster.roadmaster.entity.Instructor;
import com.roadmaster.roadmaster.repository.UserRepository;
import com.roadmaster.roadmaster.repository.LearnerRepository;
import com.roadmaster.roadmaster.repository.InstructorRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LearnerRepository learnerRepository;

    @Autowired
    private InstructorRepository instructorRepository;

    // Register a new user
    public User register(User user) {
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already registered!");
        }
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // Get learner profile by user ID
    public Optional<Learner> getLearnerProfile(Long userId) {
        return learnerRepository.findByUserId(userId);
    }

    // Get instructor profile by user ID
    public Optional<Instructor> getInstructorProfile(Long userId) {
        return instructorRepository.findByUserId(userId);
    }
}
