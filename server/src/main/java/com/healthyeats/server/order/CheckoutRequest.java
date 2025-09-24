package com.healthyeats.server.order;

import lombok.Data;
import java.util.List;

/**
 * Data Transfer Object (DTO) representing the payload
 * sent by the frontend to initiate a checkout.
 *
 * Contains:
 * - A list of items being purchased
 * - The shipping address for the order
 */
@Data
public class CheckoutRequest {

    /**
     * List of items the user wants to purchase.
     * Each item includes name, unit price (in cents), and quantity.
     */
    private List<CheckoutItem> items;

    /**
     * Shipping address provided by the user at checkout.
     */
    private ShippingAddress address;
}
