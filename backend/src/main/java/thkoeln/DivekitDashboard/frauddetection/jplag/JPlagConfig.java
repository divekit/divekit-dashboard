package thkoeln.DivekitDashboard.frauddetection.jplag;

public record JPlagConfig(int minToken, double similarityThreshold, boolean useBaseCode) {
}
