# 🍽️ CanteenX

Welcome to the CanteenX repository.  
This project reimagines how a canteen operates — streamlining customer orders, real-time updates, and admin control into one unified system.

Built for clarity, speed, and seamless experience across three user roles: Customer, Order Taker, and Admin.

---

## 🚀 Overview

CanteenX offers a role-based platform with live Firestore sync, built on top of modern web technologies.  
It is crafted to handle real-world canteen workflows while remaining fully serverless and responsive.

---

## 🌐 Live Site

Access it here: [canteen-x.vercel.app](https://canteen-x.vercel.app)

*(Note: You may need specific login access depending on your role)*

---

## 🖼️ Screenshots

### 🧑‍💼 Customer:
<table>
<tr>
  <td><img src="https://github.com/sidd-phoenix/Canteen-X/blob/main/screenshots/Screenshot%202025-03-06%20002351.png" alt="Customer View 1" width="600"></td>
  <td><img src="https://github.com/sidd-phoenix/Canteen-X/blob/main/screenshots/Screenshot%202025-03-06%20002402.png" alt="Customer View 2" width="600"></td>
</tr>
<tr>
  <td colspan="2" align="center">
    <img src="https://github.com/sidd-phoenix/Canteen-X/blob/main/screenshots/Screenshot%202025-03-06%20014046.png" alt="Customer View 3" height="600">
  </td>
</tr>
</table>

### 🛠️ Manager (Admin):
<table>
<tr>
  <td><img src="https://github.com/sidd-phoenix/Canteen-X/blob/main/screenshots/Screenshot%202025-03-06%20002651.png" alt="Manager View 1" width="600"></td>
  <td><img src="https://github.com/sidd-phoenix/Canteen-X/blob/main/screenshots/Screenshot%202025-03-06%20002640.png" alt="Manager View 2" width="600"></td>
</tr>
<tr>
  <td><img src="https://github.com/sidd-phoenix/Canteen-X/blob/main/screenshots/Screenshot%202025-03-06%20002703.png" alt="Manager View 3" width="600"></td>
  <td><img src="https://github.com/sidd-phoenix/Canteen-X/blob/main/screenshots/Screenshot%202025-03-06%20002717.png" alt="Manager View 4" width="600"></td>
</tr>
</table>

### 🧾 Order Taker:
<table>
<tr>
  <td><img src="https://github.com/sidd-phoenix/Canteen-X/blob/main/screenshots/Screenshot%202025-03-06%20002424.png" alt="Order Taker View 1" width="600"></td>
  <td><img src="https://github.com/sidd-phoenix/Canteen-X/blob/main/screenshots/Screenshot%202025-03-06%20002441.png" alt="Order Taker View 2" width="600"></td>
</tr>
</table>

---

## ⚙️ Core Functionalities

- 🔐 **Role-based Login** — Google Sign-In assigns user roles (Customer, Taker, Admin)
- 🧾 **Live Order Flow** — Orders placed by customers are instantly shown to takers
- 📦 **Real-Time Updates** — Every status update reflects live using Firestore's `onSnapshot()`
- 🧑‍🍳 **Order Management** — Order takers can mark orders as served or in-progress
- 🧠 **Admin Panel** — Admins manage users, items, categories, and view analytics

---

## ⚒️ Implementation Notes

- Firebase Auth handles Google login and session persistence
- Firestore stores user roles, orders, and menu data with instant sync
- Dashboard components auto-adapt based on login role using conditional routing
- Built with React + TailwindCSS for a clean, responsive UI

---

## 🛠️ Contributions

Ideas and suggestions are welcome — from UI improvements to backend optimization.

Mistakes are natural and correcting them is part of the journey.

> However, **this is a personal/academic project**, and maintaining its identity is key.  
> Contributions will be reviewed to ensure consistency with the original vision.

---

## ⚖️ License and Usage

**Note:** This project is released **without an open-source license**.  
By default:

> All rights are reserved by the owner.  
> Reproducing or distributing without permission is not allowed.

Inspired? Want to build on this idea? Reach out — collaboration is welcome with proper attribution.

---

## 📫 Contact

For ideas, feedback, or collaboration, feel free to [open an issue](https://github.com/sidd-phoenix/Canteen-X/issues) or reach out directly.
---

*Thank you for exploring CanteenX!*
