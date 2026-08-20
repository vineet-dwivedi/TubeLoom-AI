import React from "react";
import "./UrlForm.scss";

export default function UrlForm({ url, setUrl, loading, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="input-form">
      <input
        type="url"
        placeholder="Paste YouTube Video URL..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Synthesizing...' : 'Summarize'}
      </button>
    </form>
  );
}
