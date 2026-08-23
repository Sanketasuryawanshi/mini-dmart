# 🔒 Security Documentation & Review — Mini D-Mart

## 1. Overview
The Mini D-Mart application adheres to modern application security best practices across authentication, authorization, data validation, database protection, and session management.

---

## 2. Threat Model & Key Security Measures

### A. Authentication & Password Security
- **BCrypt Hashing**: All user passwords are encrypted using `BCryptPasswordEncoder` with a high computational strength factor prior to storage.
- **JWT (JSON Web Tokens)**: Stateless token-based authentication using HMAC-SHA256 (`HS256`) signature keys.
- **Token Expiry**: Configurable token expiration (default 24 hours) to minimize the risk of replay attacks.
- **AuthEntryPoint**: Returns standardized JSON 401 Unauthorized errors rather than leaking server stack traces.

### B. Role-Based Access Control (RBAC)
- Fine-grained role separation:
  - `ROLE_CUSTOMER`: Can only browse products, place orders, view own order history, cancel own pending orders, and submit return requests for own orders.
  - `ROLE_STAFF`: Access to the store fulfillment queue, order packing updates, pickup counter dispatch, and return request processing.
  - `ROLE_ADMIN`: Full access to executive analytics, product CRUD, inventory stock editing, slot creation, and user role management.
- Authorization enforced at the controller method level via `@PreAuthorize("hasRole('ADMIN')")` and `@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")`.

### C. Input Validation & Data Integrity
- Jakarta Bean Validation annotations (`@NotNull`, `@NotBlank`, `@Email`, `@Min`, `@DecimalMin`, `@Size`) applied to all incoming request DTOs.
- `GlobalExceptionHandler` intercepts validation failures and returns clean RFC-compliant error dictionaries without leaking internal class structures.
- Negative prices, negative stock, and invalid quantity inputs are rejected at the service validation layer.

### D. SQL Injection & ORM Protection
- Spring Data JPA and Hibernate use parameterized queries with named parameters (`:search`, `:categoryId`, etc.) preventing SQL injection vulnerabilities.

### E. Cross-Origin Resource Sharing (CORS)
- Strict CORS configuration allowing designated origin patterns, explicitly configured HTTP methods (`GET, POST, PUT, PATCH, DELETE, OPTIONS`), and secure headers.
- Cross-Site Request Forgery (CSRF) is disabled strictly because authentication is stateless and uses Bearer tokens stored in client headers rather than ambient session cookies.

### F. Return & Exchange Policy Security
- Ownership validation: Prevents users from requesting returns on orders belonging to other accounts.
- State validation: Rejects returns on non-delivered or cancelled orders.
- Time-window validation: Rejects return requests created past the 7-day delivery window.
- Perishable goods policy: Prevents fraudulent returns on perishable items unless marked as damaged/defective.

---

## 3. Vulnerability Reporting
For any security disclosures, please contact the development team at `security@minidmart.com`.
