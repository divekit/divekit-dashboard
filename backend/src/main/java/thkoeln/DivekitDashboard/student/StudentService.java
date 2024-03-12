package thkoeln.DivekitDashboard.student;

import org.gitlab4j.api.GitLabApiException;
import org.gitlab4j.api.models.RepositoryFile;
import org.springframework.stereotype.Service;
import thkoeln.DivekitDashboard.student.Student;
import thkoeln.DivekitDashboard.gitlab.GitlabService;
import thkoeln.DivekitDashboard.student.StudentRepository;

import java.util.List;
import java.util.stream.StreamSupport;

@Service
public class StudentService {

    final StudentRepository studentRepository;

    final GitlabService gitlabService;

    public StudentService(StudentRepository studentRepository, GitlabService gitlabService) {
        this.studentRepository = studentRepository;
        this.gitlabService = gitlabService;
    }

    public List<Student> saveStudentsFromOverview(RepositoryFile file) throws GitLabApiException, RuntimeException {
        Iterable<Student> students = studentRepository.saveAll(
                gitlabService.fetchStudentsFromOverview(file)
        );

        return StreamSupport
                .stream(students.spliterator(), false)
                .toList();
    }

}
