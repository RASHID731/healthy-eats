import axios from "axios";

/**
 * Preconfigured Axios instance to call the Spring Boot API.
 * withCredentials=true ensures the session cookie is sent/received,
 * which is required for server side carts tied to the session.
 */
export const api = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});
