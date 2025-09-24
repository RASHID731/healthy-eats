package com.healthyeats.server.order;

import com.healthyeats.server.product.ProductRepository;
import com.healthyeats.server.user.UserRepository;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller handling checkout and payment with Stripe.
 *
 * Responsibilities:
 * - Verify user authentication before checkout
 * - Persist orders in the database (pending status)
 * - Forward cart items to Stripe as line items
 * - Return a Checkout session URL to the frontend
 *
 * Base path: /api/checkout
 * Allows CORS for frontend (localhost:5173).
 */
@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CheckoutController {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    /** Stripe secret key injected from application.yml */
    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    public CheckoutController(UserRepository userRepository,
                              ProductRepository productRepository,
                              OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.orderRepository = orderRepository;
    }

    /**
     * Initializes Stripe API key once the application starts.
     */
    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }

    /**
     * POST /api/checkout
     *
     * Handles checkout request:
     * 1. Verifies user is logged in.
     * 2. Saves order in DB with pending status.
     * 3. Builds Stripe Checkout session with items and redirect URLs.
     * 4. Returns the Stripe Checkout URL to the frontend.
     *
     * @param checkoutRequest payload containing address + cart items
     * @return map containing Stripe session URL
     * @throws Exception if authentication fails or Stripe call fails
     */
    @PostMapping
    public Map<String, Object> checkout(@RequestBody CheckoutRequest checkoutRequest) throws Exception {
        // Ensure only logged-in users can checkout
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new RuntimeException("Unauthorized");
        }

        // Save order with pending status
        Order order = new Order();
        order.setUser(userRepository.findByEmail(authentication.getName()).orElseThrow());
        order.setPaid(false);

        // Set shipping address
        ShippingAddress address = checkoutRequest.getAddress();
        order.setFullName(address.getFullName());
        order.setStreet(address.getStreet());
        order.setCity(address.getCity());
        order.setZip(address.getZip());
        order.setCountry(address.getCountry());

        // Create OrderItems from request
        List<OrderItem> orderItems = new ArrayList<>();
        for (CheckoutItem item : checkoutRequest.getItems()) {
            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(productRepository.findByName(item.getName()).orElseThrow());
            oi.setQuantity(item.getQuantity());
            oi.setPriceCents(item.getPriceCents());
            orderItems.add(oi);
        }
        order.setItems(orderItems);

        // Persist order in DB
        orderRepository.save(order);

        // Convert to Stripe line items
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
        for (CheckoutItem item : checkoutRequest.getItems()) {
            lineItems.add(
                SessionCreateParams.LineItem.builder()
                    .setQuantity((long) item.getQuantity())
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("eur")
                            .setUnitAmount((long) item.getPriceCents())
                            .setProductData(
                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                            .setName(item.getName())
                                            .build()
                            )
                            .build()
                    )
                    .build()
            );
        }

        // Create Stripe Checkout session
        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl("http://localhost:5173/success/?session_id={CHECKOUT_SESSION_ID}")
            .setCancelUrl("http://localhost:5173/cancel")
            .setClientReferenceId(order.getId().toString()) // tie Stripe session to order
            .addAllLineItem(lineItems)
            .build();

        Session session = Session.create(params);

        // Response contains Stripe Checkout URL
        Map<String, Object> response = new HashMap<>();
        response.put("url", session.getUrl());
        return response;
    }
}
