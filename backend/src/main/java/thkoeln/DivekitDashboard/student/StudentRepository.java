package thkoeln.DivekitDashboard.student;


import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findFirstByUuid(UUID uuid);
}
