// InstructorRepository.java
package com.roadmaster.roadmaster.repository;

import com.roadmaster.roadmaster.entity.Instructor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InstructorRepository extends JpaRepository<Instructor, Long> {
    Optional<Instructor> findByUserId(Long userId); // Assuming Instructor has a reference to User
}
