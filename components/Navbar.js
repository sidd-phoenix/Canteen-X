import { useState, useEffect } from "react";
import { FaSun, FaMoon, FaShoppingCart } from "react-icons/fa";
import '../styles/Navbar.css';
import { signIn, signOut, useSession } from "next-auth/react"; // Import NextAuth hooks
import { useUser } from '@/context/UserContext';
import UserProfile from './UserProfile';
import Image from 'next/image';
import Link from 'next/link';
import { useView } from '@/context/ViewContext';
import { useCart } from '@/context/CartContext';

export const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false); // State anirudh for dark mode
  const { data: session, status } = useSession(); // Get session data and status
  const { userDetails } = useUser();
  const [showProfile, setShowProfile] = useState(false);
  const { setView } = useView();
  const { cartCount } = useCart();

  useEffect(() => {
    // If you need to perform any side effects based on cartCount, do it here
    console.log('Cart count updated:', cartCount);
  }, [cartCount]); // Dependency array to run effect when cartCount changes

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode", !isDarkMode); // Toggle dark mode class
    document.body.classList.toggle("light-mode", isDarkMode); // Toggle light mode class
  };

  const handleLogout = () => {
    signOut();
  };
  const handleLogin = () => {
    signIn("google", { callbackUrl: 'http://localhost:3000' });
  };

  const handleProfileClick = () => {
    setView('user_profile');
  };

  const handleLogoClick = () => {
    setView('default');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img
            src="./logo1.jpg"
            alt="CanteenX Logo"
            className="navbar-logo"
            onClick={handleLogoClick}
          />
          <h1>CanteenX</h1>
          {status === "loading" ? (
            <span className="skeleton skeleton-text"></span> // Skeleton for user role
          ) : session ? (
            <span className="user-role">{session.user.role}</span>
          ) : (
            <span></span>
          )}
        </div>

        <div className="nav-buttons">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {isDarkMode ? (
              <FaSun className="sun-icon" />
            ) : (
              <FaMoon />
            )}
          </button>
        </div>

        <div className="navbar-auth">
          {/* <Link href="/cart"> */}
            <a className="cart-icon-container" href='/cart'>
              <FaShoppingCart className="cart-icon" />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </a>
          {/* </Link> */}
          {status === "loading" ? (
            <div className="profile-skeleton-container">
              <div className="skeleton skeleton-circle"></div> {/* Skeleton for profile picture */}
              <div className="skeleton skeleton-btn"></div> {/* Skeleton for button */}
            </div>
          ) : session ? (
            <div className="profile-container">
              <Image
                src={session.user.image || '/default-profile.png'}
                alt="Profile"
                width={40}
                height={40}
                className="profile-icon"
                onClick={handleProfileClick}
              />
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={handleLogin}>
              Login with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
