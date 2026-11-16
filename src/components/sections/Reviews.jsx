import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { Star, MapPin, X, RotateCcw } from 'lucide-react';
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

const TOTAL_CARDS = TESTIMONIALS.length; // 8
const ANGLE_STEP = (2 * Math.PI) / TOTAL_CARDS; // 45 deg

/**
 * Reviews Section — ReactBits Pro Orbit Reel Architecture
 *
 * Interaction Model:
 * 1. RING VIEW (Default State):
 *    - All 8 testimonial cards form a continuous, 3D rotating ring.
 *    - Cards remain strictly upright (counter-rotated).
 *    - Continuous rotation at ~12 deg/s.
 *    - Drag/swipe to spin the wheel interactively.
 *    - No testimonial panel or center card visible.
 *
 * 2. ARC VIEW (Focused State):
 *    - Triggered by clicking any card.
 *    - The reel smoothly morphs into a focused arc layout.
 *    - The selected card glides to the center apex and scales up.
 *    - Attached compact details appear directly on/below the selected card:
 *      Name, Service, Rating, Location, Short Testimonial.
 *    - Other cards fan out along the arc with tangent curve tilt.
 *    - Clicking neighbor cards in the arc slides them to the focal apex.
 *
 * 3. RETURN TO RING:
 *    - Click backdrop, close button, or press Escape.
 *    - Smoothly morphs the arc back into the continuous spinning ring.
 */
const Reviews = () => {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  // View state: 'ring' or 'arc'
  const [viewMode, setViewMode] = useState('ring');
  const [focusedIndex, setFocusedIndex] = useState(null);

  // Continuous ring rotation angle (radians)
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const rotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const hasMovedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartRotRef = useRef(0);
  const isHoveredRef = useRef(false);
  const animFrameRef = useRef(null);

  // Morph progress: 0 = Ring View, 1 = Arc View
  const [morph, setMorph] = useState(0);
  const morphRef = useRef({ value: 0 });

  // Arc drag offset (in card steps)
  const [arcOffset, setArcOffset] = useState(0);
  const arcOffsetRef = useRef({ value: 0 });

  // Responsive dimensions
  const [viewportWidth, setViewportWidth] = useState(() => {
    if (typeof window !== 'undefined') return window.innerWidth;
    return 1024;
  });

  // Reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
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

  // Geometry configuration
  const cardDims = useMemo(() => {
    if (isMobile) return { width: 110, height: 140 };
    if (isTablet) return { width: 140, height: 180 };
    return { width: 170, height: 215 }; // Aspect ratio ~0.78
  }, [isMobile, isTablet]);

  const ringRadius = useMemo(() => {
    if (isMobile) return 155;
    if (isTablet) return 215;
    return 270;
  }, [isMobile, isTablet]);

  const arcRadius = useMemo(() => {
    if (isMobile) return 260;
    if (isTablet) return 360;
    return 460;
  }, [isMobile, isTablet]);

  // Continuous animation loop (Ring rotation + Morph interpolation)
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Continuous rotation in Ring View (slows on hover, pauses on drag or reduced motion)
      if (viewMode === 'ring' && !isDraggingRef.current && !prefersReducedMotion) {
        const speed = isHoveredRef.current ? 0.04 : 0.18; // ~10 deg/sec
        rotationRef.current += speed * dt;
        setRotation(rotationRef.current);
      }

      // Update morph state from GSAP tween object
      if (Math.abs(morphRef.current.value - morph) > 0.001) {
        setMorph(morphRef.current.value);
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [viewMode, morph, prefersReducedMotion]);

  // Pointer drag controls (for spinning in Ring View & dragging in Arc View)
  const handlePointerDown = (e) => {
    if (e.target.closest('button')) return;

    isDraggingRef.current = true;
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    if (viewMode === 'ring') {
      dragStartRotRef.current = rotationRef.current;
    } else {
      dragStartRotRef.current = arcOffsetRef.current.value;
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 6) {
      hasMovedRef.current = true;
      setIsDragging(true);

      if (viewMode === 'ring') {
        const sensitivity = isMobile ? 0.006 : 0.0035;
        rotationRef.current = dragStartRotRef.current - deltaX * sensitivity;
        setRotation(rotationRef.current);
      } else {
        // Drag in Arc View
        const pixelsPerCard = isMobile ? 120 : isTablet ? 155 : 190;
        const currentDrag = dragStartRotRef.current + deltaX / pixelsPerCard;
        arcOffsetRef.current.value = currentDrag;
        setArcOffset(currentDrag);
      }
    }
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setTimeout(() => {
      setIsDragging(false);
      hasMovedRef.current = false;
    }, 60);

    // In Arc View, snap to nearest card on release
    if (viewMode === 'arc') {
      const currentOffset = arcOffsetRef.current.value;
      const shift = Math.round(currentOffset);
      const newIndex = ((focusedIndex - shift) % TOTAL_CARDS + TOTAL_CARDS) % TOTAL_CARDS;

      gsap.to(arcOffsetRef.current, {
        value: shift,
        duration: 0.35,
        ease: 'power2.out',
        onUpdate: () => {
          setArcOffset(arcOffsetRef.current.value);
        },
        onComplete: () => {
          setFocusedIndex(newIndex);
          arcOffsetRef.current.value = 0;
          setArcOffset(0);
        },
      });
    }
  };

  // Click card: Ring -> Arc zoom transition
  const handleCardClick = (index) => {
    if (hasMovedRef.current) return;

    if (viewMode === 'ring') {
      setFocusedIndex(index);
      setViewMode('arc');
      arcOffsetRef.current.value = 0;
      setArcOffset(0);

      // GSAP smooth morph from 0 (Ring) to 1 (Arc)
      gsap.to(morphRef.current, {
        value: 1,
        duration: 0.75,
        ease: 'power3.out',
      });
    } else {
      // In Arc view, clicking another card smoothly slides the focal apex to it
      if (focusedIndex !== index) {
        let stepDiff = (index - focusedIndex) % TOTAL_CARDS;
        if (stepDiff > TOTAL_CARDS / 2) stepDiff -= TOTAL_CARDS;
        if (stepDiff < -TOTAL_CARDS / 2) stepDiff += TOTAL_CARDS;

        gsap.to(arcOffsetRef.current, {
          value: -stepDiff,
          duration: 0.45,
          ease: 'power2.out',
          onUpdate: () => {
            setArcOffset(arcOffsetRef.current.value);
          },
          onComplete: () => {
            setFocusedIndex(index);
            arcOffsetRef.current.value = 0;
            setArcOffset(0);
          },
        });
      }
    }
  };

  // Return: Arc -> Ring transition
  const handleReturnToRing = useCallback(() => {
    if (viewMode !== 'arc') return;

    // Reset arc offset
    arcOffsetRef.current.value = 0;
    setArcOffset(0);

    // GSAP smooth morph from 1 (Arc) to 0 (Ring)
    gsap.to(morphRef.current, {
      value: 0,
      duration: 0.65,
      ease: 'power3.inOut',
      onComplete: () => {
        setViewMode('ring');
        setFocusedIndex(null);
      },
    });
  }, [viewMode]);

  // Keyboard navigation: Escape key returns to ring
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && viewMode === 'arc') {
        e.preventDefault();
        handleReturnToRing();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, handleReturnToRing]);

  // Active focused review data (tracks nearest card while dragging or snapped)
  const displayedIndex = focusedIndex !== null
    ? ((focusedIndex - Math.round(arcOffset)) % TOTAL_CARDS + TOTAL_CARDS) % TOTAL_CARDS
    : null;
  const focusedReview = displayedIndex !== null ? TESTIMONIALS[displayedIndex] : null;

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="py-24 px-4 sm:px-6 relative overflow-hidden select-none"
      style={{ background: 'linear-gradient(135deg, #E7B0DE 0%, #D997C9 50%, #E7B0DE 100%)' }}
      aria-label="Client Testimonials Orbit Reel"
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
    >
      {/* Background ambient lighting matching site system */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(231,176,222,0.45)' }}
      />
      <div
        className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'rgba(217,151,201,0.5)' }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-6 md:mb-10">
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-parlour-plum/70 font-medium mb-3">
            WORDS FROM OUR BRIDES
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl text-parlour-plum mb-3 font-display uppercase tracking-tight">
            Love, In Their Words.
          </h2>
          <p className="text-sm md:text-base text-parlour-plum/80 max-w-xl mx-auto font-sans leading-relaxed">
            {viewMode === 'arc'
              ? 'Click any story card to switch, or click close to return to the revolving wheel.'
              : 'Our brides in motion. Click any portrait card to zoom into her bridal story.'
            }
          </p>

          {/* View Mode Indicator / Return Button */}
          {viewMode === 'arc' && (
            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={handleReturnToRing}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 hover:bg-parlour-plum hover:text-white text-parlour-plum border border-parlour-plum/20 shadow-sm text-xs font-semibold tracking-wider uppercase transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-parlour-plum/30"
                aria-label="Return to spinning wheel view"
              >
                <RotateCcw size={14} />
                <span>Return to Wheel</span>
              </button>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════════════════════ */}
        {/*  INTERACTIVE ORBIT REEL ARENA (STAGE)                          */}
        {/* ══════════════════════════════════════════════════════════════ */}
        <div
          ref={stageRef}
          onClick={(e) => {
            if (hasMovedRef.current) return;
            // Clicking background in Arc View returns to Ring View
            if (viewMode === 'arc' && e.target === stageRef.current) {
              handleReturnToRing();
            }
          }}
          className={`
            relative mx-auto w-full transition-[height] duration-500 cursor-grab active:cursor-grabbing touch-none
            ${viewMode === 'arc'
              ? 'h-[500px] sm:h-[560px] md:h-[600px]'
              : 'h-[440px] sm:h-[500px] md:h-[560px]'
            }
          `}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          role="region"
          aria-label="Revolving Orbit Reel"
        >
          {/* Ambient Center Guide in Ring View */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500"
            style={{ opacity: 1 - morph }}
          >
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border border-parlour-plum/15 flex flex-col items-center justify-center text-center p-2">
              <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-parlour-plum/60">
                CLICK CARD
              </span>
              <span className="text-[8px] text-parlour-plum/40 tracking-wider mt-0.5">
                TO EXPAND
              </span>
            </div>
          </div>

          {/* ════════════════════════════════════════════════════════════ */}
          {/*  THE 8 TESTIMONIAL CARDS (MORPH BETWEEN RING & ARC)         */}
          {/* ════════════════════════════════════════════════════════════ */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {TESTIMONIALS.map((item, index) => {
              // 1. Coordinates in RING VIEW:
              // Cards travel around a 3D circle. Counters rotation so cards ALWAYS stay upright!
              const ringAngle = index * ANGLE_STEP + rotation;
              const xRing = Math.sin(ringAngle) * ringRadius;
              const yRing = -Math.cos(ringAngle) * (ringRadius * 0.42); // 3D ellipse perspective
              const zRing = Math.cos(ringAngle) * 80;
              const rotZRing = 0; // Strictly upright! No upside-down cards!
              const scaleRing = 0.82 + 0.18 * Math.cos(ringAngle);
              const opacityRing = 0.65 + 0.35 * Math.cos(ringAngle);
              const zIndexRing = Math.round(50 + Math.cos(ringAngle) * 40);

              // 2. Coordinates in ARC VIEW (when focusedIndex is active):
              const activeIdx = focusedIndex !== null ? focusedIndex : 0;
              let diff = (index - activeIdx) % TOTAL_CARDS;
              if (diff > TOTAL_CARDS / 2) diff -= TOTAL_CARDS;
              if (diff < -TOTAL_CARDS / 2) diff += TOTAL_CARDS;

              const effectiveDiff = diff + arcOffset;
              const isFocal = Math.abs(effectiveDiff) < 0.45;
              const arcAngle = effectiveDiff * 0.44; // Angle step along the arc
              const xArc = Math.sin(arcAngle) * arcRadius;
              const yArc = (1 - Math.cos(arcAngle)) * (arcRadius * 0.75) - (isFocal ? 70 : 50);
              const zArc = -Math.abs(effectiveDiff) * 60;
              const rotZArc = arcAngle * (180 / Math.PI) * 0.75; // Fanning curve tilt
              const scaleArc = isFocal ? (isMobile ? 1.05 : 1.15) : Math.max(0.65, 0.9 - Math.abs(effectiveDiff) * 0.15);
              const opacityArc = Math.max(0, 1 - Math.abs(effectiveDiff) * 0.38);
              const zIndexArc = Math.round(100 - Math.abs(effectiveDiff) * 20);

              // 3. Interpolate (morph) between Ring View and Arc View:
              const x = xRing * (1 - morph) + xArc * morph;
              const y = yRing * (1 - morph) + yArc * morph;
              const z = zRing * (1 - morph) + zArc * morph;
              const rotZ = rotZRing * (1 - morph) + rotZArc * morph;
              const scale = scaleRing * (1 - morph) + scaleArc * morph;
              const opacity = opacityRing * (1 - morph) + opacityArc * morph;
              const zIndex = morph > 0.5 ? zIndexArc : zIndexRing;

              if (opacity <= 0.01) return null;

              return (
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(index);
                  }}
                  className={`
                    absolute left-1/2 top-1/2 rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer
                    pointer-events-auto transition-[box-shadow,border-color] duration-300 group
                    ${isFocal && viewMode === 'arc'
                      ? 'border-2 border-parlour-plum shadow-2xl ring-4 ring-parlour-gold/30'
                      : 'border border-parlour-plum/20 shadow-lg hover:border-parlour-plum/60 hover:shadow-xl'
                    }
                  `}
                  style={{
                    width: `${cardDims.width}px`,
                    height: `${cardDims.height}px`,
                    transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${z}px) rotate(${rotZ}deg) scale(${scale})`,
                    zIndex,
                    opacity,
                    transition: isDragging ? 'none' : 'transform 0.15s ease-out',
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
                  {/* Clean Card Portrait Image */}
                  <img
                    src={item.photo}
                    alt={item.name}
                    className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gentle bottom scrim with bride's name in Ring View */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-parlour-plum/85 via-transparent to-transparent flex items-end p-2.5 transition-opacity duration-300"
                    style={{ opacity: viewMode === 'ring' ? 1 : 0.6 }}
                  >
                    <span className="text-white text-xs font-semibold tracking-wide drop-shadow truncate w-full text-center">
                      {item.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ════════════════════════════════════════════════════════════ */}
          {/*  ATTACHED COMPACT TESTIMONIAL PANEL (APPEARS IN ARC VIEW)   */}
          {/* ════════════════════════════════════════════════════════════ */}
          {viewMode === 'arc' && focusedReview && (
            <div
              className="absolute z-40 w-full max-w-md px-4 pointer-events-auto transition-all duration-500"
              style={{
                left: '50%',
                bottom: isMobile ? '8px' : '20px',
                transform: `translate(-50%, ${(1 - morph) * 20}px)`,
                opacity: morph,
              }}
              role="article"
              aria-live="polite"
            >
              <div className="relative rounded-2xl bg-white/95 backdrop-blur-xl border border-parlour-plum/15 shadow-2xl p-5 md:p-6 text-center">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleReturnToRing}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-parlour-plum/10 hover:bg-parlour-plum hover:text-white text-parlour-plum flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-parlour-plum/30"
                  aria-label="Close story"
                >
                  <X size={14} />
                </button>

                {/* Star Rating */}
                <div className="mb-1.5">
                  <StarRating rating={focusedReview.rating} />
                </div>

                {/* Client Name */}
                <h3 className="text-xl md:text-2xl font-display uppercase tracking-wide text-parlour-plum mb-1">
                  {focusedReview.name}
                </h3>

                {/* Service & Location */}
                <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-parlour-plum/70 font-semibold mb-2.5">
                  <span>{focusedReview.service}</span>
                  <span>&bull;</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-parlour-gold" />
                    <span>{focusedReview.location}</span>
                  </div>
                </div>

                {/* Short Testimonial Quote */}
                <blockquote className="text-xs md:text-sm text-parlour-plum/85 italic leading-relaxed font-sans max-w-sm mx-auto">
                  &ldquo;{focusedReview.review}&rdquo;
                </blockquote>
              </div>
            </div>
          )}
        </div>

        {/* Drag Hint */}
        <div className="mt-2 text-center">
          <span className="text-[10px] uppercase tracking-widest text-parlour-plum/60 font-medium">
            {viewMode === 'arc'
              ? 'Drag horizontally to rotate stories \u2022 Click card to focus \u2022 Click outside to return'
              : 'Drag to spin wheel \u2022 Click card to zoom into story'}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
