// Structured client testimonials consumed by the Orbit Reel (Reviews) section.
//
// Each entry carries the portrait, the service received, the star rating and the
// testimonial text. Portraits reuse the existing gallery assets so no new images
// are required. Services are drawn from the catalogue in src/lib/services.js.

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Meera',
    photo: "/assets/images/bridal 1.jpg",
    service: 'Bridal Makeup',
    rating: 5,
    location: 'karaikudi',
    review:
      'On my wedding day I felt entirely myself, only more elevated. ',
  },
  {
    id: 2,
    name: 'Anjali',
    photo: '/assets/images/bridal 2.jpg',
    service: 'Reception Makeup',
    rating: 5,
    location: 'ariyakudi',
    review:
      'The reception look held luminous under every light, from the ceremony through to the last dance. ',
  },
  {
    id: 3,
    name: 'Divya Murugan',
    photo: '/assets/images/bridal 3.jpg',
    service: 'Hair Styling',
    rating: 4,
    location: 'karaikudi',
    review:
      'The styling held beautifully through a long evening. My hair stayed voluminous and glossy',
  },
  {
    id: 4,
    name: 'Keerthana Sundaram',
    photo: '/assets/images/bridal 4.jpg',
    service: 'Saree Draping',
    rating: 5,
    location: 'kandanur',
    review:
      'The drape fell absolutely perfectly, pleat after pleat.',
  },
  {
    id: 5,
    name: 'Nandhini',
    photo: '/assets/images/bridal 5.jpg',
    service: 'Bridal Makeup',
    rating: 5,
    location: 'puduvayal',
    review:
      'From the first consultation to the final look, nothing was left to chance.',
  },
  {
    id: 6,
    name: 'Harini B',
    photo: '/assets/images/bridal 6.jpg',
    service: 'South Indian Bridal Makeup',
    rating: 5,
    location: 'Karaikudi',
    review:
      'The look honoured the tradition of my family while feeling unmistakably modern.',
  },
  {
    id: 7,
    name: 'Priya A',
    photo: '/assets/images/bridal 7.jpg',
    service: 'Makeup',
    rating: 4,
    location: 'kottaiyur',
    review:
      'An effortless, polished look for my engagement. W soundarya',
  },
  {
    id: 8,
    name: 'Pooja M',
    photo: '/assets/images/bridal 8.jpg',
    service: 'Bridal makeup',
    rating: 5,
    location: 'kalanivasal',
    review:
      'I felt absolutely beautiful on my wedding day. The makeup looked flawless, natural, and stayed perfect.',
  },
];

export default TESTIMONIALS;