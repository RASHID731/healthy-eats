import { useEffect, useState } from "react";
import type { User } from "../types/user";
import { api } from "../lib/api";

/**
 * AccountTab
 *
 * Displays basic user account info:
 * - Email
 * - Registration date
 *
 * On mount, fetches the current user (`/auth/me`).
 * If not logged in, shows a fallback message.
 */
export default function AccountTab() {
  // Local state for user data (null if not logged in)
  const [user, setUser] = useState<User | null>(null);

  // Fetch user profile once on mount
  useEffect(() => {
    api
      .get<User>("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null)); // ensure null if request fails
  }, []);

  // Fallback if no user is logged in
  if (!user) {
    return <p className="text-gray-2">You are not logged in</p>;
  }

  // Render user info
  return (
    <div className="p-4">
      <p className="mb-1">
        <span className="font-bold">Email:</span> {user.email}
      </p>
      <p>
        <span className="font-bold">Member since:</span>{" "}
        {new Date(user.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
}
