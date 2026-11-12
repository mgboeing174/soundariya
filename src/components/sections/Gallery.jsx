import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import BeforeAfterSlider from './BeforeAfterSlider';
import beforeImage from '../../assets/images/before.png';
import afterImage from '../../assets/images/after.png';

const quoteVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.4, 0, 0.2, 1] },
  }),
};

const Gallery = () => {
  const containerRef = useRef(null);
  const galleryRef = useRef(null);

  useGSAP(() => {
    if (galleryRef.current) {
      gsap.from(galleryRef.current, {
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power2.out',
      });
    }
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="gallery"
      className="py-28 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(to bottom, #f3d4e0, #fce4ec)' }}
    >
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(218,158,210,0.35)' }} />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full blur-2xl pointer-events-none" style={{ background: 'rgba(225,161,213,0.4)' }} />

      <div className="max-w-4xl mx-auto relative z-10">
        <div ref={galleryRef} className="text-center mb-12">
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-parlour-accent font-medium mb-4">
            REAL BEAUTY, TIMELESS MEMORIES
          </span>
          <h2 className="text-4xl md:text-6xl text-parlour-plum mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Every Bride Has Her Moment
          </h2>
          <p className="text-lg text-parlour-plum/70 max-w-2xl mx-auto">
            A glimpse into the art of bridal transformation, where every detail comes together to celebrate the bride.
          </p>
        </div>

        {/* Standalone Before & After Transformation showcase */}
        <div className="mb-24 bg-white/60 backdrop-blur-md p-6 sm:p-10 rounded-3xl border border-parlour-plum/10 shadow-xl">
          <BeforeAfterSlider
            beforeImage={beforeImage}
            afterImage={afterImage}
            beforeLabel="BEFORE"
            afterLabel="AFTER"
            title="Before & After Transformation"
            subtitle="Slide to experience the difference our signature bridal makeover brings"
          />
        </div>

        {/* Editorial bridal quotes */}
        <div className="max-w-2xl mx-auto space-y-10">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={quoteVariants}
            className="text-center"
          >
            <p className="text-xl md:text-2xl text-parlour-plum italic leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
              &ldquo;On your special day, let your beauty tell your story.&rdquo;
            </p>
          </motion.div>

          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-parlour-rose" />
            <span className="text-parlour-accent text-sm tracking-[0.3em] uppercase font-medium">✦</span>
            <span className="h-px w-16 bg-parlour-rose" />
          </div>

          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={quoteVariants}
            className="text-center"
          >
            <p className="text-xl md:text-2xl text-parlour-plum italic leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
              &ldquo;Elegance is not about changing who you are. It is about bringing out the beauty that is already yours.&rdquo;
            </p>
          </motion.div>

          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-parlour-rose" />
            <span className="text-parlour-accent text-sm tracking-[0.3em] uppercase font-medium">✦</span>
            <span className="h-px w-16 bg-parlour-rose" />
          </div>

          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={quoteVariants}
            className="text-center"
          >
            <p className="text-xl md:text-2xl text-parlour-plum italic leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
              &ldquo;A timeless bridal look for a moment you will cherish forever.&rdquo;
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;