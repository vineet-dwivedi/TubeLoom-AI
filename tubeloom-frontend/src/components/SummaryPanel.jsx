import React from "react";
import "./SummaryPanel.scss";

export default function SummaryPanel({ summary }) {
  if (!summary) return null;

  return (
    <div className="card summary-section">
      <h2>{summary.title_suggestion}</h2>
      <p className="summary-text">{summary.executive_summary}</p>

      <div className="section">
        <h3>Key Topics</h3>
        <ul>
          {summary.key_topics?.map((topic, i) => (
            <li key={i}>{topic}</li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h3>Takeaways</h3>
        <ul>
          {summary.actionable_takeaways?.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
