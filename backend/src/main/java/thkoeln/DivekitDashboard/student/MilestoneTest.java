package thkoeln.DivekitDashboard.student;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Embeddable
@AllArgsConstructor
@NoArgsConstructor
@Data
public class MilestoneTest {
    int id;
    String name;
    String groupName;
    boolean isPassed;
}
