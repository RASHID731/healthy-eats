import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { JSX } from "react";

/**
 * ProtectedRoute
 *
 * Guards routes that require authentication:
 * - While auth state is loading → render nothing
 * - If not authenticated → redirect to /login (store origin route in state)
 * - If authenticated → render children
 */
export default function ProtectedRoute({
  children,
}: {
  children: JSX.Element;
}) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show nothing while checking auth state
  if (loading) return null;

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Otherwise render the protected content
  return children;
}