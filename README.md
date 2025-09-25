# Healthy Shop

A full-stack e-commerce demo for “Healthy Eats,” showcasing a responsive React storefront backed by a Spring Boot API, complete with session carts, authentication, and a Stripe-powered checkout flow.

## Features

- Product catalog with category filters, search, and rich product cards.
- Session-backed shopping cart with quantity controls synced to the backend.
- Email/password authentication, protected routes, and profile area with order history.
- Checkout form that collects shipping details, creates Stripe Checkout sessions, and handles success/cancel flows.
- Stripe webhook listener that marks orders paid after successful payments.
- Seeded PostgreSQL database with categories and inventory images served by the Vite dev server.

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS v4, React Router, Axios, Lucide icons.
- **Backend:** Spring Boot 3.5, Spring Security, Spring Data JPA, Jakarta Validation, Stripe Java SDK.
- **Database:** PostgreSQL (auto-migrated schema, seeded via `data.sql`).
- **Tooling:** Maven, Lombok, ESLint, TypeScript, Stripe CLI/webhooks.

## Architecture

```
client/   → React SPA (Vite, Tailwind, Auth/Cart contexts, router)
server/   → Spring Boot API (auth, products, categories, cart, checkout, orders)
```

- The frontend calls the backend at `http://localhost:8080/api` via a shared Axios instance (`withCredentials: true`) to send the session cookie.
- Stripe checkout is initiated from the client; the server persists a pending order, creates a Stripe session, and returns the hosted payment URL.
- Stripe webhooks (`/api/checkout/webhook`) update the persisted order once payment succeeds.

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Java 21 (matches the Maven `java.version`)
- PostgreSQL running locally with a database/user that matches `spring.datasource.*` in `server/src/main/resources/application.yml`
- Stripe API keys & webhook secret

### 1. Backend

```bash
cd server
./mvnw spring-boot:run
```

Environment variables (override defaults in `application.yml` as needed):

- `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
- `STRIPE_SECRET_KEY`, `STRIPE_PUBLIC_KEY`, `STRIPE_WEBHOOK_SECRET`

The app seeds categories/products on startup via `data.sql`.

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

The Vite dev server runs on `http://localhost:5173` and proxies API calls to the backend host defined in `src/lib/api.ts`.

### 3. Stripe Webhook (optional but recommended)

Use the Stripe CLI to forward webhooks to the local server:

```bash
stripe listen --forward-to localhost:8080/api/checkout/webhook
```

## Available Scripts

### Frontend (`client/`)

- `npm run dev` – start Vite dev server
- `npm run build` – type-check + production build
- `npm run lint` – run ESLint

### Backend (`server/`)

- `./mvnw spring-boot:run` – start Spring Boot app
- `./mvnw test` – execute backend tests

## Key Endpoints

| Method | Path                     | Description                          | Auth |
| ------ | ------------------------ | ------------------------------------ | ---- |
| GET    | `/api/products`          | List all products                    | No   |
| GET    | `/api/categories`        | List categories                      | No   |
| GET    | `/api/cart`              | Fetch session cart                   | No   |
| POST   | `/api/cart/items`        | Add/increment item in cart           | No   |
| PUT    | `/api/cart/items/{id}`   | Set quantity                         | No   |
| DELETE | `/api/cart`              | Clear cart                           | No   |
| POST   | `/api/auth/register`     | Register user                        | No   |
| POST   | `/api/auth/login`        | Login (session-based)                | No   |
| GET    | `/api/auth/me`           | Current user session                 | Yes  |
| POST   | `/api/checkout`          | Kick off Stripe checkout             | Yes  |
| GET    | `/api/orders`            | Authenticated user order history     | Yes  |
| POST   | `/api/checkout/webhook` | Stripe webhook to confirm payments   | No   |

## Directory Layout

```
healthy-shop/
├── client/                # React + Vite SPA
│   ├── src/
│   │   ├── pages/         # Route components (home, products, auth, checkout…)
│   │   ├── components/    # Shared UI (NavBar, Footer, tabs…)
│   │   ├── context/       # Auth + Cart contexts
│   │   └── lib/api.ts     # Axios instance pointing at the API
│   └── public/images/     # Product imagery referenced by data.sql
└── server/                # Spring Boot API
    ├── src/main/java/com/healthyeats/server/
    │   ├── auth/          # Auth controllers + services
    │   ├── cart/          # Session cart service + DTOs
    │   ├── category/      # Category endpoints
    │   ├── order/         # Checkout, orders, Stripe webhook
    │   ├── product/       # Product CRUD/read endpoints
    │   └── config/        # Security + CORS configuration
    └── src/main/resources/
        ├── application.yml
        └── data.sql       # Seed data (categories/products)
```

## Styling & UI

- Tailwind CSS v4 theme customization lives in `client/src/index.css`.
- Fonts (Inter + custom Gilroy) loaded via Google Fonts/`@font-face`.
- Responsive navigation with auto-hide on scroll and mobile drawer menu.

## Testing & Quality Checks

- Backend tests run via Maven (`./mvnw test`).
- Frontend linting ensures TypeScript/React best practices (`npm run lint`).
- Add integration/UI tests as the project grows (e.g., Jest, Testing Library, Playwright).

## Deployment Notes

- Configure production URLs for both the API base URL and Stripe success/cancel pages before deploying.
- Replace the placeholder Stripe test keys in `application.yml` with secure environment variables.
- Ensure HTTPS termination so Stripe can reach the webhook endpoint in production.

---

Happy building!
