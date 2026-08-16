package com.fieldingvane.ecommerce.controller;

import com.fieldingvane.ecommerce.dto.PageResponse;
import com.fieldingvane.ecommerce.dto.ProductDto;
import com.fieldingvane.ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public PageResponse<ProductDto> getProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer minPrice,
            @RequestParam(required = false) Integer maxPrice,
            @RequestParam(required = false) String sort) {

        return productService.getProducts(page, size, category, search, minPrice, maxPrice, sort);
    }

    @GetMapping("/{id}")
    public ProductDto getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/slug/{slug}")
    public ProductDto getProductBySlug(@PathVariable String slug) {
        return productService.getProductBySlug(slug);
    }
}
