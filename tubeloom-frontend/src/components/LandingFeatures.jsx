import React from "react";
import "./LandingFeatures.scss";

export default function LandingFeatures() {
  return (
    <div className="landing-features">
      <div className="feature">
        <span className="feature-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="m8 21 4-4 4 4M12 17v4"/></svg>
        </span>
        <div>
          <strong>Video Summary</strong>
          <span>Get a clear executive summary of any YouTube video in seconds.</span>
        </div>
      </div>
      <div className="feature">
        <span className="feature-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        </span>
        <div>
          <strong>Key Topics</strong>
          <span>Extracts the core topics and actionable takeaways automatically.</span>
        </div>
      </div>
      <div className="feature">
        <span className="feature-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        </span>
        <div>
          <strong>AI Chat</strong>
          <span>Ask anything about the video — get instant, grounded answers.</span>
        </div>
      </div>
    </div>
  );
}
