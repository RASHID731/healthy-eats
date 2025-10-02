import axios from "axios";

/**
 * Preconfigured Axios instance to call the Spring Boot API.
 * withCredentials=true ensures the session cookie is sent/received,
 * which is required for server side carts tied to the session.
 */
// Determine API base URL from environment.
// In dev, fall back to the local Spring Boot server; otherwise use relative '/api'.
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
