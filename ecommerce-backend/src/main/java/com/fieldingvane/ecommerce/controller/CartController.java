package com.fieldingvane.ecommerce.controller;

import com.fieldingvane.ecommerce.dto.AddToCartRequest;
import com.fieldingvane.ecommerce.dto.CartResponse;
import com.fieldingvane.ecommerce.dto.UpdateCartItemRequest;
import com.fieldingvane.ecommerce.entity.User;
import com.fieldingvane.ecommerce.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    public CartResponse getCart(Authentication authentication) {
        return cartService.getCart(userId(authentication));
    }

    @PostMapping("/items")
    public CartResponse addItem(Authentication authentication, @Valid @RequestBody AddToCartRequest request) {
        return cartService.addItem(userId(authentication), request.getProductId(), request.getQuantity());
    }

    @PutMapping("/items/{productId}")
    public CartResponse updateItem(Authentication authentication, @PathVariable Long productId,
                                    @Valid @RequestBody UpdateCartItemRequest request) {
        return cartService.updateItemQuantity(userId(authentication), productId, request.getQuantity());
    }

    @DeleteMapping("/items/{productId}")
    public CartResponse removeItem(Authentication authentication, @PathVariable Long productId) {
        return cartService.removeItem(userId(authentication), productId);
    }

    @DeleteMapping
    public CartResponse clearCart(Authentication authentication) {
        return cartService.clearCart(userId(authentication));
    }

    private Long userId(Authentication authentication) {
        return ((User) authentication.getPrincipal()).getId();
    }
}
