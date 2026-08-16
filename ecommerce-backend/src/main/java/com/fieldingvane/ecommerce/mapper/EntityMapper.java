package com.fieldingvane.ecommerce.mapper;

import com.fieldingvane.ecommerce.dto.*;
import com.fieldingvane.ecommerce.entity.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class EntityMapper {

    public CategoryDto toCategoryDto(Category category) {
        if (category == null) {
            return null;
        }
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .imageUrl(category.getImageUrl())
                .build();
    }

    public ProductDto toProductDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .slug(product.getSlug())
                .description(product.getDescription())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .category(toCategoryDto(product.getCategory()))
                .rating(product.getRating())
                .reviewCount(product.getReviewCount())
                .imageUrl(product.getImageUrl())
                .images(product.getImages())
                .stock(product.getStock())
                .featured(product.getFeatured())
                .bestseller(product.getBestseller())
                .sellerId(product.getSeller() != null ? product.getSeller().getId() : null)
                .build();
    }

    public CartItemDto toCartItemDto(CartItem item) {
        return CartItemDto.builder()
                .id(item.getId())
                .product(toProductDto(item.getProduct()))
                .quantity(item.getQuantity())
                .build();
    }

    public WishlistItemDto toWishlistItemDto(WishlistItem item) {
        return WishlistItemDto.builder()
                .id(item.getId())
                .product(toProductDto(item.getProduct()))
                .build();
    }

    public ReviewDto toReviewDto(Review review) {
        return ReviewDto.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userName(review.getUser().getName())
                .productId(review.getProduct().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }

    public OrderItemDto toOrderItemDto(OrderItem item) {
        return OrderItemDto.builder()
                .id(item.getId())
                .orderId(item.getOrder() != null ? item.getOrder().getId() : null)
                .productId(item.getProduct() != null ? item.getProduct().getId() : null)
                .productName(item.getProductName())
                .productImage(item.getProductImage())
                .price(item.getPrice())
                .quantity(item.getQuantity())
                .build();
    }

    public OrderDto toOrderDto(Order order) {
        List<OrderItemDto> items = order.getItems().stream().map(this::toOrderItemDto).toList();
        return OrderDto.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .items(items)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus().name())
                .shippingName(order.getShippingName())
                .shippingPhone(order.getShippingPhone())
                .shippingAddress(order.getShippingAddress())
                .shippingCity(order.getShippingCity())
                .shippingState(order.getShippingState())
                .shippingPincode(order.getShippingPincode())
                .paymentMethod(order.getPaymentMethod())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
