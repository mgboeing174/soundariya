import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Hero = () => {
  const heroRef = useRef(null);
  const taglineRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const modelRef = useRef(null);

  useGSAP(() => {
    if (!heroRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Top tagline
    tl.from(taglineRef.current, {
      y: 20,
      opacity: 0,
      duration: 0.6,
    });

    // Massive headline: staggered word reveal
    tl.from(
      headlineRef.current.querySelectorAll('.hero-word'),
      {
        y: 120,
        opacity: 0,
        duration: 1,
        stagger: 0.12,
      },
      '-=0.2'
    );

    // Sub-copy
    tl.from(
      subRef.current,
      {
        y: 30,
        opacity: 0,
        duration: 0.8,
      },
      '-=0.4'
    );

    // CTA button
    tl.from(
      ctaRef.current,
      {
        y: 20,
        opacity: 0,
        duration: 0.6,
      },
      '-=0.2'
    );

    // Model image
    tl.from(
      modelRef.current,
      {
        x: 60,
        opacity: 0,
        duration: 1,
      },
      '-=0.6'
    );
  }, { scope: heroRef });

  return (
    <section
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #E7B0DE 0%, #D997C9 50%, #E7B0DE 100%)',
      }}
    >
      {/* Hero content: full-width headline + centered model overlaid on top, matching reference layout */}
      <div className="relative z-10 w-full h-full">
        {/* Tagline — left-aligned, above headline like the reference */}
        <div className="absolute left-[3%]" style={{ top: '8%' }}>
          <p
            ref={taglineRef}
            className="font-medium"
            style={{
              color: '#380b44',
              fontSize: 'clamp(0.75rem, 0.8vw, 1.1rem)',
              letterSpacing: '0.3em',
            }}
          >
            FUTURE LOOKS GOOD ON YOU
          </p>
        </div>

        {/* Full-width centered headline, near the top like the reference */}
        <div className="absolute left-0 right-0 flex justify-center" style={{ top: '25%' }}>
          <h1
            ref={headlineRef}
            className="leading-[0.82] tracking-[-0.02em] font-black whitespace-nowrap"
            style={{
              color: '#380b44',
              fontFamily: 'Anton, Impact, Haettenschweiler, sans-serif',
              fontSize: 'clamp(2.5rem, 19.5vw, 32rem)',
              wordBreak: 'safe',
            }}
          >
            <span className="hero-word">SOUNDARYA</span>
          </h1>
        </div>

        {/* Model image overlaid on top of headline, centered like the reference */}
        <div
          ref={modelRef}
          className="absolute z-20 -translate-x-1/2"
          style={{
            bottom: 0,
            left: '46%',
            width: 'clamp(360px, 45vw, 900px)',
          }}
        >
          <img
            src="/assets/images/dancer 2.png"
            alt="Traditional model"
            className="w-full h-auto object-contain drop-shadow-2xl"
            loading="lazy"
          />
        </div>

        {/* Sub-copy + CTA, left-aligned below headline like the reference */}
        <div className="absolute left-[3%] flex flex-col" style={{ top: '62%' }}>
          <p
            ref={subRef}
            className="font-medium"
            style={{
              color: '#380b44',
              fontSize: 'clamp(1rem, 1.15vw, 1.6rem)',
              lineHeight: 2.2,
              maxWidth: 'min(28rem, 35vw)',
            }}
          >
            BEAUTY PARLOUR.<br/> SAME YOU. JUST MORE POTENTIAL.
          </p>

          <div ref={ctaRef} style={{ marginTop: 'clamp(2rem, 3vw, 4rem)' }}>
            <a
              href="#booking"
              className="inline-flex items-center gap-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
              style={{
                border: '1.5px solid #380b44',
                color: '#380b44',
                background: 'transparent',
                padding: 'clamp(0.75rem, 0.9vw, 1.1rem) clamp(1.75rem, 2vw, 2.5rem)',
                fontSize: 'clamp(0.7rem, 0.78vw, 0.95rem)',
                letterSpacing: '0.25em',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
              }}
            >
              EXPLORE THE COLLECTION
              <svg
                width="clamp(14px, 1vw, 18px)"
                height="clamp(14px, 1vw, 18px)"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;