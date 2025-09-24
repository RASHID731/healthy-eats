import { useState } from "react";
import type { Address, CheckoutRequest } from "../types/order";
import { useCart } from "../context/CartContext";
import { api } from "../lib/api";

/**
 * CheckoutPage component
 *
 * Handles checkout flow:
 * - Collects shipping address from the user
 * - Displays current cart items and total
 * - Calls backend `/checkout` endpoint to create a Stripe checkout session
 * - Redirects user to payment page
 */
export default function CheckoutPage() {
  const { cart } = useCart();
  const [address, setAddress] = useState<Address>({
    fullName: "",
    street: "",
    city: "",
    zip: "",
    country: "",
  });

  // Updates the address state when any input field changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddress({ ...address, [e.target.name]: e.target.value });
  }

  // Prepares checkout payload and redirects user to Stripe session
  async function handleCheckout() {
    if (!cart) return; // No cart, nothing to do

    // Prepare payload for backend
    const payload: CheckoutRequest = {
      items: cart.items.map(i => ({
        name: i.name,
        priceCents: i.unitPriceCents,
        quantity: i.quantity,
      })),
      address,
    };

    try {
      const response = await api.post<{ url: string }>("/checkout", payload);
      window.location.href = response.data.url;
    } catch (err) {
      console.error("Checkout failed", err);
    }
  }

  // Sum all items in cart: price * quantity (in cents)
  const totalCents = cart
    ? cart.items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0)
    : 0;

  return (
    <div className="flex-grow max-w-6xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-bold text-black mb-10">Checkout</h1>
      <form 
        onSubmit={e => {
          e.preventDefault();
          handleCheckout();
        } }
        className="space-y-10"
      >
        {/* Two-column layout (stack on mobile) */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Shipping Address */}
          <div>
            <h2 className="text-xl font-semibold text-black mb-6">Shipping Address</h2>
            <div className="space-y-5">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={address.fullName}
                onChange={handleChange}
                required
                className="w-full border border-gray-3 rounded-lg px-4 py-3 bg-gray-7 text-black focus:outline-none focus:ring-2 focus:ring-green-3"
              />
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={address.street}
                onChange={handleChange}
                required
                className="w-full border border-gray-3 rounded-lg px-4 py-3 bg-gray-7 text-black focus:outline-none focus:ring-2 focus:ring-green-3"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleChange}
                required
                className="w-full border border-gray-3 rounded-lg px-4 py-3 bg-gray-7 text-black focus:outline-none focus:ring-2 focus:ring-green-3"
              />
              <input
                type="text"
                name="zip"
                placeholder="ZIP Code"
                value={address.zip}
                onChange={handleChange}
                required
                className="w-full border border-gray-3 rounded-lg px-4 py-3 bg-gray-7 text-black focus:outline-none focus:ring-2 focus:ring-green-3"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={address.country}
                onChange={handleChange}
                required
                className="w-full border border-gray-3 rounded-lg px-4 py-3 bg-gray-7 text-black focus:outline-none focus:ring-2 focus:ring-green-3"
              />
            </div>
          </div>

          {/* Right: Order Summary */}
          <div>
            <h2 className="text-xl font-semibold text-black mb-6">Your Order</h2>
            <ul className="divide-y divide-gray-3 mb-6">
              {cart?.items.map(i => (
                <li key={i.productId} className="flex justify-between py-3 text-gray-2">
                  <span>
                    {i.name} <span className="text-sm">× {i.quantity}</span>
                  </span>
                  <span className="font-medium text-black">
                    €{((i.unitPriceCents * i.quantity) / 100).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center text-lg font-bold text-black mb-8">
              <span>Total</span>
              <span>€{(totalCents / 100).toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-lg font-semibold text-white bg-green-3 hover:bg-green-7 transition cursor-pointer"
            >
              Pay Now
            </button>
          </div>
        </div>
      </form>
      <div className="flex flex-col items-center text-gray-2 mt-16">
        <p>Note: For testing Stripe</p>
        <p>For a successful payment with Visa: 4242 4242 4242 4242</p>
        <p>For a decline: 4000 0000 0000 0002</p>
        <p>More cards for testing can be found <a target="_blank" href="https://docs.stripe.com/testing" className="text-blue-600 underline">here</a></p>
      </div>
    </div>
  );
}
