import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * AuthPage component
 *
 * Provides login/register functionality:
 * - Switches between LoginForm and RegisterForm using tabs
 * - Uses AuthContext for login/register functions
 * - Redirects user back to the page they came from (or /products by default) on success
 */
export default function AuthPage() {
  const { login, register } = useAuth();

  // Track which tab is active: "login" or "register"
  const [tab, setTab] = useState<"login" | "register">("login");

  // Router hooks for redirecting after successful auth
  const navigate = useNavigate();
  const location = useLocation();

  // If user came from a protected route, redirect them back after login/register
  const from = (location.state as any)?.from?.pathname || "/products";

  return (
    <div className="flex justify-center items-center h-[90vh]">
      <div className="sm:w-128 w-84">
        {/* --- Tab Switcher --- */}
        <div className="flex border-2 border-gray-4 bg-gray-4 rounded-lg overflow-hidden">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-3 text-center rounded-lg cursor-pointer ${
              tab === "login" ? "bg-white font-bold" : "hover:text-black"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-3 text-center rounded-lg cursor-pointer ${
              tab === "register" ? "bg-white font-bold" : "hover:text-black"
            }`}
          >
            Register
          </button>
        </div>

        {/* --- Conditionally render Login or Register form --- */}
        <div className="py-6">
          {tab === "login" ? (
            <LoginForm
              login={login}
              onSuccess={() => navigate(from, { replace: true })}
            />
          ) : (
            <RegisterForm
              register={register}
              onSuccess={() => navigate(from, { replace: true })}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------- LOGIN FORM ---------------- */
/**
 * Handles login:
 * - Collects email/password
 * - Calls login() from AuthContext
 * - Redirects on success, shows error on failure
 */
function LoginForm({
  login,
  onSuccess,
}: {
  login: (email: string, password: string) => Promise<void>;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      onSuccess(); // redirect user on success
    } catch {
      setError("Invalid credentials or server error.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email input */}
      <div>
        <label
          htmlFor="login-form-email"
          className="block text-sm font-semibold text-black mb-2"
        >
          Email
        </label>
        <input
          id="login-form-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-3 rounded-lg px-4 py-2 bg-gray-7 text-black focus:outline-none focus:ring-2 focus:ring-green-3"
        />
      </div>
      {/* Password input */}
      <div>
        <label
          htmlFor="login-form-password"
          className="block text-sm font-semibold text-black mb-2"
        >
          Password
        </label>
        <input
          id="login-form-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-3 rounded-lg px-4 py-2 bg-gray-7 text-black focus:outline-none focus:ring-2 focus:ring-green-3"
        />
      </div>
      {/* Error message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {/* Submit button */}
      <button
        type="submit"
        className="mt-6 w-full py-3 rounded-lg font-semibold text-white bg-green-3 hover:bg-green-7 transition cursor-pointer"
      >
        Login
      </button>
    </form>
  );
}

/* ---------------- REGISTER FORM ---------------- */
/**
 * Handles user registration:
 * - Collects email, password, confirm password
 * - Validates password confirmation
 * - Calls register() from AuthContext
 * - Redirects on success, shows error on failure
 */
function RegisterForm({
  register,
  onSuccess,
}: {
  register: (email: string, password: string) => Promise<void>;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Basic client-side validation
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await register(email, password);
      onSuccess();
    } catch {
      setError("Registration failed. Try another email.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email input */}
      <div>
        <label
          htmlFor="register-form-email"
          className="block text-sm font-semibold text-black mb-2"
        >
          Email
        </label>
        <input
          id="register-form-email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border border-gray-3 rounded-lg px-4 py-2 bg-gray-7 text-black focus:outline-none focus:ring-2 focus:ring-green-3"
        />
      </div>
      {/* Password + confirm password inputs */}
      <div>
        <label
          htmlFor="register-form-password"
          className="block text-sm font-semibold text-black mb-2"
        >
          Password
        </label>
        <input
          id="register-form-password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border border-gray-3 rounded-lg px-4 py-2 bg-gray-7 text-black focus:outline-none focus:ring-2 focus:ring-green-3"
        />
      </div>
      <div>
        <label
          htmlFor="register-form-confirm-password"
          className="block text-sm font-semibold text-black mb-2"
        >
          Confirm Password
        </label>
        <input
          id="register-form-confirm-password"
          type="password"
          placeholder="Confirm Password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          className="w-full border border-gray-3 rounded-lg px-4 py-2 bg-gray-7 text-black focus:outline-none focus:ring-2 focus:ring-green-3"
        />
      </div>
      {/* Error message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {/* Submit button */}
      <button
        type="submit"
        className="mt-6 w-full py-3 rounded-lg font-semibold text-white bg-green-3 hover:bg-green-7 transition cursor-pointer"
      >
        Register
      </button>
    </form>
  );
}
