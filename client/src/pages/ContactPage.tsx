import { useNavigate } from "react-router-dom";

/**
 * ContactPage
 *
 * Provides a contact form + quick info:
 * - Collects name, email, message
 * - On submit, redirects to `/contact-success` (demo only, no real backend)
 * - Displays fallback contact details (email + phone)
 */
export default function ContactPage() {
  const navigate = useNavigate();

  // Handle form submission: prevent reload + redirect to success page
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/contact-success");
  };

  return (
    <main className="flex flex-col flex-grow items-center justify-center px-6 py-28">
      {/* --- Header --- */}
      <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
        Contact Us
      </h1>
      <p className="text-gray-2 text-center max-w-xl mb-12">
        Got questions, feedback, or partnership ideas? Fill out the form below
        or reach out directly — we’d love to hear from you.
      </p>

      {/* --- Contact Form --- */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded-lg p-8 w-full max-w-lg space-y-6"
      >
        {/* Name input */}
        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Name
          </label>
          <input
            type="text"
            className="w-full border border-gray-3 rounded-lg px-4 py-2 bg-gray-7 text-black focus:outline-none focus:ring-2 focus:ring-green-3"
            placeholder="Your name"
            required
          />
        </div>

        {/* Email input */}
        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Email
          </label>
          <input
            type="email"
            className="w-full border border-gray-3 rounded-lg px-4 py-2 bg-gray-7 text-black focus:outline-none focus:ring-2 focus:ring-green-3"
            placeholder="you@example.com"
            required
          />
        </div>

        {/* Message input */}
        <div>
          <label className="block text-sm font-semibold text-black mb-2">
            Message
          </label>
          <textarea
            rows={4}
            className="w-full border border-gray-3 rounded-lg px-4 py-2 bg-gray-7 text-black focus:outline-none focus:ring-2 focus:ring-green-3"
            placeholder="Write your message..."
            required
          ></textarea>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold text-white bg-green-3 hover:bg-green-7 transition cursor-pointer"
        >
          Send Message
        </button>

        {/* Note: demo only */}
        <p className="text-xs text-gray-2 text-center mt-4">
          This is a demo app — messages won’t actually be sent.
        </p>
      </form>

      {/* --- Quick Info --- */}
      <div className="text-center mt-12">
        <p className="text-black font-semibold">
          Email: <span className="text-gray-2">support@healthyeats.com</span>
        </p>
        <p className="text-black font-semibold">
          Phone: <span className="text-gray-2">+49 1234 5678 999</span>
        </p>
      </div>
    </main>
  );
}
