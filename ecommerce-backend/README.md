# Fielding & Vane — E-commerce Backend

Spring Boot 3 / Java 17 backend implementing `API_CONTRACT.md` from the
`ecommerce-frontend` project exactly (same JSON shapes, query params, sort
values, and error format), so the React frontend can point at this API with
no code changes beyond `VITE_API_BASE_URL`.

## Database setup (MySQL)

This backend runs on MySQL. You need a running MySQL server (locally or
via Docker) — the schema itself is created automatically by Hibernate
(`ddl-auto: update`), and the database named in the URL is created
automatically too (`createDatabaseIfNotExist=true`).

**Option A — local MySQL install**

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ecommerce;"
```

**Option B — Docker**

```bash
docker run --name ecommerce-mysql -e MYSQL_ROOT_PASSWORD=yourpassword \
  -e MYSQL_DATABASE=ecommerce -p 3306:3306 -d mysql:8.4
```

### Configuration

Connection settings are read from environment variables, with sensible
local defaults baked in (`application.yml`):

| Variable       | Default                                                                          | Description        |
|----------------|-----------------------------------------------------------------------------------|---------------------|
| `DB_URL`       | `jdbc:mysql://localhost:3306/ecommerce?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true` | JDBC connection URL |
| `DB_USERNAME`  | `root`                                                                            | MySQL username       |
| `DB_PASSWORD`  | *(empty)*                                                                         | MySQL password       |

Set them before running, e.g.:

```bash
export DB_URL="jdbc:mysql://localhost:3306/ecommerce?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true"
export DB_USERNAME=root
export DB_PASSWORD=yourpassword
```

Or with a `.env`-style tool / your IDE's run configuration — any mechanism
that sets process environment variables works, since Spring reads them
directly in `application.yml` via `${DB_URL}`, `${DB_USERNAME}`, `${DB_PASSWORD}`.

## Run

```bash
mvn spring-boot:run
```

API starts on `http://localhost:8080`. On first boot, `DataSeeder` populates
the `ecommerce` MySQL database with the same 6 categories / 16 products used
in the frontend's mock data (`src/data/products.js`, `src/data/categories.js`).
The seeder only runs when the `categories` table is empty, so restarts won't
duplicate data.

## Connect the frontend

In `ecommerce-frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

## Endpoints

- `GET /api/products?page=0&size=12&category=audio&search=headphones&minPrice=&maxPrice=&sort=price_asc`
- `GET /api/products/{id}`
- `GET /api/products/slug/{slug}`
- `GET /api/categories`
- `GET /api/categories/{id}`
- `GET /api/categories/slug/{slug}`

Sort values: `price_asc`, `price_desc`, `name_asc`, `name_desc`, `rating_desc`, `newest`

## Structure

```
src/main/java/com/fieldingvane/ecommerce/
├── EcommerceBackendApplication.java
├── config/        CorsConfig, DataSeeder
├── controller/     ProductController, CategoryController
├── dto/            ProductDto, CategoryDto, PageResponse, ErrorResponse
├── entity/         Product, Category
├── repository/     ProductRepository, CategoryRepository
├── service/        ProductService, CategoryService
├── specification/  ProductSpecifications (dynamic filtering)
├── exception/       ResourceNotFoundException, GlobalExceptionHandler
└── mapper/         EntityMapper
```

## Notes / next steps

- Currently read-only (Phase 1, matching the frontend's current contract).
  No cart, auth, or order endpoints yet — add these when the frontend's
  contract expands into Phase 2.
- Runs on MySQL end-to-end (dev and prod) via env vars — no code changes
  needed between environments, just different `DB_URL` / `DB_USERNAME` /
  `DB_PASSWORD` values (e.g. pointing at RDS or another managed MySQL in
  production).
- `price` / `originalPrice` are stored as integers in the smallest currency
  unit, matching the frontend mock data convention.
