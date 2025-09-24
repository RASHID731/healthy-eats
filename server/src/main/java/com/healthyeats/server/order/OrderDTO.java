package com.healthyeats.server.order;

import java.util.List;

/**
 * Data Transfer Object (DTO) representing an order returned to the frontend.
 *
 * Contains summary information about the order, including
 * metadata, shipping address, and purchased items.
 *
 * @param id        unique identifier of the order
 * @param paid      payment status (true = paid, false = not paid)
 * @param createdAt timestamp when the order was created (ISO string)
 * @param address   shipping address for the order (wrapped in {@link AddressDTO})
 * @param items     list of purchased items (each as {@link OrderItemDTO})
 */
public record OrderDTO(
        Long id,
        boolean paid,
        String createdAt,
        AddressDTO address,
        List<OrderItemDTO> items
) {}
