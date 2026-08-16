package com.fieldingvane.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDto {
    private Long id;
    private Long userId;
    private String userName;
    private Long productId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
