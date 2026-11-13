import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { CheckCircle, AlertCircle, Loader2, MapPin } from 'lucide-react';
import { services, serviceLabel } from '../../lib/services';
import { useBooking } from '../../contexts/BookingContext';

// Booking form only offers these four services.
const BOOKABLE_SERVICES = ['makeup', 'bridal-makeup', 'hair-styling', 'saree-draping'];

// Business WhatsApp number (digits only, no country prefix — wa.me requires this format).
const WHATSAPP = '917094036158';

// Normalize any Indian phone input to wa.me format: "91" + 10 local digits.
// Strips spaces, parentheses, hyphens, dots, a leading "0", and a stray standalone "91".
const normalizePhone = (raw) => {
  let digits = (raw || '').replace(/\D/g, '');
  if (digits.startsWith('0')) digits = digits.slice(1);
  if (digits === '91') digits = '';
  if (digits.startsWith('91') && digits.length > 10) digits = digits.slice(-10);
  return `91${digits.slice(-10)}`;
};

// Build a professional, line-broken booking payload for the WhatsApp message.
const buildBookingMessage = (data) => {
  const serviceName = serviceLabel(data.service) || data.service;
  const lines = [
    'Soundariya Beauty Parlour — Booking Request',
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    `Email: ${data.email}`,
    `Service: ${serviceName}`,
    `Preferred Date: ${data.date}`,
    `Preferred Time: ${data.time}`,
  ];
  if (data.message) lines.push(`Notes: ${data.message}`);
  return encodeURIComponent(lines.join('\n'));
};

const pad = (n) => String(n).padStart(2, '0');
const todayLocalStr = () => {
  const t = new Date();
  return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`;
};

const Booking = () => {
  const { selectedService, setSelectedService, bookingRef } = useBooking();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: selectedService || '',
    date: '',
    time: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waSent, setWaSent] = useState(false);
  const [waSentName, setWaSentName] = useState('');

  const sectionRef = useRef(null);
  const formRef = useRef(null);

  // Sync selected service if triggered from Services section
  useEffect(() => {
    if (selectedService) {
      setFormData((prev) => ({ ...prev, service: selectedService }));
    }
  }, [selectedService]);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.from(sectionRef.current, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power2.out',
    });
  }, { scope: sectionRef });

  const validate = () => {
    const errs = {};

    // 1. Name
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters long.';
    }

    // 2. Email
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    // 3. Phone — normalize first, then validate the 10-digit local number.
    //    Fixes: double country-prefix acceptance, leading-zero rejection, and
    //    parenthesised/spaced input that the old regex rejected.
    const normalized = normalizePhone(formData.phone);
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[6-9]\d{9}$/.test(normalized.slice(2))) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).';
    }

    // 4. Service
    if (!formData.service) {
      errs.service = 'Please select a service.';
    }

    // 5. Date (cannot be past) — timezone-safe: compare date-only values, not UTC
    //    midnight vs local midnight (which breaks for users west of UTC).
    if (!formData.date) {
      errs.date = 'Preferred date is required.';
    } else {
      const [y, m, d] = formData.date.split('-').map(Number);
      const selected = new Date(y, m - 1, d);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errs.date = 'Date cannot be in the past.';
      }
    }

    // 6. Time
    if (!formData.time) {
      errs.time = 'Preferred time slot is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setWaSent(false);
    setErrors({});

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Brief visual confirmation while the WhatsApp tab opens.
    setTimeout(() => {
      const text = buildBookingMessage({
        ...formData,
        phone: normalizePhone(formData.phone),
      });
      window.open(`https://wa.me/${WHATSAPP}?text=${text}`, '_blank', 'noopener,noreferrer');

      setWaSentName(formData.name.trim());
      setWaSent(true);
      setIsSubmitting(false);

      // Clear form fields except the selected service.
      setFormData((prev) => ({
        name: '',
        email: '',
        phone: '',
        service: prev.service,
        date: '',
        time: '',
        message: '',
      }));
      setErrors({});
    }, 700);
  };

  const todayStr = todayLocalStr();

  return (
    <section
      ref={bookingRef}
      id="booking"
      className="py-28 px-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #fce4ec 0%, #f3d4e0 100%)' }}
    >
      <div ref={sectionRef} className="max-w-6xl mx-auto relative z-10">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-parlour-plum/10 flex flex-col lg:flex-row">

          {/* Left Panel: Visual & Brand Image */}
          <div className="lg:w-5/12 relative min-h-[320px] lg:min-h-full flex flex-col justify-end p-8 md:p-12 text-white overflow-hidden">
            <img
              src="/assets/images/booking-hero.jpg"
              alt="Soundariya salon luxury bridal makeover experience"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-parlour-plum/95 via-parlour-plum/40 to-transparent z-10" />

            <div className="relative z-20 space-y-4">
              <span className="inline-block text-[10px] tracking-[0.3em] uppercase text-parlour-lavender font-bold">
                Bespoke Pampering
              </span>
              <h3
                className="text-3xl md:text-4xl text-white uppercase tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                The Soundariya Experience
              </h3>
              <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                Book your journey to radiance today. I'm ready to curate a personalized ritual tailored to you.
              </p>
              <div className="pt-4 border-t border-white/20 text-[11px] text-parlour-blush/90 flex flex-col gap-1">
                <span className="flex items-center gap-1.5">
                  <MapPin size={12} className="shrink-0" /> Kandanur, Karaikudi, Tamil Nadu
                </span>
              </div>
            </div>
          </div>

          {/* Right Panel: Visible & Functional Booking Form */}
          <div className="lg:w-7/12 p-8 md:p-14 bg-white">
            <div className="max-w-xl mx-auto">
              <span className="text-[10px] tracking-[0.3em] uppercase text-parlour-accent font-bold block mb-2">
                Reserve Your Appointment
              </span>
              <h2
                className="text-3xl md:text-5xl text-parlour-plum mb-4 uppercase tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Book Appointment
              </h2>
              <p className="text-parlour-plum/70 text-sm mb-8 leading-relaxed font-medium">
                Select your preferred service, date and time slot below.
              </p>

              {/* WhatsApp confirmation notice — replaces the fake "booking logged" state.
                  This only appears AFTER the WhatsApp tab has been opened with a
                  pre-filled message containing every field the customer entered. */}
              {waSent && (
                <div
                  role="status"
                  aria-live="polite"
                  className="mb-8 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-4 animate-fade-in"
                >
                  <CheckCircle size={24} className="text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-2 text-xs sm:text-sm">
                    <h4 className="font-bold text-emerald-900 text-base">
                      WhatsApp message opened
                    </h4>
                    <p>
                      Thank you, <strong>{waSentName}</strong>. A WhatsApp message has been opened to our team with
                      your name, phone, email, service, preferred date and time. Please send it so we can confirm
                      your appointment.
                    </p>
                    <p className="text-emerald-700 text-xs italic pt-1 border-t border-emerald-200/60">
                      Tip: if the tab didn't open, please allow pop-ups or send the message manually to{' '}
                      <a href="https://wa.me/917094036158" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                        +91 70940 36158
                      </a>.
                    </p>
                  </div>
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">

                {/* 1. Full Name */}
                <div>
                  <label htmlFor="booking-name" className="block text-[11px] uppercase tracking-[0.15em] text-parlour-plum font-bold mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="booking-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: null });
                    }}
                    className={`w-full bg-parlour-cream/40 p-3.5 text-parlour-plum font-medium rounded-xl border transition-all text-sm outline-none ${
                      errors.name
                        ? 'border-red-500 bg-red-50/50 focus:ring-2 focus:ring-red-400'
                        : 'border-parlour-plum/20 focus:border-parlour-plum focus:bg-white focus:ring-2 focus:ring-parlour-plum/10'
                    }`}
                  />
                  {errors.name && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle size={12} /> {errors.name}
                    </p>
                  )}
                </div>

                {/* 2 & 3: Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="booking-email" className="block text-[11px] uppercase tracking-[0.15em] text-parlour-plum font-bold mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="booking-email"
                      name="email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: null });
                      }}
                      className={`w-full bg-parlour-cream/40 p-3.5 text-parlour-plum font-medium rounded-xl border transition-all text-sm outline-none ${
                        errors.email
                          ? 'border-red-500 bg-red-50/50 focus:ring-2 focus:ring-red-400'
                          : 'border-parlour-plum/20 focus:border-parlour-plum focus:bg-white focus:ring-2 focus:ring-parlour-plum/10'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle size={12} /> {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="booking-phone" className="block text-[11px] uppercase tracking-[0.15em] text-parlour-plum font-bold mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="booking-phone"
                      name="phone"
                      type="tel"
                      required
                      placeholder="98765 43210"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: null });
                      }}
                      className={`w-full bg-parlour-cream/40 p-3.5 text-parlour-plum font-medium rounded-xl border transition-all text-sm outline-none ${
                        errors.phone
                          ? 'border-red-500 bg-red-50/50 focus:ring-2 focus:ring-red-400'
                          : 'border-parlour-plum/20 focus:border-parlour-plum focus:bg-white focus:ring-2 focus:ring-parlour-plum/10'
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle size={12} /> {errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* 4 & 5: Choose Service and Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="booking-service" className="block text-[11px] uppercase tracking-[0.15em] text-parlour-plum font-bold mb-2">
                      Choose Service <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="booking-service"
                      name="service"
                      required
                      value={formData.service}
                      onChange={(e) => {
                        setFormData({ ...formData, service: e.target.value });
                        if (errors.service) setErrors({ ...errors, service: null });
                      }}
                      className={`w-full bg-parlour-cream/40 p-3.5 text-parlour-plum font-medium rounded-xl border transition-all text-sm outline-none ${
                        errors.service
                          ? 'border-red-500 bg-red-50/50 focus:ring-2 focus:ring-red-400'
                          : 'border-parlour-plum/20 focus:border-parlour-plum focus:bg-white focus:ring-2 focus:ring-parlour-plum/10'
                      }`}
                    >
                      <option value="">Select a service</option>
                      {services
                        .filter((s) => BOOKABLE_SERVICES.includes(s.key))
                        .map((s) => (
                          <option key={s.key} value={s.key}>
                            {s.name}
                          </option>
                        ))}
                    </select>
                    {errors.service && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle size={12} /> {errors.service}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="booking-date" className="block text-[11px] uppercase tracking-[0.15em] text-parlour-plum font-bold mb-2">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="booking-date"
                      name="date"
                      type="date"
                      required
                      min={todayStr}
                      value={formData.date}
                      onChange={(e) => {
                        setFormData({ ...formData, date: e.target.value });
                        if (errors.date) setErrors({ ...errors, date: null });
                      }}
                      className={`w-full bg-parlour-cream/40 p-3.5 text-parlour-plum font-medium rounded-xl border transition-all text-sm outline-none ${
                        errors.date
                          ? 'border-red-500 bg-red-50/50 focus:ring-2 focus:ring-red-400'
                          : 'border-parlour-plum/20 focus:border-parlour-plum focus:bg-white focus:ring-2 focus:ring-parlour-plum/10'
                      }`}
                    />
                    {errors.date && (
                      <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                        <AlertCircle size={12} /> {errors.date}
                      </p>
                    )}
                  </div>
                </div>

                {/* 6. Preferred Time */}
                <div>
                  <label htmlFor="booking-time" className="block text-[11px] uppercase tracking-[0.15em] text-parlour-plum font-bold mb-2">
                    Preferred Time Slot <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="booking-time"
                    name="time"
                    required
                    value={formData.time}
                    onChange={(e) => {
                      setFormData({ ...formData, time: e.target.value });
                      if (errors.time) setErrors({ ...errors, time: null });
                    }}
                    className={`w-full bg-parlour-cream/40 p-3.5 text-parlour-plum font-medium rounded-xl border transition-all text-sm outline-none ${
                      errors.time
                        ? 'border-red-500 bg-red-50/50 focus:ring-2 focus:ring-red-400'
                        : 'border-parlour-plum/20 focus:border-parlour-plum focus:bg-white focus:ring-2 focus:ring-parlour-plum/10'
                    }`}
                  >
                    <option value="">Select a time slot</option>
                    <option value="10:00 AM">10:00 AM - Morning Slot</option>
                    <option value="11:30 AM">11:30 AM - Late Morning Slot</option>
                    <option value="01:30 PM">01:30 PM - Afternoon Slot</option>
                    <option value="03:00 PM">03:00 PM - Late Afternoon Slot</option>
                    <option value="05:00 PM">05:00 PM - Evening Slot</option>
                    <option value="06:30 PM">06:30 PM - Late Evening Slot</option>
                  </select>
                  {errors.time && (
                    <p className="text-red-600 text-xs mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle size={12} /> {errors.time}
                    </p>
                  )}
                </div>

                {/* 7. Additional Message */}
                <div>
                  <label htmlFor="booking-message" className="block text-[11px] uppercase tracking-[0.15em] text-parlour-plum font-bold mb-2">
                    Additional Notes / Requests (Optional)
                  </label>
                  <textarea
                    id="booking-message"
                    name="message"
                    rows={3}
                    placeholder="Mention skin concerns, preferred stylist, or event details..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-parlour-cream/40 p-3.5 text-parlour-plum font-medium rounded-xl border border-parlour-plum/20 focus:border-parlour-plum focus:bg-white focus:ring-2 focus:ring-parlour-plum/10 transition-all text-sm outline-none resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 btn-luxury-primary rounded-xl py-4 font-bold text-xs tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Processing Request...</span>
                      </>
                    ) : (
                      <span>Request Appointment</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ name: '', email: '', phone: '', service: '', date: '', time: '', message: '' });
                      setErrors({});
                      setSubmitSuccess(null);
                    }}
                    className="btn-luxury-outline rounded-xl px-8 py-4 font-bold text-xs tracking-[0.2em] hover:bg-parlour-plum/5"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;