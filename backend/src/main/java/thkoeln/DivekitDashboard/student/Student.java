package thkoeln.DivekitDashboard.student;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@NoArgsConstructor
@Data
public class Student {
    @Id
    @GeneratedValue
    private Long id;
    private UUID uuid;
    private String name;
    private String codeRepoUrl;
    private String testRepoUrl;
    private String testOverviewUrl;

    @ElementCollection
    private List<MilestoneTest> milestoneTests;

    @ElementCollection
    private List<Commit> commits;

    public Student(
            UUID uuid,
            String name,
            String codeRepoUrl,
            String testRepoUrl,
            String testOverviewUrl,
            List<MilestoneTest> milestoneTests
    ) {
        this.uuid = uuid;
        this.name = name;
        this.codeRepoUrl = codeRepoUrl;
        this.testRepoUrl = testRepoUrl;
        this.testOverviewUrl = testOverviewUrl;
        this.milestoneTests = milestoneTests;
    }
}
