# 🗄️ Mini D-Mart — Database Schema & Entity Relational Model

## 1. Entity Relational Diagram (ERD)

```mermaid
erDiagram
    USERS ||--o{ ORDERS : places
    CATEGORIES ||--o{ PRODUCTS : categorizes
    PRODUCTS ||--o{ ORDER_ITEMS : "contains in"
    ORDERS ||--|{ ORDER_ITEMS : contains
    PICKUP_SLOTS ||--o{ ORDERS : "reserves slot"
    ORDERS ||--o{ RETURN_REQUESTS : "initiates return"
    USERS ||--o{ RETURN_REQUESTS : submits
    RETURN_REQUESTS ||--|{ RETURN_ITEMS : specifies
    PRODUCTS ||--o{ RETURN_ITEMS : references

    USERS {
        bigint id PK
        varchar email UK
        varchar password
        varchar full_name
        varchar phone
        varchar address
        varchar pincode
        varchar role
        datetime created_at
    }

    CATEGORIES {
        bigint id PK
        varchar name UK
        varchar slug UK
        varchar image_url
        varchar description
        int display_order
    }

    PRODUCTS {
        bigint id PK
        varchar name
        text description
        varchar image_url
        bigint category_id FK
        varchar brand
        decimal mrp
        decimal price
        varchar unit
        int stock_quantity
        boolean is_perishable
        varchar shelf_life
        boolean is_active
        datetime created_at
    }

    PICKUP_SLOTS {
        bigint id PK
        varchar store_name
        varchar store_address
        date slot_date
        time start_time
        time end_time
        int max_capacity
        int booked_count
        boolean is_active
    }

    ORDERS {
        bigint id PK
        varchar order_number UK
        bigint user_id FK
        varchar fulfillment_type
        varchar status
        decimal total_mrp
        decimal total_discount
        decimal delivery_fee
        decimal final_amount
        bigint pickup_slot_id FK
        varchar delivery_address
        varchar delivery_phone
        varchar delivery_pincode
        varchar payment_method
        varchar payment_status
        datetime created_at
        datetime updated_at
    }

    ORDER_ITEMS {
        bigint id PK
        bigint order_id FK
        bigint product_id FK
        varchar product_name
        decimal unit_price
        decimal mrp
        int quantity
        decimal subtotal
    }

    RETURN_REQUESTS {
        bigint id PK
        bigint order_id FK
        bigint user_id FK
        varchar request_type
        varchar reason
        varchar customer_comments
        varchar status
        varchar staff_notes
        decimal refund_amount
        boolean restock_inventory
        datetime created_at
        datetime resolved_at
    }

    RETURN_ITEMS {
        bigint id PK
        bigint return_request_id FK
        bigint product_id FK
        int quantity
        varchar item_action
    }
```

---

## 2. Table Specifications & Constraints

### 1. `users`
Stores user credentials and RBAC roles.
- `email`: `VARCHAR(120) NOT NULL UNIQUE`
- `password`: `VARCHAR(255) NOT NULL` (BCrypt encoded)
- `role`: `VARCHAR(30) NOT NULL` (`ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN`)

### 2. `products`
Stores grocery product catalog, regular MRPs and discounted DMart prices.
- `mrp`: `DECIMAL(10,2) NOT NULL` (Standard retail MRP)
- `price`: `DECIMAL(10,2) NOT NULL` (Discounted DMart price)
- `stock_quantity`: `INT NOT NULL`
- `is_perishable`: `BOOLEAN NOT NULL` (Determines return eligibility)

### 3. `pickup_slots`
Manages 2-hour pickup collection windows at DMart Ready hubs.
- `max_capacity`: `INT NOT NULL` (Max orders allowed per slot)
- `booked_count`: `INT NOT NULL` (Tracked in real time)

### 4. `orders`
Represents customer purchase transactions.
- `order_number`: `VARCHAR(50) NOT NULL UNIQUE` (Format: `DM-YYYYMMDD-XXXX`)
- `status`: `VARCHAR(30)` (`PLACED`, `CONFIRMED`, `PREPARING`, `READY_FOR_PICKUP`, `OUT_FOR_DELIVERY`, `DELIVERED`, `PICKED_UP`, `CANCELLED`)
- `fulfillment_type`: `VARCHAR(30)` (`STORE_PICKUP` or `HOME_DELIVERY`)

### 5. `return_requests` & `return_items`
Manages customer return/exchange submissions, staff inspection notes, and inventory restock decisions.
