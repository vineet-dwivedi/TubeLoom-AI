/**
 * FormattedText.jsx
 * Lightweight markdown renderer for AI chat responses.
 * Handles: **bold**, *bullets, paragraph breaks.
 * No external dependencies.
 */

import React from "react";
import "./FormattedText.scss";

function parseLine(line, keyPrefix) {
  // Split on **bold** markers
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`${keyPrefix}-b${i}`}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export default function FormattedText({ text }) {
  if (!text) return null;

  // Split into bullet groups and normal paragraphs
  const lines = text.split(/\n/);
  const blocks = [];
  let bulletBuffer = [];

  const flushBullets = () => {
    if (bulletBuffer.length > 0) {
      blocks.push({ type: "bullets", items: [...bulletBuffer] });
      bulletBuffer = [];
    }
  };

  lines.forEach((raw, i) => {
    const line = raw.trim();

    // Bullet: starts with "* " or "- "
    if (/^\*\s+/.test(line) || /^-\s+/.test(line)) {
      bulletBuffer.push(line.replace(/^[\*\-]\s+/, ""));
    } else if (line === "") {
      flushBullets();
      // skip empty lines (they become paragraph spacing via CSS gap)
    } else {
      flushBullets();
      blocks.push({ type: "text", content: line });
    }
  });
  flushBullets();

  return (
    <div className="fmt-response">
      {blocks.map((block, bi) => {
        if (block.type === "bullets") {
          return (
            <ul key={bi} className="fmt-list">
              {block.items.map((item, ii) => (
                <li key={ii}>{parseLine(item, `${bi}-${ii}`)}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={bi} className="fmt-para">
            {parseLine(block.content, String(bi))}
          </p>
        );
      })}
    </div>
  );
}
