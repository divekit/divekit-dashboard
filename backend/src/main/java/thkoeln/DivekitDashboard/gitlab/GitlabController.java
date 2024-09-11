package thkoeln.DivekitDashboard.gitlab;

import lombok.val;
import org.apache.commons.io.FileUtils;
import org.gitlab4j.api.GitLabApiException;
import org.gitlab4j.api.models.RepositoryFile;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import thkoeln.DivekitDashboard.frauddetection.jplag.RepositoryData;
import thkoeln.DivekitDashboard.milestone.Milestone;
import thkoeln.DivekitDashboard.milestone.MilestoneService;
import thkoeln.DivekitDashboard.student.Student;
import thkoeln.DivekitDashboard.student.StudentService;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.NoSuchElementException;

import static java.lang.Long.parseLong;

@CrossOrigin(origins = "http://localhost:3000/", allowCredentials = "true")
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

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMilestone(@PathVariable String id){
        milestoneService.removeMilestone(id);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }

    @GetMapping("/{milestone-id}/repositories/{student-id}")
    public ResponseEntity<Student> downloadRepository(@PathVariable("milestone-id") String milestoneId,
                                                      @PathVariable("student-id") String studentId){
        try {
            Student student = studentService.getStudent(parseLong(studentId)).orElseThrow(() -> new NoSuchElementException(studentId));
            gitlabService.fetchRepositoryArchive(student.getCodeRepoUrl());
            return new ResponseEntity<>(student, HttpStatus.OK);
        } catch(NoSuchElementException e){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Cannot retrieve milestone with milestone id " + milestoneId + ".",
                    e
            );
        } catch(NumberFormatException e){
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Student id could not be cast to long: " + studentId + ".",
                    e
            );
        } catch (GitLabApiException e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{milestone-id}/repositories")
    public ResponseEntity<Milestone> downloadRepositories(@PathVariable("milestone-id") String milestoneId){
        try {
            Milestone milestone = milestoneService.getMilestoneById(milestoneId);

            // TODO make this work with docker too
            gitlabService.downloadRepositoriesForJplag(milestone);

            return new ResponseEntity<>(milestone, HttpStatus.OK);
        } catch (RuntimeException e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (GitLabApiException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    @DeleteMapping("/{milestone-id}/repositories")
    public ResponseEntity<String> deleteRepositoryFolder(@PathVariable("milestone-id") String milestoneId){
        try {
            // TODO make this work with docker too
            val currentDir = new File(new File(".").getAbsolutePath());
            FileUtils.deleteDirectory(new File(currentDir + "/repositories/" + milestoneId));

            return new ResponseEntity<>(milestoneId, HttpStatus.OK);
        } catch (RuntimeException | IOException  e){
            System.out.println(e.getMessage());
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/{milestone-id}/repositories/data")
    public ResponseEntity<RepositoryData> getRepositoryData(@PathVariable("milestone-id") String milestoneId){
        try {
            return new ResponseEntity<>(gitlabService.getRepositoryData(milestoneId), HttpStatus.OK);
        } catch(NoSuchElementException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Cannot retrieve milestone with milestone id " + milestoneId + ".",
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
            System.out.println(e.getMessage());
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
        List<Milestone> milestones = milestoneService.getAllMilestones().stream().toList();

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
