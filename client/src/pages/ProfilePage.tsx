import { useState } from "react";
import AccountTab from "../components/AccountTab";
import OrdersTab from "../components/OrdersTab";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * ProfilePage
 *
 * Provides a user profile area with:
 * - "Account details" tab (shows user info / settings)
 * - "Order history" tab (lists past orders)
 * - Logout button (clears session + redirects to products)
 *
 * Tabs are controlled via local state.
 */
export default function ProfilePage() {
  // Track which tab is active
  const [activeTab, setActiveTab] = useState<"account" | "orders">("account");

  // Auth + navigation helpers
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex-grow w-full max-w-4xl p-6 mx-auto">
      {/* Header with title + logout */}
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold my-8">My Account</h1>
        <button
          onClick={() => {
            logout();
            navigate("/products");
          }}
          className="text-green-3 hover:text-green-7 font-bold cursor-pointer"
        >
          Log out
        </button>
      </div>

      {/* --- Tabs --- */}
      <div className="flex">
        <button
          onClick={() => setActiveTab("account")}
          className={`px-5 py-3 font-bold text-lg border-b-1 cursor-pointer  ${
            activeTab === "account"
              ? "border-green-3 border-b-3 pb-2.5"
              : "text-gray-2 border-gray-3"
          }`}
        >
          Account details
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-5 py-3 font-bold text-lg border-b-1 cursor-pointer ${
            activeTab === "orders"
              ? "border-green-3 border-b-3 pb-2.5"
              : "text-gray-2 border-gray-3"
          }`}
        >
          Order History
        </button>
      </div>

      {/* Border under tab area */}
      <div className="relative">
        <hr className="border-gray-3 absolute -top-[1px] left-0 right-0 z-[-1]" />
      </div>

      {/* --- Content --- */}
      {activeTab === "account" && <AccountTab />}
      {activeTab === "orders" && <OrdersTab />}
    </div>
  );
}
