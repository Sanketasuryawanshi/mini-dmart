# 📡 Mini D-Mart — REST API Documentation

Interactive Swagger UI documentation is available locally at:  
**`http://localhost:8080/swagger-ui/index.html`** (or raw OpenAPI JSON at `/api-docs`).

---

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | Public | Authenticates user with email & password, returns JWT token & profile |
| `POST` | `/api/auth/register` | Public | Registers a new user account |
| `GET` | `/api/auth/me` | Authenticated | Fetches profile of currently logged-in user |

---

## 2. Product & Category Endpoints (`/api/products`, `/api/categories`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | Search and filter products with pagination, category, and price range |
| `GET` | `/api/products/all` | Public | Fetches all active products without pagination |
| `GET` | `/api/products/{id}` | Public | Fetches single product details |
| `GET` | `/api/products/category/{categoryId}` | Public | Fetches products belonging to a specific category |
| `POST` | `/api/products` | `ADMIN` | Creates a new grocery item |
| `PUT` | `/api/products/{id}` | `ADMIN` | Updates product details |
| `PATCH` | `/api/products/{id}/stock` | `STAFF, ADMIN` | Inline updates warehouse stock quantity |
| `DELETE` | `/api/products/{id}` | `ADMIN` | Soft deletes / deactivates product |
| `GET` | `/api/categories` | Public | Returns all grocery categories |
| `POST` | `/api/categories` | `ADMIN` | Creates a new category |

---

## 3. Store Pickup Slot Endpoints (`/api/slots`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/slots` | Public | Returns all future active pickup slots with available capacity |
| `GET` | `/api/slots/by-date?date=YYYY-MM-DD` | Public | Returns slots for a specific date |
| `POST` | `/api/slots` | `ADMIN` | Adds a new store collection slot |
| `PATCH` | `/api/slots/{id}/toggle?active=true` | `ADMIN` | Enables or disables a slot |

---

## 4. Order Management Endpoints (`/api/orders`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/orders` | Authenticated | Creates a new order (Store Pickup or Home Delivery) |
| `GET` | `/api/orders/my-orders` | Authenticated | Returns current customer's order history |
| `GET` | `/api/orders/{id}` | Authenticated | Returns detailed invoice and tracking status for an order |
| `GET` | `/api/orders/track/{orderNumber}` | Public/Auth | Returns order tracking timeline by order number |
| `POST` | `/api/orders/{id}/cancel` | Authenticated | Cancels order (if not yet preparing), restocks inventory |
| `GET` | `/api/orders/all` | `ADMIN` | Returns all orders in system |
| `GET` | `/api/orders/queue` | `STAFF, ADMIN` | Live order queue for packing and pickup dispatch |
| `PATCH` | `/api/orders/{id}/status` | `STAFF, ADMIN` | Updates order stage (`CONFIRMED`, `PREPARING`, `OUT_FOR_DELIVERY`, `READY_FOR_PICKUP`, `DELIVERED`, `PICKED_UP`) |

---

## 5. Returns & Exchanges Endpoints (`/api/returns`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/returns` | Authenticated | Submits a return or exchange request with item selection & reason |
| `GET` | `/api/returns/my-returns` | Authenticated | Returns customer's return requests |
| `GET` | `/api/returns/{id}` | Authenticated | Returns specific return request details |
| `GET` | `/api/returns/all` | `STAFF, ADMIN` | Returns all return requests for staff review queue |
| `PATCH` | `/api/returns/{id}/process` | `STAFF, ADMIN` | Approves or Rejects return with staff response & optional inventory restock |

---

## 6. Admin Analytics & Users (`/api/admin`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/admin/stats` | `ADMIN` | Returns executive KPIs, 7-day revenue chart, category breakdown, low-stock count |
| `GET` | `/api/admin/users` | `ADMIN` | Returns all registered users |
| `PATCH` | `/api/admin/users/{id}/role` | `ADMIN` | Updates user RBAC role (`ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN`) |
