/**
 * AboutPage
 *
 * Static page with:
 * - Hero section (title + mission text)
 * - Mission & values grid (Freshness, Sustainability, Community)
 */
export default function AboutPage() {
  return (
    <main className="flex flex-col flex-grow items-center justify-center bg-white px-6 py-16">
      {/* --- Hero Section --- */}
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
        About Healthy Eats
      </h1>
      <p className="text-gray-2 text-center max-w-2xl mb-12">
        At Healthy Eats, our mission is to bring you fresh, sustainable, and healthy food 
        right to your doorstep. We believe eating well should be simple, affordable, and enjoyable.
      </p>

      {/* --- Mission & Values --- */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
        {/* Freshness card */}
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-black mb-2">Freshness</h2>
          <p className="text-gray-2 text-sm">
            We partner with trusted local suppliers to ensure every item is fresh and nutritious.
          </p>
        </div>

        {/* Sustainability card */}
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-black mb-2">Sustainability</h2>
          <p className="text-gray-2 text-sm">
            We prioritize eco-friendly packaging and responsible sourcing for a healthier planet.
          </p>
        </div>

        {/* Community card */}
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-black mb-2">Community</h2>
          <p className="text-gray-2 text-sm">
            Healthy eating is a journey, and we’re here to support you every step of the way.
          </p>
        </div>
      </div>
    </main>
  );
}
