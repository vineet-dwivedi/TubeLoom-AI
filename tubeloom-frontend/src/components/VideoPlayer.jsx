import React from "react";
import "./VideoPlayer.scss";

export default function VideoPlayer({ videoId }) {
  if (!videoId) return null;

  return (
    <div className="video-player-wrapper">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube Video Player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
