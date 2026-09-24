# Enterprise Frontend (Next.js + Spring Boot)

A production-shaped Next.js 14 (App Router, TypeScript) frontend, wired end-to-end
as a CRUD console for a **Product** resource against a Spring Boot REST API.
Use `Product` as the template — copy the `products` folder pattern for every
other entity in your backend.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **TanStack Query (React Query)** — server state, caching, invalidation
- **Axios** — API client with interceptors for auth + error normalization
- **React Hook Form + Zod** — form state and validation
- **Tailwind CSS** — styling, no component library lock-in
- **sonner** — toast notifications
- **lucide-react** — icons

## Architecture

```
src/
  app/                  Routes (App Router) — pages only, no business logic
    products/           list, new, [id], [id]/edit
  components/
    ui/                 Dumb, reusable primitives (Button, Input, Modal…)
    layout/             Sidebar, header, app shell
    products/           Feature-specific components (table, form, delete dialog)
  lib/
    api/                Axios instance + one file per resource (products.ts)
    validations/        Zod schemas — single source of truth for form + type
  hooks/                React Query hooks per resource (use-products.ts)
  types/                TypeScript interfaces mirroring your Spring DTOs
  providers/            QueryClientProvider setup
```

The pattern per resource is always: `types/X.ts` → `lib/api/X.ts` →
`hooks/use-X.ts` → `components/X/*` → `app/X/*`. This keeps API calls,
caching, and UI cleanly separated so it scales to dozens of resources
without turning into spaghetti.

## 1. Install

You'll need Node.js 18.18+ (20 LTS recommended). From this folder:

```bash
npm install
```

## 2. Configure the backend URL

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Point this at wherever your Spring Boot app exposes its REST controllers.

## 3. Run it

```bash
npm run dev
```

Open http://localhost:3000.

## What your Spring Boot API needs to expose

The frontend assumes standard REST + Spring Data `Page<T>` conventions:

| Method | Path                | Purpose                        |
|--------|---------------------|---------------------------------|
| GET    | `/api/products`     | list, supports `?page&size&search` |
| GET    | `/api/products/{id}`| get one |
| POST   | `/api/products`     | create |
| PUT    | `/api/products/{id}`| update |
| DELETE | `/api/products/{id}`| delete |

If you return `Page<Product>` from a Spring Data JPA repository via
`Pageable`, the JSON shape (`content`, `totalElements`, `totalPages`,
`number`, `size`) already matches `src/types/product.ts`. If your
controller returns a plain `List<Product>` instead, either wrap it
in a `Page` on the backend, or simplify `productsApi.list` /
`useProducts` to skip pagination.

### CORS

If you're calling the Spring Boot API directly from the browser (not through
the `rewrites()` proxy in `next.config.mjs`), enable CORS on the backend, e.g.:

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:3000")
            .allowedMethods("GET", "POST", "PUT", "DELETE");
    }
}
```

Alternatively, keep `NEXT_PUBLIC_API_URL=/backend/api` and let the
`rewrites()` entry in `next.config.mjs` proxy requests server-side to
`BACKEND_URL` (set that env var instead) — no CORS config needed then.

### Error shape

`src/lib/api/client.ts` expects Spring error responses shaped roughly like:

```json
{ "message": "Validation failed", "errors": { "name": "must not be blank" } }
```

which is what a typical `@RestControllerAdvice` `@ExceptionHandler` returns.
Adjust the interceptor if your `@ControllerAdvice` uses a different shape
(e.g. Spring's default `ProblemDetail`).

## Authentication

Login lives at `/login` and everything under the `(dashboard)` route group
(`/`, `/products/**`) is wrapped in `ProtectedRoute`, which redirects to
`/login?from=<path>` when there's no session, then sends the user back to
where they were headed after a successful sign-in.

- `src/providers/auth-provider.tsx` — React context holding the current user
  and token, backed by `localStorage` (`auth_token`, `auth_user`) so a
  refresh doesn't log the user out.
- `src/lib/api/auth.ts` — calls `POST /api/auth/login`, expecting
  `{ token: string, user?: { id, username, roles } }` back. Adjust the
  path and response shape to match your Spring Security setup (a filter
  chain issuing a JWT, or whatever `AuthenticationManager` you've wired up).
- `apiClient` already attaches `Authorization: Bearer <token>` to every
  request and, on a `401`, clears the session and hard-redirects to
  `/login`.
- Logout is in the header (top-right).

**Known limitation:** the token lives in `localStorage`, which is read on
the client only — so an unauthenticated user technically still downloads
the JS bundle for a protected page before being redirected (no data leaks,
since API calls still need a valid token, but it's not a hardened SSR
guard). For a stricter setup, have Spring set the JWT as an `httpOnly`
cookie instead, and add Next.js `middleware.ts` that reads that cookie to
block the request server-side before the page ever renders.

## Adding a new resource (e.g. "Order")

1. `src/types/order.ts` — interface mirroring your Spring DTO
2. `src/lib/api/orders.ts` — copy `products.ts`, change the base path
3. `src/lib/validations/order.ts` — Zod schema
4. `src/hooks/use-orders.ts` — copy `use-products.ts`
5. `src/components/orders/*` — copy the three `products` components, adjust fields
6. `src/app/orders/**` — copy the four `products` route files
7. Add a link in `src/components/layout/sidebar.tsx`

## Production build

```bash
npm run build
npm run start
```
