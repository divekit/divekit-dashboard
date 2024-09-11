package thkoeln.DivekitDashboard.frauddetection.fraudmessage;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FraudMessageRepository extends JpaRepository<FraudMessage, Long> {
}
