package com.healthyeats.server.order;

import com.healthyeats.server.user.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Entity representing a customer order.
 *
 * An order belongs to a user, contains one or more order items,
 * and stores shipping address + payment status.
 *
 * Mapped to the "orders" table.
 */
@Entity
@Table(name = "orders")
@Data
public class Order {

    /**
     * Primary key.
     * Auto-generated using database identity column.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * The user who placed the order.
     * Mandatory relationship (cannot be null).
     */
    @ManyToOne(optional = false)
    private User user;

    /**
     * Timestamp when the order was created.
     * Defaults to the current time.
     */
    private LocalDateTime createdAt = LocalDateTime.now();

    /**
     * Payment status flag.
     * false = not paid (default), true = paid.
     * Updated after Stripe webhook confirms payment.
     */
    private boolean paid = false;

    // --- Shipping Address Fields ---

    /** Recipient's full name. */
    private String fullName;

    /** Street and house number. */
    private String street;

    /** City/locality. */
    private String city;

    /** Postal/ZIP code. */
    private String zip;

    /** Country name. */
    private String country;

    /**
     * List of order items (products purchased).
     * Cascade type ALL ensures items are persisted/removed together with the order.
     */
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;
}
