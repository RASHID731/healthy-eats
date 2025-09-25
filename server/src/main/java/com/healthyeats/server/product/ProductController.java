package com.healthyeats.server.product;

import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing products.
 *
 * Provides endpoints for browsing all products available in the store.
 *
 * Base path: /api/products
 * CORS handled globally in {@link com.healthyeats.server.config.SecurityConfig}.
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository repo;

    /**
     * Constructor-based dependency injection.
     *
     * @param repo repository for Product entities
     */
    public ProductController(ProductRepository repo) {
        this.repo = repo;
    }

    /**
     * GET /api/products
     *
     * Fetch all products from the database and map them into DTOs.
     * Each DTO contains:
     * - Product ID
     * - Name
     * - Price in cents
     * - Image URL
     * - Category ID
     * - Unit of measure
     *
     * @return list of ProductDTOs
     */
    @GetMapping
    public List<ProductDTO> all() {
        return repo.findAll().stream()
                .map(p -> new ProductDTO(
                        p.getId(),
                        p.getName(),
                        p.getPriceCents(),
                        p.getImageUrl(),
                        p.getCategory().getId(),
                        p.getUnit()
                ))
                .toList();
    }
}
