import axios from "axios";

/**
 * Preconfigured Axios instance to call the Spring Boot API.
 * withCredentials=true ensures the session cookie is sent/received,
 * which is required for server side carts tied to the session.
 */
// Determine API base URL from environment; default to relative '/api'.
// Configure production via `VITE_API_BASE_URL` (e.g., https://api.example.com/api).
const baseURL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
