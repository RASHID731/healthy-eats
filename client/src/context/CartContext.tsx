import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../lib/api";
import type { CartDTO } from "../types/cart";

/**
 * CartContext
 *
 * Provides access to the user's shopping cart state:
 * - `cart`: current cart (or null if empty/not loaded)
 * - `refresh`: reload cart from server
 * - `add`: add or increment a product
 * - `setQty`: set exact quantity of a product
 * - `remove`: remove a product line
 * - `clear`: clear the cart entirely
 * - `itemsCount`: derived total quantity (for UI badges)
 */
type CartContextType = {
  cart: CartDTO | null;
  refresh: () => Promise<void>;
  add: (productId: number, deltaQty?: number) => Promise<void>;
  setQty: (productId: number, quantity: number) => Promise<void>;
  remove: (productId: number) => Promise<void>;
  clear: () => Promise<void>;
  itemsCount: number;
};

const CartContext = createContext<CartContextType | null>(null);

/**
 * CartProvider
 *
 * Wraps the app and manages cart state by mirroring the server session cart.
 * All mutations call the server first, then update local state with response.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartDTO | null>(null);

  /* ---------------- CART ACTIONS ---------------- */

  /** Reload the current cart from the server. */
  const refresh = async () => {
    const { data } = await api.get<CartDTO>("/cart");
    setCart(data);
  };

  /** Add/increment a product (deltaQty defaults to +1). */
  const add = async (productId: number, deltaQty = 1) => {
    const { data } = await api.post<CartDTO>("/cart/items", null, {
      params: { productId, deltaQty },
    });
    setCart(data);
  };

  /** Set exact quantity for a given product (0 = remove). */
  const setQty = async (productId: number, quantity: number) => {
    const { data } = await api.put<CartDTO>(`/cart/items/${productId}`, null, {
      params: { quantity },
    });
    setCart(data);
  };

  /** Remove a product line entirely. */
  const remove = async (productId: number) => {
    const { data } = await api.delete<CartDTO>(`/cart/items/${productId}`);
    setCart(data);
  };

  /** Clear the entire cart. */
  const clear = async () => {
    const { data } = await api.delete<CartDTO>("/cart");
    setCart(data);
  };

  /* ---------------- LIFECYCLE ---------------- */

  // Load initial cart on mount so header/cart badge stays accurate
  useEffect(() => {
    void refresh();
  }, []);

  /* ---------------- DERIVED VALUES ---------------- */

  /** Total quantity across all items (for UI badges). */
  const itemsCount = cart?.items.reduce((sum, it) => sum + it.quantity, 0) ?? 0;

  /* ---------------- PROVIDER ---------------- */
  return (
    <CartContext.Provider
      value={{ cart, refresh, add, setQty, remove, clear, itemsCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

/**
 * Hook to access CartContext safely.
 * Throws if used outside of <CartProvider>.
 */
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
