import React, { useEffect, useState } from 'react';
import { load } from "@cashfreepayments/cashfree-js";
import Link from 'next/link';
import '@/styles/Cart.css';

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const [paymentSessionId, setPaymentSessionId] = useState("");
    const [unavailableItems, setUnavailableItems] = useState([]);
    const [notification, setNotification] = useState("");

    useEffect(() => {
        setIsClient(true);
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        // Ensure each item has a quantity of at least 1
        const initializedCart = storedCart.map(item => ({
            ...item,
            quantity: item.quantity || 1,
        }));
        setCart(initializedCart);
        checkItemAvailability(initializedCart);
    }, []);

    // Load Cashfree SDK in sandbox mode
    const initializeSDK = async () => {
        console.log("initSDK reached")
        try {
            const cashfree = await load({ mode: "sandbox" });
            return cashfree;
        } catch (error) {
            console.error("Error loading Cashfree SDK:", error);
            throw error;
        }
    };

    const checkItemAvailability = async (cartItems) => {
        const unavailable = [];
        for (const item of cartItems) {
            const response = await fetch(`/api/menu/${item._id}`);
            const data = await response.json();
            if (!data.isAvailable) {
                unavailable.push(data.name);
            }
        }
        setUnavailableItems(unavailable);
        console.log(unavailableItems)
    };

    // Function to handle the "Buy Now" button click
    const handleBuyNow = async (price) => {
        console.log("hbn",unavailableItems)
        if (unavailableItems.length > 0) {
            checkItemAvailability(cart);
            setNotification(`Please remove the following unavailable items to proceed: ${unavailableItems.join(', ')}`);
            setTimeout(() => setNotification(null), 2000); // Hide notification after 3 seconds
            return;
        }
        try {
            const bodydata = {
                order_id: `order_${new Date().getTime()}`,
                order_amount: price,
                customer_id: `cust_${new Date().getTime()}`,
                customer_phone: "9999999999", // Sample phone number
            }
            console.log(bodydata)

            const response = await fetch("/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodydata),
            });
            const data = await response.json();
            console.log(data)
            if (!data.success) {
                alert("Failed to initiate payment. Please try again.");
                return;
            }

            // Store payment session ID and initiate payment
            setPaymentSessionId(data.data.payment_session_id);
            initiatePayment(data.data.payment_session_id);
        } catch (error) {
            console.error("Network Error:", error);
        }
    };

    // Initiate Cashfree payment process
    const initiatePayment = async (sessionId) => {
        console.log(sessionId)
        const cashfree = await initializeSDK();
        console.log("out")
        const checkoutOptions = {
            paymentSessionId: sessionId,
            redirectTarget: "_self",  // Redirects to the target URL after payment
        };
        console.log("Starting checkout with options:", checkoutOptions);
        cashfree.checkout(checkoutOptions);
    };


    const calculateTotal = () => {
        return cart.reduce((total, item) => {
            const itemTotal = item.price * item.quantity;
            return total + (isNaN(itemTotal) ? 0 : itemTotal);
        }, 0);
    };

    const updateCartItemQuantity = (itemId, quantity) => {
        const updatedCart = cart.map(item =>
            item._id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const removeCartItem = async (itemId) => {
        const itemToRemove = cart.find(item => item._id === itemId).name;
        setUnavailableItems(unavailableItems.filter(item => item !== itemToRemove));
        console.log("rci",unavailableItems)
        const updatedCart = cart.filter(item => item._id !== itemId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update local storage
    };

    const saveCartToLocalStorage = () => {
        localStorage.setItem('cart', JSON.stringify(cart)); // Save the current cart to local storage
    };

    if (!isClient) {
        return null; // Render nothing on the server
    }

    return (
        <div className="cart-container">
            <h2 className="cart-title">Your Cart</h2>
            <ul className="cart-items">
                {cart.map(item => (
                    <li key={item._id} className="cart-item">
                        <button className="remove-button" onClick={() => removeCartItem(item._id)}>Remove</button>
                        <strong>{item.name}</strong>: ${item.price}
                        <div className="quantity-controls">
                            <button
                                className="quantity-button"
                                onClick={() => {
                                    if (item.quantity > 1) {
                                        updateCartItemQuantity(item._id, item.quantity - 1);
                                    }
                                }}
                            >
                                -
                            </button>
                            <input
                                className="quantity-input"
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateCartItemQuantity(item._id, parseInt(e.target.value) || 1)}
                            />
                            <button
                                className="quantity-button"
                                onClick={() => updateCartItemQuantity(item._id, item.quantity + 1)}
                            >
                                +
                            </button>
                            <span className="item-total">= ${item.price * item.quantity}</span>
                        </div>
                    </li>
                ))}
            </ul>
            <h3 className="total">Total: ${calculateTotal()}</h3>
            {notification && (
                <div className="notification">
                    {notification}
                </div>
            )}
            <Link href="/">
                <button className="continue-shopping" onClick={saveCartToLocalStorage}>Continue Shopping</button>
            </Link>
            <button className="pay-now" onClick={() => handleBuyNow(calculateTotal())}>Pay Now</button>
        </div>
    );
};

export default Cart;
