package com.healthyeats.server.order;

import lombok.Data;

/**
 * Data Transfer Object (DTO) representing a shipping address
 * provided by the customer during checkout.
 *
 * Used inside {@link CheckoutRequest} and persisted into {@link Order}.
 */
@Data
public class ShippingAddress {

    /** Recipient's full name. */
    private String fullName;

    /** Street address (including house number). */
    private String street;

    /** City or locality. */
    private String city;

    /** Postal/ZIP code. */
    private String zip;

    /** Country name. */
    private String country;
}
