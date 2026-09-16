import React, { useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import './NotesExporter.scss';

/* ── Inline SVG Icons (minimal, stroke-based) ── */

const IconNotes = () => (
  <svg className="notes-exporter__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const IconDownload = () => (
  <svg className="notes-exporter__btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

export default function NotesExporter({ videoTitle, summaryData }) {
  const [userNotes, setUserNotes] = useState('');
  const [status, setStatus] = useState('');
  const printRef = useRef();

  // Section toggles — user picks what goes into the PDF
  const [sections, setSections] = useState({
    summary: true,
    topics: true,
    takeaways: true,
    notes: true,
  });

  const toggleSection = (key) =>
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleDownloadPDF = () => {
    const element = printRef.current;
    if (!element) return;

    setStatus('Generating PDF…');

    const opt = {
      margin: [12, 14, 12, 14],
      filename: `${(videoTitle || 'tubeloom_notes').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_notes.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .then(() => {
        setStatus('PDF saved ✓');
        setTimeout(() => setStatus(''), 2500);
      })
      .catch(() => {
        setStatus('Export failed');
        setTimeout(() => setStatus(''), 3000);
      });
  };

  /* ── Shared inline styles for the PDF template ── */
  const pdf = {
    page: {
      padding: '28px 32px',
      fontFamily: "'DM Sans', 'Segoe UI', Arial, sans-serif",
      color: '#1a1a19',
      fontSize: '12px',
      lineHeight: '1.7',
    },
    headerBar: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      borderBottom: '2px solid #2c2c29',
      paddingBottom: '14px',
      marginBottom: '24px',
    },
    logoMark: {
      width: '28px',
      height: '28px',
      borderRadius: '6px',
      background: '#1a1a19',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    brand: {
      fontSize: '18px',
      fontWeight: '600',
      letterSpacing: '-0.02em',
      color: '#1a1a19',
      margin: 0,
    },
    videoTitle: {
      fontSize: '14px',
      color: '#555',
      fontWeight: '400',
      marginTop: '4px',
      margin: 0,
    },
    sectionLabel: {
      fontSize: '9px',
      fontWeight: '600',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: '#999',
      marginBottom: '10px',
      marginTop: '0',
      fontFamily: "'DM Mono', 'Courier New', monospace",
    },
    paragraph: {
      fontSize: '12px',
      lineHeight: '1.8',
      color: '#444',
      margin: '0 0 20px 0',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '22px',
      fontSize: '11.5px',
    },
    th: {
      textAlign: 'left',
      padding: '8px 12px',
      fontSize: '9px',
      fontWeight: '600',
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: '#888',
      borderBottom: '1.5px solid #ddd',
      fontFamily: "'DM Mono', 'Courier New', monospace",
    },
    tdIndex: {
      padding: '9px 12px',
      color: '#aaa',
      fontFamily: "'DM Mono', 'Courier New', monospace",
      fontSize: '10px',
      width: '40px',
      verticalAlign: 'top',
    },
    tdContent: {
      padding: '9px 12px',
      color: '#333',
      lineHeight: '1.65',
    },
    trEven: {
      backgroundColor: '#fafaf8',
    },
    trOdd: {
      backgroundColor: '#fff',
    },
    takeawayItem: {
      display: 'flex',
      gap: '10px',
      marginBottom: '8px',
      fontSize: '12px',
      lineHeight: '1.7',
      color: '#444',
    },
    takeawayNum: {
      color: '#aaa',
      fontFamily: "'DM Mono', 'Courier New', monospace",
      fontSize: '10px',
      flexShrink: 0,
      minWidth: '18px',
    },
    userNotesBox: {
      backgroundColor: '#f5f5f2',
      padding: '16px 18px',
      borderRadius: '6px',
      marginBottom: '22px',
      border: '1px solid #e8e7e3',
    },
    userNotesText: {
      fontSize: '12px',
      lineHeight: '1.8',
      color: '#444',
      whiteSpace: 'pre-wrap',
      margin: 0,
    },
    footer: {
      marginTop: '32px',
      borderTop: '1px solid #e5e5e0',
      paddingTop: '12px',
      fontSize: '9px',
      color: '#bbb',
      textAlign: 'center',
      letterSpacing: '0.06em',
      fontFamily: "'DM Mono', 'Courier New', monospace",
    },
  };

  const hasTopics = summaryData?.key_topics?.length > 0;
  const hasTakeaways = summaryData?.actionable_takeaways?.length > 0;
  const hasSummary = !!summaryData?.executive_summary;
  const hasNotes = !!userNotes.trim();

  return (
    <div className="notes-exporter">
      {/* ── Header ── */}
      <div className="notes-exporter__header">
        <IconNotes />
        <h3 className="notes-exporter__title">Study Notes</h3>
      </div>

      {/* ── Editor ── */}
      <textarea
        className="notes-exporter__editor"
        rows="5"
        placeholder="Add your key insights or custom notes here…"
        value={userNotes}
        onChange={(e) => setUserNotes(e.target.value)}
      />

      <hr className="notes-exporter__divider" />

      {/* ── PDF Section Toggles ── */}
      <div className="notes-exporter__toggles">
        {hasSummary && (
          <label className="notes-exporter__toggle">
            <input type="checkbox" checked={sections.summary} onChange={() => toggleSection('summary')} />
            Summary
          </label>
        )}
        {hasTopics && (
          <label className="notes-exporter__toggle">
            <input type="checkbox" checked={sections.topics} onChange={() => toggleSection('topics')} />
            Topics table
          </label>
        )}
        {hasTakeaways && (
          <label className="notes-exporter__toggle">
            <input type="checkbox" checked={sections.takeaways} onChange={() => toggleSection('takeaways')} />
            Takeaways
          </label>
        )}
        {hasNotes && (
          <label className="notes-exporter__toggle">
            <input type="checkbox" checked={sections.notes} onChange={() => toggleSection('notes')} />
            My notes
          </label>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="notes-exporter__actions">
        <button className="notes-exporter__btn" onClick={handleDownloadPDF}>
          <IconDownload />
          Download PDF
        </button>
        {status && <span className="notes-exporter__status">{status}</span>}
      </div>

      {/* ═══════════════════════════════════════════════
          Hidden PDF Template — rendered off-screen
          ═══════════════════════════════════════════════ */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <div ref={printRef} style={pdf.page}>
          {/* ── PDF Header ── */}
          <div style={pdf.headerBar}>
            <div style={pdf.logoMark}>
              {/* Minimal "T" logo mark */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="12" y1="6" x2="12" y2="20" />
              </svg>
            </div>
            <div>
              <h1 style={pdf.brand}>TubeLoom AI</h1>
              <p style={pdf.videoTitle}>{videoTitle}</p>
            </div>
          </div>

          {/* ── Executive Summary ── */}
          {hasSummary && sections.summary && (
            <div>
              <h3 style={pdf.sectionLabel}>Executive Summary</h3>
              <p style={pdf.paragraph}>{summaryData.executive_summary}</p>
            </div>
          )}

          {/* ── Key Topics Table ── */}
          {hasTopics && sections.topics && (
            <div>
              <h3 style={pdf.sectionLabel}>Key Topics</h3>
              <table style={pdf.table}>
                <thead>
                  <tr>
                    <th style={pdf.th}>#</th>
                    <th style={pdf.th}>Topic</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.key_topics.map((topic, i) => (
                    <tr key={i} style={i % 2 === 0 ? pdf.trEven : pdf.trOdd}>
                      <td style={pdf.tdIndex}>{String(i + 1).padStart(2, '0')}</td>
                      <td style={pdf.tdContent}>{topic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Actionable Takeaways ── */}
          {hasTakeaways && sections.takeaways && (
            <div style={{ marginBottom: '22px' }}>
              <h3 style={pdf.sectionLabel}>Actionable Takeaways</h3>
              {summaryData.actionable_takeaways.map((item, i) => (
                <div key={i} style={pdf.takeawayItem}>
                  <span style={pdf.takeawayNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {/* ── User Notes ── */}
          {hasNotes && sections.notes && (
            <div>
              <h3 style={pdf.sectionLabel}>Personal Notes</h3>
              <div style={pdf.userNotesBox}>
                <p style={pdf.userNotesText}>{userNotes}</p>
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <footer style={pdf.footer}>
            Generated via TubeLoom AI &nbsp;·&nbsp; {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </footer>
        </div>
      </div>
    </div>
  );
}