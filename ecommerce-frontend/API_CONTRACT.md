# API Contract — Phase 1 (Products + Categories)

This is the single source of truth shared between frontend and backend (Spring Boot).
The frontend's `src/services/` layer is built to match this exactly, so switching
from mock data to the live API only requires setting `VITE_API_BASE_URL` and
removing the artificial delay in `services/productService.js` / `categoryService.js`.

## Base URL
```
/api
```
Configured via `VITE_API_BASE_URL` in `.env` (see `.env.example`).

## Pagination
Query params: `page`, `size` (e.g. `?page=0&size=12`)

## Products

### GET /api/products
Query parameters: `page`, `size`, `category`, `search`, `minPrice`, `maxPrice`, `sort`

Example:
```
GET /api/products?page=0&size=12&category=audio&search=headphones&sort=price_asc
```

Response:
```json
{
  "content": [
    {
      "id": 1,
      "name": "Wireless Headphones",
      "slug": "wireless-headphones",
      "description": "Premium wireless headphones.",
      "price": 2499,
      "originalPrice": 2999,
      "category": { "id": 1, "name": "Audio", "slug": "audio" },
      "rating": 4.5,
      "reviewCount": 128,
      "imageUrl": "https://cdn.example.com/products/headphones.jpg",
      "images": [
        "https://cdn.example.com/products/headphones-1.jpg",
        "https://cdn.example.com/products/headphones-2.jpg"
      ],
      "stock": 18,
      "featured": true,
      "bestseller": true
    }
  ],
  "page": 0,
  "size": 12,
  "totalElements": 16,
  "totalPages": 2
}
```

### GET /api/products/{id}
### GET /api/products/slug/{slug}

## Categories

### GET /api/categories
```json
[
  { "id": 1, "name": "Audio", "slug": "audio", "imageUrl": "https://cdn.example.com/categories/audio.jpg" }
]
```

### GET /api/categories/{id}
### GET /api/categories/slug/{slug}

## Error format
```json
{
  "timestamp": "2026-08-12T12:30:00",
  "status": 404,
  "error": "NOT_FOUND",
  "message": "Product not found",
  "path": "/api/products/999"
}
```

## Sort values
`price_asc`, `price_desc`, `name_asc`, `name_desc`, `rating_desc`, `newest`
