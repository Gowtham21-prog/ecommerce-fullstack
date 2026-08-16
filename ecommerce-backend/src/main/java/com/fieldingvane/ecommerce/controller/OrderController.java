package com.fieldingvane.ecommerce.controller;

import com.fieldingvane.ecommerce.dto.CreateOrderRequest;
import com.fieldingvane.ecommerce.dto.OrderDto;
import com.fieldingvane.ecommerce.dto.PageResponse;
import com.fieldingvane.ecommerce.entity.User;
import com.fieldingvane.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    /** Checkout: builds an order from the caller's current server-side cart. */
    @PostMapping
    public ResponseEntity<OrderDto> createOrder(Authentication authentication, @Valid @RequestBody CreateOrderRequest request) {
        OrderDto order = orderService.createOrder(userId(authentication), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(order);
    }

    /** The caller's own order history, most recent first. */
    @GetMapping
    public PageResponse<OrderDto> getMyOrders(Authentication authentication,
                                               @RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "10") int size) {
        return orderService.getOrdersForUser(userId(authentication), page, size);
    }

    @GetMapping("/{id}")
    public OrderDto getOrder(Authentication authentication, @PathVariable Long id) {
        User user = (User) authentication.getPrincipal();
        boolean privileged = user.getRole() == User.Role.ADMIN || user.getRole() == User.Role.SELLER;
        return orderService.getOrderById(user.getId(), id, privileged);
    }

    private Long userId(Authentication authentication) {
        return ((User) authentication.getPrincipal()).getId();
    }
}
