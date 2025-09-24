package com.healthyeats.server.cart;

import com.healthyeats.server.product.Product;
import com.healthyeats.server.product.ProductRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Service layer for managing shopping cart logic.
 *
 * The cart is stored in the user's HTTP session as a map:
 *   - Key: Product ID
 *   - Value: Quantity
 *
 * Provides operations for adding, setting, and removing items,
 * as well as converting the raw cart map into a CartDTO
 * with line totals and computed subtotal/tax/total.
 */
@Service
public class CartService {
    /** Session attribute key for storing the cart map */
    static final String CART_KEY = "CART_MAP";

    private final ProductRepository productRepo;

    public CartService(ProductRepository productRepo) {
        this.productRepo = productRepo;
    }

    /**
     * Retrieves the mutable cart map from the session.
     * Creates a new empty LinkedHashMap if missing.
     *
     * LinkedHashMap is used to preserve insertion order,
     * so items appear in the order they were added (better UX).
     *
     * @param session current HTTP session
     * @return mutable cart map (productId → quantity)
     */
    @SuppressWarnings("unchecked")
    private Map<Long, Integer> getCartMap(HttpSession session) {
        Object obj = session.getAttribute(CART_KEY);
        if (obj instanceof Map<?, ?> map) {
            return (Map<Long, Integer>) map;
        }
        Map<Long, Integer> fresh = new LinkedHashMap<>();
        session.setAttribute(CART_KEY, fresh);
        return fresh;
    }

    /**
     * Returns the current cart as a DTO, computing totals from the database.
     *
     * @param session current HTTP session
     * @return cart DTO
     */
    public CartDTO getCart(HttpSession session) {
        var cartMap = getCartMap(session);
        return buildDTO(cartMap);
    }

    /**
     * Clears the entire cart and returns an empty DTO.
     *
     * @param session current HTTP session
     * @return empty cart DTO
     */
    public CartDTO clear(HttpSession session) {
        session.setAttribute(CART_KEY, new LinkedHashMap<Long, Integer>());
        return buildDTO(getCartMap(session));
    }

    /**
     * Adds or subtracts quantity for a product (deltaQty can be negative).
     * - If resulting qty <= 0 → remove the product line.
     * - Caps qty to a maximum of 99 to avoid unrealistic values.
     *
     * @param session   current HTTP session
     * @param productId ID of the product
     * @param deltaQty  change in quantity (positive = add, negative = subtract)
     * @return updated cart DTO
     */
    public CartDTO add(HttpSession session, Long productId, Integer deltaQty) {
        if (deltaQty == 0) return getCart(session);

        var cartMap = getCartMap(session);
        int newQty = cartMap.getOrDefault(productId, 0) + deltaQty;

        if (newQty <= 0) {
            cartMap.remove(productId);
        } else {
            cartMap.put(productId, Math.min(newQty, 99)); // cap qty
        }

        session.setAttribute(CART_KEY, cartMap);
        return buildDTO(cartMap);
    }

    /**
     * Sets the exact quantity for a product (idempotent).
     * - If qty <= 0 → remove the product line.
     * - Caps qty to a maximum of 99.
     *
     * @param session   current HTTP session
     * @param productId ID of the product
     * @param qty       exact quantity to set
     * @return updated cart DTO
     */
    public CartDTO setQty(HttpSession session, Long productId, Integer qty) {
        var cartMap = getCartMap(session);

        if (qty <= 0) {
            cartMap.remove(productId);
        } else {
            cartMap.put(productId, Math.min(qty, 99));
        }

        session.setAttribute(CART_KEY, cartMap);
        return buildDTO(cartMap);
    }

    /**
     * Removes a product line from the cart by product ID.
     *
     * @param session   current HTTP session
     * @param productId ID of the product to remove
     * @return updated cart DTO
     */
    public CartDTO remove(HttpSession session, Long productId) {
        var cartMap = getCartMap(session);
        cartMap.remove(productId);
        session.setAttribute(CART_KEY, cartMap);
        return buildDTO(cartMap);
    }

    /**
     * Internal helper: converts the raw cart map into a CartDTO.
     *
     * Steps:
     * 1. Load products from DB by IDs in the cart map.
     * 2. Skip any products that no longer exist or have invalid quantities.
     * 3. Build CartItemDTO list with line totals.
     * 4. Compute subtotal (sum of line totals).
     * 5. Compute tax (currently 0, but can be extended per region/category).
     * 6. Return a CartDTO with items, subtotal, tax, and total.
     *
     * @param cartMap map of productId → quantity
     * @return fully built CartDTO
     */
    private CartDTO buildDTO(Map<Long, Integer> cartMap) {
        if (cartMap.isEmpty()) return new CartDTO(List.of(), 0, 0, 0);

        // Load all products in one DB query
        var products = productRepo.findAllById(cartMap.keySet());

        // Index products by ID for quick lookup
        Map<Long, Product> productById = new HashMap<>();
        for (Product p : products) {
            productById.put(p.getId(), p);
        }

        List<CartItemDTO> items = new ArrayList<>();
        int subtotal = 0;

        // Preserve insertion order for deterministic UI rendering
        for (var entry : cartMap.entrySet()) {
            Long pid = entry.getKey();
            Integer qty = entry.getValue();
            Product p = productById.get(pid);

            if (p == null || qty == null || qty <= 0) {
                // Product deleted or invalid quantity → skip
                continue;
            }

            int line = p.getPriceCents() * qty;
            subtotal += line;

            items.add(new CartItemDTO(
                    p.getId(),
                    p.getName(),
                    p.getImageUrl(),
                    p.getPriceCents(),
                    qty,
                    line
            ));
        }

        int tax = 0; // Placeholder: extend to compute VAT dynamically
        int total = subtotal + tax;

        return new CartDTO(items, subtotal, tax, total);
    }
}
