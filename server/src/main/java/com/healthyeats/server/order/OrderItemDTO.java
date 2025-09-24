package com.healthyeats.server.order;

/**
 * Data Transfer Object (DTO) representing a single item
 * inside an {@link OrderDTO}.
 *
 * Used in API responses to show the purchased product name,
 * quantity, and price information.
 *
 * @param name       product name
 * @param quantity   quantity purchased
 * @param priceCents price per unit in cents (at time of purchase)
 */
public record OrderItemDTO(
        String name,
        int quantity,
        int priceCents
) {}
