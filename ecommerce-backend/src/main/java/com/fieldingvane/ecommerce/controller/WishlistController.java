package com.fieldingvane.ecommerce.controller;

import com.fieldingvane.ecommerce.dto.WishlistItemDto;
import com.fieldingvane.ecommerce.entity.User;
import com.fieldingvane.ecommerce.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public List<WishlistItemDto> getWishlist(Authentication authentication) {
        return wishlistService.getWishlist(userId(authentication));
    }

    @PostMapping("/{productId}")
    public List<WishlistItemDto> addItem(Authentication authentication, @PathVariable Long productId) {
        return wishlistService.addItem(userId(authentication), productId);
    }

    @DeleteMapping("/{productId}")
    public List<WishlistItemDto> removeItem(Authentication authentication, @PathVariable Long productId) {
        return wishlistService.removeItem(userId(authentication), productId);
    }

    private Long userId(Authentication authentication) {
        return ((User) authentication.getPrincipal()).getId();
    }
}
