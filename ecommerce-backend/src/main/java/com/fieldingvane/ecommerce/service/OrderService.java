package com.fieldingvane.ecommerce.service;

import com.fieldingvane.ecommerce.dto.*;
import com.fieldingvane.ecommerce.entity.*;
import com.fieldingvane.ecommerce.exception.ResourceNotFoundException;
import com.fieldingvane.ecommerce.mapper.EntityMapper;
import com.fieldingvane.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    @Transactional
    public OrderDto createOrder(Long userId, CreateOrderRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUserIdOrderByCreatedAtDesc(userId);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Your cart is empty");
        }

        // Validate stock for every line before committing anything.
        for (CartItem ci : cartItems) {
            Product product = ci.getProduct();
            if (product.getStock() == null || product.getStock() < ci.getQuantity()) {
                throw new IllegalArgumentException(
                        "Only " + (product.getStock() == null ? 0 : product.getStock())
                                + " unit(s) of \"" + product.getName() + "\" are in stock");
            }
        }

        User user = userRepository.getReferenceById(userId);

        Order order = Order.builder()
                .user(user)
                .totalAmount(0)
                .shippingName(request.getShippingName())
                .shippingPhone(request.getShippingPhone())
                .shippingAddress(request.getShippingAddress())
                .shippingCity(request.getShippingCity())
                .shippingState(request.getShippingState())
                .shippingPincode(request.getShippingPincode())
                .paymentMethod(request.getPaymentMethod() == null || request.getPaymentMethod().isBlank()
                        ? "COD" : request.getPaymentMethod())
                .build();

        List<OrderItem> orderItems = new ArrayList<>();
        int total = 0;
        for (CartItem ci : cartItems) {
            Product product = ci.getProduct();

            OrderItem oi = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .productName(product.getName())
                    .productImage(product.getImageUrl())
                    .price(product.getPrice())
                    .quantity(ci.getQuantity())
                    .build();
            orderItems.add(oi);
            total += product.getPrice() * ci.getQuantity();

            // Decrement stock now that we're committing the order.
            product.setStock(product.getStock() - ci.getQuantity());
            productRepository.save(product);
        }

        order.setItems(orderItems);
        order.setTotalAmount(total);

        order = orderRepository.save(order);

        // Empty the cart now that it has become an order.
        cartItemRepository.deleteByUserId(userId);

        return mapper.toOrderDto(order);
    }

    public PageResponse<OrderDto> getOrdersForUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        var result = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable).map(mapper::toOrderDto);
        return PageResponse.from(result);
    }

    public OrderDto getOrderById(Long userId, Long orderId, boolean isSellerOrAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!isSellerOrAdmin && !order.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "This order does not belong to you");
        }

        return mapper.toOrderDto(order);
    }

    /** Orders containing at least one item from this seller's products. */
    public PageResponse<OrderItemDto> getOrderItemsForSeller(Long sellerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        var result = orderItemRepository.findByProductSellerIdOrderByIdDesc(sellerId, pageable).map(mapper::toOrderItemDto);
        return PageResponse.from(result);
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, String status, Long actingUserId, boolean isAdmin) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        Order.OrderStatus newStatus;
        try {
            newStatus = Order.OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        if (!isAdmin) {
            boolean sellsInOrder = order.getItems().stream()
                    .anyMatch(i -> i.getProduct() != null && i.getProduct().getSeller() != null
                            && i.getProduct().getSeller().getId().equals(actingUserId));
            if (!sellsInOrder) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not sell any items in this order");
            }
        }

        order.setStatus(newStatus);
        order.setUpdatedAt(java.time.LocalDateTime.now());
        order = orderRepository.save(order);
        return mapper.toOrderDto(order);
    }
}
