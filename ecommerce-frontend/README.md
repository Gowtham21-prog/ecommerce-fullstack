# Fielding & Vane — E-commerce Frontend

A premium e-commerce frontend built with React + Vite. Fully runnable against
mock data today; designed to plug into a Spring Boot REST API later with a
one-line config change.

## Quick start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Connecting to the real backend later

1. See `API_CONTRACT.md` — the exact endpoint shapes this frontend expects.
2. Set in `.env`:
   ```
   VITE_API_BASE_URL=https://your-backend-host/api
   VITE_USE_MOCK_DATA=false
   ```
3. Nothing else changes. `src/services/productService.js` and
   `categoryService.js` are the only files that talk to data, and they
   already call `apiGet()` against the contract — the mock adapter is just
   swapped out.

## Project structure

```
src/
  components/
    common/      Reusable primitives: Button, Icon, Badge, StarRating, etc.
    layout/       Header, Footer, MobileMenu, SearchOverlay, CartDrawer wrapper
    product/      ProductCard, ProductGrid, ProductFilters, SortDropdown, Pagination
    cart/         CartDrawer
    home/         Hero, CategoryGrid, FeaturedProducts, PromoSections
  pages/          One file per route (Home, Shop, ProductDetail, Cart, ...)
  data/           Mock product & category data (separate from all components)
  services/       API layer: apiClient, mockAdapter, productService, categoryService
  hooks/          useProducts, useProduct, useCategories, useMediaQuery
  context/        CartContext (global cart state + localStorage persistence)
  utils/          formatters (currency, rating, discount %)
  styles/         Design tokens, global reset, shared animations
```

## Design notes

- Palette: ink / bone / moss / clay — an editorial, boutique-atelier feel
  rather than generic SaaS blue.
- Type: Fraunces (display serif) + Inter (UI) + JetBrains Mono (prices).
- Fully responsive: mobile, tablet, laptop, and wide desktop breakpoints.
- Cart state persists across reloads via localStorage.
- All product/category data access goes through `src/services/` — never
  import `src/data/*.js` directly from a component.
