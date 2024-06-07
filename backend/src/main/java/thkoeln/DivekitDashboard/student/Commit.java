package thkoeln.DivekitDashboard.student;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Commit {
    private String hash;
    private Date date;
    @Column(columnDefinition="text")
    private String message;

}
