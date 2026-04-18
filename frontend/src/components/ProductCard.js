import React, { useState } from 'react';

const COLOR_OPTIONS = [
  { key: 'yellow', label: 'Yellow Gold', hex: '#E6CA97' },
  { key: 'white', label: 'White Gold', hex: '#D9D9D9' },
  { key: 'rose', label: 'Rose Gold', hex: '#E1A4A9' },
];

function StarRating({ score }) {
  const stars = [];
  const full = Math.floor(score);
  const partial = score - full;

  for (let i = 0; i < 5; i++) {
    if (i < full) {
      stars.push(<span key={i} className="star star-full">★</span>);
    } else if (i === full && partial >= 0.5) {
      stars.push(<span key={i} className="star star-half">★</span>);
    } else {
      stars.push(<span key={i} className="star star-empty">★</span>);
    }
  }
  return <div className="star-rating">{stars}</div>;
}

export default function ProductCard({ product }) {
  const [selectedColor, setSelectedColor] = useState('yellow');

  const colorInfo = COLOR_OPTIONS.find(c => c.key === selectedColor);

  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        <img
          src={product.images[selectedColor]}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </div>
      <div className="product-info">
        <p className="product-name">{product.name}</p>
        <p className="product-price">${product.price.toFixed(2)} USD</p>
        <div className="color-picker">
          {COLOR_OPTIONS.map(color => (
            <button
              key={color.key}
              className={`color-dot ${selectedColor === color.key ? 'active' : ''}`}
              style={{ backgroundColor: color.hex }}
              onClick={() => setSelectedColor(color.key)}
              title={color.label}
              aria-label={color.label}
            />
          ))}
        </div>
        <p className="color-label">{colorInfo.label}</p>
        <div className="rating-row">
          <StarRating score={product.starRating} />
          <span className="rating-text">{product.starRating.toFixed(1)}/5</span>
        </div>
      </div>
    </div>
  );
}
