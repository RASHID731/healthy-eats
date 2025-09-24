package com.healthyeats.server.order;

import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.ApiResource;
import com.stripe.net.Webhook;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller that handles Stripe webhook events.
 *
 * Specifically listens for "checkout.session.completed" events,
 * which indicate that a Stripe Checkout payment has succeeded.
 * When received, the corresponding {@link Order} in the database
 * is marked as paid.
 *
 * Base path: /api/checkout/webhook
 */
@RestController
@RequestMapping("/api/checkout")
public class StripeWebhookController {

    /** Stripe webhook signing secret (injected from application.yml). */
    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    private final OrderRepository orderRepository;

    public StripeWebhookController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * POST /api/checkout/webhook
     *
     * Main entry point for Stripe webhook calls.
     *
     * Steps:
     * 1. Verify event signature using Stripe's SDK.
     * 2. Parse the event payload into a Stripe {@link Session}.
     * 3. If event type is "checkout.session.completed", mark the
     *    corresponding order as paid in the database.
     *
     * @param request HTTP request (used to read signature header)
     * @param payload raw JSON body from Stripe
     * @return "success" if processed, or "Invalid signature" if verification fails
     */
    @PostMapping("/webhook")
    public String handleWebhook(HttpServletRequest request, @RequestBody String payload) {
        String sigHeader = request.getHeader("Stripe-Signature");
        Event event;
        try {
            event = Webhook.constructEvent(
                    payload,
                    sigHeader,
                    webhookSecret
            );
        } catch (Exception e) {
            return "Invalid signature";
        }

        // Handle only checkout session completion events
        if ("checkout.session.completed".equals(event.getType())) {
            EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();

            // Try deserializing event into a Session object
            if (dataObjectDeserializer.getObject().isPresent()) {
                StripeObject stripeObject = dataObjectDeserializer.getObject().get();

                if (stripeObject instanceof Session) {
                    handleSession((Session) stripeObject);
                } else {
                    System.out.println("Unexpected object type: " + stripeObject.getClass());
                }
            } else {
                // Fallback: parse raw JSON into Session
                String rawJson = dataObjectDeserializer.getRawJson();
                Session session = ApiResource.GSON.fromJson(rawJson, Session.class);
                handleSession(session);
            }
        }

        return "success";
    }

    /**
     * Marks the order associated with a Stripe session as paid.
     *
     * Uses clientReferenceId (set in CheckoutController) to link
     * the Stripe Checkout Session back to the local Order.
     *
     * @param session Stripe Checkout session
     */
    private void handleSession(Session session) {
        String orderId = session.getClientReferenceId();
        System.out.println("clientReferenceId: " + orderId);

        orderRepository.findById(Long.valueOf(orderId))
                .ifPresent(order -> {
                    order.setPaid(true);
                    orderRepository.save(order);
                    System.out.println("Order Id: " + order.getId() + " is paid");
                });
    }
}
