import React, { useState, useRef } from 'react';

// value: 0..5 in 0.5 steps, onChange: (val) => void, label: string
export default function StarPicker({ value, onChange, label }) {
  const [hovered, setHovered] = useState(null);
  const containerRef = useRef(null);
  const isPressed = useRef(false);

  const getStarValue = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const starWidth = rect.width / 5;
    const starIndex = Math.floor(x / starWidth); // 0..4
    const withinStar = (x % starWidth) / starWidth;
    const val = starIndex + (withinStar < 0.5 ? 0.5 : 1);
    return Math.min(5, Math.max(0.5, val));
  };

  const handleMouseMove = (e) => {
    setHovered(getStarValue(e));
    if (isPressed.current) onChange(getStarValue(e));
  };

  const handleMouseDown = (e) => {
    isPressed.current = true;
    onChange(getStarValue(e));
  };

  const handleMouseUp = () => { isPressed.current = false; };
  const handleMouseLeave = () => { setHovered(null); isPressed.current = false; };

  const handleTouchStart = (e) => {
    isPressed.current = true;
    onChange(getStarValue(e));
  };
  const handleTouchMove = (e) => {
    e.preventDefault();
    onChange(getStarValue(e));
  };
  const handleTouchEnd = () => { isPressed.current = false; };

  const display = hovered !== null ? hovered : value;

  return (
    <div className="star-picker-wrapper">
      <span className="star-picker-label">{label}</span>
      <div className="star-picker-row">
        <div
          ref={containerRef}
          className="star-picker-stars"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {[1, 2, 3, 4, 5].map(star => {
            let fill = 'empty';
            if (display >= star) fill = 'full';
            else if (display >= star - 0.5) fill = 'half';
            return (
              <span key={star} className={`star-pick star-pick-${fill}`}>★</span>
            );
          })}
        </div>
        <span className="star-picker-value">
          {value ? `${value}/5` : 'Any'}
        </span>
        {value > 0 && (
          <button
            className="star-picker-clear"
            onClick={() => onChange(0)}
            title="Clear"
          >×</button>
        )}
      </div>
    </div>
  );
}
