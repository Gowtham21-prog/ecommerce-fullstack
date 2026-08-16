package com.fieldingvane.ecommerce.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "name is required")
    private String name;

    private String description;

    @NotNull(message = "price is required")
    @Min(value = 0, message = "price must be non-negative")
    private Integer price;

    private Integer originalPrice;

    private Long categoryId;

    private String imageUrl;

    private List<String> images;

    @NotNull(message = "stock is required")
    @Min(value = 0, message = "stock must be non-negative")
    private Integer stock;

    private Boolean featured = false;

    private Boolean bestseller = false;
}
