import React, { Suspense, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { BookingProvider, useBooking } from './contexts/BookingContext';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Services from './components/sections/Services';
import Gallery from './components/sections/Gallery';
import Contact from './components/sections/Contact';
import Booking from './components/sections/Booking';
import Reviews from './components/sections/Reviews';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(useGSAP);
}

function AppContent() {
  // Global GSAP setup for performance
  useGSAP(() => {
    // Prevent layout shifts
    gsap.set('.section', { opacity: 0, y: 30 });
    gsap.set('.card-luxury', { opacity: 0, y: 40 });
    gsap.set('.image-reveal', { scale: 1.1, opacity: 0 });
  });

  return (
    <div className="min-h-screen bg-parlour-blush text-parlour-plum selection:bg-parlour-lavender selection:text-parlour-plum">
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <Booking />
        <Contact />
        <Reviews />
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <BookingProvider>
      <AppContent />
    </BookingProvider>
  );
}

export default App;
