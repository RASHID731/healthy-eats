package com.healthyeats.server.order;

/**
 * Data Transfer Object (DTO) representing a postal address
 * for an order (e.g., shipping or billing address).
 *
 * @param fullName recipient's full name
 * @param street   street address (including house number)
 * @param city     city or locality
 * @param zip      postal/ZIP code
 * @param country  country name
 */
public record AddressDTO(
        String fullName,
        String street,
        String city,
        String zip,
        String country
) {}
