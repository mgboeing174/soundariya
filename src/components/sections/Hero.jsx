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
          'linear-gradient(135deg, #dea2d8 0%, #e1a1d5 45%, #da9ed2 100%)',
      }}
    >
      {/* Top nav bar — matches reference layout exactly */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 md:px-12 py-5">
        <a href="#" className="flex flex-col md:hidden">
          <span className="text-xl font-display tracking-wider uppercase font-bold" style={{ color: '#380b44' }}>
            Soundariya
          </span>
        </a>
        <nav className="hidden md:flex items-center space-x-10">
          {['ABOUT', 'SERVICES', 'GALLERY', 'BOOKING', 'CONTACT'].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-xs tracking-[0.2em] transition-opacity hover:opacity-70 font-medium"
              style={{ color: '#380b44' }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      {/* Hero content: full-width headline + centered model overlaid on top, matching reference layout */}
      <div className="relative z-10 w-full h-full">
        {/* Tagline — left-aligned, above headline like the reference */}
        <div className="absolute top-[8%] left-[3%]">
          <p
            ref={taglineRef}
            className="text-xs md:text-sm tracking-[0.3em] font-medium"
            style={{ color: '#380b44' }}
          >
            FUTURE LOOKS GOOD ON YOU
          </p>
        </div>

        {/* Full-width centered headline, near the top like the reference */}
        <div className="absolute top-[25%] left-0 right-0 flex justify-center">
          <h1
            ref={headlineRef}
            className="text-[clamp(2.5rem,19.5vw,16rem)] leading-[0.82] tracking-[-0.02em] font-black whitespace-nowrap"
            style={{
              color: '#380b44',
              fontFamily: 'Anton, Impact, Haettenschweiler, sans-serif',
              wordBreak: 'safe',
            }}
          >
            <span className="hero-word">SOUNDARIYA</span>
          </h1>
        </div>

        {/* Model image overlaid on top of headline, centered like the reference */}
        <div
          ref={modelRef}
          className="absolute z-20 top-[10%] left-[46%] -translate-x-1/2 w-[clamp(240px,60vw,320px)] md:w-[clamp(330px,40vw,520px)]"
        >
          <img
            src="/assets/images/dancer 2.png"
            alt="Traditional model"
            className="w-full h-auto object-contain drop-shadow-2xl md:scale-150  scale-150 md:translate-y-18 translate-y-[75px]"
            loading="lazy"
          />
        </div>

        {/* Sub-copy + CTA, left-aligned below headline like the reference */}
        <div className="absolute top-[62%] left-[3%] flex flex-col">
          <p
            ref={subRef}
            className="max-w-md text-base md:text-lg leading-[2.2] font-medium"
            style={{ color: '#380b44' }}
          >
            BEAUTY PARLOUR.<br/> SAME YOU. JUST MORE POTENTIAL.
          </p>

          <div ref={ctaRef} className="mt-10">
            <a
              href="#booking"
              className="inline-flex items-center gap-3 rounded-full px-8 py-3.5 text-xs tracking-[0.25em] transition-all duration-300 hover:scale-105 font-medium shadow-sm"
              style={{
                border: '1.5px solid #380b44',
                color: '#380b44',
                background: 'transparent',
              }}
            >
              EXPLORE THE COLLECTION
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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