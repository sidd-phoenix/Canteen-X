**Context Details:**

1.SessionProvider - nextauth builtin
2.ViewProvider - sidebar
3.MenuProvide - menu in admin console

**App Structure details:**

1. User Types:
    1.1 admin
    1.2 order_taker
    1.3 customer

2. View details:
    2.0 default
    2.1 user_profile
    2.2 order_history
    2.3 menu

3. SubMenu details:
    3.0 default
    3.1 add_items
    3.2 modify_items

  
**Database details**

1. Users Collection
Stores details of admins, order takers, and customers.
{
  "_id": ObjectId,            // Unique ID for the user
  "name": String,             // User's name
  "email": String,            // User's email (unique, used for login)
  "role": String,             // Role of the user: "admin", "order_taker", or "customer"
  "counter": Number,          // Counter number (only for order takers; null for others)
  "createdAt": Date,          // Account creation timestamp
  "updatedAt": Date           // Last updated timestamp
}

2. Menu Collection
Stores all menu items and maps them to specific order takers.
{
  "_id": ObjectId,            // Unique ID for the menu item
  "name": String,             // Name of the item (e.g., "Burger")
  "price": Number,            // Price of the item
  "isAvailable": Boolean,     // True if the item is available, false if disabled
  "category": String,         // Optional: Category of the item (e.g., "Drinks", "Snacks")
  "assignedCounter": ObjectId,  // Reference to the order taker who serves this item
  "createdAt": Date,          // Item creation timestamp
  "updatedAt": Date           // Last updated timestamp
}

3. Orders Collection
Tracks all orders placed by customers, split into sub-orders per order taker.
{
  "_id": ObjectId,            // Unique order ID
  "customerId": ObjectId,     // Reference to the user (customer)
  "items": [                  // List of items in the order
    {
      "menuItemId": ObjectId, // Reference to the menu item
      "name": String,         // Name of the item (for redundancy)
      "price": Number,        // Price of the item (for redundancy)
      "quantity": Number,     // Quantity of the item ordered
      "orderTakerId": ObjectId, // Reference to the order taker responsible for this item
      "status": String        // Status for this item: "pending", "preparing", "ready"
    }
  ],
  "totalAmount": Number,      // Total price of the order
  "status": String,           // Overall order status: "pending", "partially completed", "completed"
  "placedAt": Date,           // Timestamp when the order was placed
  "updatedAt": Date           // Timestamp when the status was last updated
}
