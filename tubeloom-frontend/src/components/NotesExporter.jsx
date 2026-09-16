import React, {useRef, useState} from 'react';
import html2pdf from 'html2pdf.js';
import './NotesExporter.scss';

export default function NotesExporter({videoTitle, summaryData, historyId}) {
    const [userNotes, setUserNotes] = useState('');
    const printRef = useRef();

    const handleDownloadPDF = () => {
        const element = printRef.current;
        const opt = {
            margin: 10,
            filename: `${videoTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.pdf`,
            image: {type: 'jpeg', quality: 0.98},
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }
        html2pdf().from(element).set(opt).save();
    };

    return (
    <div className="notes-container">
      {/* Notes Input Area */}
      <div className="editor-section">
        <h3 className="text-xl font-bold mb-2">Personal Study Notes</h3>
        <textarea
          className="w-full p-3 border rounded-lg bg-gray-900 text-white"
          rows="5"
          placeholder="Add your key insights or custom notes here..."
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
        />
        <button
          onClick={handleDownloadPDF}
          className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700"
        >
          📄 Download Formatted PDF
        </button>
      </div>

      {/* Hidden/Formatted Printable Template */}
      <div style={{ display: "none" }}>
        <div ref={printRef} style={{ padding: "20px", fontFamily: "Arial, sans-serif", color: "#111" }}>
          <div style={{ borderBottom: "2px solid #6366f1", paddingBottom: "10px", marginBottom: "20px" }}>
            <h1 style={{ fontSize: "22px", color: "#4f46e5", margin: 0 }}>TubeLoom AI Notes</h1>
            <h2 style={{ fontSize: "16px", color: "#374151", marginTop: "5px" }}>{videoTitle}</h2>
          </div>

          {/* AI Executive Summary */}
          {summaryData?.executive_summary && (
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "14px", color: "#111827", textTransform: "uppercase" }}>Executive Summary</h3>
              <p style={{ fontSize: "12px", lineHeight: "1.6", color: "#4b5563" }}>
                {summaryData.executive_summary}
              </p>
            </div>
          )}

          {/* User Custom Notes Section */}
          {userNotes && (
            <div style={{ marginTop: "20px", backgroundColor: "#f9fafb", padding: "12px", borderRadius: "6px" }}>
              <h3 style={{ fontSize: "14px", color: "#4f46e5" }}>My Custom Notes</h3>
              <p style={{ fontSize: "12px", lineHeight: "1.6", whitespace: "pre-wrap" }}>
                {userNotes}
              </p>
            </div>
          )}

          <footer style={{ marginTop: "30px", borderTop: "1px solid #e5e7eb", paddingTop: "10px", fontSize: "10px", color: "#9ca3af", textAlign: "center" }}>
            Generated via TubeLoom AI • {new Date().toLocaleDateString()}
          </footer>
        </div>
      </div>
    </div>
  );
}