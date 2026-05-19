import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>AI-Powered Complaint Management</h1>
          <p>
            Submit your complaints online and get instant AI-based analysis,
            priority detection, and department recommendations.
          </p>
          <div className="hero-buttons">
            <Link to="/register-complaint" className="btn-primary">
              Register Complaint
            </Link>
            <Link to="/complaints" className="btn-secondary">
              View All Complaints
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-icon">🏛️</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Easy Registration</h3>
            <p>Submit complaints with detailed information including category, location, and description.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Analysis</h3>
            <p>Get instant AI-powered priority detection, department recommendation, and auto-response.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Real-time Tracking</h3>
            <p>Track your complaint status from Pending to Resolved with live updates.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>JWT authentication and bcrypt encryption keep your data safe and secure.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-item">
          <div className="stat-number">AI</div>
          <div className="stat-label">Powered Analysis</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">24/7</div>
          <div className="stat-label">Online Access</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">8+</div>
          <div className="stat-label">Categories</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">100%</div>
          <div className="stat-label">Secure</div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="cta">
          <h2>Get Started Today</h2>
          <p>Create an account to track your complaints and get personalized updates.</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-primary">Create Account</Link>
            <Link to="/login" className="btn-outline">Login</Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
