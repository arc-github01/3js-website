import React from 'react';
import './SolarSystemBackground.css';

export default function SolarSystemBackground() {
  return (
    <div className="solar-bg">
      <div className="orbit orbit1">
        <div className="planet planet1" />
      </div>
      <div className="orbit orbit2">
        <div className="planet planet2" />
      </div>
      <div className="orbit orbit3">
        <div className="planet planet3" />
      </div>
      <div className="sun" />
      {/* Add some stars */}
      {[...Array(20)].map((_, i) => (
        <div key={i} className="star" style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`
        }} />
      ))}
    </div>
  );
} 