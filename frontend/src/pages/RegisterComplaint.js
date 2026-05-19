import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AIAnalysisCard from "../components/AIAnalysisCard";
import "./RegisterComplaint.css";

const API_URL = process.env.REACT_APP_API_URL || "";

const CATEGORIES = [
  "Water Supply",
  "Electricity",
  "Roads & Infrastructure",
  "Sanitation & Garbage",
  "Public Safety",
  "Healthcare",
  "Education",
  "Other",
];

const RegisterComplaint = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    title: "",
    description: "",
    category: "",
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [submittedId, setSubmittedId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Step 1: Submit complaint
      const res = await axios.post(`${API_URL}/api/complaints`, formData);
      const complaintId = res.data.complaint._id;
      setSubmittedId(complaintId);
      toast.success("Complaint registered successfully!");

      // Step 2: Run AI analysis
      setAiLoading(true);
      try {
        const aiRes = await axios.post(`${API_URL}/api/ai/analyze`, {
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
        });

        const analysis = aiRes.data.analysis;
        setAiAnalysis(analysis);

        // Step 3: Save AI analysis to complaint
        await axios.put(`${API_URL}/api/complaints/${complaintId}/ai-analysis`, analysis).catch(() => {});
        toast.info("AI analysis completed!");
      } catch (aiError) {
        console.error("AI analysis failed:", aiError);
        toast.warning("Complaint saved but AI analysis failed.");
      } finally {
        setAiLoading(false);
      }
    } catch (error) {
      const errors = error.response?.data?.errors;
      if (errors && errors.length > 0) {
        errors.forEach((err) => toast.error(err.msg));
      } else {
        toast.error(error.response?.data?.message || "Failed to register complaint.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewComplaint = () => {
    navigate(`/complaints/${submittedId}`);
  };

  const handleNewComplaint = () => {
    setFormData({ name: "", email: "", title: "", description: "", category: "", location: "" });
    setAiAnalysis(null);
    setSubmittedId(null);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>📝 Register Complaint</h1>
          <p>Fill in the details below to submit your complaint</p>
        </div>

        {!submittedId ? (
          <form onSubmit={handleSubmit} className="complaint-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Kumar"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. rahul@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="title">Complaint Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Water Leakage Issue"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Ghaziabad, Sector 5"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Complaint Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your complaint in detail..."
                rows={5}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint & Get AI Analysis"}
            </button>
          </form>
        ) : (
          <div className="success-section">
            <div className="success-banner">
              <span className="success-icon">✅</span>
              <div>
                <h3>Complaint Registered Successfully!</h3>
                <p>Complaint ID: <strong>{submittedId}</strong></p>
              </div>
            </div>

            {/* AI Analysis Result */}
            <AIAnalysisCard analysis={aiAnalysis} loading={aiLoading} />

            <div className="success-actions">
              <button onClick={handleViewComplaint} className="btn-view">
                View Complaint Details
              </button>
              <button onClick={handleNewComplaint} className="btn-new">
                Register Another Complaint
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterComplaint;
