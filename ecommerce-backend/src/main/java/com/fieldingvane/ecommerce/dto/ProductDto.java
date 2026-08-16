package com.fieldingvane.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private Integer price;
    private Integer originalPrice;
    private CategoryDto category;
    private Double rating;
    private Integer reviewCount;
    private String imageUrl;
    private List<String> images;
    private Integer stock;
    private Boolean featured;
    private Boolean bestseller;
    private Long sellerId;
}
