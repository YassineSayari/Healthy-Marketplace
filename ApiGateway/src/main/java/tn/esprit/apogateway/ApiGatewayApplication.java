package tn.esprit.apogateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.cloud.gateway.filter.factory.DedupeResponseHeaderGatewayFilterFactory.Config;
import org.springframework.cloud.gateway.filter.factory.DedupeResponseHeaderGatewayFilterFactory;

@EnableDiscoveryClient
@SpringBootApplication
public class ApiGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("product", r -> r.path("/api/products/**")
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE"))
                        .uri("http://localhost:8081"))

                .route("orders", r -> r.path("/api/orders/**", "/api/payments/**")
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE"))
                        .uri("http://localhost:8082"))

                .route("reviewandreports", r -> r.path("/api/reviews/**")
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE"))
                        .uri("http://localhost:8083"))

                .route("delivery", r -> r.path("/api/**")
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE"))
                        .uri("http://localhost:3000"))
                .build();
    }

    @Bean
    public DedupeResponseHeaderGatewayFilterFactory dedupeResponseHeaderGatewayFilterFactory() {
        return new DedupeResponseHeaderGatewayFilterFactory();
    }

}
