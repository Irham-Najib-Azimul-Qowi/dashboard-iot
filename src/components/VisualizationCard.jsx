// src/components/VisualizationCard.jsx
import React from 'react';
import './VisualizationCard.css';

function VisualizationCard({ title, children }) {
  return (
    <div className="card-container">
      <div className="card-header">
        <h2 className="card-title">{title}</h2>
      </div>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

export default VisualizationCard;