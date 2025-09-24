package com.healthyeats.server.order;

import com.healthyeats.server.user.User;
import com.healthyeats.server.user.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for managing user orders.
 *
 * Provides endpoints for fetching the authenticated user's
 * order history including address, items, and payment status.
 *
 * Base path: /api/orders
 * Allows cross-origin requests from the frontend (localhost:5173).
 */
@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    /**
     * Constructor-based dependency injection.
     *
     * @param orderRepository repository for Order entities
     * @param userRepository  repository for User entities
     */
    public OrderController(OrderRepository orderRepository, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    /**
     * GET /api/orders
     *
     * Fetch all orders for the currently authenticated user.
     *
     * Steps:
     * 1. Get authenticated user's email from SecurityContext.
     * 2. Load user from database (throws if missing).
     * 3. Fetch all orders for this user.
     * 4. Map orders into {@link OrderDTO} objects, including:
     *    - Order ID
     *    - Paid status
     *    - Creation timestamp
     *    - Shipping address (wrapped in {@link AddressDTO})
     *    - List of order items (wrapped in {@link OrderItemDTO})
     *
     * @return list of OrderDTOs for the user
     */
    @GetMapping
    public List<OrderDTO> getOrders() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        // Load user from database (required for userId)
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found: " + email));

        // Fetch orders and map into DTOs
        return orderRepository.findByUserId(user.getId())
            .stream()
            .map(order -> new OrderDTO(
                order.getId(),
                order.isPaid(),
                order.getCreatedAt().toString(),
                new AddressDTO(
                    order.getFullName(),
                    order.getStreet(),
                    order.getCity(),
                    order.getZip(),
                    order.getCountry()
                ),
                order.getItems().stream()
                    .map(i -> new OrderItemDTO(
                        i.getProduct().getName(),
                        i.getQuantity(),
                        i.getPriceCents()
                    ))
                    .toList()
            ))
            .toList();
    }
}
