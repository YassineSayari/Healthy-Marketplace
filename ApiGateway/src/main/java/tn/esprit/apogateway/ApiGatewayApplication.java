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
                .route("product", r -> r.path("/api/products/**" , "/api/categories")
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE"))
                        .uri("lb://PRODUCTSERVICE"))

                .route("orders", r -> r.path("/api/orders/**", "/api/payments/**")
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE"))
                        .uri("lb://ORDERSERVICE"))

                .route("reviewandreports", r -> r.path("/api/reviews/**", "/api/reports/**", "/REVIEWREPORTSERVICE/**")
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE")
                                .rewritePath("/REVIEWREPORTSERVICE/(?<segment>.*)", "/${segment}")
                                .tokenRelay())
                        .uri("lb://REVIEWREPORTSERVICE"))
                .route("forum", r -> r.path("/api/posts/**")
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE")
                                .tokenRelay())
                        .uri("lb://FORUMSERVICE"))

                .route("diet", r -> r.path("/api/MealPlan/**", "/api/NutritionProfile/**")
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE"))
                        .uri("http://localhost:8008"))

                .route("delivery", r -> r.path("/api/**")
                        .filters(f -> f.dedupeResponseHeader("Access-Control-Allow-Origin", "RETAIN_UNIQUE")
                                .dedupeResponseHeader("Access-Control-Allow-Credentials", "RETAIN_UNIQUE")
                                .tokenRelay())
                        .uri("lb://DELIVERY-SERVICE"))
                .build();
    }

    @Bean
    public DedupeResponseHeaderGatewayFilterFactory dedupeResponseHeaderGatewayFilterFactory() {
        return new DedupeResponseHeaderGatewayFilterFactory();
    }

}
