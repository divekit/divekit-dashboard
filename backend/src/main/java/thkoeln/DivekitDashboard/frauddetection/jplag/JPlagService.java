package thkoeln.DivekitDashboard.frauddetection.jplag;


import de.jplag.JPlag;
import de.jplag.JPlagResult;
import de.jplag.exceptions.ExitException;
import de.jplag.java.JavaLanguage;
import de.jplag.options.JPlagOptions;
import de.jplag.reporting.reportobject.ReportObjectFactory;
import lombok.val;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Set;

@Service
public class JPlagService {

    public File run(String milestoneId, JPlagConfig config) throws ExitException, FileNotFoundException {
        val currentDir = new File(new File(".").getAbsolutePath()) + "/repositories/";

        JPlagOptions options = getjPlagOptions(milestoneId, config, currentDir);

        JPlagResult result = JPlag.run(options);
        new File(currentDir + "reports").mkdirs();
        ReportObjectFactory reportObjectFactory = new ReportObjectFactory(
                new File(currentDir + "reports/" + milestoneId + ".zip"));
        reportObjectFactory.createAndSaveReport(result);

        return new File(currentDir + "reports/" + milestoneId + ".zip");
    }

    private static JPlagOptions getjPlagOptions(String milestoneId, JPlagConfig config, String currentDir) {
        JavaLanguage language = new JavaLanguage();
        language.getOptions();
        Set<File> submissionDirectories = Set.of(new File(currentDir + milestoneId));
        JPlagOptions options = new JPlagOptions(language, submissionDirectories, Set.of())
                .withMinimumTokenMatch(config.minToken())
                .withSimilarityThreshold(config.similarityThreshold());

        if(config.useBaseCode()){
            File baseCode = new File(currentDir + milestoneId + "/base-code");
            options = options.withBaseCodeSubmissionDirectory(baseCode);
        }
        return options;
    }
}
