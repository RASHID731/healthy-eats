package com.healthyeats.server.order;

import lombok.Data;

/**
 * Data Transfer Object (DTO) representing a single item
 * in the checkout request payload.
 *
 * Sent from the frontend during checkout to indicate
 * which products and quantities the user wants to purchase.
 */
@Data
public class CheckoutItem {

    /** Product name (used for display in Stripe and DB lookup). */
    private String name;

    /** Price per unit in cents (integer, avoids floating-point issues). */
    private int priceCents;

    /** Quantity of this product being purchased. */
    private int quantity;
}
