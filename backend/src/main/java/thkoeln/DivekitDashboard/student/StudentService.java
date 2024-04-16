package thkoeln.DivekitDashboard.student;

import org.gitlab4j.api.GitLabApiException;
import org.gitlab4j.api.models.RepositoryFile;
import org.springframework.stereotype.Service;
import thkoeln.DivekitDashboard.gitlab.GitlabService;

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
                gitlabService.createStudentsFromOverview(file)
        );

        return StreamSupport
                .stream(students.spliterator(), false)
                .toList();
    }

}
