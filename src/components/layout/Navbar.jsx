import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navbarRef = useRef();
  const mobileMenuRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock / unlock body scroll while the mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // GSAP animations for navbar and mobile menu
  useGSAP(() => {
    // Navbar scroll animation
    gsap.from(navbarRef.current, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power2.out'
    });

    // Mobile menu animation
    if (isMobileMenuOpen && mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        height: 'auto',
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
        onStart: () => {
          mobileMenuRef.current.style.display = 'block';
        }
      });

      // Stagger animation for menu items
      const menuItems = mobileMenuRef.current.querySelectorAll('a');
      gsap.from(menuItems, {
        x: -30,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => {
    if (mobileMenuRef.current) {
      gsap.to(mobileMenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          mobileMenuRef.current.style.display = 'none';
          setIsMobileMenuOpen(false);
        }
      });
    }
  };

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      ref={navbarRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 py-4',
        isScrolled ? 'bg-parlour-blush/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#" className="flex flex-col">
          <span className="text-2xl font-display tracking-wider uppercase font-bold text-parlour-plum">
            Soundariya
          </span>
          <span className="text-[10px] tracking-[0.3em] uppercase text-parlour-plum/70 -mt-1 ml-0.5">
            Beauty Parlour
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs uppercase tracking-widest text-parlour-plum hover:opacity-70 transition-opacity font-medium"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#booking"
            className="btn-luxury-outline text-xs uppercase tracking-widest px-6 py-2 rounded-full"
          >
            Book Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-parlour-plum p-2 rounded-lg hover:bg-parlour-lavender/20 transition-colors"
          onClick={() => {
            if (isMobileMenuOpen) {
              closeMobileMenu();
            } else {
              setIsMobileMenuOpen(true);
            }
          }}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <div className="w-6 h-6 relative">
            {isMobileMenuOpen ? (
              <Icons.X
                size={24}
                className="absolute inset-0 text-parlour-plum transition-all duration-300 transform rotate-90"
              />
            ) : (
              <Icons.Menu
                size={24}
                className="absolute inset-0 text-parlour-plum transition-all duration-300"
              />
            )}
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="md:hidden absolute top-full left-0 right-0 bg-parlour-blush border-t border-parlour-plum/10 shadow-xl overflow-hidden"
        style={{ display: 'none', opacity: 0, height: 0 }}
      >
        <div className="flex flex-col p-4 sm:p-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm uppercase tracking-widest py-3 text-parlour-plum hover:text-parlour-plum/70 transition-colors font-medium border-b border-parlour-plum/5 last:border-0"
              onClick={closeMobileMenu}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#booking"
            className="btn-luxury-primary w-full text-center text-xs uppercase tracking-widest rounded-full py-3 mt-2"
            onClick={closeMobileMenu}
          >
            Book Now
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
