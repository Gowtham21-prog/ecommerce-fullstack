package com.fieldingvane.ecommerce.service;

import com.fieldingvane.ecommerce.dto.CartResponse;
import com.fieldingvane.ecommerce.entity.CartItem;
import com.fieldingvane.ecommerce.entity.Product;
import com.fieldingvane.ecommerce.entity.User;
import com.fieldingvane.ecommerce.exception.ResourceNotFoundException;
import com.fieldingvane.ecommerce.mapper.EntityMapper;
import com.fieldingvane.ecommerce.repository.CartItemRepository;
import com.fieldingvane.ecommerce.repository.ProductRepository;
import com.fieldingvane.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    public CartResponse getCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return toResponse(items);
    }

    @Transactional
    public CartResponse addItem(Long userId, Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, productId)
                .orElseGet(() -> {
                    User userRef = userRepository.getReferenceById(userId);
                    return CartItem.builder().user(userRef).product(product).quantity(0).build();
                });

        int newQuantity = item.getQuantity() + quantity;
        if (product.getStock() != null && newQuantity > product.getStock()) {
            throw new IllegalArgumentException("Only " + product.getStock() + " unit(s) of \"" + product.getName() + "\" are in stock");
        }

        item.setQuantity(newQuantity);
        cartItemRepository.save(item);

        return getCart(userId);
    }

    @Transactional
    public CartResponse updateItemQuantity(Long userId, Long productId, int quantity) {
        CartItem item = cartItemRepository.findByUserIdAndProductId(userId, productId)
                .orElseThrow(() -> new ResourceNotFoundException("Item not in cart"));

        Product product = item.getProduct();
        if (product.getStock() != null && quantity > product.getStock()) {
            throw new IllegalArgumentException("Only " + product.getStock() + " unit(s) of \"" + product.getName() + "\" are in stock");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
        return getCart(userId);
    }

    @Transactional
    public CartResponse removeItem(Long userId, Long productId) {
        cartItemRepository.deleteByUserIdAndProductId(userId, productId);
        return getCart(userId);
    }

    @Transactional
    public CartResponse clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
        return getCart(userId);
    }

    private CartResponse toResponse(List<CartItem> items) {
        var dtos = items.stream().map(mapper::toCartItemDto).toList();
        int subtotal = items.stream().mapToInt(i -> i.getProduct().getPrice() * i.getQuantity()).sum();
        int itemCount = items.stream().mapToInt(CartItem::getQuantity).sum();
        return CartResponse.builder().items(dtos).subtotal(subtotal).itemCount(itemCount).build();
    }
}
