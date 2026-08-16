package com.fieldingvane.ecommerce.service;

import com.fieldingvane.ecommerce.dto.ReviewDto;
import com.fieldingvane.ecommerce.dto.ReviewRequest;
import com.fieldingvane.ecommerce.entity.Product;
import com.fieldingvane.ecommerce.entity.Review;
import com.fieldingvane.ecommerce.entity.User;
import com.fieldingvane.ecommerce.exception.ResourceNotFoundException;
import com.fieldingvane.ecommerce.mapper.EntityMapper;
import com.fieldingvane.ecommerce.repository.ProductRepository;
import com.fieldingvane.ecommerce.repository.ReviewRepository;
import com.fieldingvane.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    public List<ReviewDto> getReviewsForProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream().map(mapper::toReviewDto).toList();
    }

    @Transactional
    public ReviewDto addOrUpdateReview(Long userId, Long productId, ReviewRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        User user = userRepository.getReferenceById(userId);

        Review review = reviewRepository.findByUserIdAndProductId(userId, productId)
                .orElseGet(() -> Review.builder().user(user).product(product).build());

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review = reviewRepository.save(review);

        recalculateProductRating(product);

        return mapper.toReviewDto(review);
    }

    @Transactional
    public void deleteReview(Long userId, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found"));

        if (!review.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only delete your own review");
        }

        Product product = review.getProduct();
        reviewRepository.delete(review);
        recalculateProductRating(product);
    }

    private void recalculateProductRating(Product product) {
        List<Review> reviews = reviewRepository.findByProductIdOrderByCreatedAtDesc(product.getId());
        int count = reviews.size();
        double avg = count == 0 ? 0.0 : reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);
        product.setReviewCount(count);
        product.setRating(Math.round(avg * 10.0) / 10.0);
        productRepository.save(product);
    }
}
