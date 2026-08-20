import React from 'react';
import './HistorySidebar.scss';

export default function HistorySidebar({
  isOpen,
  onClose,
  history = [],
  loading = false,
  user,
  onSelectHistoryItem,
  onDeleteHistoryItem,
  onGoogleSuccess
}) {
  if (!isOpen) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div className="sidebar-backdrop" onClick={onClose} aria-label="Close sidebar" />

      {/* Sliding Sidebar Drawer */}
      <aside className="history-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-title-group">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <h2>Video History</h2>
            {history.length > 0 && <span className="history-count">{history.length}</span>}
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close history">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="sidebar-content">
          {!user ? (
            <div className="guest-history-prompt">
              <div className="prompt-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3>Save & View Your History</h3>
              <p>Sign in with your Google account using the top header button to automatically store and access your processed video summaries anytime.</p>
            </div>
          ) : loading ? (
            <div className="history-skeleton-list">
              {[1, 2, 3].map((i) => (
                <div key={i} className="history-skeleton-card">
                  <div className="skeleton-thumb" />
                  <div className="skeleton-lines">
                    <div className="skeleton-line long" />
                    <div className="skeleton-line short" />
                  </div>
                </div>
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="empty-history">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
              <h3>No History Saved Yet</h3>
              <p>Enter any YouTube video link above to generate notes. Your past searches will be saved here automatically.</p>
            </div>
          ) : (
            <div className="history-list">
              {history.map((item, idx) => (
                <div 
                  key={item._id || idx} 
                  className="history-item-card"
                  onClick={() => {
                    onSelectHistoryItem(item);
                    onClose();
                  }}
                >
                  <div className="history-thumb-wrapper">
                    {item.video_id ? (
                      <img 
                        src={`https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`} 
                        alt={item.title || 'Video thumbnail'} 
                        className="history-thumb"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="history-thumb-placeholder">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="history-item-info">
                    <h4 className="history-item-title">{item.title || 'Untitled Video'}</h4>
                    {item.created_at && (
                      <span className="history-item-date">{formatDate(item.created_at)}</span>
                    )}
                    {item.executive_summary && (
                      <p className="history-item-snippet">{item.executive_summary}</p>
                    )}
                  </div>

                  {onDeleteHistoryItem && item._id && (
                    <button
                      className="delete-item-btn"
                      title="Delete item"
                      aria-label="Delete history item"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteHistoryItem(item._id);
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
