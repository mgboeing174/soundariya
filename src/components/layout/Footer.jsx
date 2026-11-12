import React from 'react';
import { MapPin, Phone, Mail, Camera, Users, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-parlour-plum text-parlour-blush pt-16 pb-8 px-6 border-t border-parlour-plum-deep">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-6">
          <div>
            <h3 className="text-2xl font-display tracking-wider uppercase font-bold text-white">
              Soundariya
            </h3>
            <p className="text-[10px] tracking-[0.3em] uppercase text-parlour-lavender">
              Beauty Parlour
            </p>
          </div>
          <p className="text-sm leading-relaxed text-parlour-blush/80 max-w-xs">
            Experience the pinnacle of luxury beauty and wellness. Our expert team is dedicated to enhancing your natural radiance through bespoke treatments.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-parlour-lavender transition-colors"><Camera size={20} /></a>
            <a href="#" className="hover:text-parlour-lavender transition-colors"><Users size={20} /></a>
            <a href="#" className="hover:text-parlour-lavender transition-colors"><MessageCircle size={20} /></a>
          </div>
        </div>

        <div>
          <h4 className="font-display uppercase tracking-wider text-base mb-6 text-white">Quick Links</h4>
          <ul className="space-y-3 text-sm text-parlour-blush/80">
            <li><a href="#" className="hover:text-parlour-lavender transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-parlour-lavender transition-colors">About Us</a></li>
            <li><a href="#services" className="hover:text-parlour-lavender transition-colors">Services</a></li>
            <li><a href="#gallery" className="hover:text-parlour-lavender transition-colors">Gallery</a></li>
            <li><a href="#booking" className="hover:text-parlour-lavender transition-colors">Book Appointment</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display uppercase tracking-wider text-base mb-6 text-white">Contact</h4>
          <ul className="space-y-4 text-sm text-parlour-blush/80">
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="shrink-0 text-parlour-lavender mt-0.5" />
              <span>Kandanur, Karaikudi<br />Tamil Nadu</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="shrink-0 text-parlour-lavender" />
              <a href="https://wa.me/917094036158" className="hover:text-parlour-lavender transition-colors">+91 70940 36158</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display uppercase tracking-wider text-base mb-6 text-white">Hours</h4>
          <ul className="space-y-2 text-sm text-parlour-blush/80">
            <li className="flex justify-between">
              <span>Mon - Fri</span>
              <span>10:00 AM - 8:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span>Saturday</span>
              <span>10:00 AM - 9:00 PM</span>
            </li>
            <li className="flex justify-between text-parlour-lavender">
              <span>Sunday</span>
              <span>11:00 AM - 6:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest text-parlour-blush/60">
        <p>© 2024 Soundariya Beauty Parlour. All Rights Reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
