package thkoeln.DivekitDashboard.frauddetection.fraudmessage;

import org.springframework.stereotype.Service;
import thkoeln.DivekitDashboard.student.Student;
import thkoeln.DivekitDashboard.student.StudentService;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FraudMessageService {

    private final FraudMessageRepository fraudMessageRepository;
    private final StudentService studentService;

    public FraudMessageService(FraudMessageRepository fraudMessageRepository, StudentService studentService) {
        this.fraudMessageRepository = fraudMessageRepository;
        this.studentService = studentService;
    }

    public FraudMessage saveFraudMessage(String fraudMessageStr) {
        String[] msgTokens = fraudMessageStr.split(" ");

        Student student = studentService.getStudentByUuid(
                UUID.fromString(msgTokens[4].replace(":", ""))
        );

        FraudMessage fraudMessage = new FraudMessage(
                fraudMessageStr,
                student.getName(),
                msgTokens[9].replace("'", ""),
                msgTokens[6].replace("'", ""),
                msgTokens[10].replaceAll("[()$]", ""),
                msgTokens[12],
                new Date()
        );

        fraudMessageRepository.save(fraudMessage);

        return fraudMessage;
    }

    public List<FraudMessage> getFraudMessages() {
        return fraudMessageRepository.findAll();
    }

    public List<List<FraudMessage>> groupFraudsByStudent() {
        return getDistinctFrauds()
                .stream()
                .collect(Collectors.groupingBy(FraudMessage::getCampusId))
                .values()
                .stream()
                .sorted(Comparator.<List<FraudMessage>, Integer> comparing(List::size)
                        .reversed()
                        .thenComparing(list -> list.get(0).getCampusId()))
                .toList();
    }

    public Map<String, Map<String, Integer>> getFraudMatches() {
        Map<String, Map<String, Integer>> fraudPartnerMap = new HashMap<>();
        List<FraudMessage> distinctFrauds = getDistinctFrauds();

        distinctFrauds.forEach(fraudMessage -> {
            String campusId = fraudMessage.getCampusId();
            distinctFrauds.forEach(fraudToCompare -> {
                if (fraudMessage.isFraudPartnerWith(fraudToCompare)) {
                    if (!fraudPartnerMap.containsKey(campusId)) {
                        fraudPartnerMap.put(campusId, new HashMap<>());
                    }
                    fraudPartnerMap.get(campusId).merge(fraudToCompare.getCampusId(), 1, Integer::sum);
                }
            });
        });

        return sortedByMatchCount(fraudPartnerMap);
    }

    private List<FraudMessage> getDistinctFrauds() {
        List<FraudMessage> distinctFrauds = new ArrayList<>();
        Set<String> fraudTuples = new HashSet<>();

        getFraudMessages().forEach(fraudMessage -> {
            String fraudTuple = fraudMessage.getCampusId()
                    + fraudMessage.getExpectedName()
                    + fraudMessage.getActualName();

            if (!fraudTuples.contains(fraudTuple)) {
                distinctFrauds.add(fraudMessage);
                fraudTuples.add(fraudTuple);
            }
        });

        return distinctFrauds;
    }

    private Map<String, Map<String, Integer>> sortedByMatchCount(Map<String, Map<String, Integer>> fraudPartnerMap) {
        Map<String, Map<String, Integer>> sortedMap = new HashMap<>();

        fraudPartnerMap.forEach((campusId, partners) -> sortedMap.put(campusId, partners
                .entrySet()
                .stream()
                .sorted(Comparator.comparing(entry -> -entry.getValue())) // minus value simulates reversed sorting
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        Map.Entry::getValue,
                        (e1, e2) -> e1, LinkedHashMap::new
                ))
        ));

        return sortedMap;
    }
}
