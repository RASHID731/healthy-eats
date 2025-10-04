# Healthy Shop

## What It Does
This full-stack Healthy Shop demo combines a Spring Boot REST API with a React storefront so shoppers can browse curated groceries, manage a session-backed cart, check out with Stripe, and review order history while the backend persists catalog, customer, and payment data.

## Tech Stack
- Backend: Java with Spring Boot (Web, Security, Data JPA, Validation) and Lombok
- Frontend: React, TypeScript, Vite, Tailwind CSS, React Router, Axios
- Payments: Stripe Checkout integration across server and client SDKs
- Data: PostgreSQL backed by Hibernate/JPA entities and seeded catalog data
- Deployment: AWS (CloudFront, S3, Elastic Beanstalk, RDS, Aurora)

## Architecture
- **Client (`client/`)**: Vite-powered React SPA with Tailwind styling. Cart and auth state live in context providers (`CartContext`, `AuthContext`) that wrap the router and share session data. Pages fetch data through a preconfigured Axios client (`src/lib/api.ts`) that attaches session cookies (`withCredentials: true`), handles product/category loading, and posts checkout payloads.
- **Server (`server/`)**: Spring Boot application exposing `/api/**/*` endpoints. Packages group auth, product, category, cart, and order logic; services coordinate session cart mutations, Stripe checkout sessions, and webhook reconciliation. Security config enables session-based authentication with CORS for the Vite origin.
- **Persistence**: PostgreSQL schema with JPA entities for users, products, categories, carts, and orders. Startup seed data in `data.sql` hydrates the catalog and image URLs served from `client/public/images`. `application.yml` toggles schema validation, seed execution, and Stripe credentials via environment variables.

## Functional Coverage
- **Product discovery**
  - Fetches categories and products from `/api/categories` + `/api/products` and renders a responsive grid with lazy-loaded imagery.
  - Category filters and incremental search narrow the catalog client-side; cards display friendly pricing units.
  - Home, About, and Contact pages showcase marketing content that links through to the catalog.
- **Cart & checkout**
  - Session-backed cart API supports add, remove, quantity set, and clear operations; the React cart badge stays in sync through `CartContext`.
  - Checkout flow collects shipping details, posts to `/api/checkout`, and redirects to Stripe-hosted payment with order id stored as the client reference.
  - Cancel/success routes handle Stripe redirects and surface status messaging to the shopper.
- **Authentication & profiles**
  - Email/password registration and login persist Spring Security sessions; `/api/auth/me` hydrates the client’s auth context on refresh.
  - Protected routes gate the profile area; hitting `/api/auth/logout` clears the server session and front-end state.
- **Orders & payments**
  - Successful Stripe webhooks (`/api/checkout/webhook`) mark orders as paid and unlock order summaries in `/api/orders`.
  - Profile dashboard lists order history with line items, shipping address, and payment status.
- **Backend services**
  - Stripe session creation enforces authenticated checkout, maps cart items to Stripe line items, and stores pending orders before redirect.
  - Controllers centralize validation error handling (e.g., cart quantity bounds) and rely on repositories for persistence.

## API Endpoints
### Auth (`/api/auth`)
- `POST /register` — create a new user and start a session.
- `POST /login` — authenticate via Spring Security and store session.
- `GET /me` — return the currently authenticated user (or `null`).
- `POST /logout` — invalidate the session and clear security context.

### Products (`/api/products`)
- `GET /` — list all products with pricing, imagery, and categories.

### Categories (`/api/categories`)
- `GET /` — list all categories for filter controls.

### Cart (`/api/cart`)
- `GET /` — read the current session cart.
- `POST /items` — increment/decrement a product quantity (defaults to +1).
- `PUT /items/{productId}` — set an exact quantity.
- `DELETE /items/{productId}` — remove a product from the cart.
- `DELETE /` — clear the entire cart.

### Checkout (`/api/checkout`)
- `POST /` — validate checkout payload, persist a pending order, and return the Stripe Checkout URL.
- `POST /webhook` — Stripe webhook endpoint that verifies signatures and marks orders paid.

### Orders (`/api/orders`)
- `GET /` — list the authenticated user’s orders with line items and shipping info.

## Directory Layout
```
.
├── client/        # React + Vite storefront
│   ├── src/
│   │   ├── pages/           # Route components (home, products, checkout, profile…)
│   │   ├── components/      # Shared UI (navigation, marketing sections, forms)
│   │   ├── context/         # Auth + cart contexts and providers
│   │   └── lib/api.ts       # Axios instance pointing to the API base URL
│   └── public/images/       # Product imagery consumed by data.sql
└── server/        # Spring Boot REST API
    ├── src/main/java/com/healthyeats/server/
    │   ├── auth/            # Session auth controller + service
    │   ├── cart/            # Cart controller, service, DTOs
    │   ├── category/        # Category controller + repository
    │   ├── order/           # Checkout, webhooks, order persistence
    │   ├── product/         # Product controller + repository
    │   └── config/          # Security, CORS, session configuration
    └── src/main/resources/
        ├── application.yml  # Environment-driven config (DB, CORS, Stripe)
        └── data.sql         # Seed data for categories/products
```

## Minimal Setup
1. Configure environment:
   - Update `server/src/main/resources/application.yml` or export overrides (`DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`, `STRIPE_WEBHOOK_SECRET`, `FRONTEND_URL`).
   - Create `client/.env.local` (or edit `client/.env.production`) with `VITE_API_BASE_URL=http://localhost:8080/api` for local dev.
   - Ensure PostgreSQL database exists and the user matches the datasource credentials.
2. Start the backend:
   ```bash
   cd server
   ./mvnw spring-boot:run
   ```
   The app validates the schema (`ddl-auto=validate`) and can load seed data when `SQL_INIT_MODE=always`.
3. Start the frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   Vite runs on `http://localhost:5173` and proxies API calls to the base URL set in `VITE_API_BASE_URL`.
4. (Optional) Forward Stripe webhooks:
   ```bash
   stripe listen --forward-to localhost:8080/api/checkout/webhook
   ```
   This keeps local orders in sync by marking them paid once Checkout succeeds.

