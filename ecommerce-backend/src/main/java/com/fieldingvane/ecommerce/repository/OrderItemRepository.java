package com.fieldingvane.ecommerce.repository;

import com.fieldingvane.ecommerce.entity.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    Page<OrderItem> findByProductSellerIdOrderByIdDesc(Long sellerId, Pageable pageable);
}
