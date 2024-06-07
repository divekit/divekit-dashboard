package thkoeln.DivekitDashboard.gitlab;

import jakarta.annotation.PostConstruct;
import lombok.val;
import org.gitlab4j.api.GitLabApi;
import org.gitlab4j.api.GitLabApiException;
import org.gitlab4j.api.models.RepositoryFile;
import org.springframework.stereotype.Service;
import thkoeln.DivekitDashboard.student.Commit;
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

@Service
public class GitlabService {
    private final String GITLAB_SERVER = getEnvServer();
    private final String GITLAB_TOKEN = System.getenv("GITLAB_TOKEN") + "";

    private GitLabApi gitLab;

    @PostConstruct
    public void init() {
        gitLab = new GitLabApi(GITLAB_SERVER, GITLAB_TOKEN);
    }

    private String getEnvServer() {
        String server = System.getenv("GITLAB_SERVER") + "";
        if (server.charAt(server.length() - 1) == '/') {
            server = server.substring(0, server.length() - 1);
        }
        return server;
    }

    public RepositoryFile fetchMilestoneFile(String source) throws GitLabApiException {
        String overviewPath = source.substring(0, source.lastIndexOf("/"));

        return gitLab
                .getRepositoryFileApi()
                .getOptionalFile(overviewPath, source.replace(overviewPath + "/", ""), "master")
                .orElseThrow(() -> new GitLabApiException("Could not get milestone file from source " + source + "."));
    }

    private List<Commit> fetchStudentCommits(Student student){
        try {
            val trimmedCodeRepoURL = student.getCodeRepoUrl().replace(GITLAB_SERVER + "/", "");
            val gitlabCommits = gitLab.getCommitsApi().getCommits(trimmedCodeRepoURL);

            // removes automatic initial commit as it's not made by students
            gitlabCommits.remove(0);

            val createdCommits = new ArrayList<Commit>();
            gitlabCommits.forEach(commit -> createdCommits.add(
                    new Commit(commit.getId(), commit.getAuthoredDate(), commit.getMessage())));
            return createdCommits;
        } catch (GitLabApiException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Student> createStudentsFromOverview(RepositoryFile file) throws GitLabApiException, RuntimeException {
        System.out.println("creating students...");

        // GitLab GET requests return files in Base64, so they need to be decoded
        byte[] decodedMdFile = Base64.getDecoder().decode(file.getContent());
        if(decodedMdFile == null || decodedMdFile.length == 0){
            throw new GitLabApiException("Could not decode file content from repository file.");
        }

        String mdString = new String(decodedMdFile, StandardCharsets.UTF_8);
        List<Student> students = GitlabParser.mdToStudentList(mdString);
        applyTestsAndCommits(students);

        return students;
    }

    private void applyTestsAndCommits(List<Student> students) {
        ArrayList<MilestoneTest> prevTests = new ArrayList<>();

        forEachAsync(students, student -> {
            student.setCommits(fetchStudentCommits(student));
            // URLs to the test pages of students in student overview start with http://,
            // so they need to be redirected
            String testPageAsString = fetchHtmlString(student.getTestOverviewUrl().replace("http://", "https://"));

            if(testPageAsString == null){
                throw new RuntimeException("Could not get HTTPS version of student test page.");
            }

            ArrayList<MilestoneTest> milestoneTests = GitlabParser.htmlToTests(testPageAsString);

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

    public static <T> void forEachAsync(List<T> list, Consumer<T> func) {
        ExecutorService executorService = Executors.newFixedThreadPool(list.size());
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        list.forEach(item ->
            futures.add(CompletableFuture.runAsync(() -> func.accept(item), executorService))
        );

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        executorService.shutdown();
    }

    private String fetchHtmlString(String htmlUrl, int max) {
        for (int i = 0; i < max; i++) {
            try {
                URLConnection connection =  new URL(htmlUrl).openConnection();
                Scanner scanner = new Scanner(connection.getInputStream());
                scanner.useDelimiter("\\Z");
                String content = scanner.next();
                scanner.close();
                return content;
            } catch (Exception ex) {
                if (i + 1 != max) {
                    System.out.println("Retrying to fetch student test page...");
                } else {
                    System.out.println("Could not fetch student test page.");
                }
            }
        }
        return null;
    }

    private String fetchHtmlString(String htmlUrl) {
        return fetchHtmlString(htmlUrl, 5);
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
}
