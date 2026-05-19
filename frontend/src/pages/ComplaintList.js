import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./ComplaintList.css";

const API_URL = process.env.REACT_APP_API_URL || "";

const CATEGORIES = [
  "All",
  "Water Supply",
  "Electricity",
  "Roads & Infrastructure",
  "Sanitation & Garbage",
  "Public Safety",
  "Healthcare",
  "Education",
  "Other",
];

const STATUS_COLORS = {
  Pending: { bg: "#fff3e0", color: "#e65100" },
  "In Progress": { bg: "#e3f2fd", color: "#1565c0" },
  Resolved: { bg: "#e6f4ea", color: "#1e7e34" },
  Rejected: { bg: "#fce8e6", color: "#c62828" },
};

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [total, setTotal] = useState(0);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/api/complaints`;
      const params = {};

      if (selectedCategory !== "All") params.category = selectedCategory;

      const res = await axios.get(url, { params });
      setComplaints(res.data.complaints);
      setTotal(res.data.total);
    } catch (error) {
      toast.error("Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const searchComplaints = async () => {
    if (!searchInput.trim()) {
      fetchComplaints();
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/complaints/search?location=${searchInput}`);
      setComplaints(res.data.complaints);
      setTotal(res.data.total);
      setSearchLocation(searchInput);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedCategory]);

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") searchComplaints();
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchLocation("");
    fetchComplaints();
  };

  return (
    <div className="list-page">
      <div className="list-container">
        <div className="list-header">
          <h1>📋 All Complaints</h1>
          <p>Total: <strong>{total}</strong> complaints found</p>
        </div>

        {/* Filters */}
        <div className="filters">
          {/* Search by location */}
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by location..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <button onClick={searchComplaints} className="search-btn">🔍</button>
            {searchLocation && (
              <button onClick={clearSearch} className="clear-btn">✕ Clear</button>
            )}
          </div>

          {/* Category filter */}
          <div className="category-filters">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`cat-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  setSearchLocation("");
                  setSearchInput("");
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="spinner-large">⏳</div>
            <p>Loading complaints...</p>
          </div>
        ) : complaints.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No complaints found</h3>
            <p>
              {searchLocation
                ? `No complaints found in "${searchLocation}"`
                : "No complaints match the selected filter"}
            </p>
            <Link to="/register-complaint" className="btn-register">
              Register First Complaint
            </Link>
          </div>
        ) : (
          <div className="complaints-grid">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="complaint-card">
                <div className="card-top">
                  <span className="card-category">{complaint.category}</span>
                  <span
                    className="card-status"
                    style={{
                      background: STATUS_COLORS[complaint.status]?.bg || "#f5f5f5",
                      color: STATUS_COLORS[complaint.status]?.color || "#333",
                    }}
                  >
                    {complaint.status}
                  </span>
                </div>

                <h3 className="card-title">{complaint.title}</h3>
                <p className="card-description">
                  {complaint.description.length > 100
                    ? complaint.description.substring(0, 100) + "..."
                    : complaint.description}
                </p>

                <div className="card-meta">
                  <span>👤 {complaint.name}</span>
                  <span>📍 {complaint.location}</span>
                  <span>📅 {new Date(complaint.createdAt).toLocaleDateString("en-IN")}</span>
                </div>

                {complaint.aiAnalysis?.urgency && (
                  <div className="card-ai-badge">
                    🤖 AI: {complaint.aiAnalysis.urgency.split(" - ")[0]}
                  </div>
                )}

                <Link to={`/complaints/${complaint._id}`} className="card-link">
                  View Details →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintList;
