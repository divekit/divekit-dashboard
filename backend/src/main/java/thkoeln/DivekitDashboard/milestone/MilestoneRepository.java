package thkoeln.DivekitDashboard.milestone;

import org.springframework.data.repository.CrudRepository;
import thkoeln.DivekitDashboard.milestone.Milestone;

import java.util.Optional;

public interface MilestoneRepository extends CrudRepository<Milestone, Long> {

    void deleteAllBySource(String source);

    Optional<Milestone> findFirstBySource(String source);
}
