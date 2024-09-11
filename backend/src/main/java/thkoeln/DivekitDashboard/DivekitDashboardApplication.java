package thkoeln.DivekitDashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DivekitDashboardApplication {

	public static void main(String[] args) {
		SpringApplication.run(DivekitDashboardApplication.class, args);
	}
}
