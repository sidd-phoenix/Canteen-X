import { useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa"
import '../styles/Navbar.css';
import { signIn, signOut, useSession } from "next-auth/react"; // Import NextAuth hooks

export const Navbar = () => {

  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const { data: session } = useSession(); // Get session data

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark-mode", !isDarkMode); // Toggle dark mode class
    document.body.classList.toggle("light-mode", isDarkMode); // Toggle light mode class
  };

  const handleClick = () => {
    if (session) {
      signOut(); // Sign out if user is logged in
    } else {
      signIn("google", { callbackUrl: 'http://localhost:3000' }); // Sign in with Google
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src='./logo1.jpg' alt="CanteenX Logo" className="navbar-logo" />
          <h1>CanteenX</h1>
          {session ? (
            <span className="user-role">{session.user.role}</span>
          ) : (
            <span></span>
          )
          }
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
              <img
                src={session.user.image}
                alt="Profile"
                className="profile-pic"
              />
              <button className="logout-btn" onClick={handleClick}>
                Logout
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={handleClick}>
              Login with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
