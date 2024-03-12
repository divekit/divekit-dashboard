package thkoeln.DivekitDashboard.student;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import thkoeln.DivekitDashboard.student.Student;
import thkoeln.DivekitDashboard.student.StudentRepository;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("/students")
public class StudentController {
    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("")
    public Iterable<Student> getAllStudents(){
        return studentRepository.findAll();
    }
}
