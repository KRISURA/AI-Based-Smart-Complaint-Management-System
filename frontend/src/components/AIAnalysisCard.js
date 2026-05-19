import React from "react";
import "./AIAnalysisCard.css";

const AIAnalysisCard = ({ analysis, loading }) => {
  if (loading) {
    return (
      <div className="ai-card loading">
        <div className="ai-card-header">
          <span className="ai-icon">🤖</span>
          <h3>AI Analysis in Progress...</h3>
        </div>
        <div className="ai-loading-bar">
          <div className="ai-loading-fill"></div>
        </div>
        <p className="ai-loading-text">Analyzing complaint with AI...</p>
      </div>
    );
  }

  if (!analysis) return null;

  const getUrgencyColor = (urgency) => {
    if (!urgency) return "#gray";
    const lower = urgency.toLowerCase();
    if (lower.includes("high")) return "#ea4335";
    if (lower.includes("medium")) return "#fbbc04";
    return "#34a853";
  };

  const getUrgencyBg = (urgency) => {
    if (!urgency) return "#f5f5f5";
    const lower = urgency.toLowerCase();
    if (lower.includes("high")) return "#fce8e6";
    if (lower.includes("medium")) return "#fef9e7";
    return "#e6f4ea";
  };

  return (
    <div className="ai-card">
      <div className="ai-card-header">
        <span className="ai-icon">🤖</span>
        <h3>AI Analysis Results</h3>
        <span className="ai-badge">Powered by AI</span>
      </div>

      <div className="ai-grid">
        {/* Urgency */}
        <div
          className="ai-item urgency"
          style={{
            borderLeft: `4px solid ${getUrgencyColor(analysis.urgency)}`,
            background: getUrgencyBg(analysis.urgency),
          }}
        >
          <div className="ai-item-label">
            <span>⚡</span> Priority Level
          </div>
          <div className="ai-item-value">{analysis.urgency || "Not determined"}</div>
        </div>

        {/* Department */}
        <div className="ai-item department">
          <div className="ai-item-label">
            <span>🏢</span> Responsible Department
          </div>
          <div className="ai-item-value">{analysis.department || "Not determined"}</div>
        </div>

        {/* Summary */}
        <div className="ai-item summary">
          <div className="ai-item-label">
            <span>📋</span> Complaint Summary
          </div>
          <div className="ai-item-value">{analysis.summary || "No summary available"}</div>
        </div>

        {/* Auto Response */}
        <div className="ai-item response">
          <div className="ai-item-label">
            <span>💬</span> Automated Response
          </div>
          <div className="ai-item-value response-text">
            {analysis.autoResponse || "No response generated"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisCard;
