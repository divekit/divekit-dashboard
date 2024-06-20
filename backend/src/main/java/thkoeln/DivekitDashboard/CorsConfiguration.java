package thkoeln.DivekitDashboard;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfiguration {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                final String FRONTEND_PORT = System.getenv("DOCKER_FRONTEND_PORT") + "";
                registry.addMapping("/**")
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedOrigins("http://localhost:" + FRONTEND_PORT)
                        .allowedHeaders("*")
                        .maxAge(-1)
                        .allowCredentials(false);
            }
        };
    }
}