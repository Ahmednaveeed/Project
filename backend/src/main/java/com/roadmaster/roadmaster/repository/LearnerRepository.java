// LearnerRepository.java
package com.roadmaster.roadmaster.repository;

import com.roadmaster.roadmaster.entity.Learner;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface LearnerRepository extends JpaRepository<Learner, Long> {
    Optional<Learner> findByUserId(Long userId); // Assuming Learner has a reference to User
}
