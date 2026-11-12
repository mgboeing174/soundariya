import React from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Services = () => {
  const containerRef = React.useRef(null);
  const contentRef = React.useRef(null);

  useGSAP(() => {
    if (contentRef.current) {
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        duration: 1,
        ease: 'power2.out',
      });
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="services"
      className="py-28 px-6 relative overflow-hidden bg-parlour-cream"
    >
      <div className="max-w-3xl mx-auto relative z-10 text-center" ref={contentRef}>
        <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-parlour-accent font-medium mb-4">
          THE ART OF BRIDAL BEAUTY
        </span>
        <h2
          className="text-4xl md:text-6xl text-parlour-espresso mb-10"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Bridal Makeup
        </h2>
        <div className="text-lg md:text-xl text-parlour-brown/80 leading-relaxed font-light mb-10 space-y-6" style={{ fontFamily: 'var(--font-sans)' }}>
          <p>
            Every bride deserves to feel extraordinary on her special day. At Soundariya, bridal makeup is thoughtfully crafted to enhance your natural beauty while complementing your personality, traditions and bridal attire.
          </p>
          <p>
            From refined elegance to timeless traditional looks, every detail is carefully considered to make your wedding moments unforgettable.
          </p>
        </div>
        <p className="text-sm tracking-[0.2em] uppercase text-parlour-accent font-medium italic">
          Your day. Your beauty. Your story.
        </p>
      </div>
    </section>
  );
};

export default Services;