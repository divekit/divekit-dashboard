package thkoeln.DivekitDashboard.student;


import org.springframework.data.repository.CrudRepository;
import thkoeln.DivekitDashboard.student.Student;

public interface StudentRepository extends CrudRepository<Student, Long> {
}
