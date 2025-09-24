package com.healthyeats.server.product;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Data Transfer Object (DTO) representing a product
 * exposed to the frontend via the API.
 *
 * Contains product details required for display
 * and selection in the storefront UI.
 */
@Data
@AllArgsConstructor
public class ProductDTO {

    /** Unique identifier of the product. */
    private Long id;

    /** Product name (e.g., "Cucumber", "Pumpkin Seeds"). */
    private String name;

    /** Price in cents (integer to avoid floating-point issues). */
    private Integer priceCents;

    /** Optional image URL for product display. */
    private String imageUrl;

    /** ID of the category this product belongs to. */
    private Long categoryId;

    /** Unit of measure (e.g., "per piece", "per 200g"). */
    private String unit;
}
