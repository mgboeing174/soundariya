import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const About = () => {
  const aboutRef = useRef(null);
  const textRef = useRef(null);
  const imageRef = useRef(null);

  useGSAP(() => {
    if (!textRef.current || !imageRef.current) return;

    gsap.from(textRef.current, {
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: -50,
      duration: 1,
      ease: 'power2.out',
    });

    gsap.from(imageRef.current, {
      scrollTrigger: {
        trigger: imageRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      scale: 1.2,
      duration: 1.2,
      ease: 'power2.out',
    });

    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: aboutRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
      y: -30,
      scale: 1.05,
      ease: 'none',
    });

    gsap.from(textRef.current.querySelectorAll('p'), {
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 60%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power2.out',
    });

    gsap.from(textRef.current.querySelectorAll('a'), {
      scrollTrigger: {
        trigger: textRef.current,
        start: 'top 50%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
    });
  }, { scope: aboutRef });

  return (
    <section
      ref={aboutRef}
      id="about"
      className="py-24 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fce4ec 0%, #f3d4e0 100%)' }}
    >
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl" style={{ background: 'rgba(218,158,210,0.35)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-2xl" style={{ background: 'rgba(225,161,213,0.4)' }} />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-16 items-center relative z-10 px-6">
        <div ref={textRef} className="space-y-6 order-2 md:order-1">
          <h2 className="text-3xl md:text-5xl text-parlour-plum mb-6 leading-tight">
            A Haven of Serenity
          </h2>
          <p className="text-parlour-plum/80 leading-relaxed text-sm md:text-base">
            At Soundariya Beauty Parlour, we believe that true beauty is an expression of inner peace and personal care. Nestled in the heart of the city, our parlour offers a sanctuary where modern expertise meets timeless traditions.
          </p>
          <p className="text-parlour-plum/80 leading-relaxed text-sm md:text-base">
            Our team of dedicated professionals uses only the finest, carefully curated products to ensure every service leaves you feeling rejuvenated, confident, and celebrated.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#services"
              className="btn-luxury-outline px-6 md:px-8 py-3 rounded-full text-[10px] md:text-sm uppercase tracking-wider transition-all duration-300"
            >
              Our Services
            </a>
            <a
              href="#booking"
              className="btn-luxury-primary px-6 md:px-8 py-3 rounded-full text-[10px] md:text-sm uppercase tracking-wider transition-all duration-300"
            >
              Book Now
            </a>
          </div>
        </div>

        <div ref={imageRef} className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2">
          <div className="absolute inset-0 z-10 rounded-2xl" style={{ background: 'linear-gradient(135deg, rgba(56,11,68,0.18), rgba(218,158,210,0.12))' }} />
          <img
            src="/assets/images/about-interior.jpg"
            alt="Soundariya Beauty Parlour Interior"
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default About;