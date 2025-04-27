package com.roadmaster.roadmaster.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class Learner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long userId; // Foreign key to User table (one-to-one relation)
    private String learningPreferences;
    private String drivingTestStatus;

    // Constructors, getters, and setters
    public Learner() {}

    public Learner(Long userId, String learningPreferences, String drivingTestStatus) {
        this.userId = userId;
        this.learningPreferences = learningPreferences;
        this.drivingTestStatus = drivingTestStatus;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getLearningPreferences() {
        return learningPreferences;
    }

    public void setLearningPreferences(String learningPreferences) {
        this.learningPreferences = learningPreferences;
    }

    public String getDrivingTestStatus() {
        return drivingTestStatus;
    }

    public void setDrivingTestStatus(String drivingTestStatus) {
        this.drivingTestStatus = drivingTestStatus;
    }
}
