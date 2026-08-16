package com.fieldingvane.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Snapshot of a product at the moment it was ordered. We copy name/price/image
 * rather than relying purely on the Product FK, so order history stays accurate
 * even if a seller later edits or deletes the product.
 */
@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "product_name", nullable = false)
    private String productName;

    @Column(name = "product_image", length = 1000)
    private String productImage;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    private Integer quantity;
}
