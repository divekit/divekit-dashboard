package thkoeln.DivekitDashboard.gitlab;

import org.gitlab4j.api.GitLabApiException;
import org.gitlab4j.api.models.RepositoryFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import thkoeln.DivekitDashboard.milestone.Milestone;
import thkoeln.DivekitDashboard.milestone.MilestoneService;
import thkoeln.DivekitDashboard.student.Student;
import thkoeln.DivekitDashboard.student.StudentService;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.StreamSupport;

@CrossOrigin(origins = "http://localhost:3000/")
@RestController
@RequestMapping("/milestones")
public class GitlabController {
    private final MilestoneService milestoneService;
    private final StudentService studentService;
    private final GitlabService gitlabService;

    public GitlabController(MilestoneService milestoneService, StudentService studentService, GitlabService gitlabService) {
        this.milestoneService = milestoneService;
        this.studentService = studentService;
        this.gitlabService = gitlabService;
    }

    @GetMapping("")
    public ResponseEntity<Iterable<Milestone>> getAllMilestones(){
        Iterable<Milestone> milestones = milestoneService.getAllMilestones();
        return new ResponseEntity<>(milestones, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Milestone> getMilestone(@PathVariable String id){
        try {
            Milestone milestone = milestoneService.getMilestoneById(id);
            return new ResponseEntity<>(milestone, HttpStatus.OK);
        } catch(NoSuchElementException e){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Cannot retrieve milestone with milestone id " + id + ".",
                    e
            );
        }
    }

    @RequestMapping(value = "/sources/**", method = RequestMethod.POST)
    public ResponseEntity<String> addMilestoneSource(@RequestBody String milestoneLink) {
        try {
            RepositoryFile file = gitlabService.fetchMilestoneFile(milestoneLink);
            List<Student> students = studentService.saveStudentsFromOverview(file);
            milestoneService.saveMilestoneFromOverview(file.getFileName(), milestoneLink, students);
        } catch (GitLabApiException | RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(milestoneLink, HttpStatus.OK);
    }

    @RequestMapping(value = "/sources/paths/**", method = RequestMethod.GET)
    public ResponseEntity<Iterable<String>> getMilestonePaths(@RequestParam("link") String milestoneLink) {
        try {
            List<String> mdPaths = gitlabService.fetchMilestoneLink(milestoneLink);
            return new ResponseEntity<>(mdPaths, HttpStatus.OK);
        } catch (GitLabApiException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/refresh")
    public ResponseEntity<Iterable<Milestone>> requestRefresh(){
        System.out.println("Requested refresh of all milestones.");
        updateMilestones();
        return new ResponseEntity<>(milestoneService.getAllMilestones(), HttpStatus.OK);
    }

    @GetMapping("/sources")
    public ResponseEntity<Iterable<String>> getAllMilestoneSources(){
        Iterable<String> sources = milestoneService.getAllMilestoneSources();
        return new ResponseEntity<>(sources, HttpStatus.OK);
    }

    @DeleteMapping("/sources/{id}") // removes all milestones and students from that source as well
    public ResponseEntity<String> deleteMilestoneSourceCascade(@PathVariable String id){
        milestoneService.removeMilestoneSource(id);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }

    // runs every hour of every day
    @Scheduled(cron = "0 0 * * * *")
    public void updateMilestones() {
        System.out.println("Updating milestones...");
        List<Milestone> milestones = StreamSupport
                .stream(milestoneService.getAllMilestones().spliterator(), false)
                .toList();

        if(milestones.isEmpty()){
            return;
        }

        GitlabService.forEachAsync(milestones, ms -> {
            try {
                System.out.println("Updating milestone " + ms.getName());
                RepositoryFile file = gitlabService.fetchMilestoneFile(ms.getSource());
                List<Student> students = studentService.saveStudentsFromOverview(file);

                milestoneService.saveMilestoneFromOverview(file.getFileName(), ms.getSource(), students);
            }
            catch (GitLabApiException | RuntimeException e) {
                System.out.println("Could not update current milestone. Exception: " + e.getMessage());
            }
        });

        System.out.println("Finished updating milestones.");
    }
}
