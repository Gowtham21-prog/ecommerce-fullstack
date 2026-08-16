package com.fieldingvane.ecommerce.service;

import com.fieldingvane.ecommerce.dto.PageResponse;
import com.fieldingvane.ecommerce.dto.ProductDto;
import com.fieldingvane.ecommerce.dto.ProductRequest;
import com.fieldingvane.ecommerce.entity.Category;
import com.fieldingvane.ecommerce.entity.Product;
import com.fieldingvane.ecommerce.entity.User;
import com.fieldingvane.ecommerce.exception.ResourceNotFoundException;
import com.fieldingvane.ecommerce.mapper.EntityMapper;
import com.fieldingvane.ecommerce.repository.CategoryRepository;
import com.fieldingvane.ecommerce.repository.ProductRepository;
import com.fieldingvane.ecommerce.repository.UserRepository;
import com.fieldingvane.ecommerce.specification.ProductSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final EntityMapper mapper;

    public PageResponse<ProductDto> getProducts(int page, int size, String category, String search,
                                                 Integer minPrice, Integer maxPrice, String sort) {

        Specification<Product> spec = Specification
                .where(ProductSpecifications.hasCategory(category))
                .and(ProductSpecifications.matchesSearch(search))
                .and(ProductSpecifications.priceGreaterThanOrEqual(minPrice))
                .and(ProductSpecifications.priceLessThanOrEqual(maxPrice));

        Pageable pageable = PageRequest.of(page, size, resolveSort(sort));

        org.springframework.data.domain.Page<ProductDto> resultPage =
                productRepository.findAll(spec, pageable).map(mapper::toProductDto);

        return PageResponse.from(resultPage);
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return mapper.toProductDto(product);
    }

    public ProductDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return mapper.toProductDto(product);
    }

    // ---------------------------------------------------------------
    // Seller-facing catalog management
    // ---------------------------------------------------------------

    public PageResponse<ProductDto> getProductsForSeller(Long sellerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        var result = productRepository.findBySellerIdOrderByCreatedAtDesc(sellerId, pageable).map(mapper::toProductDto);
        return PageResponse.from(result);
    }

    @Transactional
    public ProductDto createProduct(Long sellerId, ProductRequest request) {
        User seller = userRepository.getReferenceById(sellerId);
        Category category = resolveCategory(request.getCategoryId());

        Product product = Product.builder()
                .name(request.getName())
                .slug(generateUniqueSlug(request.getName()))
                .description(request.getDescription())
                .price(request.getPrice())
                .originalPrice(request.getOriginalPrice())
                .category(category)
                .seller(seller)
                .imageUrl(request.getImageUrl())
                .images(request.getImages() != null ? request.getImages() : List.of())
                .stock(request.getStock())
                .featured(Boolean.TRUE.equals(request.getFeatured()))
                .bestseller(Boolean.TRUE.equals(request.getBestseller()))
                .build();

        product = productRepository.save(product);
        return mapper.toProductDto(product);
    }

    @Transactional
    public ProductDto updateProduct(Long sellerId, Long productId, ProductRequest request, boolean isAdmin) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        assertOwnership(product, sellerId, isAdmin);

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setCategory(resolveCategory(request.getCategoryId()));
        product.setImageUrl(request.getImageUrl());
        if (request.getImages() != null) {
            product.setImages(request.getImages());
        }
        product.setStock(request.getStock());
        product.setFeatured(Boolean.TRUE.equals(request.getFeatured()));
        product.setBestseller(Boolean.TRUE.equals(request.getBestseller()));

        product = productRepository.save(product);
        return mapper.toProductDto(product);
    }

    @Transactional
    public void deleteProduct(Long sellerId, Long productId, boolean isAdmin) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        assertOwnership(product, sellerId, isAdmin);
        productRepository.delete(product);
    }

    @Transactional
    public ProductDto updateStock(Long sellerId, Long productId, int stock, boolean isAdmin) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        assertOwnership(product, sellerId, isAdmin);
        product.setStock(stock);
        product = productRepository.save(product);
        return mapper.toProductDto(product);
    }

    private void assertOwnership(Product product, Long sellerId, boolean isAdmin) {
        if (isAdmin) return;
        if (product.getSeller() == null || !product.getSeller().getId().equals(sellerId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not own this product");
        }
    }

    private Category resolveCategory(Long categoryId) {
        if (categoryId == null) return null;
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
    }

    private String generateUniqueSlug(String name) {
        String base = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .trim()
                .replaceAll("\\s+", "-");
        if (base.isBlank()) base = "product";
        String slug = base;
        int suffix = 1;
        while (productRepository.existsBySlug(slug)) {
            suffix++;
            slug = base + "-" + suffix;
        }
        return slug;
    }

    private Sort resolveSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Direction.ASC, "id");
        }
        return switch (sort) {
            case "price_asc" -> Sort.by(Sort.Direction.ASC, "price");
            case "price_desc" -> Sort.by(Sort.Direction.DESC, "price");
            case "name_asc" -> Sort.by(Sort.Direction.ASC, "name");
            case "name_desc" -> Sort.by(Sort.Direction.DESC, "name");
            case "rating_desc" -> Sort.by(Sort.Direction.DESC, "rating");
            case "newest" -> Sort.by(Sort.Direction.DESC, "createdAt");
            default -> throw new IllegalArgumentException("Invalid sort value: " + sort);
        };
    }
}
