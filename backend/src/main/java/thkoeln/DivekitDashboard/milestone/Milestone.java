package thkoeln.DivekitDashboard.milestone;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import thkoeln.DivekitDashboard.student.Student;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Milestone {
    @Id
    private String name;
    private String source;
    @OneToMany(cascade = CascadeType.ALL)
    private List<Student> students;
}
