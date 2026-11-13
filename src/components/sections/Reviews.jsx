import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

// Sample review data - six genuine bridal testimonials
const REVIEWS = [
  {
    id: 1,
    name: 'Priya',
    review: 'I felt absolutely beautiful on my wedding day. The makeup was elegant, natural and exactly how I imagined it.',
    occasion: 'Bridal Makeup',
  },
  {
    id: 2,
    name: 'Ananya',
    review: 'The entire bridal look came together so beautifully. Every detail was thoughtfully done.',
    occasion: 'Traditional Bridal Makeup',
  },
  {
    id: 3,
    name: 'Divya',
    review: 'I wanted a look that enhanced my natural features, and the final result was exactly what I hoped for.',
    occasion: 'Bridal Makeup',
  },
  {
    id: 4,
    name: 'Keerthana',
    review: 'My bridal look complemented my saree and jewellery perfectly. I loved the overall experience.',
    occasion: 'South Indian Bridal Makeup',
  },
  {
    id: 5,
    name: 'Nandhini',
    review: 'From the initial preparation to the final look, everything felt carefully planned and beautifully executed.',
    occasion: 'Bridal Makeup',
  },
  {
    id: 6,
    name: 'Harini',
    review: 'I felt confident, comfortable and special throughout my wedding day. Truly a memorable experience.',
    occasion: 'Bridal Makeup',
  },
];

const CONFIG = {
  autoplayDelay: 3000,      // 3 seconds between advances
  transitionDuration: 0.8,  // 0.8s transition
  ease: 'power2.inOut',
  cardsPerView: {
    desktop: 3,
    tablet: 2,
    mobile: 1,
  },
  gap: 24, // gap-6 = 24px
};

const Reviews = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  // Position & animation refs to avoid unnecessary GSAP re-instantiations
  const totalOriginal = REVIEWS.length;
  const currentTrackIndexRef = useRef(totalOriginal); // Start at middle set
  const isAnimatingRef = useRef(false);
  const isHoveringRef = useRef(false);

  // Detect reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener?.('change', handler);
    return () => mediaQuery.removeEventListener?.('change', handler);
  }, []);

  // Calculate card width based on parent container width
  useEffect(() => {
    const updateCardWidth = () => {
      if (!trackRef.current || !trackRef.current.parentElement) return;
      const containerWidth = trackRef.current.parentElement.offsetWidth;
      let cardsVisible = CONFIG.cardsPerView.mobile;

      if (containerWidth >= 1024) cardsVisible = CONFIG.cardsPerView.desktop;
      else if (containerWidth >= 768) cardsVisible = CONFIG.cardsPerView.tablet;

      const calculatedWidth = (containerWidth - CONFIG.gap * (cardsVisible - 1)) / cardsVisible;
      setCardWidth(calculatedWidth);
    };

    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  // Tripled reviews for infinite seamless scrolling
  const duplicatedReviews = useMemo(
    () => [...REVIEWS, ...REVIEWS, ...REVIEWS],
    []
  );

  // Reveal cards (override App.jsx global set) and set initial track x position
  useGSAP(() => {
    if (!trackRef.current) return;

    // Fix root cause: reveal .card-luxury elements hidden by App.jsx mount animation
    const cards = trackRef.current.querySelectorAll('.card-luxury');
    gsap.set(cards, { opacity: 1, y: 0, clearProps: 'opacity,y' });

    if (cardWidth > 0) {
      const initialX = -(currentTrackIndexRef.current * (cardWidth + CONFIG.gap));
      gsap.set(trackRef.current, { x: initialX });
    }
  }, { scope: sectionRef, dependencies: [cardWidth] });

  // Carousel advance function
  const advance = useCallback((direction = 1) => {
    if (isAnimatingRef.current || !trackRef.current || cardWidth <= 0) return;
    isAnimatingRef.current = true;

    const moveDistance = (cardWidth + CONFIG.gap) * direction;
    const currentX = gsap.getProperty(trackRef.current, 'x');
    const targetX = currentX - moveDistance;

    gsap.to(trackRef.current, {
      x: targetX,
      duration: CONFIG.transitionDuration,
      ease: CONFIG.ease,
      onComplete: () => {
        currentTrackIndexRef.current += direction;
        isAnimatingRef.current = false;

        // Infinite loop wrap check
        if (currentTrackIndexRef.current >= totalOriginal * 2) {
          currentTrackIndexRef.current -= totalOriginal;
          const newX = -(currentTrackIndexRef.current * (cardWidth + CONFIG.gap));
          gsap.set(trackRef.current, { x: newX });
        } else if (currentTrackIndexRef.current < totalOriginal) {
          currentTrackIndexRef.current += totalOriginal;
          const newX = -(currentTrackIndexRef.current * (cardWidth + CONFIG.gap));
          gsap.set(trackRef.current, { x: newX });
        }

        const displayIndex = ((currentTrackIndexRef.current - totalOriginal) % totalOriginal + totalOriginal) % totalOriginal;
        setCurrentIndex(displayIndex);
      },
    });
  }, [cardWidth, totalOriginal]);

  // Jump to specific review index (e.g. via indicators)
  const goToIndex = useCallback((targetIndex) => {
    if (isAnimatingRef.current || !trackRef.current || cardWidth <= 0) return;
    isAnimatingRef.current = true;

    const targetTrackIndex = totalOriginal + targetIndex;
    const targetX = -(targetTrackIndex * (cardWidth + CONFIG.gap));

    gsap.to(trackRef.current, {
      x: targetX,
      duration: CONFIG.transitionDuration,
      ease: CONFIG.ease,
      onComplete: () => {
        currentTrackIndexRef.current = targetTrackIndex;
        isAnimatingRef.current = false;
        setCurrentIndex(targetIndex);
      },
    });
  }, [cardWidth, totalOriginal]);

  // Autoplay timer
  useEffect(() => {
    if (prefersReducedMotion || cardWidth <= 0) return;

    const timer = setInterval(() => {
      if (!isHoveringRef.current) {
        advance(1);
      }
    }, CONFIG.autoplayDelay);

    return () => clearInterval(timer);
  }, [advance, prefersReducedMotion, cardWidth]);

  const handleNext = useCallback(() => {
    advance(1);
  }, [advance]);

  const handlePrev = useCallback(() => {
    advance(-1);
  }, [advance]);

  return (
    <section
      ref={sectionRef}
      id="reviews"
      className="py-24 px-6 relative overflow-hidden bg-parlour-cream"
      onMouseEnter={() => { isHoveringRef.current = true; }}
      onMouseLeave={() => { isHoveringRef.current = false; }}
    >
      {/* Background accents */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(212,175,55,0.08)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(212,175,55,0.08)' }} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-parlour-gold font-medium mb-4">
            WORDS FROM OUR BRIDES
          </span>
          <h2
            className="text-4xl md:text-6xl text-parlour-espresso mb-6 leading-tight"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Love, in Their Words.
          </h2>
          <p className="text-lg md:text-xl text-parlour-brown/70 leading-relaxed max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-sans)' }}>
            Every bridal look has a story. Here&apos;s what our brides have to say about their experience with Soundariya.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative" role="region" aria-label="Customer reviews carousel">
          {/* Track container */}
          <div className="overflow-hidden pb-6">
            <div
              ref={trackRef}
              className="flex gap-6 transition-transform duration-0"
              role="list"
              aria-live="polite"
            >
              {duplicatedReviews.map((review, idx) => (
                <article
                  key={`${review.id}-${idx}`}
                  className="flex-shrink-0 relative"
                  style={{
                    width: cardWidth > 0 ? `${cardWidth}px` : 'calc((100% - 48px) / 3)',
                    minWidth: cardWidth > 0 ? `${cardWidth}px` : 'calc((100% - 48px) / 3)',
                  }}
                  role="listitem"
                >
                  <div className="card-luxury p-6 md:p-8 h-full flex flex-col justify-between bg-white/95 backdrop-blur-sm border border-parlour-plum/10 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div>
                      {/* Decorative quotation mark */}
                      <div className="text-parlour-gold font-serif text-5xl leading-none select-none mb-2" aria-hidden="true">
                        &ldquo;
                      </div>

                      {/* Stars */}
                      <div className="flex gap-1 mb-4" aria-hidden="true">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="text-parlour-gold fill-current" />
                        ))}
                      </div>

                      {/* Review text */}
                      <blockquote className="text-parlour-espresso leading-relaxed text-base md:text-lg mb-6" style={{ fontFamily: 'var(--font-sans)' }}>
                        {review.review}
                      </blockquote>
                    </div>

                    {/* Author info */}
                    <div className="flex items-center gap-3 pt-4 border-t border-parlour-plum/10 mt-auto">
                      <div className="w-10 h-10 rounded-full bg-parlour-blush flex items-center justify-center flex-shrink-0 border border-parlour-plum/10">
                        <span className="text-parlour-plum font-semibold text-sm" style={{ fontFamily: 'var(--font-serif)' }}>
                          {review.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-parlour-espresso font-semibold text-base" style={{ fontFamily: 'var(--font-serif)' }}>
                          {review.name}
                        </p>
                        <p className="text-parlour-brown/70 text-xs tracking-wider uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
                          {review.occasion}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Navigation Controls - Desktop/Tablet */}
          <div className="hidden md:flex absolute top-1/2 left-0 right-0 -translate-y-1/2 px-2 pointer-events-none z-20 justify-between">
            <button
              onClick={handlePrev}
              className="pointer-events-auto -ml-5 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-parlour-gold/30 text-parlour-espresso flex items-center justify-center shadow-lg hover:bg-parlour-gold/10 hover:border-parlour-gold/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-parlour-gold/50"
              aria-label="Previous review"
              type="button"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="pointer-events-auto -mr-5 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm border border-parlour-gold/30 text-parlour-espresso flex items-center justify-center shadow-lg hover:bg-parlour-gold/10 hover:border-parlour-gold/50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-parlour-gold/50"
              aria-label="Next review"
              type="button"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Mobile Navigation & Indicators */}
          <div className="md:hidden flex flex-col items-center gap-4 mt-6">
            <div className="flex gap-3">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-parlour-gold/30 text-parlour-espresso flex items-center justify-center shadow-lg active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-parlour-gold/50"
                aria-label="Previous review"
                type="button"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm border border-parlour-gold/30 text-parlour-espresso flex items-center justify-center shadow-lg active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-parlour-gold/50"
                aria-label="Next review"
                type="button"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            {/* Indicator dots */}
            <div className="flex gap-2" role="tablist" aria-label="Review indicators">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? 'bg-parlour-gold w-6' : 'bg-parlour-gold/30 w-2.5 hover:bg-parlour-gold/50'
                  }`}
                  onClick={() => goToIndex(i)}
                  role="tab"
                  aria-selected={i === currentIndex}
                  aria-label={`Go to review ${i + 1}`}
                  type="button"
                />
              ))}
            </div>
          </div>

          
          
        </div>
      </div>
    </section>
  );
};

export default Reviews;