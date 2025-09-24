import { Facebook, Instagram, Twitter } from "lucide-react";

/**
 * Footer
 *
 * Reusable site footer with:
 * - Brand info + tagline
 * - Navigation links
 * - Social icons
 * - Copyright line
 */
export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-4 py-10 px-6 md:px-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        {/* --- Brand section --- */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-black">Healthy Eats</h2>
          <p className="text-sm text-gray-600 mt-2">
            Fresh, healthy, and sustainable food at your fingertips.
          </p>
        </div>

        {/* --- Navigation links --- */}
        <ul className="flex flex-col md:flex-row gap-4 text-center md:text-left">
          <li>
            <a href="/" className="text-black hover:opacity-60">
              Home
            </a>
          </li>
          <li>
            <a href="/products" className="text-black hover:opacity-60">
              Catalog
            </a>
          </li>
          <li>
            <a href="/contact" className="text-black hover:opacity-60">
              Contact
            </a>
          </li>
          <li>
            <a href="/about" className="text-black hover:opacity-60">
              About
            </a>
          </li>
        </ul>

        {/* --- Social media icons --- */}
        <div className="flex gap-4">
          <a href="#" className="text-blue-600 hover:text-black">
            <Facebook size={20} />
          </a>
          <a href="#" className="text-rose-600 hover:text-black">
            <Instagram size={20} />
          </a>
          <a href="#" className="text-blue-400 hover:text-black">
            <Twitter size={20} />
          </a>
        </div>
      </div>

      {/* --- Bottom copyright line --- */}
      <div className="border-t border-gray-300 mt-8 pt-4 text-center">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} Healthy Eats. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
