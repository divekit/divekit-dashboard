package thkoeln.DivekitDashboard.frauddetection.jplag;

import de.jplag.exceptions.ExitException;
import de.jplag.exceptions.RootDirectoryException;
import lombok.val;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.util.NoSuchElementException;

@CrossOrigin(origins = "http://localhost:3000/", allowCredentials = "true")
@RestController
@RequestMapping("milestones")
public class JPlagController {
    private static final String MIME_TYPE = "application/zip";

    private final JPlagService jPlagService;

    public JPlagController(JPlagService jPlagService) {
        this.jPlagService = jPlagService;
    }

    @GetMapping(value = "/{milestone-id}/report", produces = MIME_TYPE)
    public ResponseEntity<byte[]> getJPlagReport(@PathVariable("milestone-id") String milestoneId,
                             @RequestParam(name = "minToken", defaultValue = "15") int minToken,
                             @RequestParam(name = "threshold", defaultValue = "0.3") double threshold,
                             @RequestParam(name = "useBaseCode", defaultValue = "false") boolean useBaseCode){
        try {
            val config = new JPlagConfig(minToken, threshold, useBaseCode);
            System.out.printf(
            "Running report for milestoneId %s with minToken %s, threshold %s and base code %s%n", milestoneId, minToken, threshold, useBaseCode);
            val reportLocation = jPlagService.run(milestoneId, config);
            reportLocation.mkdirs();
            val report = Files.readAllBytes(reportLocation.toPath());

            return ResponseEntity.ok()
                    .contentLength(report.length)
                    .header(HttpHeaders.CONTENT_TYPE,  MIME_TYPE)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + milestoneId + ".zip")
                    .body(report);
        } catch(NoSuchElementException | RootDirectoryException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Cannot retrieve milestone with milestone id " + milestoneId + ".",
                    e
            );
        } catch (IOException | ExitException e) {
            System.out.println("Base Repository not working");
            throw new RuntimeException(e);
        }
    }
}
