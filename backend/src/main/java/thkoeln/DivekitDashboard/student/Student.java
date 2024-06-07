package thkoeln.DivekitDashboard.student;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@NoArgsConstructor
@Data
public class Student {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String codeRepoUrl;
    private String testRepoUrl;
    private String testOverviewUrl;

    @ElementCollection
    private List<MilestoneTest> milestoneTests;

    @ElementCollection
    private List<Commit> commits;

    public Student(String name,
                   String codeRepoUrl,
                   String testRepoUrl,
                   String testOverviewUrl,
                   List<MilestoneTest> milestoneTests) {
        this.name = name;
        this.codeRepoUrl = codeRepoUrl;
        this.testRepoUrl = testRepoUrl;
        this.testOverviewUrl = testOverviewUrl;
        this.milestoneTests = milestoneTests;
    }
}
