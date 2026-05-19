import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

const API_URL = process.env.REACT_APP_API_URL || "";

const STATUS_COLORS = {
  Pending: { bg: "#fff3e0", color: "#e65100" },
  "In Progress": { bg: "#e3f2fd", color: "#1565c0" },
  Resolved: { bg: "#e6f4ea", color: "#1e7e34" },
  Rejected: { bg: "#fce8e6", color: "#c62828" },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const fetchAllComplaints = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/complaints?limit=100`);
      const all = res.data.complaints;
      setComplaints(all);
      setStats({
        total: all.length,
        pending: all.filter((c) => c.status === "Pending").length,
        inProgress: all.filter((c) => c.status === "In Progress").length,
        resolved: all.filter((c) => c.status === "Resolved").length,
      });
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Header */}
        <div className="dashboard-header">
          <div>
            <h1>Welcome, {user?.name} 👋</h1>
            <p>Here's an overview of all complaints in the system</p>
          </div>
          <Link to="/register-complaint" className="new-complaint-btn">
            + New Complaint
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card total">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <div className="stat-num">{stats.total}</div>
              <div className="stat-lbl">Total Complaints</div>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <div className="stat-num">{stats.pending}</div>
              <div className="stat-lbl">Pending</div>
            </div>
          </div>
          <div className="stat-card progress">
            <div className="stat-icon">🔄</div>
            <div className="stat-info">
              <div className="stat-num">{stats.inProgress}</div>
              <div className="stat-lbl">In Progress</div>
            </div>
          </div>
          <div className="stat-card resolved">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <div className="stat-num">{stats.resolved}</div>
              <div className="stat-lbl">Resolved</div>
            </div>
          </div>
        </div>

        {/* Recent Complaints Table */}
        <div className="recent-section">
          <div className="section-header">
            <h2>Recent Complaints</h2>
            <Link to="/complaints" className="view-all-link">View All →</Link>
          </div>

          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : complaints.length === 0 ? (
            <div className="empty-dashboard">
              <p>No complaints yet.</p>
              <Link to="/register-complaint">Register the first complaint</Link>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="complaints-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.slice(0, 10).map((c) => (
                    <tr key={c._id}>
                      <td className="td-title">{c.title}</td>
                      <td>
                        <span className="td-category">{c.category}</span>
                      </td>
                      <td>{c.location}</td>
                      <td>
                        <span
                          className="td-status"
                          style={{
                            background: STATUS_COLORS[c.status]?.bg,
                            color: STATUS_COLORS[c.status]?.color,
                          }}
                        >
                          {c.status}
                        </span>
                      </td>
                      <td>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                      <td>
                        <Link to={`/complaints/${c._id}`} className="td-link">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
