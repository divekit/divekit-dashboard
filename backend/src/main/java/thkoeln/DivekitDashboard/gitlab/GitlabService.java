package thkoeln.DivekitDashboard.gitlab;

import jakarta.annotation.PostConstruct;
import org.gitlab4j.api.GitLabApi;
import org.gitlab4j.api.GitLabApiException;
import org.gitlab4j.api.models.Commit;
import org.gitlab4j.api.models.RepositoryFile;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Service;
import thkoeln.DivekitDashboard.student.MilestoneTest;
import thkoeln.DivekitDashboard.student.Student;

import java.net.URL;
import java.net.URLConnection;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Scanner;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

@PropertySource("classpath:secrets.properties")
@Service
public class GitlabService {
    private static final String GITLAB_SERVER = "https://git.archi-lab.io";
    @Value("${gitlab-secret}")
    private String GITLAB_SECRET;

    private GitLabApi gitLab;

    @PostConstruct
    public void init() {
        gitLab = new GitLabApi(GITLAB_SERVER, GITLAB_SECRET);
    }

    public List<Student> fetchStudentsFromOverview(RepositoryFile file) throws GitLabApiException, RuntimeException {
        System.out.println("creating students...");

        byte[] decodedMdFile = Base64.getDecoder().decode(file.getContent());
        if(decodedMdFile == null || decodedMdFile.length == 0){
            throw new GitLabApiException("Could not get decoded file content from repository file.");
        }

        String mdString = new String(decodedMdFile, StandardCharsets.UTF_8);
        List<Student> students = GitlabParser.mdToStudentList(mdString);
//       students = students.stream().limit(10).collect(Collectors.toList());
        applyTestsAndCommits(students);
        System.out.println("done");

        return students;
    }

    private void applyTestsAndCommits(List<Student> students) {
        ArrayList<MilestoneTest> prevTests = new ArrayList<>();

        forEachAsync(students, student -> {
            student.setCommits(fetchStudentCommits(student));
            String testPageAsString = fetchHtmlString(student.getTestOverviewUrl().replace("http://", "https://"));

            if(testPageAsString == null){
                throw new RuntimeException("Could not get HTTPS version of student test page.");
            }

            ArrayList<MilestoneTest> milestoneTests = GitlabParser.htmlToTests(testPageAsString);

            // TODO: error if first student of milestone has no tests, needs to be fixed
            if (milestoneTests.size() == 0) {
                prevTests.forEach(prevTest -> milestoneTests.add(new MilestoneTest(
                        prevTest.getId(),
                        prevTest.getName(),
                        prevTest.getGroupName(),
                        false
                )));
            } else if (prevTests.size() == 0) {
                prevTests.addAll(milestoneTests);
            }
            student.setMilestoneTests(milestoneTests);
        });
    }

    private <T> void forEachAsync(List<T> list, Consumer<T> func) {
        ExecutorService executorService = Executors.newFixedThreadPool(list.size());
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        list.forEach(item ->
            futures.add(CompletableFuture.runAsync(() -> func.accept(item), executorService))
        );

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        executorService.shutdown();
    }

    private List<String> fetchStudentCommits(Student student){
        try {
            String trimmedCodeRepoURL = student.getCodeRepoUrl().replace(GITLAB_SERVER + "/", "");
            List<Commit> commits = gitLab.getCommitsApi().getCommits(trimmedCodeRepoURL);

            // removes automatic inital commit as it's not made by students
            commits.remove(0);

            List<String> commitHashes = new ArrayList<>();
            commits.forEach(commit -> commitHashes.add(commit.getId()));

            return commitHashes;
        } catch (GitLabApiException e) {
            throw new RuntimeException(e);
        }
    }

    private String fetchHtmlString(String htmlUrl, int count, int max) {
        String content = null;
        try {
            URLConnection connection =  new URL(htmlUrl).openConnection();
            Scanner scanner = new Scanner(connection.getInputStream());
            scanner.useDelimiter("\\Z");
            content = scanner.next();
            scanner.close();
        } catch (Exception ex) {
            if(count > max){
                return null;
            }
            fetchHtmlString(htmlUrl, count + 1, max);
        }
        return content;
    }

    private String fetchHtmlString(String htmlUrl) {
        return fetchHtmlString(htmlUrl, 0, 5);
    }

    public List<String> fetchMilestoneLink(String source) throws GitLabApiException {
        String milestoneLinkTrimmed = source.replace(GITLAB_SERVER + "/", "");

        return gitLab
                .getRepositoryApi()
                .getTree(milestoneLinkTrimmed)
                .stream()
                .map(treeItem -> source + "/" + treeItem.getPath())
                .toList();
    }

    public RepositoryFile fetchMilestoneFile(String source) throws GitLabApiException {
        String overviewPath = source.substring(0, source.lastIndexOf("/"));

        return  gitLab
                .getRepositoryFileApi()
                .getOptionalFile(overviewPath, source.replace(overviewPath + "/", ""), "master")
                .orElseThrow(() -> new GitLabApiException("Could not get milestone file from source " + source + "."));
    }
}
