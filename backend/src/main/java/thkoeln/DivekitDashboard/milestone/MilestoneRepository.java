package thkoeln.DivekitDashboard.milestone;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface MilestoneRepository extends JpaRepository<Milestone, String> {

    void deleteAllBySource(String source);

    Optional<Milestone> findFirstBySource(String source);

    @Query("select distinct source from Milestone")
    List<String> getAllSources();
}
