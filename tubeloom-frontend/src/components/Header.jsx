import React from "react";
import "./Header.scss";

export default function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="header-top">
        <div className="brand-logo-group">
          <span className="brand-icon" title="TubeLoom AI">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2.5" y="4.5" width="19" height="15" rx="4" strokeOpacity="0.85" />
              <path d="M2.5 12C6 12 7.5 8 12 8S18 16 21.5 12" strokeOpacity="0.45" strokeDasharray="3 2" />
              <path d="M10.5 9.5L15 12L10.5 14.5V9.5Z" fill="currentColor" fillOpacity="0.9" />
            </svg>
          </span>
          <h1 className="brand-title">TubeLoom AI</h1>
        </div>
        <button className="theme-btn" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          )}
        </button>
      </div>
      <p>Cinematic Video Intelligence & Notes</p>
    </header>
  );
}
