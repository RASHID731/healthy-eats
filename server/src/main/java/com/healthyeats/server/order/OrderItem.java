package com.healthyeats.server.order;

import com.healthyeats.server.product.Product;
import jakarta.persistence.*;
import lombok.Data;

/**
 * Entity representing a single line item within an {@link Order}.
 *
 * Each OrderItem connects an Order to a Product, including
 * the purchased quantity and unit price at the time of purchase.
 *
 * Mapped to the "order_items" table.
 */
@Entity
@Table(name = "order_items")
@Data
public class OrderItem {

    /**
     * Primary key.
     * Auto-generated using database identity column.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The parent order that this item belongs to.
     * Mandatory relationship.
     */
    @ManyToOne(optional = false)
    private Order order;

    /**
     * The product that was purchased.
     * Mandatory relationship.
     */
    @ManyToOne(optional = false)
    private Product product;

    /**
     * Quantity of the product purchased in this order.
     */
    private int quantity;

    /**
     * Price per unit (in cents) at the time of purchase.
     * Stored on the OrderItem to ensure historical pricing is preserved,
     * even if the Product price changes later.
     */
    private int priceCents;
}
