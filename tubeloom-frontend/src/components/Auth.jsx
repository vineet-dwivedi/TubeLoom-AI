import React, { useState, useRef, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './Auth.scss';

export default function Auth({ user, onGoogleSuccess, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="auth-container" ref={dropdownRef}>
      {user ? (
        <div className="user-profile-wrapper">
          <button 
            className="user-profile-btn" 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            aria-label="User menu"
          >
            {user.picture ? (
              <img src={user.picture} alt={user.name || "User avatar"} className="user-avatar" />
            ) : (
              <div className="user-avatar-fallback">
                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <span className="user-name">{user.name || user.email.split('@')[0]}</span>
            <svg 
              className={`dropdown-chevron ${dropdownOpen ? 'open' : ''}`}
              width="14" 
              height="14" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="user-dropdown-menu">
              <div className="user-info-header">
                <p className="user-full-name">{user.name || 'User'}</p>
                <p className="user-email">{user.email}</p>
              </div>
              <div className="dropdown-divider" />
              <button 
                className="dropdown-item logout-btn" 
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout();
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="google-login-btn-wrapper">
          <GoogleLogin
            onSuccess={onGoogleSuccess}
            onError={() => alert('Google Sign-In failed. Please try again.')}
            theme="outline"
            size="medium"
            shape="pill"
            text="signin_with"
          />
        </div>
      )}
    </div>
  );
}
