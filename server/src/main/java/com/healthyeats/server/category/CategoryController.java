package com.healthyeats.server.category;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for managing product categories.
 *
 * Provides endpoints for fetching categories that products can belong to
 * (e.g., "Fruits", "Dairy", "Bakery").
 *
 * Base path: /api/categories
 * Allows cross-origin requests from the frontend (localhost:5173).
 */
@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    private final CategoryRepository repo;

    /**
     * Constructor-based dependency injection.
     *
     * @param repo repository for Category entities
     */
    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    /**
     * GET /api/categories
     *
     * Fetch all available categories from the database.
     * Used by the frontend to display filters or navigation menus.
     *
     * @return list of all categories
     */
    @GetMapping
    public List<Category> all() {
        return repo.findAll();
    }
}
