import React, { useRef, useState, useCallback } from 'react';
import beforeSrc from '../../assets/images/before.png';
import afterSrc from '../../assets/images/after.png';

/**
 * Premium Before & After Image Comparison Slider
 *
 * Implementation details:
 * - Uses CSS `clipPath: inset(...)` for pixel-perfect image reveal.
 * - Both images maintain identical dimensions, positioning, and aspect-ratio (no distortion/stretching).
 * - Full Pointer Events support (mouse + touch).
 * - Keyboard accessible (Arrow keys, Home, End).
 */
const BeforeAfterSlider = ({
  beforeImage = beforeSrc,
  afterImage = afterSrc,
  beforeLabel = 'BEFORE',
  afterLabel = 'AFTER',
  title = 'Bridal Makeover Transformation',
  subtitle = 'Drag the slider or use arrow keys to compare before and after styling',
}) => {
  const containerRef = useRef(null);
  const [position, setPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percentage);
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      updatePosition(e.clientX);
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (_) {
        // ignore if capture already lost
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setPosition((prev) => Math.min(100, prev + 5));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setPosition(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setPosition(100);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header text */}
      {(title || subtitle) && (
        <div className="text-center mb-6">
          {title && (
            <h3
              className="text-2xl md:text-3xl text-parlour-plum uppercase tracking-tight mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-parlour-plum/70 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Main Slider Box */}
      <div
        ref={containerRef}
        role="slider"
        tabIndex={0}
        aria-label="Before and After transformation slider"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl cursor-ew-resize select-none touch-none border border-parlour-plum/10 focus:outline-none focus:ring-2 focus:ring-parlour-plum"
      >
        {/* Base Layer: BEFORE Image (visible from 0% to position%) */}
        <div className="absolute inset-0">
          <img
            src={beforeImage}
            alt={`${title} - ${beforeLabel}`}
            className="w-full h-full object-cover object-center pointer-events-none"
          />
          {/* BEFORE label — clipped together with the BEFORE image layer */}
          <div className="absolute top-4 left-4 pointer-events-none">
            <span className="bg-parlour-plum/85 backdrop-blur-md text-parlour-blush text-[10px] uppercase tracking-[0.2em] font-bold px-3.5 py-1.5 rounded-full shadow-md border border-white/20">
              {beforeLabel}
            </span>
          </div>
        </div>

        {/* Overlay Layer: AFTER Image (visible from position% to 100%) */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 0 0 ${position}%)`,
          }}
        >
          <img
            src={afterImage}
            alt={`${title} - ${afterLabel}`}
            className="w-full h-full object-cover object-center pointer-events-none"
          />
          {/* AFTER label — clipped together with the AFTER overlay layer */}
          <div className="absolute top-4 right-4 pointer-events-none">
            <span className="bg-parlour-plum/85 backdrop-blur-md text-parlour-blush text-[10px] uppercase tracking-[0.2em] font-bold px-3.5 py-1.5 rounded-full shadow-md border border-white/20">
              {afterLabel}
            </span>
          </div>
        </div>

        {/* Vertical Divider Line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.4)] z-20 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          {/* Circular Drag Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white text-parlour-plum shadow-xl flex items-center justify-center border-2 border-parlour-plum/20">
            <svg
              className="w-5 h-5 text-parlour-plum"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7l-5 5 5 5M16 7l5 5-5 5"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeAfterSlider;