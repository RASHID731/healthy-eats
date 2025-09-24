package com.healthyeats.server.cart;

/**
 * Data Transfer Object (DTO) representing a single line item in the shopping cart.
 *
 * Each CartItemDTO corresponds to one product in the cart,
 * including product details, pricing, and calculated totals.
 *
 * @param productId      ID of the product
 * @param name           product name
 * @param imageUrl       URL for product image (used in frontend display)
 * @param unitPriceCents price per unit (in cents)
 * @param quantity       number of units in the cart
 * @param lineTotalCents total cost for this line item (unitPriceCents * quantity), in cents
 */
public record CartItemDTO(
        Long productId,
        String name,
        String imageUrl,
        Integer unitPriceCents,
        Integer quantity,
        Integer lineTotalCents
) {}
