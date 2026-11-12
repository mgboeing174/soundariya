import React, { createContext, useContext, useRef, useState } from 'react';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [selectedService, setSelectedService] = useState('');
  const bookingRef = useRef(null);

  const scrollToBooking = (serviceKey = '') => {
    if (serviceKey) setSelectedService(serviceKey);
    const target = bookingRef.current;
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      const el = document.getElementById('booking');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <BookingContext.Provider
      value={{ selectedService, setSelectedService, scrollToBooking, bookingRef }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return ctx;
}