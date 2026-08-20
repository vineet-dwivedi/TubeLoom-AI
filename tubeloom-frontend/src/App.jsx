import React, { useState, useEffect } from "react";
import { processVideo, askQuestion, getUserHistory, deleteHistoryItem } from "./services/api.js";
import { authenticateWithGoogle, saveUserSession, getUserSession, clearUserSession } from "./services/authService.js";

import Header from "./components/Header";
import UrlForm from "./components/UrlForm";
import LandingFeatures from "./components/LandingFeatures";
import VideoPlayer from "./components/VideoPlayer";
import SummaryPanel from "./components/SummaryPanel";
import ChatPanel from "./components/ChatPanel";
import HistorySidebar from "./components/HistorySidebar";

import "./App.scss";
import { googleLogout } from "@react-oauth/google";

export default function App() {
  // Authentication
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = getUserSession();
    if (savedUser) setUser(savedUser);
  }, []);

  // Navigation & Browser History Sync
  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ page: 'home' }, '', window.location.pathname);
    }

    const handlePopState = (e) => {
      if (!e.state || e.state.page === 'home') {
        setSummary(null);
        setUrl('');
        setChatHistory([]);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleGoHome = () => {
    setSummary(null);
    setUrl('');
    setChatHistory([]);
    if (window.history.state?.page === 'summary') {
      window.history.pushState({ page: 'home' }, '', window.location.pathname);
    }
  };

  // History state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchHistory = async (googleId) => {
    if (!googleId) {
      setHistory([]);
      return;
    }
    setHistoryLoading(true);
    try {
      const data = await getUserHistory(googleId);
      setHistory(data || []);
    } catch (err) {
      console.error("Failed to load user history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (user?.google_id) {
      fetchHistory(user.google_id);
    } else {
      setHistory([]);
    }
  }, [user]);

  const handleDeleteHistoryItem = async (itemId) => {
    if (!user?.google_id) return;
    try {
      await deleteHistoryItem(user.google_id, itemId);
      setHistory((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error("Failed to delete history item:", err);
      alert("Failed to delete history item.");
    }
  };

  // Auth Handling Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const userData = await authenticateWithGoogle(credentialResponse.credential);
      setUser(userData);
      saveUserSession(userData);
    } catch (err) {
      console.error("Auth error:", err);
      alert("Authentication failed. Please try again.");
    }
  };

  // Auth Handling Logout
  const handleLogout = () => {
    googleLogout();
    clearUserSession();
    setUser(null);
    setHistory([]);
  };

  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const [question, setQuestion] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  const getYouTubeId = (videoUrl) => {
    if (!videoUrl) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleProcess = async (e) => {
    e.preventDefault();
    if (!url) return;
    setLoading(true);

    try {
      const data = await processVideo(url, user?.google_id);
      setSummary(data);
      window.history.pushState({ page: 'summary', url }, '', window.location.pathname);

      if (user?.google_id) {
        fetchHistory(user.google_id);
      }
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to process video');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistoryItem = (item) => {
    if (item.video_url) setUrl(item.video_url);
    if (item.summary) {
      setSummary(item.summary);
    } else {
      setSummary({
        title_suggestion: item.title || "Saved Summary",
        executive_summary: item.executive_summary || "",
        key_takeaways: item.key_takeaways || [],
        timestamped_breakdown: item.timestamped_breakdown || []
      });
    }
    setChatHistory([]);
    window.history.pushState({ page: 'summary', url: item.video_url }, '', window.location.pathname);
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question || !url) return;
    setChatLoading(true);
    const qText = question;
    setQuestion('');

    try {
      const res = await askQuestion(url, qText);
      setChatHistory((prev) => [...prev, { q: qText, a: res.answer }]);
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to fetch answer');
    } finally {
      setChatLoading(false);
    }
  };

  const videoId = getYouTubeId(url);

  // Theme selection
  const getInitialTheme = () => {
    try { const s = localStorage.getItem('tubeloom-theme'); if (s) return s; } catch {}
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('tubeloom-theme', theme); } catch {}
  }, [theme]);

  const handleToggleTheme = (e) => {
    if (!document.startViewTransition) { setTheme(t => t === 'dark' ? 'light' : 'dark'); return; }
    const x = e?.clientX ?? window.innerWidth / 2;
    const y = e?.clientY ?? window.innerHeight / 2;
    const r = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    const dark = theme === 'dark';
    const tr = document.startViewTransition(() => setTheme(dark ? 'light' : 'dark'));
    tr.ready.then(() => {
      const clip = [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`];
      document.documentElement.animate(
        { clipPath: dark ? [...clip].reverse() : clip },
        { duration: 420, easing: 'ease', pseudoElement: dark ? '::view-transition-old(root)' : '::view-transition-new(root)' }
      );
    });
  };

  return (
    <div className="app-container">
      <Header
        theme={theme}
        onToggleTheme={handleToggleTheme}
        user={user}
        onGoogleSuccess={handleGoogleSuccess}
        onLogout={handleLogout}
        onToggleHistory={() => setIsHistoryOpen(prev => !prev)}
        historyCount={history.length}
        onGoHome={handleGoHome}
      />

      <HistorySidebar
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        loading={historyLoading}
        user={user}
        onSelectHistoryItem={handleSelectHistoryItem}
        onDeleteHistoryItem={handleDeleteHistoryItem}
        onGoogleSuccess={handleGoogleSuccess}
      />

      <UrlForm
        url={url}
        setUrl={setUrl}
        loading={loading}
        onSubmit={handleProcess}
      />

      {!summary && <LandingFeatures />}

      {summary && (
        <div className="main-content">
          <VideoPlayer videoId={videoId} />

          <div className="split-grid">
            <SummaryPanel summary={summary} />
            <ChatPanel
              question={question}
              setQuestion={setQuestion}
              chatLoading={chatLoading}
              chatHistory={chatHistory}
              onAsk={handleAsk}
            />
          </div>
        </div>
      )}
    </div>
  );
}