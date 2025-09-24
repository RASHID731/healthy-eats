/**
 * HomePage
 *
 * Landing page with a hero banner:
 * - Background image + overlay for readability
 * - Title, tagline, and CTA link to products
 */
export default function HomePage() {
  return (
    <main>
      {/* --- Hero Section --- */}
      <section
        className="relative bg-cover bg-center h-[90vh] flex items-center justify-center text-center px-6"
        style={{ backgroundImage: "url('/images/lemons.jpg')" }}
      >
        {/* Overlay darkens background for text contrast */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Hero content */}
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Fresh. Healthy. Sustainable.
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-8">
            Delicious and nutritious food, delivered straight to your door.
          </p>
          <a
            href="/products"
            className="inline-block px-10 py-4 bg-green-3 hover:bg-green-7 text-white font-semibold rounded-lg transition"
          >
            Shop Now
          </a>
        </div>
      </section>
    </main>
  );
}
