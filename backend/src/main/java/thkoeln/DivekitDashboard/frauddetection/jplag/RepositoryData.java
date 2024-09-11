package thkoeln.DivekitDashboard.frauddetection.jplag;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class RepositoryData {
    private long downloadedRepositories;
    private long sizeInByte;
}
