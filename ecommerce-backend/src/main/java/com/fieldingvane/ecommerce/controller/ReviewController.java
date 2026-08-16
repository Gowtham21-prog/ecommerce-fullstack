package com.fieldingvane.ecommerce.controller;

import com.fieldingvane.ecommerce.dto.ReviewDto;
import com.fieldingvane.ecommerce.dto.ReviewRequest;
import com.fieldingvane.ecommerce.entity.User;
import com.fieldingvane.ecommerce.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    /** Public: anyone can read a product's reviews. */
    @GetMapping("/api/products/{productId}/reviews")
    public List<ReviewDto> getReviews(@PathVariable Long productId) {
        return reviewService.getReviewsForProduct(productId);
    }

    /** Authenticated: create or update the caller's own review for a product (one review per user per product). */
    @PostMapping("/api/products/{productId}/reviews")
    public ReviewDto addOrUpdateReview(Authentication authentication, @PathVariable Long productId,
                                        @Valid @RequestBody ReviewRequest request) {
        return reviewService.addOrUpdateReview(userId(authentication), productId, request);
    }

    @DeleteMapping("/api/reviews/{reviewId}")
    public void deleteReview(Authentication authentication, @PathVariable Long reviewId) {
        reviewService.deleteReview(userId(authentication), reviewId);
    }

    private Long userId(Authentication authentication) {
        return ((User) authentication.getPrincipal()).getId();
    }
}
