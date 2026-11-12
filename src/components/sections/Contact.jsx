import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const INSTAGRAM = 'https://www.instagram.com/the_soundaryabridalmakeup';
const WHATSAPP = '917094036158';
const MAP_SRC = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1254927.60959982!2d78.4426!3d10.3296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39bfe84663b6a7e3%3A0x8b7c3e1f5a6b4d2c!2sKandanur%2C%20Karaikudi%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';

const Contact = () => {
  const contactRef = useRef(null);
  const mapRef = useRef(null);
  const infoRef = useRef(null);
  const [message, setMessage] = useState('');

  useGSAP(() => {
    gsap.from(contactRef.current, {
      scrollTrigger: {
        trigger: contactRef.current,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out',
    });

    // Reveal the card-luxury container (App.jsx sets opacity:0 on mount)
    const infoCard = contactRef.current?.querySelector('.card-luxury');
    if (infoCard) {
      gsap.to(infoCard, {
        scrollTrigger: {
          trigger: infoCard,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      });
    }

    const items = contactRef.current?.querySelectorAll('.contact-item');
    if (items) {
      gsap.from(items, {
        scrollTrigger: {
          trigger: contactRef.current,
          start: 'top 50%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }
  }, { scope: contactRef });

  const sendMessage = (e) => {
    e.preventDefault();
    const text = encodeURIComponent(message.trim() || 'Hi, I would like to book a bridal makeup consultation.');
    window.open(`https://wa.me/${WHATSAPP}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      ref={contactRef}
      id="contact"
      className="py-24 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #f3d4e0 0%, #fce4ec 100%)' }}
    >
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(218,158,210,0.35)' }} />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(225,161,213,0.4)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-display uppercase tracking-tight text-parlour-plum mb-6">
            Visit Us
          </h2>
          <p className="text-xl text-parlour-plum/80 max-w-2xl mx-auto">
            Reach out directly or visit us at our location. We are here to help you plan your bridal look.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-stretch justify-center">
          <div
            ref={mapRef}
            className="map-card relative rounded-2xl overflow-hidden shadow-lg w-full lg:w-[520px] h-[390px] flex-shrink-0"
          >
            <iframe
              title="Soundariya Beauty Parlour — Kandanur, Karaikudi"
              src={MAP_SRC}
              className="absolute inset-0 w-full h-full border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(56,11,68,0.12), transparent)' }} />
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-parlour-plum/10">
              <p className="text-parlour-plum font-bold text-sm">Soundariya Beauty Parlour</p>
              <p className="text-parlour-plum/70 text-xs">Kandanur, Karaikudi, Tamil Nadu</p>
            </div>
          </div>

          <div ref={infoRef} className="card-luxury p-6 sm:p-8 md:p-10 rounded-2xl shadow-lg bg-white relative flex flex-col w-full lg:w-[520px] lg:h-[590px] flex-shrink-0">
            <div className="absolute top-0 left-0 w-24 h-1 bg-gradient-to-r from-parlour-lavender to-transparent rounded-full" />
            <div className="absolute bottom-0 right-0 w-24 h-1 bg-gradient-to-l from-parlour-lavender to-transparent rounded-full" />

            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-2xl font-display uppercase tracking-wide text-parlour-plum mb-8 relative z-10">
                Contact Information
              </h3>

              <div className="space-y-8 relative z-10">
                <div className="contact-item">
                  <p className="text-parlour-plum/60 text-xs uppercase tracking-widest mb-1 font-medium">Address</p>
                  <p className="text-parlour-plum font-semibold text-lg">Kandanur, Karaikudi, Tamil Nadu</p>
                </div>

                <div className="contact-item">
                  <p className="text-parlour-plum/60 text-xs uppercase tracking-widest mb-1 font-medium">Phone</p>
                  <a
                    href={`https://wa.me/${WHATSAPP}`}
                    className="text-parlour-plum font-semibold text-lg hover:text-parlour-lavender transition-colors duration-300"
                  >
                    +91 70940 36158
                  </a>
                </div>

                <div className="contact-item">
                  <p className="text-parlour-plum/60 text-xs uppercase tracking-widest mb-2 font-medium">Instagram</p>
                  <a
                    href={INSTAGRAM}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-parlour-plum font-semibold text-lg hover:text-parlour-lavender transition-colors duration-300"
                  >
                    @the_soundaryabridalmakeup
                  </a>
                </div>
              </div>
            </div>

            <form onSubmit={sendMessage} className="mt-10 pt-8 border-t border-parlour-plum/10 relative z-10">
              <label className="block text-parlour-plum/60 text-xs uppercase tracking-widest mb-2 font-medium">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Tell us about your wedding date or bridal look..."
                className="w-full rounded-xl border border-parlour-plum/15 bg-parlour-blush/40 px-4 py-3 text-parlour-plum text-sm focus:outline-none focus:ring-2 focus:ring-parlour-lavender resize-none"
              />
              <button
                type="submit"
                className="mt-4 inline-flex items-center justify-between w-full btn-luxury-primary px-5 py-3 rounded-full text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.02]"
              >
                <span>Send via WhatsApp</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;