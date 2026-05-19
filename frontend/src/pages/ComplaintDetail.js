import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import AIAnalysisCard from "../components/AIAnalysisCard";
import "./ComplaintDetail.css";

const API_URL = process.env.REACT_APP_API_URL || "";

const STATUS_OPTIONS = ["Pending", "In Progress", "Resolved", "Rejected"];

const STATUS_COLORS = {
  Pending: { bg: "#fff3e0", color: "#e65100" },
  "In Progress": { bg: "#e3f2fd", color: "#1565c0" },
  Resolved: { bg: "#e6f4ea", color: "#1e7e34" },
  Rejected: { bg: "#fce8e6", color: "#c62828" },
};

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/complaints/${id}`);
      setComplaint(res.data);
      setNewStatus(res.data.status);
    } catch (error) {
      toast.error("Complaint not found");
      navigate("/complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (newStatus === complaint.status) {
      toast.info("Status is already set to " + newStatus);
      return;
    }
    setUpdating(true);
    try {
      const res = await axios.put(`${API_URL}/api/complaints/${id}`, { status: newStatus });
      setComplaint(res.data.complaint);
      toast.success("Status updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleRunAI = async () => {
    setAiLoading(true);
    try {
      const aiRes = await axios.post(`${API_URL}/api/ai/analyze`, {
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        location: complaint.location,
      });
      const analysis = aiRes.data.analysis;

      // Save to complaint
      const updated = await axios.put(`${API_URL}/api/complaints/${id}/ai-analysis`, analysis);
      setComplaint(updated.data.complaint);
      toast.success("AI analysis completed!");
    } catch (error) {
      toast.error("AI analysis failed");
    } finally {
      setAiLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;
    try {
      await axios.delete(`${API_URL}/api/complaints/${id}`);
      toast.success("Complaint deleted successfully");
      navigate("/complaints");
    } catch (error) {
      toast.error("Failed to delete complaint");
    }
  };

  if (loading) {
    return (
      <div className="detail-loading">
        <p>Loading complaint details...</p>
      </div>
    );
  }

  if (!complaint) return null;

  const statusStyle = STATUS_COLORS[complaint.status] || {};

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* Back button */}
        <button className="back-btn" onClick={() => navigate("/complaints")}>
          ← Back to All Complaints
        </button>

        {/* Main Card */}
        <div className="detail-card">
          <div className="detail-top">
            <div>
              <span className="detail-category">{complaint.category}</span>
              <h1 className="detail-title">{complaint.title}</h1>
            </div>
            <span
              className="detail-status"
              style={{ background: statusStyle.bg, color: statusStyle.color }}
            >
              {complaint.status}
            </span>
          </div>

          <div className="detail-meta">
            <div className="meta-item">
              <span className="meta-label">👤 Submitted By</span>
              <span className="meta-value">{complaint.name}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">📧 Email</span>
              <span className="meta-value">{complaint.email}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">📍 Location</span>
              <span className="meta-value">{complaint.location}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">📅 Submitted On</span>
              <span className="meta-value">
                {new Date(complaint.createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="detail-description">
            <h3>Complaint Description</h3>
            <p>{complaint.description}</p>
          </div>

          {/* Status Update (Admin/Logged in users) */}
          {user && (
            <div className="status-update">
              <h3>Update Status</h3>
              <div className="status-controls">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button
                  onClick={handleStatusUpdate}
                  disabled={updating}
                  className="update-btn"
                >
                  {updating ? "Updating..." : "Update Status"}
                </button>
              </div>
            </div>
          )}

          {/* AI Analysis */}
          <div className="ai-section">
            <div className="ai-section-header">
              <h3>AI Analysis</h3>
              <button
                onClick={handleRunAI}
                disabled={aiLoading}
                className="run-ai-btn"
              >
                {aiLoading ? "Analyzing..." : "🤖 Run AI Analysis"}
              </button>
            </div>

            {complaint.aiAnalysis?.urgency ? (
              <AIAnalysisCard analysis={complaint.aiAnalysis} loading={false} />
            ) : (
              <AIAnalysisCard analysis={null} loading={aiLoading} />
            )}

            {!complaint.aiAnalysis?.urgency && !aiLoading && (
              <p className="no-ai-text">No AI analysis yet. Click "Run AI Analysis" to analyze.</p>
            )}
          </div>

          {/* Delete button */}
          {user && (
            <div className="danger-zone">
              <button onClick={handleDelete} className="delete-btn">
                🗑️ Delete Complaint
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;
