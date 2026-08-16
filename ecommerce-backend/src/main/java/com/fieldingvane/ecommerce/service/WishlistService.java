package com.fieldingvane.ecommerce.service;

import com.fieldingvane.ecommerce.dto.WishlistItemDto;
import com.fieldingvane.ecommerce.entity.Product;
import com.fieldingvane.ecommerce.entity.User;
import com.fieldingvane.ecommerce.entity.WishlistItem;
import com.fieldingvane.ecommerce.exception.ResourceNotFoundException;
import com.fieldingvane.ecommerce.mapper.EntityMapper;
import com.fieldingvane.ecommerce.repository.ProductRepository;
import com.fieldingvane.ecommerce.repository.UserRepository;
import com.fieldingvane.ecommerce.repository.WishlistItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    public List<WishlistItemDto> getWishlist(Long userId) {
        return wishlistItemRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(mapper::toWishlistItemDto).toList();
    }

    @Transactional
    public List<WishlistItemDto> addItem(Long userId, Long productId) {
        if (!wishlistItemRepository.existsByUserIdAndProductId(userId, productId)) {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            User userRef = userRepository.getReferenceById(userId);
            wishlistItemRepository.save(WishlistItem.builder().user(userRef).product(product).build());
        }
        return getWishlist(userId);
    }

    @Transactional
    public List<WishlistItemDto> removeItem(Long userId, Long productId) {
        wishlistItemRepository.deleteByUserIdAndProductId(userId, productId);
        return getWishlist(userId);
    }
}
