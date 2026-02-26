package tn.esprit.reviewreportservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import tn.esprit.reviewreportservice.entity.Review;
import tn.esprit.reviewreportservice.service.ReviewService;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin("*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private tn.esprit.reviewreportservice.client.ProductRestClient productRestClient;

    @PostMapping
    public Review addReview(@RequestBody Review review) {
        return reviewService.addReview(review);
    }

    @GetMapping("/product/{productId}")
    public List<Review> getReviewsByProduct(@PathVariable Long productId) {
        return reviewService.getReviewsByProduct(productId);
    }

    // test openfeign
    @GetMapping("/product/{productId}/details")
    public Object getProductDetailsWithReviews(@PathVariable Long productId) {
        tn.esprit.reviewreportservice.dto.ProductDTO product = null;
        try {
            product = productRestClient.getProductById(productId);
        } catch (feign.FeignException.NotFound e) {
        }

        List<Review> reviews = reviewService.getReviewsByProduct(productId);

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        if (product != null) {
            response.put("product", product);
        } else {
            response.put("product", "Product with ID " + productId + " not found in ProductService");
        }
        response.put("reviews", reviews);
        return response;
    }

    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
    }
}
