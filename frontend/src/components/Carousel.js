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
  const [progress, setProgress] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(0.5);

  const updateProgress = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0);
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

  // Progress bar drag
  const barRef = useRef(null);
  const isDraggingBar = useRef(false);

  const moveBarTo = (clientX) => {
    const bar = barRef.current;
    const el = viewportRef.current;
    if (!bar || !el) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const maxScroll = el.scrollWidth - el.clientWidth;
    el.scrollLeft = ratio * maxScroll;
  };

  const onBarMouseDown = (e) => { e.preventDefault(); isDraggingBar.current = true; moveBarTo(e.clientX); };
  const onBarMouseMove = useCallback((e) => { if (isDraggingBar.current) moveBarTo(e.clientX); }, []);
  const onBarMouseUp = useCallback(() => { isDraggingBar.current = false; }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onBarMouseMove);
    window.addEventListener('mouseup', onBarMouseUp);
    return () => {
      window.removeEventListener('mousemove', onBarMouseMove);
      window.removeEventListener('mouseup', onBarMouseUp);
    };
  }, [onBarMouseMove, onBarMouseUp]);

  const thumbLeft = progress * (1 - thumbWidth) * 100;
  const cardWidthPercent = 100 / visibleCount;

  return (
    <div className="carousel-outer">
      <div className="carousel-wrapper">
        <button className="carousel-arrow" onClick={() => scrollBy(-1)} aria-label="Previous">‹</button>

        <div className="carousel-viewport" ref={viewportRef}>
          <div className="carousel-track">
            {products.map((product, i) => (
              <div
                key={i}
                className="carousel-item"
                style={{ flex: `0 0 ${cardWidthPercent}%`, scrollSnapAlign: 'start' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <button className="carousel-arrow" onClick={() => scrollBy(1)} aria-label="Next">›</button>
      </div>

      <div className="carousel-scrollbar" ref={barRef} onMouseDown={onBarMouseDown}>
        <div className="carousel-scrollbar-thumb" style={{ width: `${thumbWidth * 100}%`, left: `${thumbLeft}%` }} />
      </div>
    </div>
  );
}
