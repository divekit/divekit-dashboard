package thkoeln.DivekitDashboard.student;

import org.gitlab4j.api.GitLabApiException;
import org.gitlab4j.api.models.RepositoryFile;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import thkoeln.DivekitDashboard.gitlab.GitlabService;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
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
        return studentRepository.saveAll(
                gitlabService.createStudentsFromOverview(file)
        );
    }

    public Optional<Student> getStudent(Long id){
        return studentRepository.findById(id);
    }

    public Student getStudentByUuid(UUID uuid) {
        Optional<Student> student = studentRepository.findFirstByUuid(uuid);

        if (student.isEmpty()) {
            throw new IllegalArgumentException("Student with UUID " + uuid + " does not exist.");
        }

        return student.get();
    }

    public List<UUID> getRandomUuids(int amount) {
        return studentRepository
                       .findAll()
                       .stream()
                       .distinct()
                       .limit(amount)
                       .map(Student::getUuid)
                       .toList();
    }
}
