import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { useCart } from "../context/CartContext";

/**
 * SuccessPage
 *
 * Shown after a successful payment:
 * - Clears cart on mount
 * - Displays confirmation message
 * - Provides actions: continue shopping or view orders
 */
export default function SuccessPage() {
  const { clear } = useCart();

  // Clear cart once after payment succeeds
  useEffect(() => {
    clear();
  }, [clear]);

  return (
    <main className="flex flex-col flex-grow items-center px-6 pt-70">
      {/* --- Success Icon --- */}
      <CheckCircle className="w-20 h-20 text-green-3 mb-6" />

      {/* --- Title --- */}
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
        Payment Successful 🎉
      </h1>

      {/* --- Message --- */}
      <p className="text-gray-2 text-center max-w-md mb-8">
        Thank you for your order! Your payment has been received and your items
        will be on their way soon.
      </p>

      {/* --- Actions --- */}
      <div className="flex gap-4">
        <a
          href="/products"
          className="px-6 py-3 rounded-lg font-semibold text-white bg-green-3 hover:bg-green-7 transition"
        >
          Continue Shopping
        </a>
        <a
          href="/profile"
          className="px-6 py-3 rounded-lg font-semibold text-black bg-gray-4 hover:bg-gray-3 transition"
        >
          View Orders
        </a>
      </div>
    </main>
  );
}
