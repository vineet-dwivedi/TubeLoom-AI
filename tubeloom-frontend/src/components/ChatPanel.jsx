import React from "react";
import FormattedText from "./FormattedText";
import "./ChatPanel.scss";

export default function ChatPanel({
  question,
  setQuestion,
  chatLoading,
  chatHistory,
  onAsk,
}) {
  return (
    <div className="card chat-section">
      <h3>Video Q&A</h3>
      <form onSubmit={onAsk} className="chat-input-form">
        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button type="submit" disabled={chatLoading}>
          {chatLoading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      <div className="chat-history">
        {chatHistory.length === 0 ? (
          <p className="empty-chat">Ask anything about the video content above.</p>
        ) : (
          chatHistory.map((chat, idx) => (
            <div key={idx} className="chat-card">
              <p className="chat-q"><strong>Q:</strong> {chat.q}</p>
              <div className="chat-a"><FormattedText text={chat.a} /></div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
