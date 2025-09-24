import { XCircle } from "lucide-react";

/**
 * CancelPage
 *
 * Shown after a failed payment attempt:
 * - Error icon
 * - Title + explanation message
 * - Actions: retry checkout or continue shopping
 */
export default function CancelPage() {
  return (
    <main className="flex flex-col flex-grow items-center px-6 pt-70">
      {/* --- Error Icon --- */}
      <XCircle className="w-20 h-20 text-red-500 mb-6" />

      {/* --- Title --- */}
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
        Payment Failed
      </h1>

      {/* --- Message --- */}
      <p className="text-gray-2 text-center max-w-md mb-8">
        Oops! Something went wrong and your payment was not completed.
        No money has been charged. Please try again or continue shopping.
      </p>

      {/* --- Actions --- */}
      <div className="flex gap-4">
        <a
          href="/checkout"
          className="px-6 py-3 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition"
        >
          Try Again
        </a>
        <a
          href="/products"
          className="px-6 py-3 rounded-lg font-semibold text-black bg-gray-4 hover:bg-gray-3 transition"
        >
          Continue Shopping
        </a>
      </div>
    </main>
  );
}
