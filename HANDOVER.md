# HANDOVER — E-commerce Full-Stack Build (UPDATED — most of Phase 1 & 2 now done)

**This doc was updated in a follow-up session. A lot of what was "not done" below has
since been completed.** Read the "STATUS AS OF THIS UPDATE" section first, then treat
the rest of the file as historical context for how things are structured.

## STATUS AS OF THIS UPDATE

✅ **Frontend builds cleanly** — verified with an actual `npm run build` (Vite), zero
errors. This is real, not just a manual read-through.

❌ **Backend NOT compiler-verified** — Maven was installed in this sandbox
(`apt-get install maven` worked), but `repo.maven.apache.org` is blocked by the egress
proxy (403 Forbidden), so `mvn compile` cannot resolve the Spring Boot parent POM or
any dependencies at all. **This is an environment limitation, not a code problem** —
if you have real internet access (a real dev machine, CI, or a sandbox with Maven
Central allowed), compiling should be the very first thing you do. All backend code
was manually cross-checked line-by-line against entity fields, repository methods, and
DTO constructors — no mismatches found — but that is not a substitute for an actual
compile.

### Now fully implemented (Phase 1 — Customer): Cart, Checkout, Orders, Order history, Wishlist, Reviews — ALL DONE

- Cart: full CRUD via `CartContext` → `cartService.js` → `CartController`/`CartService`
- Checkout: `CheckoutPage.jsx` — shipping form, COD-only payment, calls
  `orderService.createOrder`
- Orders: `OrdersPage.jsx` (list) + `OrderDetailPage.jsx` (single order with a status
  tracker)
- Wishlist: `WishlistPage.jsx`, wishlist toggle button on `ProductDetailPage.jsx`, heart
  icon in `Header.jsx`
- Reviews: `ProductReviews.jsx` component rendered at the bottom of
  `ProductDetailPage.jsx` — submit/update/delete own review, list all reviews

### Now fully implemented (Phase 2 — Seller): Seller dashboard, Add/Edit/Delete product, Stock management, Seller's orders, Update order status — ALL DONE

All under `pages/seller/`:
- `SellerLayout.jsx` — sidebar shell, nested under `/seller` in `App.jsx`
- `SellerDashboardPage.jsx` — overview stats (product count, orders, revenue, low stock)
- `SellerProductsPage.jsx` — product table, inline stock editor, delete
- `SellerProductFormPage.jsx` — shared create/edit form (`/seller/products/new` and
  `/seller/products/:id/edit`)
- `SellerOrdersPage.jsx` — order items table with a per-order status-update dropdown
  (uses `OrderItemDto.orderId`, which was added to the backend in this session — see
  below)

All routes are gated with `<ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>` in
`App.jsx`. Registration already lets users pick SELLER vs CUSTOMER
(`RegisterPage.jsx` — this was already done before this session, not new).

### Backend fix made in this session

`OrderItemDto` was missing `orderId`, which the seller order-status UI needs (a seller
sees individual order *items*, not full orders, but needs the parent order id to call
`PATCH /api/seller/orders/{orderId}/status`). Added `orderId` to `OrderItemDto` and to
`EntityMapper.toOrderItemDto()`. This is a small, low-risk change — verify it compiles
first thing.

## What's STILL not done

### 1. Phase 3 — Polish (not started)

- **Image upload**: `imageUrl`/`images` in `ProductRequest` are still plain text URL
  fields — no file upload endpoint or UI exists. The seller product form
  (`SellerProductFormPage.jsx`) currently takes a URL string and a comma-separated list
  of additional URLs. If building real upload: needs a new `/api/upload` multipart
  endpoint + local disk or cloud storage, plus a file input + preview in the form.
- **Search**: backend already supports a `search` query param via
  `ProductSpecifications.matchesSearch` (confirmed present in `ProductService`) — check
  whether `SearchOverlay.jsx` actually calls `productService.getProducts({ search })`
  with a real query, or if it's currently decorative/mock-only. Not verified in this
  session.
- **Validation/error handling**: mostly done backend-side via `@Valid` +
  `GlobalExceptionHandler` (handles `MethodArgumentNotValidException`,
  `BadCredentialsException`, `AccessDeniedException`, `ResponseStatusException`).
  Frontend: all new pages (`CheckoutPage`, `SellerProductFormPage`, `ProductReviews`,
  etc.) surface backend errors via `err?.message` in a toast or inline error banner —
  this pattern is consistent throughout what was built. Worth a final audit pass for
  anything missed.
- **Responsive UI**: all new CSS files follow the existing breakpoint conventions
  (`@media (max-width: ...)`, using the same `--space-*`/`--fs-*` tokens as pre-existing
  pages) but haven't been visually tested in a real browser at various widths — only
  code-reviewed for consistency.
- **Security improvements**: still worth considering — rate-limiting login/register,
  shorter JWT expiry + refresh tokens (currently a flat 24h, unchanged from before this
  session), sanitizing review comments (currently raw text, only length-capped),
  validating that `imageUrl` values in `ProductRequest` are actually well-formed URLs.

### 2. Phase 4 — Optional (not started, lowest priority, needs user input)

- Razorpay/Stripe — needs real sandbox credentials from the user, can't build blind.
  `Order.paymentMethod` currently defaults to "COD" everywhere (backend default and
  frontend checkout UI only offers COD) — this assumption would need revisiting.
- Admin dashboard — backend groundwork partly exists (`isAdmin` bypass params already
  threaded through `ProductService`/`OrderService`/`SellerController`), but there is
  **no admin UI at all**.
- Email notifications — nothing started, needs SMTP/SendGrid credentials from the user.
- Deployment — nothing started, needs to know target platform from the user.

### 3. Minor known rough edges (not bugs, but worth improving)

- `SellerProductFormPage.jsx`'s edit mode fetches up to 100 of the seller's products
  client-side just to find one by ID (there's no `GET /api/seller/products/{id}`
  single-product endpoint). Works correctly but is wasteful — a dedicated endpoint would
  be cleaner if the seller has a large catalog.
- Backend price fields are `Integer` in the smallest currency unit (paise/cents) — the
  seller product form's price/originalPrice inputs are plain number inputs with a label
  clarifying this ("Price (in paise/cents)"), but there's no unit-conversion helper — a
  seller has to do the ₹→paise math themselves. Consider adding a rupees-input with
  automatic ×100 conversion for a nicer UX.

## Original architecture notes (still accurate, kept from the first handover)

- Backend: Spring Boot 3, Java 21, MySQL, Spring Security + JWT, Lombok, JPA. Path:
  `ecommerce-backend/src/main/java/com/fieldingvane/ecommerce/`
- Frontend: React 18 + Vite, react-router-dom, plain CSS (tokens in
  `src/styles/tokens.css`). Path: `ecommerce-frontend/src/`
- Mock/real API toggle via `VITE_USE_MOCK_DATA` in `.env` (currently `false` — hits the
  real backend at `VITE_API_BASE_URL`, default `http://localhost:8080/api`). Every new
  service (`cartService.js`, `wishlistService.js`, `reviewService.js`,
  `orderService.js`) supports both mock (localStorage-backed) and real mode.
  `sellerService.js` is intentionally real-API-only (documented in a comment at the top
  of the file) since simulating a full seller catalog in mock mode wasn't worth the
  effort for this scope.
- `SecurityConfig`: `/api/auth/**` public, GET on `/api/products/**` and
  `/api/categories/**` public (covers the public reviews-read endpoint too, since it's
  nested under `/api/products/{id}/reviews`), `/api/seller/**` requires
  SELLER-or-ADMIN role, everything else requires authentication.

## Original request, for reference

Take the finalized zip (Auth ✅, Products ✅ already done) and add:
- **Phase 1 — Customer**: Cart, Checkout, Orders, Order history, Wishlist, Reviews (✅ all done)
- **Phase 2 — Seller**: Dashboard, Add/Edit/Delete product, Stock management, Seller's
  orders, Update order status (✅ all done)
- **Phase 3 — Polish**: Image upload, Search, Validation/error handling, Responsive UI,
  Security improvements (not started)
- **Phase 4 — Optional**: Razorpay/Stripe, Admin dashboard, Email notifications,
  Deployment (not started, needs user-provided credentials/decisions)

## Final step once Phase 3/4 work (or a real compile check) is done

Re-zip the whole `ecommerce-fullstack/` folder (both `ecommerce-backend/` and
`ecommerce-frontend/`, excluding `target/`, `dist/`, and `node_modules/` build
artifacts) and present it via `present_files`.
