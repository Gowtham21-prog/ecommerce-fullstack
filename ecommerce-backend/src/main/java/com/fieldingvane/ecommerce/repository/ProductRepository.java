package com.fieldingvane.ecommerce.repository;

import com.fieldingvane.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    Optional<Product> findBySlug(String slug);
    Page<Product> findBySellerIdOrderByCreatedAtDesc(Long sellerId, Pageable pageable);
    boolean existsBySlug(String slug);
}
