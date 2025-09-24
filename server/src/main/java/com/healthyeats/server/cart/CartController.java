package com.healthyeats.server.cart;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing the shopping cart.
 *
 * Uses the HTTP session to store and retrieve cart state
 * for each user (cart survives across requests until logout or session expiry).
 *
 * Base path: /api/cart
 * Allows cross-origin requests from frontend (localhost:5173).
 */
@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CartController {

    private final CartService service;

    /**
     * Constructor-based dependency injection.
     *
     * @param service service layer for handling cart operations
     */
    public CartController(CartService service) {
        this.service = service;
    }

    /**
     * GET /api/cart
     *
     * Fetch the current cart state for the session.
     *
     * @param session current HTTP session
     * @return cart DTO representing the current cart
     */
    @GetMapping
    public CartDTO get(HttpSession session) {
        return service.getCart(session);
    }

    /**
     * POST /api/cart/items
     *
     * Increment or decrement the quantity of a product in the cart.
     * - productId (required): ID of the product
     * - quantity (default = 1): amount to add (negative = decrement)
     *
     * Example: POST /api/cart/items?productId=1&quantity=2
     *
     * @param session   current HTTP session
     * @param productId ID of the product to update
     * @param quantity  amount to add or subtract (default = 1)
     * @return updated cart DTO
     */
    @PostMapping("/items")
    @ResponseStatus(HttpStatus.OK)
    public CartDTO add(HttpSession session,
                       @RequestParam Long productId,
                       @RequestParam(defaultValue = "1") Integer quantity) {
        return service.add(session, productId, quantity);
    }

    /**
     * PUT /api/cart/items/{productId}
     *
     * Set the exact quantity for a product in the cart (idempotent).
     * - quantity (required): new quantity to set
     *
     * Example: PUT /api/cart/items/1?quantity=5
     *
     * @param session   current HTTP session
     * @param productId ID of the product to update
     * @param quantity  new quantity to set
     * @return updated cart DTO
     */
    @PutMapping("/items/{productId}")
    public CartDTO setQty(HttpSession session,
                          @PathVariable Long productId,
                          @RequestParam Integer quantity) {
        return service.setQty(session, productId, quantity);
    }

    /**
     * DELETE /api/cart/items/{productId}
     *
     * Remove a single product completely from the cart.
     *
     * @param session   current HTTP session
     * @param productId ID of the product to remove
     * @return updated cart DTO
     */
    @DeleteMapping("/items/{productId}")
    public CartDTO delete(HttpSession session, @PathVariable Long productId) {
        return service.remove(session, productId);
    }

    /**
     * DELETE /api/cart
     *
     * Clear the entire cart for the current session.
     *
     * @param session current HTTP session
     * @return updated (empty) cart DTO
     */
    @DeleteMapping
    public CartDTO clear(HttpSession session) {
        return service.clear(session);
    }

    /**
     * Global exception handler for invalid arguments.
     *
     * Maps {@link IllegalArgumentException} to:
     * - HTTP status 400 (Bad Request)
     * - Response body containing the error message
     *
     * @param e the exception
     * @return error message as plain text
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ IllegalArgumentException.class })
    public String badRequest(Exception e) {
        return e.getMessage();
    }
}
