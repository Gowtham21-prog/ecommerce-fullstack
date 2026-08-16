package com.fieldingvane.ecommerce.controller;

import com.fieldingvane.ecommerce.dto.*;
import com.fieldingvane.ecommerce.entity.User;
import com.fieldingvane.ecommerce.service.OrderService;
import com.fieldingvane.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerController {

    private final ProductService productService;
    private final OrderService orderService;

    // ---- Product management ----

    @GetMapping("/products")
    public PageResponse<ProductDto> getMyProducts(Authentication authentication,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "20") int size) {
        return productService.getProductsForSeller(userId(authentication), page, size);
    }

    @PostMapping("/products")
    public ResponseEntity<ProductDto> createProduct(Authentication authentication, @Valid @RequestBody ProductRequest request) {
        ProductDto created = productService.createProduct(userId(authentication), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/products/{id}")
    public ProductDto updateProduct(Authentication authentication, @PathVariable Long id,
                                     @Valid @RequestBody ProductRequest request) {
        return productService.updateProduct(userId(authentication), id, request, isAdmin(authentication));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(Authentication authentication, @PathVariable Long id) {
        productService.deleteProduct(userId(authentication), id, isAdmin(authentication));
        return ResponseEntity.noContent().build();
    }

    /** Quick stock-only update, e.g. from an inline stock editor in the seller dashboard. */
    @PatchMapping("/products/{id}/stock")
    public ProductDto updateStock(Authentication authentication, @PathVariable Long id,
                                   @RequestBody Map<String, Integer> body) {
        Integer stock = body.get("stock");
        if (stock == null || stock < 0) {
            throw new IllegalArgumentException("stock must be a non-negative integer");
        }
        return productService.updateStock(userId(authentication), id, stock, isAdmin(authentication));
    }

    // ---- Orders containing this seller's products ----

    @GetMapping("/orders")
    public PageResponse<OrderItemDto> getMyOrderItems(Authentication authentication,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "20") int size) {
        return orderService.getOrderItemsForSeller(userId(authentication), page, size);
    }

    @PatchMapping("/orders/{orderId}/status")
    public OrderDto updateOrderStatus(Authentication authentication, @PathVariable Long orderId,
                                       @Valid @RequestBody UpdateOrderStatusRequest request) {
        return orderService.updateOrderStatus(orderId, request.getStatus(), userId(authentication), isAdmin(authentication));
    }

    private Long userId(Authentication authentication) {
        return ((User) authentication.getPrincipal()).getId();
    }

    private boolean isAdmin(Authentication authentication) {
        return ((User) authentication.getPrincipal()).getRole() == User.Role.ADMIN;
    }
}
