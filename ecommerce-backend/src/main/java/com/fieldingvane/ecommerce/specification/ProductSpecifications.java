package com.fieldingvane.ecommerce.specification;

import com.fieldingvane.ecommerce.entity.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecifications {

    private ProductSpecifications() {
    }

    public static Specification<Product> hasCategory(String categorySlug) {
        return (root, query, cb) -> {
            if (categorySlug == null || categorySlug.isBlank()) {
                return cb.conjunction();
            }
            return cb.equal(root.join("category").get("slug"), categorySlug);
        };
    }

    public static Specification<Product> matchesSearch(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank()) {
                return cb.conjunction();
            }
            String pattern = "%" + search.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("name")), pattern),
                    cb.like(cb.lower(root.get("description")), pattern)
            );
        };
    }

    public static Specification<Product> priceGreaterThanOrEqual(Integer minPrice) {
        return (root, query, cb) -> {
            if (minPrice == null) {
                return cb.conjunction();
            }
            return cb.greaterThanOrEqualTo(root.get("price"), minPrice);
        };
    }

    public static Specification<Product> priceLessThanOrEqual(Integer maxPrice) {
        return (root, query, cb) -> {
            if (maxPrice == null) {
                return cb.conjunction();
            }
            return cb.lessThanOrEqualTo(root.get("price"), maxPrice);
        };
    }
}
