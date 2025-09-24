package com.healthyeats.server.cart;

import java.util.List;

/**
 * Data Transfer Object (DTO) representing the state of a shopping cart.
 *
 * This object is returned by the CartController to the frontend.
 * It contains the list of items and calculated totals.
 *
 * @param items         list of items currently in the cart
 * @param subtotalCents subtotal (before tax), in cents
 * @param taxCents      total tax amount, in cents
 * @param totalCents    grand total (subtotal + tax), in cents
 */
public record CartDTO(
        List<CartItemDTO> items,
        Integer subtotalCents,
        Integer taxCents,
        Integer totalCents
) {}
