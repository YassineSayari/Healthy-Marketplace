package tn.esprit.apogateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;

@EnableDiscoveryClient
@SpringBootApplication
public class ApoGatewayApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApoGatewayApplication.class, args);
    }
    @Bean
    public RouteLocator gatewayRoutes(RouteLocatorBuilder builder){
        return builder.routes()
                .route("product",r->r.path("/api/**")
                        .uri("http://localhost:8081") )
                .route("orders",r->r.path("/api/**")
                        .uri("http://localhost:8082") )
                .route("reviewandreports",r->r.path("/api/**")
                        .uri("http://localhost:8083") )
                .route("delivery",r->r.path("/api/**")
                        .uri("http://localhost:3000") )
//                .route("Job", r->r.path("/jobs/**")
//                        .uri("http://localhost:8082") )
                .build();
    }

}
