"use client"; // Ensure this is a client component

import React, { useEffect, useState } from "react";
import Link from "next/link"; // Import Link from Next.js
import Image from "next/image"; // Import Image from Next.js
import styles from "../styles/MenuList.module.css";
import MenuItemSkeleton from "./MenuItemSkeleton";

const MenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [cart, setCart] = useState([]);
  const [notification, setNotification] = useState(null); // State for notification
  const [loading, setLoading] = useState(true); // Add loading state
  const currencySymbol="₹";

  // Initialize cart from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cart");
      setCart(storedCart ? JSON.parse(storedCart) : []);
    }
  }, []);

  // Fetch menu items based on search term
  useEffect(() => {
    const fetchMenuItems = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch("/api/menu");
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await response.json();
        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      } finally {
        setLoading(false); // End loading regardless of outcome
      }
    };

    fetchMenuItems();
  }, []);

  // Function to add item to cart
  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem._id === item._id);
    if (existingItem) {
      const updatedCart = cart.map((cartItem) =>
        cartItem._id === item._id
          ? { ...existingItem, quantity: existingItem.quantity + 1 }
          : cartItem
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } else {
      const newCart = [...cart, { ...item, quantity: 1 }];
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    }

    // Show notification
    setNotification(`${item.name} has been added to your cart!`);
    setTimeout(() => setNotification(null), 3000); // Hide notification after 3 seconds
  };

  return (
    <div className={styles.menuContainer}>
      <h2>Menu Items</h2>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={styles.searchInput}
      />

      {/* Notification Popup */}
      {notification && (
        <div className={styles.notification}>
          {notification}
        </div>
      )}

      <ul className={styles.menuList}>
        {loading ? (
          // Show skeleton loaders while loading
          [...Array(6)].map((_, index) => (
            <MenuItemSkeleton key={index} />
          ))
        ) : (
          // Show actual menu items when loaded
          menuItems
            .filter(
              (item) =>
                item.isAvailable &&
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            ) // Filter for available items
            .map((item) => (
              <li key={item._id} className={styles.menuItem}>
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    width={300}
                    height={200}
                    style={{ objectFit: "cover" }} // Inline style for better rendering
                  />
                ) : (
                  <div
                    style={{
                      width: 300,
                      height: 200,
                      backgroundColor: "#ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.name}
                  </div>
                )}

                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p>{currencySymbol}{item.price.toFixed(2)}</p>
                  <button
                    onClick={() => addToCart(item)}
                    className={styles.addToCartButton}
                  >
                    Add to Cart
                  </button>
                </div>
              </li>
            ))
        )}
      </ul>
      <Link href="/cart">
        <button className={styles.viewCartButton}>View Cart</button>
      </Link>
    </div>
  );
};

export default MenuList;
