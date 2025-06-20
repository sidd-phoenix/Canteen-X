# Canteen-X

End-to-end canteen solution

---

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture Diagram](#architecture-diagram)
- [User Roles & Flow](#user-roles--flow)
- [Component & File Mapping](#component--file-mapping)
- [Component Usage Block Diagram](#component-usage-block-diagram)
- [Database Schema](#database-schema)
- [Component Flow](#component-flow)
- [Authentication Flow](#authentication-flow)
- [Payment Integration](#payment-integration)
- [Styling](#styling)
- [Extending the Project](#extending-the-project)
- [References](#references)

---

## Project Overview

Canteen-X is a full-stack canteen management platform supporting three user roles: **Admin**, **Order Taker**, and **Customer**. It manages menu items, orders, and user profiles, and supports Google authentication.

---

## Architecture Diagram

```mermaid
flowchart LR
    A[Frontend - React/Next.js] <--> B[Next.js Server - API Routes]
    B <--> C[MongoDB Database]
    A -- Auth, Orders, Menu --> B
    B -- Data (users, menu, orders) --> C
```

---

## User Roles & Flow

### Roles

- **Admin**: Manages menu and order takers, views all orders.
- **Order Taker**: Handles orders for their counter, updates order status.
- **Customer**: Browses menu, places orders, views order history.

### User Flow

```mermaid
flowchart TD
    subgraph Customer
        L[Login/Signup - Google Auth]
        M[Browse Menu]
        C[Add to Cart]
        P[Checkout/Pay]
        H[View Order History]
        S[Order Status Updates]
        L --> M --> C --> P
        P --> S
        S --> H
    end
```

---

## Component & File Mapping

| Component/File                | Purpose/Role                                 |
|-------------------------------|----------------------------------------------|
| `app/page.js`                 | Main entry, wraps everything in providers    |
| `components/Navbar.js`        | Top navigation bar, role-aware               |
| `components/Sidebar.js`       | Sidebar navigation (role-based)              |
| `components/Content.js`       | Renders main content based on view/role      |
| `components/Cart.js`          | Shopping cart and payment                    |
| `components/UserProfile.js`   | User profile page                            |
| `components/OrderHistory.js`  | Customer's order history                     |
| `components/ActiveOrders.js`  | Order taker's active orders                  |
| `components/OrderList.js`     | Admin's order list                           |
| `components/MenuList.js`      | Menu display for customers                   |
| `components/Menu.js`          | Menu management for admin                    |
| `components/Addordertaker.js` | Admin tool: add order taker                  |
| `components/Removeordertaker.js` | Admin tool: remove order taker            |
| `context/ViewContext.js`      | Controls which view is active                |
| `context/UserContext.js`      | User info and session                        |
| `context/CartContext.js`      | Cart state                                   |
| `app/api/`                    | API routes for auth, orders, menu, etc.      |
| `models/usermodel.js`         | User schema                                  |
| `models/menumodel.js`         | Menu item schema                             |
| `models/ordersmodel.js`       | Order schema                                 |

---

## Component Usage Block Diagram

```mermaid
flowchart TD
    %% Main App Structure
    Page[app/page.js] --> Providers[Providers: CartProvider, UserProvider, ViewProvider]
    Providers --> Navbar[Navbar]
    Providers --> Sidebar[Sidebar]
    Providers --> Content[Content]
    Providers --> Footer[Footer]

    %% Sidebar role-based
    Sidebar --> Sidebar_admin[Sidebar_admin]
    Sidebar --> Sidebar_order_taker[Sidebar_order_taker]
    Sidebar --> Sidebar_customer[Sidebar_customer]

    %% Content dynamic rendering
    Content --> UserProfile[UserProfile]
    Content --> OrderHistory[OrderHistory]
    Content --> MenuList[MenuList]
    Content --> Menu[Menu]
    Content --> Addordertaker[Addordertaker]
    Content --> Removeordertaker[Removeordertaker]
    Content --> ActiveOrders[ActiveOrders]
    Content --> OrderList[OrderList]
    Content --> OrderTaker[OrderTaker]

    %% Menu subcomponents
    Menu --> MenuButtons[MenuButtons]
    Menu --> MenuContent[MenuContent]
    MenuContent --> AddItems[AddItems]
    MenuContent --> ModifyItems[ModifyItems]

    %% Cart and Payment
    Navbar --> Cart[Cart]
    Content --> Cart

    %% Context usage
    Providers --> ViewContext[ViewContext]
    Providers --> UserContext[UserContext]
    Providers --> CartContext[CartContext]
```

---

## Database Schema

### Legend
- `_req` = Required (compulsory) field
- `_opt` = Optional field

```mermaid
erDiagram
    users {
        string _id PK
        string googleId_opt
        string name_req
        string email_req
        string role_req
        number counter_opt
        string phoneNumber_opt
        date createdAt_req
        date updatedAt_req
    }
    menu {
        string _id PK
        string name_req
        number price_req
        boolean isAvailable_opt
        string category_opt
        number assignedCounter_req
        string imageUrl_opt
        date createdAt_req
        date updatedAt_req
    }
    orders {
        string _id PK
        string customerId_req
        array items_req
        number totalAmount_req
        string status_req
        date placedAt_opt
        date updatedAt_req
    }
    users ||--o{ orders : places
    menu ||--o{ orders : included_in
```

---

## Component Flow

```mermaid
flowchart TD
    A[app/page.js]
    B[Providers: Cart, User, View]
    C[Navbar]
    D[Sidebar]
    E[Content]
    F[Footer]
    G[Dynamic Content: UserProfile, OrderHistory, MenuList, Menu, Cart, ...]
    A --> B
    B --> C
    B --> D
    B --> E
    B --> F
    E --> G
```

- **Content** dynamically renders the correct component based on the current view and user role.

---

## Authentication Flow

- Uses **NextAuth** with Google provider.
- On sign-in, user is created in the database if not present.
- Role is determined from the database and attached to the session.

```mermaid
sequenceDiagram
    participant User
    participant NextAuth
    participant MongoDB
    User->>NextAuth: Sign in with Google
    NextAuth->>MongoDB: Check if user exists
    alt New user
        MongoDB-->>NextAuth: No
        NextAuth->>MongoDB: Create user (role: customer)
    else Existing user
        MongoDB-->>NextAuth: Yes (get role)
    end
    NextAuth-->>User: Authenticated session (with role)
```

---

## Payment Integration

- Uses **Cashfree** for payment processing in the cart (`components/Cart.js`).
- Payment is only allowed for logged-in users.
- Unavailable items are checked before payment.

---

## Styling

- All styles are modular and located in the `styles/` directory.
- Uses CSS variables for theme consistency.
- Responsive and modern UI.

---

## Extending the Project

- Add new roles by updating `usermodel.js` and role-based logic in components.
- Add new menu categories or order statuses by updating the respective models and UI.

---

## References

- See `Documentation.md` and `README.md` for more.
- Each component's file contains inline documentation.

---

**Tip:**  
To view diagrams, use a Markdown viewer that supports Mermaid (e.g., VSCode with the Markdown Preview Mermaid Support extension, or GitHub web).

---

Let me know if you want any branding/customization! 