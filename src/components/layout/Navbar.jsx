import React, { useState, useEffect, useRef } from 'react';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

/* ============================================================
   LIQUID GLASS NAVBAR
   Premium frosted-glass aesthetic. Tinted with #E7B0DE,
   softened with plum/gold accents. Visual enhancement only —
   spacing, behaviour and navigation logic are unchanged.
   ============================================================ */

const glassStyles = `
  .glass-nav {
    background: rgba(231, 176, 222, 0.16);
    backdrop-filter: blur(22px) saturate(160%);
    -webkit-backdrop-filter: blur(22px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.55);
    box-shadow:
      0 8px 32px -8px rgba(56, 11, 68, 0.18),
      0 2px 0 rgba(255, 255, 255, 0.55) inset,
      0 -1px 0 rgba(56, 11, 68, 0.06) inset;
    transition: background 0.4s ease, backdrop-filter 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
  }

  /* Soft inner light highlight — the "liquid" sheen */
  .glass-nav::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.5) 0%,
      rgba(255, 255, 255, 0.12) 38%,
      rgba(255, 255, 255, 0) 55%,
      rgba(255, 255, 255, 0.18) 100%
    );
    pointer-events: none;
  }

  /* Deeper glass when the page has scrolled behind it */
  .glass-nav.scrolled {
    background: rgba(231, 176, 222, 0.42);
    backdrop-filter: blur(26px) saturate(180%);
    -webkit-backdrop-filter: blur(26px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.7);
    box-shadow:
      0 14px 40px -10px rgba(56, 11, 68, 0.22),
      0 2px 0 rgba(255, 255, 255, 0.6) inset,
      0 -1px 0 rgba(56, 11, 68, 0.08) inset;
  }

  /* Desktop link hover — frosted lift */
  .glass-nav .glass-link:hover {
    color: #380b44;
    background: rgba(255, 255, 255, 0.4);
  }

  /* Desktop CTA — glass active state */
  .glass-nav .glass-cta {
    background: rgba(255, 255, 255, 0.28);
    backdrop-filter: blur(10px) saturate(140%);
    -webkit-backdrop-filter: blur(10px) saturate(140%);
    border: 1px solid rgba(56, 11, 68, 0.3);
    color: #380b44;
  }
  .glass-nav .glass-cta:hover {
    background: rgba(56, 11, 68, 0.92);
    color: #fff;
    border-color: rgba(56, 11, 68, 0.9);
  }

  /* Mobile toggle button — glass */
  .glass-toggle {
    background: rgba(255, 255, 255, 0.28);
    backdrop-filter: blur(10px) saturate(140%);
    -webkit-backdrop-filter: blur(10px) saturate(140%);
    border: 1px solid rgba(56, 11, 68, 0.18);
  }
  .glass-toggle:hover {
    background: rgba(255, 255, 255, 0.5);
  }

  /* Mobile drawer — full glass panel */
  .glass-drawer {
    background: rgba(231, 176, 222, 0.9);
    backdrop-filter: blur(24px) saturate(170%);
    -webkit-backdrop-filter: blur(24px) saturate(170%);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-top: 1px solid rgba(255, 255, 255, 0.7);
    border-bottom: 1px solid rgba(56, 11, 68, 0.08);
    box-shadow:
      0 24px 60px -16px rgba(56, 11, 68, 0.28),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }
  .glass-drawer::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.35), transparent 50%);
    pointer-events: none;
  }
  .glass-drawer .glass-drawer-link:hover {
    color: #380b44;
    background: rgba(255, 255, 255, 0.45);
  }
  .glass-drawer .glass-drawer-cta {
    background: rgba(56, 11, 68, 0.92);
    color: #fff;
  }
`;

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
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'glass-nav scrolled py-3' : 'glass-nav py-4 px-4 sm:px-6'
      )}
    >
      <style dangerouslySetInnerHTML={{ __html: glassStyles }} />

      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="#" className="flex flex-col">
          <span className="text-2xl font-display tracking-wider uppercase font-bold text-parlour-plum">
            Soundarya
          </span>

        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="glass-link text-xs uppercase tracking-widest text-parlour-plum hover:opacity-70 transition-opacity font-medium px-2 py-1 rounded-full"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#booking"
            className="glass-cta btn-luxury-outline text-xs uppercase tracking-widest px-6 py-2 rounded-full"
          >
            Book Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          className="glass-toggle md:hidden text-parlour-plum p-2 rounded-lg transition-colors"
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
        className="glass-drawer md:hidden absolute top-full left-0 right-0 overflow-hidden"
        style={{ display: 'none', opacity: 0, height: 0 }}
      >
        <div className="relative flex flex-col p-4 sm:p-6 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="glass-drawer-link text-sm uppercase tracking-widest py-3 text-parlour-plum hover:text-parlour-plum/70 transition-colors font-medium border-b border-parlour-plum/5 last:border-0 px-2 rounded-lg"
              onClick={closeMobileMenu}
            >
              {link.name}
            </a>
          ))}
          <a
            href="#booking"
            className="glass-drawer-cta btn-luxury-primary w-full text-center text-xs uppercase tracking-widest rounded-full py-3 mt-2"
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
