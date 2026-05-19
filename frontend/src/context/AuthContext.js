import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Use REACT_APP_API_URL for production (Render), fallback to "" for dev (proxy handles it)
const API_URL = process.env.REACT_APP_API_URL || "";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Set axios default auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Load user profile
      fetchProfile();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/profile`);
      setUser(res.data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const signup = async (name, email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/signup`, { name, email, password });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
