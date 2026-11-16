import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { TESTIMONIALS } from '../../lib/reviews';

const StarRating = ({ rating }) => (
  <div className="flex gap-1 justify-center" role="img" aria-label={`${rating} out of 5 stars`}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'text-parlour-gold fill-current' : 'text-parlour-plum/20'}
      />
    ))}
  </div>
);

// Double testimonials to 16 items for continuous looping
const REEL_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS].map((item, idx) => ({
  ...item,
  uniqueKey: `${item.id}-${idx}`,
  originalIndex: idx % TESTIMONIALS.length,
}));

const TOTAL_CARDS = REEL_ITEMS.length;
const ANGLE_STEP = (2 * Math.PI) / TOTAL_CARDS; // 22.5 deg per card

/**
 * Orbit Reel — ReactBits Pro Architecture
 *
 * Designed to strictly mirror the ReactBits Pro orbit-reel-tw layout:
 * - Arc View: 5 cards sweeping across an arc with active card upright at apex.
 * - Ring View: Circular turning wheel of cards.
 * - Clean cards: No slopped badges or clutter, pure card aesthetic.
 * - Under-card info: Title, subtitle/testimonial, and "< 01 / 08 >" stepper controls.
 * - Color Palette: Aligned with the Soundariya site system (#fce4ec, #f3d4e0, #380b44).
 */
const Reviews = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  // View mode: 'arc' or 'ring'
  const [viewMode, setViewMode] = useState('arc');

  // Rotation state in radians
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const targetRotationRef = useRef(0);
  const currentRotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartRotRef = useRef(0);
  const isHoveredRef = useRef(false);
  const animFrameRef = useRef(null);

  // Active index (0 to 7)
  const [activeIndex, setActiveIndex] = useState(0);

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  // Responsive dimensions
  const [viewportWidth, setViewportWidth] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth;
    return 1024;
  });

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mq.addEventListener?.('change', handler);
    return () => mq.removeEventListener?.('change', handler);
  }, []);

  const isMobile = viewportWidth < 768;
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024;

  // Exact ReactBits card aspect ratio ~0.8
  const cardDims = useMemo(() => {
    if (isMobile) return { width: 140, height: 175 };
    if (isTablet) return { width: 175, height: 220 };
    return { width: 210, height: 265 };
  }, [isMobile, isTablet]);

  const arcRadius = useMemo(() => {
    if (isMobile) return 290;
    if (isTablet) return 400;
    return 520;
  }, [isMobile, isTablet]);

  const ringRadius = useMemo(() => {
    if (isMobile) return 190;
    if (isTablet) return 280;
    return 370;
  }, [isMobile, isTablet]);

  // Smooth lerp loop via requestAnimationFrame
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // In Ring view, gentle continuous spin
      if (viewMode === 'ring' && !isDraggingRef.current && !isHoveredRef.current && !prefersReducedMotion) {
        targetRotationRef.current += 0.12 * dt;
      }

      // Smooth interpolation to target
      const diff = targetRotationRef.current - currentRotationRef.current;
      currentRotationRef.current += diff * Math.min(dt * 8.5, 1);
      setRotation(currentRotationRef.current);

      // Determine active card at apex
      const normalized = ((currentRotationRef.current % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const closestSlot = Math.round(normalized / ANGLE_STEP) % TOTAL_CARDS;
      const originalIdx = REEL_ITEMS[closestSlot]?.originalIndex ?? 0;
      if (originalIdx !== activeIndex) {
        setActiveIndex(originalIdx);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [viewMode, activeIndex, prefersReducedMotion]);

  // Autoplay in Arc view (every 4s)
  useEffect(() => {
    if (viewMode !== 'arc' || prefersReducedMotion) return;

    const interval = setInterval(() => {
      if (!isHoveredRef.current && !isDraggingRef.current) {
        targetRotationRef.current += ANGLE_STEP;
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [viewMode, prefersReducedMotion]);

  // Step controls
  const handlePrev = useCallback(() => {
    targetRotationRef.current -= ANGLE_STEP;
  }, []);

  const handleNext = useCallback(() => {
    targetRotationRef.current += ANGLE_STEP;
  }, []);

  const navigateToCard = useCallback((cardIndex) => {
    const targetAngle = cardIndex * ANGLE_STEP;
    const current = currentRotationRef.current;
    const diff = targetAngle - (current % (2 * Math.PI));
    const adjusted = Math.atan2(Math.sin(diff), Math.cos(diff));
    targetRotationRef.current = current + adjusted;
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Pointer drag controls
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    dragStartRotRef.current = targetRotationRef.current;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    const sensitivity = isMobile ? 0.005 : 0.0035;
    targetRotationRef.current = dragStartRotRef.current - deltaX * sensitivity;
  };

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    const nearest = Math.round(targetRotationRef.current / ANGLE_STEP) * ANGLE_STEP;
    targetRotationRef.current = nearest;
  };

  const handleCardClick = (cardIndex) => {
    navigateToCard(cardIndex);
    if (viewMode === 'ring') {
      setViewMode('arc');
    }
  };

  const activeTestimonial = TESTIMONIALS[activeIndex] || TESTIMONIALS[0];
  const activeNumberStr = String(activeIndex + 1).padStart(2, '0');
  const totalNumberStr = String(TESTIMONIALS.length).padStart(2, '0');

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="py-24 px-4 sm:px-6 relative overflow-hidden select-none"
      style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #f3d4e0 50%, #fce4ec 100%)' }}
      aria-label="Client Testimonials Reel"
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
    >
      {/* Background ambient lighting matching the site palette */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(218,158,210,0.35)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-2xl pointer-events-none"
        style={{ background: 'rgba(225,161,213,0.4)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-parlour-plum/70 font-medium mb-3">
            WORDS FROM OUR BRIDES
          </span>
          <h2
            className="text-3xl md:text-5xl lg:text-6xl text-parlour-plum mb-4 font-display uppercase tracking-tight"
          >
            Love, In Their Words.
          </h2>
          <p className="text-sm md:text-base text-parlour-plum/80 max-w-xl mx-auto font-sans leading-relaxed">
            Every bridal look has a story. Slide through our real brides and their unforgettable experiences.
          </p>

          {/* Minimal View Toggle (Arc / Ring) */}
          <div className="mt-5 flex items-center justify-center">
            <div className="inline-flex p-1 rounded-full bg-white/70 backdrop-blur-md border border-parlour-plum/15 shadow-sm">
              <button
                type="button"
                onClick={() => setViewMode('arc')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                  viewMode === 'arc'
                    ? 'bg-parlour-plum text-parlour-blush shadow-xs'
                    : 'text-parlour-plum/70 hover:text-parlour-plum'
                }`}
                aria-pressed={viewMode === 'arc'}
              >
                Arc View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('ring')}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wider uppercase transition-all duration-300 ${
                  viewMode === 'ring'
                    ? 'bg-parlour-plum text-parlour-blush shadow-xs'
                    : 'text-parlour-plum/70 hover:text-parlour-plum'
                }`}
                aria-pressed={viewMode === 'ring'}
              >
                Ring View
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  ORBIT REEL STAGE (REACTBITS PRO ARC / RING)                   */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div
          ref={stageRef}
          className={`
            relative mx-auto w-full cursor-grab active:cursor-grabbing touch-none
            ${viewMode === 'arc'
              ? 'h-[230px] sm:h-[300px] md:h-[340px] overflow-visible'
              : 'h-[400px] sm:h-[480px] md:h-[540px] overflow-hidden'
            }
          `}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="region"
          aria-label="Interactive bridal cards reel"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {REEL_ITEMS.map((item, index) => {
              const itemAngle = index * ANGLE_STEP;
              let diff = (itemAngle - rotation) % (2 * Math.PI);
              if (diff > Math.PI) diff -= 2 * Math.PI;
              if (diff < -Math.PI) diff += 2 * Math.PI;

              const distFromApex = Math.abs(diff);
              const isApex = distFromApex < ANGLE_STEP * 0.55;

              let x = 0;
              let y = 0;
              let rotZ = 0;
              let scale = 1;
              let opacity = 1;
              let zIndex = Math.round(100 - distFromApex * 20);

              if (viewMode === 'arc') {
                // ARC VIEW: Exactly 5 cards visible across the arc, identical to ReactBits
                if (distFromApex > ANGLE_STEP * 2.15) return null;

                x = Math.sin(diff) * arcRadius;
                y = (1 - Math.cos(diff)) * (arcRadius * 0.72) - 20;
                rotZ = diff * (180 / Math.PI) * 0.85;
                scale = Math.max(0.75, 1 - distFromApex * 0.16);
                opacity = Math.max(0.4, 1 - Math.pow(distFromApex / (ANGLE_STEP * 2.15), 1.6) * 0.55);
              } else {
                // RING VIEW: Circular ring matching ReactBits ring view
                const alpha = itemAngle - rotation;
                x = Math.sin(alpha) * ringRadius;
                y = -Math.cos(alpha) * ringRadius;
                rotZ = (alpha * 180) / Math.PI;
                scale = Math.max(0.75, 0.92);
                opacity = Math.max(0.4, 1 - (1 - Math.cos(diff)) * 0.35);
                zIndex = Math.round(50 + y);
              }

              // Discard fully out-of-frame cards
              if (opacity <= 0.02) return null;

              return (
                <div
                  key={item.uniqueKey}
                  onClick={() => handleCardClick(index)}
                  className={`
                    absolute left-1/2 top-1/2 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer
                    transition-[box-shadow,border-color] duration-300
                    ${isApex && viewMode === 'arc'
                      ? 'border-2 border-parlour-plum shadow-2xl'
                      : 'border border-parlour-plum/15 shadow-lg hover:border-parlour-plum/40'
                    }
                  `}
                  style={{
                    width: `${cardDims.width}px`,
                    height: `${cardDims.height}px`,
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rotZ}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    transition: isDragging ? 'none' : 'transform 0.16s ease-out, opacity 0.2s ease-out',
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${item.name} — ${item.service}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCardClick(index);
                    }
                  }}
                >
                  {/* Clean Card Portrait Image — No slopped badges */}
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  CENTER TESTIMONIAL & REACTBITS STEPPER CONTROLS              */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div
          className="mt-6 md:mt-10 text-center max-w-xl mx-auto px-4"
          role="article"
          aria-live="polite"
        >
          {/* Star Rating */}
          <div className="mb-2">
            <StarRating rating={activeTestimonial.rating} />
          </div>

          {/* Title (Bride's Name) */}
          <h3 className="text-xl md:text-2xl font-display uppercase tracking-wide text-parlour-plum mb-1">
            {activeTestimonial.name}
          </h3>

          {/* Subtitle (Service & Location) */}
          <p className="text-xs uppercase tracking-widest text-parlour-plum/70 font-medium mb-3">
            {activeTestimonial.service} &bull; {activeTestimonial.location}
          </p>

          {/* Testimonial Quote */}
          <blockquote
            className="text-sm md:text-base text-parlour-plum/85 italic leading-relaxed mb-6 font-sans"
          >
            &ldquo;{activeTestimonial.review}&rdquo;
          </blockquote>

          {/* ReactBits Stepper Bar: < 01 / 08 > */}
          <div className="inline-flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 rounded-full bg-parlour-plum/10 text-parlour-plum hover:bg-parlour-plum hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-parlour-plum/40"
              aria-label="Previous story"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs font-mono tracking-widest font-semibold text-parlour-plum/80 px-2 min-w-[60px]">
              {activeNumberStr} / {totalNumberStr}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 rounded-full bg-parlour-plum/10 text-parlour-plum hover:bg-parlour-plum hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-parlour-plum/40"
              aria-label="Next story"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
