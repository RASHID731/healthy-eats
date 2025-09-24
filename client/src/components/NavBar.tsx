import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";
import { User, ShoppingCart, X, Menu } from "lucide-react";

/**
 * NavBar
 *
 * Features:
 * - Brand link + main navigation
 * - User icon (login/profile depending on auth state)
 * - Cart icon with item count badge
 * - Responsive mobile drawer menu
 * - Auto-hide on scroll down, reappear on scroll up
 */
export default function NavBar() {
  // Cart + auth state
  const { itemsCount } = useCart();
  const { user, loading } = useAuth();

  // Drawer state
  const [isOpen, setIsOpen] = useState(false);

  // Scroll visibility state
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  /* ---------------- SCROLL HANDLER ---------------- */
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down → hide nav
        setShow(false);
      } else {
        // scrolling up → show nav
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  /* ---------------- RENDER ---------------- */
  return (
    <nav
      className={`flex bg-white justify-between border-b border-gray-3 py-4 md:px-20 sm:px-10 px-6 fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* --- Brand + desktop links --- */}
      <div className="flex items-center">
        <a
          href="/"
          className="text-black font-bold text-xl hover:opacity-75 mr-10"
        >
          Healthy Eats
        </a>
        <ul className="hidden md:flex items-center">
          <li className="inline mx-4">
            <a href="/" className="text-black font-bold text-lg hover:opacity-60">
              Home
            </a>
          </li>
          <li className="inline mx-4">
            <a
              href="/products"
              className="text-black font-bold text-lg hover:opacity-60"
            >
              Catalog
            </a>
          </li>
        </ul>
      </div>

      {/* --- Right-side icons --- */}
      <ul className="flex items-center gap-4">
        {/* User icon */}
        {loading ? (
          <span className="text-gray-400">…</span> // auth state loading
        ) : user ? (
          <li>
            <a
              href="/profile"
              className="text-sm text-black hover:opacity-60 tracking-wide"
            >
              <User />
            </a>
          </li>
        ) : (
          <li>
            <a
              href="/login"
              className="text-sm text-black hover:opacity-60 tracking-wide"
            >
              <User />
            </a>
          </li>
        )}

        {/* Cart icon + badge */}
        <li>
          <a
            href="/cart"
            className="relative text-sm text-black hover:opacity-60 tracking-wide"
          >
            <div className="relative">
              <ShoppingCart />
              {itemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-3 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {itemsCount}
                </span>
              )}
            </div>
          </a>
        </li>

        {/* Mobile menu button (hamburger) */}
        <li className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="cursor-pointer text-black hover:opacity-60"
          >
            <Menu />
          </button>
        </li>
      </ul>

      {/* --- Mobile drawer --- */}
      <div
        className={`fixed top-0 right-0 h-screen w-70 z-50 bg-white shadow-lg flex flex-col py-8 px-8 md:hidden
          transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          className="mb-6 text-black font-bold hover:opacity-60 cursor-pointer absolute top-6 right-6"
        >
          <X />
        </button>

        {/* Drawer links */}
        <a href="/" className="mt-8 py-2 text-black font-bold text-lg hover:opacity-60">
          Home
        </a>
        <a
          href="/products"
          className="py-2 text-black font-bold text-lg hover:opacity-60"
        >
          Catalog
        </a>
      </div>
    </nav>
  );
}
