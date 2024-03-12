package thkoeln.DivekitDashboard.milestone;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import thkoeln.DivekitDashboard.student.Student;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
public class Milestone {
    @Id
    @GeneratedValue
    private Long id;
    private String name;
    private String source;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Student> students;

    public Milestone(String name, String source, List<Student> students) {
        this.name = name;
        this.source = source;
        this.students = students;
    }
}
