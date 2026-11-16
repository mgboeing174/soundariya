// Structured client testimonials consumed by the Orbit Reel (Reviews) section.
//
// Each entry carries the portrait, the service received, the star rating and the
// testimonial text. Portraits reuse the existing gallery assets so no new images
// are required. Services are drawn from the catalogue in src/lib/services.js.

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Meera Iyer',
    photo: '/assets/images/gallery-bridal-1.jpg',
    service: 'Bridal Makeup',
    rating: 5,
    location: 'Chennai',
    review:
      'On my wedding day I felt entirely myself, only more elevated. Every brushstroke respected my features and the final look photographed beautifully from the first photograph to the last.',
  },
  {
    id: 2,
    name: 'Anjali Rao',
    photo: '/assets/images/gallery-bridal-2.jpg',
    service: 'Reception Makeup',
    rating: 5,
    location: 'Bangalore',
    review:
      'The reception look held luminous under every light, from the ceremony through to the last dance. My guests could not stop complimenting the finish.',
  },
  {
    id: 3,
    name: 'Divya Kaur',
    photo: '/assets/images/gallery-hair-1.jpg',
    service: 'Hair Styling',
    rating: 4,
    location: 'Hyderabad',
    review:
      'The styling held beautifully through a long evening. My hair stayed voluminous and glossy, and the team made sure every pin was completely invisible.',
  },
  {
    id: 4,
    name: 'Keerthana Sundaram',
    photo: '/assets/images/gallery-bridal-3.jpg',
    service: 'Saree Draping',
    rating: 5,
    location: 'Coimbatore',
    review:
      'The drape fell absolutely perfectly, pleat after pleat. It survived the ceremonies intact and still looked immaculate when the photos came out.',
  },
  {
    id: 5,
    name: 'Nandhini Varadhan',
    photo: '/assets/images/gallery-1.jpg',
    service: 'Bridal Makeup',
    rating: 5,
    location: 'Madurai',
    review:
      'From the first consultation to the final look, nothing was left to chance. I felt calm, pampered and completely confident the entire morning.',
  },
  {
    id: 6,
    name: 'Harini Menon',
    photo: '/assets/images/gallery-2.jpg',
    service: 'South Indian Bridal Makeup',
    rating: 5,
    location: 'Kochi',
    review:
      'The look honoured the tradition of my family while feeling unmistakably modern. My mother said it was the best bridal makeup she had ever seen.',
  },
  {
    id: 7,
    name: 'Priya Nambiar',
    photo: '/assets/images/gallery-3.jpg',
    service: 'Makeup',
    rating: 4,
    location: 'Chennai',
    review:
      'An effortless, polished look for my engagement. The artist listened closely and delivered something that felt like a more refined version of me.',
  },
  {
    id: 8,
    name: 'Lakshmi Prasad',
    photo: '/assets/images/gallery-hair-2.jpg',
    service: 'Hair Care',
    rating: 5,
    location: 'Visakhapatnam',
    review:
      'The treatment restored my hair after months of wedding styling. Soft, strong and shining — I have already booked my next appointment.',
  },
];

export default TESTIMONIALS;