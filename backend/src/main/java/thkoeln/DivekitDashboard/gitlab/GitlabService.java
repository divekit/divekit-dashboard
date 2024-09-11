package thkoeln.DivekitDashboard.gitlab;

import jakarta.annotation.PostConstruct;
import lombok.val;
import org.gitlab4j.api.GitLabApi;
import org.gitlab4j.api.GitLabApiException;
import org.gitlab4j.api.models.Branch;
import org.gitlab4j.api.models.RepositoryArchiveParams;
import org.gitlab4j.api.models.RepositoryFile;
import org.springframework.stereotype.Service;
import thkoeln.DivekitDashboard.frauddetection.jplag.RepositoryData;
import thkoeln.DivekitDashboard.milestone.Milestone;
import thkoeln.DivekitDashboard.student.Commit;
import thkoeln.DivekitDashboard.student.MilestoneTest;
import thkoeln.DivekitDashboard.student.Student;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
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
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
public class GitlabService {
    private final String GITLAB_SERVER = getServerEnv();
    private final String GITLAB_TOKEN = System.getenv("GITLAB_TOKEN") + "";

    private GitLabApi gitLab;

    @PostConstruct
    public void init() {
        gitLab = new GitLabApi(GITLAB_SERVER, GITLAB_TOKEN);
    }

    private String getServerEnv() {
        String server = System.getenv("GITLAB_SERVER") + "";
        if (server.charAt(server.length() - 1) == '/') {
            server = server.substring(0, server.length() - 1);
        }
        return server;
    }

    public RepositoryFile fetchMilestoneFile(String source) throws GitLabApiException {
        String overviewPath = source.substring(0, source.lastIndexOf("/"));
        val branchName = getBranchName(overviewPath);

        return gitLab
                .getRepositoryFileApi()
                .getOptionalFile(overviewPath, source.replace(overviewPath + "/", ""), branchName)
                .orElseThrow(() -> new GitLabApiException("Could not get milestone file from source " + source + "."));
    }

    private String getBranchName(String overviewPath) throws GitLabApiException {
        val defaultBranch = gitLab.getRepositoryApi()
                .getBranches(overviewPath)
                .stream()
                .filter(Branch::getDefault)
                .findFirst();

        return defaultBranch.isPresent() ? defaultBranch.get().getName() : "master";
    }

    private List<Commit> fetchStudentCommits(Student student){
        try {
            val trimmedCodeRepoURL = student.getCodeRepoUrl().replace("https://git.archi-lab.io/", "");
            val branchName = getBranchName(trimmedCodeRepoURL);
            val gitlabCommits = gitLab.getCommitsApi().getCommits(trimmedCodeRepoURL, branchName, "");

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
        System.out.println("before commits");
        applyTestsAndCommits(students);
        System.out.println("after commits");

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
        val branchName = getBranchName(milestoneLinkTrimmed);

        return gitLab
                .getRepositoryApi()
                .getTree(milestoneLinkTrimmed, "/", branchName)
                .stream()
                .filter(treeItem -> treeItem.getPath().toLowerCase().startsWith("overview_"))
                .map(treeItem -> source + "/" + treeItem.getPath())
                .toList();
    }

    public InputStream fetchRepositoryArchive(String codeRepoUrl) throws GitLabApiException {
        val trimmedCodeRepoURL = codeRepoUrl.replace(GITLAB_SERVER + "/", "");
        return gitLab.getRepositoryApi().getRepositoryArchive(trimmedCodeRepoURL, new RepositoryArchiveParams(), "zip");
    }


    public RepositoryData getRepositoryData(String milestoneId) {
        val currentDir = new File(new File(".").getAbsolutePath());
        val dir = currentDir + "/repositories/"  + milestoneId;

        return calculateRepositoryData(new File(dir));
    }

    public RepositoryData calculateRepositoryData(File dir) {
        val files = dir.listFiles();
        if(files == null){
            return new RepositoryData(0, 0);
        }
        long repositoryCount = 0;
        long storageSpace = 0;

        for (File file : files) {
            if (file.isFile()) {
                storageSpace += file.length();
            } else {
                storageSpace += calculateRepositoryData(file).getSizeInByte();
                repositoryCount++;
            }
        }
        return new RepositoryData(repositoryCount, storageSpace);
    }

    public void downloadRepositoriesForJplag(Milestone milestone) throws GitLabApiException, IOException {
        val currentDir = new File(new File(".").getAbsolutePath());
        val repositoriesDir = new File(currentDir + "/repositories/"  + milestone.getName() + "/");

        downloadAllStudentRepositories(milestone, repositoriesDir);
        downloadBaseCodeRepository(milestone, repositoriesDir);
    }

    private void downloadAllStudentRepositories(Milestone milestone, File repositoriesDir){
        // creates the directory /repositories/{milestone_name} in root folder of project
        repositoriesDir.mkdirs();

        forEachAsync(milestone.getStudents(), student -> {
            try {
                val repository = fetchRepositoryArchive(student.getCodeRepoUrl());
                unzip(repository, milestone.getName(), repositoriesDir);
            } catch (IOException | GitLabApiException e) {
                throw new RuntimeException(e);
            }
        });
    }

    private void downloadBaseCodeRepository(Milestone milestone, File repositoryDir) throws GitLabApiException, IOException {
        val baseCodeDir = new File(repositoryDir.getAbsolutePath() + "/base-code");
        // creates directory /repositories/{milestone_name}/base-code in root folder of project
        baseCodeDir.mkdirs();

        val baseCodeRepository = fetchRepositoryArchive(
                milestone.getStudents().getFirst().getTestRepoUrl());
        unzip(baseCodeRepository, milestone.getName(), baseCodeDir);
    }

    // Unzip and newFile methods from: https://www.baeldung.com/java-compress-and-uncompress#unzip
    public void unzip(InputStream repository, String milestoneId, File destDir) throws IOException {
        byte[] buffer = new byte[1024];
        ZipInputStream zis = new ZipInputStream(repository);
        ZipEntry zipEntry = zis.getNextEntry();
        while (zipEntry != null) {
            File newFile = newFile(destDir, zipEntry);
            if (zipEntry.isDirectory()) {
                if (!newFile.isDirectory() && !newFile.mkdirs()) {
                    throw new IOException("Failed to create directory " + newFile);
                }
            } else {
                File parent = newFile.getParentFile();
                if (!parent.isDirectory() && !parent.mkdirs()) {
                    throw new IOException("Failed to create directory " + parent);
                }

                FileOutputStream fos = new FileOutputStream(newFile);
                int len;
                while ((len = zis.read(buffer)) > 0) {
                    fos.write(buffer, 0, len);
                }
                fos.close();
            }
            zipEntry = zis.getNextEntry();
        }
    }

    public static File newFile(File destinationDir, ZipEntry zipEntry) throws IOException {
        File destFile = new File(destinationDir, zipEntry.getName());

        String destDirPath = destinationDir.getCanonicalPath();
        String destFilePath = destFile.getCanonicalPath();

        if (!destFilePath.startsWith(destDirPath + File.separator)) {
            throw new IOException("Entry is outside of the target dir: " + zipEntry.getName());
        }

        return destFile;
    }
}
