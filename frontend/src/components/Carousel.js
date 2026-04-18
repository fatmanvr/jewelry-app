import React, { useState, useRef, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';

function useVisibleCount() {
  const [count, setCount] = useState(4);
  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 480) setCount(1);
      else if (w < 768) setCount(2);
      else if (w < 1024) setCount(3);
      else setCount(4);
    }
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return count;
}

export default function Carousel({ products }) {
  const visibleCount = useVisibleCount();
  const viewportRef = useRef(null);
  const [progress, setProgress] = useState(0); // 0..1
  const [thumbWidth, setThumbWidth] = useState(0.5); // fraction of bar

  // Drag state
  const startX = useRef(null);
  const scrollStartLeft = useRef(0);
  const isDragging = useRef(false);

  // Progress bar drag state
  const barRef = useRef(null);
  const isDraggingBar = useRef(false);

  const updateProgress = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    const p = maxScroll > 0 ? el.scrollLeft / maxScroll : 0;
    setProgress(p);
    setThumbWidth(el.clientWidth / el.scrollWidth);
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => el.removeEventListener('scroll', updateProgress);
  }, [updateProgress, visibleCount]);

  const scrollBy = (dir) => {
    const el = viewportRef.current;
    if (!el) return;
    const cardWidth = el.offsetWidth / visibleCount;
    el.scrollBy({ left: dir * cardWidth, behavior: 'smooth' });
  };

  // Touch swipe
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) scrollBy(diff > 0 ? 1 : -1);
  };

  // Mouse drag on carousel
  const onMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    scrollStartLeft.current = viewportRef.current.scrollLeft;
    viewportRef.current.style.cursor = 'grabbing';
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    viewportRef.current.scrollLeft = scrollStartLeft.current - (e.clientX - startX.current);
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (viewportRef.current) viewportRef.current.style.cursor = 'grab';
  };

  // Progress bar drag
  const onBarMouseDown = (e) => {
    e.preventDefault();
    isDraggingBar.current = true;
    moveBarTo(e.clientX);
  };
  const onBarMouseMove = useCallback((e) => {
    if (!isDraggingBar.current) return;
    moveBarTo(e.clientX);
  }, []);
  const onBarMouseUp = useCallback(() => { isDraggingBar.current = false; }, []);

  const moveBarTo = (clientX) => {
    const bar = barRef.current;
    const el = viewportRef.current;
    if (!bar || !el) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollLeft = ratio * maxScroll;
  };

  useEffect(() => {
    window.addEventListener('mousemove', onBarMouseMove);
    window.addEventListener('mouseup', onBarMouseUp);
    return () => {
      window.removeEventListener('mousemove', onBarMouseMove);
      window.removeEventListener('mouseup', onBarMouseUp);
    };
  }, [onBarMouseMove, onBarMouseUp]);

  const thumbLeft = progress * (1 - thumbWidth) * 100;

  return (
    <div className="carousel-outer">
      <div className="carousel-wrapper">
        <button className="carousel-arrow" onClick={() => scrollBy(-1)} aria-label="Previous">‹</button>

        <div
          className="carousel-viewport"
          ref={viewportRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <div className="carousel-track">
            {products.map((product, i) => (
              <div
                key={i}
                className="carousel-item"
                style={{ flex: `0 0 ${100 / visibleCount}%` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <button className="carousel-arrow" onClick={() => scrollBy(1)} aria-label="Next">›</button>
      </div>

      {/* Scrollbar */}
      <div
        className="carousel-scrollbar"
        ref={barRef}
        onMouseDown={onBarMouseDown}
      >
        <div
          className="carousel-scrollbar-thumb"
          style={{
            width: `${thumbWidth * 100}%`,
            left: `${thumbLeft}%`,
          }}
        />
      </div>
    </div>
  );
}
