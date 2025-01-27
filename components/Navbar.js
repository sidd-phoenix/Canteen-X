import { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa"
import '../styles/Navbar.css';
import { signIn, signOut, useSession } from "next-auth/react"; // Import NextAuth hooks
import { useUser } from '@/context/UserContext';
import UserProfile from './UserProfile';
import Image from 'next/image';
import Link from 'next/link';
import { useView } from '@/context/ViewContext';

export const Navbar = () => {

  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const { data: session } = useSession(); // Get session data
  const { userDetails } = useUser();
  const [showProfile, setShowProfile] = useState(false);
  const { setView } = useView();

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
            src='./logo1.jpg'
            alt="CanteenX Logo"
            className="navbar-logo"
            onClick={handleLogoClick}
          />
          <h1>CanteenX</h1>
          {session ? (
            <span className="user-role">{session.user.role}</span>
          ) : (
            <span></span>
          )}
        </div>
        <div className="nav-buttons">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {isDarkMode ? (
              <FaSun className="sun-icon"/>
            ) : (
              <FaMoon />
            )}
          </button>
        </div>
        <div className="navbar-auth">
          {session ? (
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
  )
}

export default Navbar;
