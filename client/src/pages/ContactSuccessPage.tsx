import { CheckCircle } from "lucide-react";

/**
 * ContactSuccessPage
 *
 * Shown after submitting the contact form:
 * - Success icon
 * - Title + confirmation message
 * - CTA link back to home
 */
export default function ContactSuccessPage() {
  return (
    <main className="flex flex-col flex-grow items-center justify-center bg-gray-7 px-6">
      {/* --- Success Icon --- */}
      <CheckCircle className="w-20 h-20 text-green-3 mb-6" />

      {/* --- Title --- */}
      <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
        Message Sent 🎉
      </h1>

      {/* --- Message --- */}
      <p className="text-gray-2 text-center max-w-md mb-8">
        Thanks for reaching out! We’ll get back to you as soon as possible.
      </p>

      {/* --- CTA --- */}
      <a
        href="/"
        className="px-6 py-3 rounded-lg font-semibold text-white bg-green-3 hover:bg-green-7 transition"
      >
        Back to Home
      </a>
    </main>
  );
}
