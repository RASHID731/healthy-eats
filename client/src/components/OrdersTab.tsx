import { useEffect, useState } from "react";
import type { Order } from "../types/order";
import { api } from "../lib/api";

/**
 * OrdersTab
 *
 * Displays the user's past orders:
 * - Fetches orders from `/orders` on mount
 * - Sorts them by newest first
 * - Shows order header, items, shipping address, and total
 */
export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);

  // Fetch orders once on mount
  useEffect(() => {
    api
      .get<Order[]>("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error("Failed to fetch orders", err));
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      {/* --- Empty state --- */}
      {orders.length === 0 ? (
        <p className="text-center text-gray-2 text-lg">No orders yet.</p>
      ) : (
        <div className="divide-y divide-gray-3">
          {[...orders]
            // Sort orders by createdAt (newest first)
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((order) => {
              // Compute total price for the order
              const total = order.items.reduce(
                (sum, item) => sum + item.priceCents * item.quantity,
                0
              );

              return (
                <div
                  key={order.id}
                  className="space-y-4 py-8 px-6 m-8 border border-gray-3 rounded-lg"
                >
                  {/* --- Header: order id, date, paid status --- */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-lg text-black">
                        Order #{order.id}
                      </span>
                      <p className="text-sm text-gray-1">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}{" "}
                        {new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.paid
                          ? "bg-green-5 text-green-3"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {order.paid ? "Paid" : "Unpaid"}
                    </span>
                  </div>

                  {/* --- Items list --- */}
                  <ul className="space-y-2">
                    {order.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex justify-between items-center text-sm"
                      >
                        <span className="text-black">
                          {item.name}{" "}
                          <span className="text-gray-2">× {item.quantity}</span>
                        </span>
                        <span className="font-medium text-black">
                          €
                          {((item.priceCents * item.quantity) / 100).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* --- Shipping address --- */}
                  <div className="text-sm text-gray-2">
                    <p className="font-semibold text-black mb-1">
                      Shipping Address
                    </p>
                    <p>{order.address.fullName}</p>
                    <p>{order.address.street}</p>
                    <p>
                      {order.address.zip} {order.address.city}
                    </p>
                    <p>{order.address.country}</p>
                  </div>

                  {/* --- Footer: total --- */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-gray-2">Total</span>
                    <span className="text-lg font-bold text-black">
                      €{(total / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
