package com.healthyeats.server.product;

import com.healthyeats.server.category.Category;
import jakarta.persistence.*;
import lombok.*;

/**
 * Entity representing a product available in the store.
 *
 * Includes name, price, image, category, and unit of measure.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    /**
     * Primary key.
     * Auto-generated using database identity column.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Product name.
     * Cannot be null.
     *
     * Example: "Cucumber", "Pumpkin Seeds"
     */
    @Column(nullable = false)
    private String name;

    /**
     * Product price stored in cents.
     * Using integer cents avoids floating-point rounding errors.
     */
    @Column(nullable = false)
    private Integer priceCents;

    /**
     * Optional URL for product image.
     * Limited to 512 characters.
     */
    @Column(length = 512)
    private String imageUrl;

    /**
     * The category this product belongs to.
     * Example: "Vegetables", "Snacks".
     */
    @ManyToOne
    private Category category;

    /**
     * Unit of measure for the product.
     *
     * Example: "per piece", "per 200g", "per loaf".
     */
    @Column(nullable = false)
    private String unit;
}
