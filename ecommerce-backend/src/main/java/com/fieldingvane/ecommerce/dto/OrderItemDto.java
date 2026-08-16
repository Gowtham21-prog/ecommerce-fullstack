package com.fieldingvane.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemDto {
    private Long id;
    private Long orderId;
    private Long productId;
    private String productName;
    private String productImage;
    private Integer price;
    private Integer quantity;
}
