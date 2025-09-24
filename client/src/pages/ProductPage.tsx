import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/product";
import { Search, ShoppingBag, CircleX, Minus, Plus } from "lucide-react";
import type { Category } from "../types/category";
import { api } from "../lib/api";

/**
 * ProductPage
 *
 * Displays:
 * - Searchable product grid
 * - Category filter buttons
 * - Cart integration (add, remove, update quantity)
 *
 * Data flow:
 * - Fetches products and categories from API on mount
 * - Filters products by category + search query
 * - Shows cart-aware controls (add/remove/qty) for each product
 */
const ProductPage = () => {
	// Local state for products, categories, filters, search
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [query, setQuery] = useState("");

	// Cart actions from context
  const { add, setQty, cart } = useCart();

	/* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    api.get<Product[]>("/products").then((r) => setProducts(r.data));
    api.get<Category[]>("/categories").then((r) => setCategories(r.data));
  }, []);

	/* ---------------- FILTER PRODUCTS ---------------- */
	// Products shown = match category filter AND search query
  const displayedProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === null || p.categoryId === selectedCategory;

    const matchesSearch =
      query.trim() === "" ||
      p.name
        .toLowerCase()
        .split(" ")
        .some((word) => word.startsWith(query.toLowerCase().trim()));

    return matchesCategory && matchesSearch;
  });

  /* ---------------- CART HELPERS ---------------- */
  // Get current quantity of a product from cart (0 if not present)
  const getQuantity = (productId: number) => {
    const item = cart?.items.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

	/* ---------------- RENDER ---------------- */
  return (
    <main className="bg-white relative z-20 py-16">
			{/* --- Search Bar --- */}
      <div className="flex justify-center flex-nowrap">
        <div
          className={`border rounded-full ${
            query.trim() ? "border-black" : "border-gray-4"
          }`}
          id="searchField"
        >
          <span className="bg-gray-4 pt-3.5 pb-3.5 pl-5 float-left rounded-l-full">
            <Search className="w-4 h-5 text-gray-2" />
          </span>
          <input
            className="bg-gray-4 placeholder-gray-2 tracking-wide rounded-r-full outline-none py-3 px-5 2xl:w-160 xl:w-144 lg:w-120 md:w-104 sm:w-100 w-80"
            placeholder="Search..."
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {/* Clear search button */}
        <div className="relative">
          {query && (
            <button
              onClick={() => {
                setQuery("");
              }}
              className="font-bold tracking-wide my-3.5 bg-gray-4 text-white rounded-full absolute right-5 cursor-pointer"
            >
              <CircleX className="w-4 h-5 text-gray-2" />
            </button>
          )}
        </div>
      </div>

			{/* --- Category Filter Buttons + Product Grid --- */}
      <section className="min-h-screen h-auto mt-16 border-t border-gray-3">
        <div className="flex flex-col justify-center">
					{/* --- Category Filter Buttons --- */}
          <div className="filter-container mx-auto my-8 flex flex-wrap gap-2 justify-center">
						{/* "All" button resets category */}
            <div className="filter">
              <button
                className={`flex justify-between focus:outline-none transition-bg py-1 px-4 rounded-lg h-fit cursor-pointer
                                ${
                                  selectedCategory === null
                                    ? "bg-green-3 text-white"
                                    : "bg-gray-4 hover:bg-gray-7 text-black"
                                }`}
                onClick={() => setSelectedCategory(null)}
              >
                <p className="font-bold tracking-wide lg:text-base text-sm py-0.5">
                  All
                </p>
              </button>
            </div>
						{/* Category buttons */}
            {categories.map((c) => (
              <div key={c.id} className="filter">
                <button
                  className={`flex justify-between focus:outline-none transition-bg py-1 px-4 rounded-lg h-fit cursor-pointer
                                        ${
                                          selectedCategory === c.id
                                            ? "bg-green-3 text-white"
                                            : "bg-gray-4 hover:bg-gray-7 text-black"
                                        }`}
                  onClick={() => setSelectedCategory(c.id)}
                >
                  <p className="font-bold tracking-wide lg:text-base text-sm py-0.5">
                    {c.name}
                  </p>
                </button>
              </div>
            ))}
          </div>

          {/* --- Product Grid --- */}
          <div className="grid 2xl:grid-cols-6 xl:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 ml:gap-4 mx-auto w-fit">
            {displayedProducts.map((p) => {
              const qty = getQuantity(p.id);

              return (
                <div
                  key={p.id}
                  className="flex flex-col h-auto mb-6 mx-3 md:w-52 sm:w-44 w-40"
                >
									{/* Product image */}
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="object-cover rounded-xl md:w-52 md:h-52 sm:w-44 sm:h-44 w-40 h-40"
                  />

									{/* Product info + cart controls */}
                  <div className="flex flex-row justify-between md:w-52 sm:w-44 w-40 h-auto mx-2 my-3">
                    <div>
                      <div className="w-full h-auto">
                        <p className="text-lg font-bold sm:text-base text-sm tracking-wide ">
                          {p.name}
                        </p>
                      </div>
                      <div className="w-full h-auto">
                        <div className="card-price">
                          <p className="font-bold sm:text-base text-sm tracking-wider">
                            <span>€{(p.priceCents / 100).toFixed(2)}</span>
                            <span> {p.unit}</span>
                          </p>
                        </div>
                      </div>
                    </div>

										{/* Add-to-cart / quantity controls */}
                    <div className="flex justify-center mr-2 mt-0.5">
                      <div className="relative">
                        <div
                          className={`absolute sm:-top-16 sm:right-2 -top-13 right-1 flex items-center justify-center rounded-full overflow-hidden transition-all duration-300 ease-in-out
                                                    ${
                                                      qty === 0
                                                        ? "sm:w-11 sm:h-10 w-9 h-8"
                                                        : "md:w-24 w-20 sm:h-10 h-8"
                                                    }`}
                        >
                          {qty === 0 ? (
														// Show "add" button if product not in cart
                            <button
                              className="flex bg-yellow-400 hover:bg-yellow-300 items-center justify-center w-full h-full cursor-pointer"
                              onClick={() => add(p.id, 1)}
                            >
                              <ShoppingBag className="w-5 text-white" />
                            </button>
                          ) : (
														// Show qty counter if already in cart
                            <div className="flex items-center justify-between w-full p-1 border border-gray-3 bg-white rounded-full">
                              <button
                                className="md:w-7 md:h-7 w-5 h-5 flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 rounded-full text-white font-bold transition cursor-pointer"
                                onClick={() => setQty(p.id, qty - 1)}
                              >
                                <Minus />
                              </button>
                              <span className="text-black font-bold">
                                {qty}
                              </span>
                              <button
                                className="md:w-7 md:h-7 w-5 h-5 flex items-center justify-center bg-yellow-400 hover:bg-yellow-300 rounded-full text-white font-bold transition cursor-pointer"
                                onClick={() => setQty(p.id, qty + 1)}
                              >
                                <Plus />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductPage;
