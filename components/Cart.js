import React, { useEffect, useState } from 'react';
import { load } from "@cashfreepayments/cashfree-js";
import { useSession, signIn } from 'next-auth/react';
import Link from 'next/link';
import '@/styles/Cart.css';
import '@/styles/OrderHistorySkeleton.module.css'; // Import the skeleton styles

const Cart = () => {
    const { data: session, status } = useSession();
    const [cart, setCart] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const [paymentSessionId, setPaymentSessionId] = useState("");
    const [unavailableItems, setUnavailableItems] = useState([]);
    const [notification, setNotification] = useState("");
    const currencySymbol="₹";

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

        // Check localStorage for theme preference on component mount
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.body.classList.toggle("dark-mode", savedTheme === 'dark');
            document.body.classList.toggle("light-mode", savedTheme === 'light');
        }
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
    };

    // Function to handle the "Buy Now" button click
    const handleBuyNow = async (price) => {
        // Check if the user is logged in using NextAuth session
        const isLoggedIn = session;
        // console.log("User logged in status:", isLoggedIn);
        // console.log("User session data:", session); 

        if (!isLoggedIn) {
            setNotification("You must be logged in to proceed with payment.");
            setTimeout(() => setNotification(null), 2000); // Hide notification after 2 seconds
            return;
        }
        
        // console.log("unavailable:", unavailableItems);
        if (unavailableItems.length > 0) {
            checkItemAvailability(cart);
            setNotification(`Please remove the following unavailable items to proceed: ${unavailableItems.join(', ')}`);
            setTimeout(() => setNotification(null), 2000); // Hide notification after 2 seconds
            return;
        }

        if(cart.length<=0){
            setNotification(`No items in Cart`);
            setTimeout(() => setNotification(null), 2000); // Hide notification after 2 seconds
            return;
        }

        // Proceed with payment since the user is logged in
        try {
            // Generate daily order number
            const orderNumberResponse = await fetch('/api/orders/generateOrderNumber', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const orderNumberData = await orderNumberResponse.json();

            if (!orderNumberData.success) {
                alert("Failed to generate order number. Please try again.");
                return;
            }

            // Fetch customer_id using the email from the session
            const email = session.user.email;
            const customerResponse = await fetch(`/api/cust_id`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            const customerData = await customerResponse.json();

            if (!customerData.success) {
                alert("Failed to fetch customer ID. Please try again.");
                return;
            }

            const customer_id = customerData.customer_id;
            const customer_name = customerData.customer_name || session.user.name; // Use API data or fallback to session
            const customer_email = customerData.customer_email || session.user.email; // Use API data or fallback to session
            const dailyOrderNumber = orderNumberData.dailyOrderNumber; // Get the generated daily order number

            // Transform the cart into the required structure
            const cartDetails = {
                cart_name: "My Cart", // Set the name of the cart
                shipping_charge: 50, // Example shipping charge, adjust as necessary
                cart_items: cart.map(item => ({
                    assignedCounter: item.assignedCounter,
                    item_id: item._id, // Unique identifier of the item
                    item_name: item.name, // Name of the item
                    item_currency: "INR", // Currency of the item
                    item_description: String(item.assignedCounter) || "No description available", // Description of the item
                    item_details_url: item.detailsUrl || "", // Item details URL
                    item_discounted_unit_price: item.discountedPrice || item.price, // Discounted price
                    item_original_unit_price: item.price, // Original price
                    item_quantity: item.quantity, // Quantity of that item
                    item_image_url: item.imageUrl || "", // Item image URL
                    item_tags: item.tags || [], // Tags attached to that item
                })),
            };

            const bodydata = {
                order_id: `order_${new Date().getTime()}`,
                order_amount: price,
                customer_id: customer_id, // Use the fetched customer_id
                customer_phone: "9999999999", // Sample phone number
                customer_name: customer_name, // Use the fetched customer_name
                customer_email: customer_email, // Use the fetched customer_email
                dailyOrderNumber: dailyOrderNumber, // Include the daily order number
                cart_details: cartDetails, // Use the transformed cart details
            };
            // console.log(bodydata);

            const response = await fetch("/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodydata),
            });
            const data = await response.json();
            // console.log(data);
            if (!data.success) {
                alert("Failed to initiate payment. Please try again.");
                return;
            }

            // Store payment session ID and initiate payment
            setPaymentSessionId(data.data.payment_session_id);
            
            // Create order in database after successful payment initiation
            const orderData = {
                customerId: customer_id,
                dailyOrderNumber: dailyOrderNumber,
                items: cart.map(item => ({
                    menuItemId: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    assignedCounter: item.assignedCounter,
                    status: 'pending'
                })),
                totalAmount: price,
                status: 'pending',
                placedAt: new Date()
            };

            const orderResponse = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            const orderResult = await orderResponse.json();
            if (!orderResult.success) {
                console.error("Failed to create order in database:", orderResult.message);
                // Continue with payment even if order creation fails
            }

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
        // console.log("rci",unavailableItems)
        const updatedCart = cart.filter(item => item._id !== itemId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart)); // Update local storage
    };

    const saveCartToLocalStorage = () => {
        localStorage.setItem('cart', JSON.stringify(cart)); // Save the current cart to local storage
    };

    const handleLogin = () => {
        signIn("google", { callbackUrl: '/cart' });
    };

    if (!isClient) {
        return null; // Render nothing on the server
    }

    // Show login prompt if user is not logged in
    if (status === "loading") {
        return (
            <div className="cart-container">
                <h2 className="cart-title">Your Cart</h2>
                <p>Loading...</p>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="cart-container">
                <h2 className="cart-title">Your Cart</h2>
                <div className="login-prompt">
                    <p>Please log in to view your cart and place orders.</p>
                    <button className="login-btn" onClick={handleLogin}>
                        Login with Google
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2 className="cart-title">Your Cart</h2>
            <ul className="cart-items">
                {cart.map(item => (
                    <li key={item._id} className="cart-item">
                        <button className="remove-button" onClick={() => removeCartItem(item._id)}>Remove</button>
                        <strong>{item.name}</strong>: {currencySymbol}{item.price}
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
                            <span className="item-total">= {currencySymbol}{item.price * item.quantity}</span>
                        </div>
                    </li>
                ))}
            </ul>
            <h3 className="total">Total: {currencySymbol}{calculateTotal()}</h3>
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
