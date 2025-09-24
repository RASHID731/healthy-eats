import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import NavBar from "./components/NavBar";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProfilePage from "./pages/ProfilePage";
import SuccessPage from "./pages/SuccessPage";
import CancelPage from "./pages/CancelPage";
import Footer from "./components/Footer";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import ContactSuccessPage from "./pages/ContactSuccessPage";

/**
 * App
 *
 * Main layout and routing:
 * - Fixed NavBar at the top
 * - Routes in the middle (protected where needed)
 * - Footer at the bottom
 */
export default function App() {
  return (
    <div className="flex flex-col min-h-screen mt-14">
      {/* --- NavBar (always visible) --- */}
      <NavBar />

      {/* --- Routes --- */}
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact-success" element={<ContactSuccessPage />} />

        {/* Protected pages (requires login) */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* --- Footer (always visible) --- */}
      <Footer />
    </div>
  );
}