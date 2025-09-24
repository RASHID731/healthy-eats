package com.healthyeats.server.category;

import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing a product category (e.g., "Fruits", "Dairy", "Bakery").
 *
 * Uses JPA annotations for ORM mapping and Lombok annotations
 * to generate boilerplate (getters, setters, constructors, toString, equals, hashCode).
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    /**
     * Primary key.
     * Auto-generated using the database's identity column strategy.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Category name.
     * Must be unique and not null (enforced at the database level).
     *
     * Example: "Vegetables", "Dairy"
     */
    @Column(nullable = false, unique = true)
    private String name;
}
