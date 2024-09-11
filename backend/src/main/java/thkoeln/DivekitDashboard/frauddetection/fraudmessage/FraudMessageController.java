package thkoeln.DivekitDashboard.frauddetection.fraudmessage;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import thkoeln.DivekitDashboard.student.StudentService;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/fraud-messages")
public class FraudMessageController {
    private final FraudMessageService fraudMessageService;
    private final StudentService studentService;

    public FraudMessageController(FraudMessageService fraudMessageService, StudentService studentService) {
        this.fraudMessageService = fraudMessageService;
        this.studentService = studentService;
    }

    @PostMapping("")
    public ResponseEntity<FraudMessage> saveFraudMessage(@RequestBody String fraudMessageStr) {
        if (fraudMessageStr == null || fraudMessageStr.isEmpty()) {
            throw new IllegalArgumentException("Fraud message should not be empty.");
        }

        FraudMessage fraudMessage = fraudMessageService.saveFraudMessage(fraudMessageStr);

        return ResponseEntity.ok(fraudMessage);
    }

    @GetMapping("")
    public ResponseEntity<Iterable<FraudMessage>> getFraudMessages() {
        return ResponseEntity.ok(fraudMessageService.getFraudMessages());
    }

    @GetMapping("/students")
    public ResponseEntity<Iterable<List<FraudMessage>>> groupFraudsByStudent() {
        return ResponseEntity.ok(fraudMessageService.groupFraudsByStudent());
    }

    @GetMapping("/matches")
    public ResponseEntity<Map<String, Map<String, Integer>>> getFraudMatches() {
        return ResponseEntity.ok(fraudMessageService.getFraudMatches());
    }

    // this method exists only for testing purposes
    @PostMapping("/testdata")
    public ResponseEntity<List<FraudMessage>> createTestData() {
        List<UUID> randomUuids = studentService.getRandomUuids(6);
        if (!fraudMessageService.getFraudMessages().isEmpty() || randomUuids.size() < 6) {
            return ResponseEntity.badRequest().build();
        }
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(0) + ": Found 'Delivery' instead of 'Fulfillment' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d0");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(1) + ": Found 'Delivery' instead of 'Fulfillment' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d1");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(1) + ": Found 'Delivery' instead of 'Fulfillment' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d1");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(1) + ": Found 'Merchandise' instead of 'Product' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d1");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(1) + ": Found 'Delivery' instead of 'Package' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d1");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(1) + ": Found 'SellingPrice' instead of 'SellPrice' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d1");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(2) + ": Found 'Item' instead of 'Thing' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d2");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(2) + ": Found 'Order' instead of 'Purchase' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d2");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(3) + ": Found 'Delivery' instead of 'Fulfillment' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d3");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(3) + ": Found 'Merchandise' instead of 'Product' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d3");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(3) + ": Found 'Delivery' instead of 'Package' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d3");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(3) + ": Found 'SellingPrice' instead of 'SellPrice' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d1");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(4) + ": Found 'Fulfillment' instead of 'Delivery' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d4");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(5) + ": Found 'Item' instead of 'Thing' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d2");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(5) + ": Found 'Order' instead of 'Purchase' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d2");
        saveFraudMessage("Possible Fraud  in " + randomUuids.get(5) + ": Found 'Merchandise' instead of 'Product' ($Object.id$) in src/main/java/thkoeln/archilab/ecommerce/solution/thing/application/ThingCalalogService.java - 262064c8-d83d-47f7-bddf-fd8abe8fe9d5");
        return ResponseEntity.ok(fraudMessageService.getFraudMessages());
    }
}
