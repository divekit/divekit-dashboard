package thkoeln.DivekitDashboard.milestone;

import org.springframework.stereotype.Service;
import thkoeln.DivekitDashboard.milestone.Milestone;
import thkoeln.DivekitDashboard.student.Student;
import thkoeln.DivekitDashboard.milestone.MilestoneRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class MilestoneService {
    private final MilestoneRepository milestoneRepository;

    public MilestoneService(MilestoneRepository milestoneRepository) {
        this.milestoneRepository = milestoneRepository;
    }

    public void saveMilestoneFromOverview(String name, String source, List<Student> students){
        Milestone milestone = new Milestone(name, source, students);
        System.out.println("Created milestone: " + name);
        milestoneRepository.save(milestone);
    }

    public Milestone getMilestoneById(long id){
        return milestoneRepository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    public Iterable<Milestone> getAllMilestones(){
        return milestoneRepository.findAll();
    }

    public Iterable<String> getAllMilestoneSources(){
        ArrayList<String> sources = new ArrayList<>();
        milestoneRepository.findAll().forEach(milestone -> sources.add(milestone.getSource()));

        return sources;
    }

    public boolean sourceExists(String source) {
        return milestoneRepository.findFirstBySource(source).isPresent();
    }

    public void removeMilestoneSource(String source){
        milestoneRepository.deleteAllBySource(source);
    }
}
