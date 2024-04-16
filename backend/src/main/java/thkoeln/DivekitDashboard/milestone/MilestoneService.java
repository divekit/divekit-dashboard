package thkoeln.DivekitDashboard.milestone;

import org.springframework.stereotype.Service;
import thkoeln.DivekitDashboard.gitlab.GitlabService;
import thkoeln.DivekitDashboard.student.Student;
import thkoeln.DivekitDashboard.student.StudentService;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class MilestoneService {
    private final MilestoneRepository milestoneRepository;
    final GitlabService gitlabService;
    final StudentService studentService;

    public MilestoneService(MilestoneRepository milestoneRepository, GitlabService gitlabService, StudentService studentService) {
        this.milestoneRepository = milestoneRepository;
        this.gitlabService = gitlabService;
        this.studentService = studentService;
    }

    public void saveMilestoneFromOverview(String name, String source, List<Student> students){
        Milestone milestone = new Milestone(name, source, students);
        System.out.println("Created milestone: " + name);
        milestoneRepository.save(milestone);
    }

    public Milestone getMilestoneById(String id){
        return milestoneRepository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    public Iterable<Milestone> getAllMilestones(){
        return milestoneRepository.findAll();
    }

    public Iterable<String> getAllMilestoneSources(){
        return milestoneRepository.getAllSources();
    }

    public boolean sourceExists(String source) {
        return milestoneRepository.findFirstBySource(source).isPresent();
    }

    public void removeMilestoneSource(String source){
        milestoneRepository.deleteAllBySource(source);
    }


}
