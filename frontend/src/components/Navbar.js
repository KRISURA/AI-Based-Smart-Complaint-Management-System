import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-icon">🏛️</span>
          <span className="brand-text">SmartComplaint</span>
        </Link>
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      <ul className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <li>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
        </li>
        <li>
          <Link to="/complaints" onClick={() => setMenuOpen(false)}>All Complaints</Link>
        </li>
        <li>
          <Link to="/register-complaint" onClick={() => setMenuOpen(false)}>
            Register Complaint
          </Link>
        </li>
        {user ? (
          <>
            <li>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
            </li>
            <li>
              <button className="btn-logout" onClick={handleLogout}>
                Logout ({user.name})
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            </li>
            <li>
              <Link to="/signup" className="btn-signup" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
