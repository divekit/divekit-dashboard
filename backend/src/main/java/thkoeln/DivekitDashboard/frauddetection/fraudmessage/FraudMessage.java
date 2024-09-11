package thkoeln.DivekitDashboard.frauddetection.fraudmessage;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FraudMessage {
    @Id
    @GeneratedValue
    private Long id;
    private String text;
    private String campusId;
    private String expectedName;
    private String actualName;
    private String placeholder;
    private String filePathFromSrc;
    private Date detectionDate;

    public FraudMessage(
            String text,
            String campusId,
            String expectedName,
            String actualName,
            String placeholder,
            String filePathFromSrc,
            Date detectionDate
    ) {
        this.text = text;
        this.campusId = campusId;
        this.expectedName = expectedName;
        this.actualName = actualName;
        this.placeholder = placeholder;
        this.filePathFromSrc = filePathFromSrc;
        this.detectionDate = detectionDate;
    }

    public boolean isFraudPartnerWith(FraudMessage fraudMessage) {
        return !this.getCampusId().equals(fraudMessage.getCampusId())
                && this.getExpectedName().equals(fraudMessage.getExpectedName())
                && this.getActualName().equals(fraudMessage.getActualName());
    }
}
