export interface PackageType {
  id: string;
  name: string;
  type: 'hajj' | 'umrah';
  duration: string;
  prices: {
    double: number;
    triple: number;
    quad: number;
    quint: number;
  };
  hotels: { name: string; city: string; distance: string }[];
  services: string[];
  inclusions: string[];
  image: string;
  featured?: boolean;
}

export const hajjPackages: PackageType[] = [
  {
    id: 'hajj-economy',
    name: 'Economy Hajj Package',
    type: 'hajj',
    duration: '20 Days',
    prices: { double: 2279000, triple: 2179000, quad: 2079000, quint: 1985000 },
    hotels: [
      { name: 'MovInPick-Hajar Tower', city: 'Makkah', distance: '400m from Haram' },
      { name: 'Grand Plaza Badr Al-Maqam', city: 'Madinah', distance: '600m from Masjid Nabawi' },
      { name: 'Behind Souq Salam', city: 'Makkah (Aziziya)', distance: '2–4 km from Masjid al-Haram' }
    ],
    services: ['Visa Processing', 'Return Air Ticket', 'Transport (AC Bus)', 'Meals (3 times)', 'Ziyarat Tours', 'Laundry Service'],
    inclusions: ['Ihram', 'Hajj Guide Book', 'Travel Bag', 'ID Card', '24/7 Support', 'Medical Aid'],
    image: 'hajj',
  },
  {
    id: 'hajj-standard',
    name: 'Standard Hajj Package',
    type: 'hajj',
    duration: '20 Days',
    prices: { double: 1895000, triple: 1795000, quad: 1695000, quint: 1595000 },
    hotels: [
      { name: 'Anjum Hotel', city: 'Makkah', distance: '450m from Haram' },
      { name: 'Grand Plaza Badr Al-Maqam', city: 'Madinah', distance: '600m from Masjid Nabawi' },
      { name: 'Behind Souq Salam', city: 'Makkah (Aziziya)', distance: '2–4 km from Masjid al-Haram' }
    ],
    services: ['Visa Processing', 'Return Air Ticket (PIA/Saudi)', 'Private AC Transport', 'Buffet Meals (3 times)', 'Complete Ziyarat', 'Laundry & Ironing'],
    inclusions: ['Ihram', 'Hajj Training Sessions', 'Premium Travel Kit', 'ID Card', 'Dedicated Guide', 'Medical Insurance'],
    image: 'hajj',
    featured: true,
  },
  {
    id: 'hajj-premium',
    name: 'Premium Hajj Package',
    type: 'hajj',
    duration: '30 Days',
    prices: { double: 2179000, triple: 2079000, quad: 1979000, quint: 1879000 },
    hotels: [
      { name: 'Anjum Hotel', city: 'Makkah', distance: '450m from Haram' },
      { name: 'Grand Plaza Badr Al-Maqam', city: 'Madinah', distance: '600m from Masjid Nabawi' },
      { name: 'Behind Souq Salam', city: 'Makkah (Aziziya)', distance: '2–4 km from Masjid al-Haram' }
    ],
    services: ['VIP Visa Processing', 'Business Class Air Ticket', 'Private Luxury Transport', 'Premium Dining', 'Private Ziyarat Tours', 'Personal Assistant'],
    inclusions: ['Premium Ihram Set', 'Private Hajj Training', 'Luxury Travel Kit', 'Gold ID Card', 'Personal Hajj Guide', 'Comprehensive Medical Coverage'],
    image: 'hajj',
  },
  {
    id: 'hajj-short',
    name: 'Concise Hajj Package',
    type: 'hajj',
    duration: '13/14 Days',
    prices: { double: 1934000, triple: 1874000, quad: 1839000, quint: 1780000 },
    hotels: [
      { name: 'Grand Plaza Badr Al-Maqam', city: 'Madinah', distance: '600m from Masjid Nabawi' },
      { name: 'Behind Souq Salam', city: 'Makkah (Aziziya)', distance: '2–4 km from Masjid al-Haram' }
    ],
    services: ['VIP Visa Processing', 'Business Class Air Ticket', 'Private Luxury Transport', 'Premium Dining', 'Private Ziyarat Tours', 'Personal Assistant'],
    inclusions: ['Premium Ihram Set', 'Private Hajj Training', 'Luxury Travel Kit', 'Gold ID Card', 'Personal Hajj Guide', 'Comprehensive Medical Coverage'],
    image: 'hajj',
  },
  {
    id: 'hajj-platinium',
    name: 'Platinium Hajj Package',
    type: 'hajj',
    duration: '17 Days',
    prices: { double: 2765000, triple: 2640000, quad: 2565000, quint: 2465000 },
    hotels: [
      { name: 'Madina Oberoi', city: 'Madinah', distance: '150m from Masjid Nabawi' },
      { name: 'Fairmont Makkah', city: 'Makkah', distance: '100m from Haram' },
      { name: 'Behind Souq Salam', city: 'Makkah (Aziziya)', distance: '2–4 km from Masjid al-Haram' }
    ],
    services: ['VIP Visa Processing', 'Business Class Air Ticket', 'Private Luxury Transport', 'Premium Dining', 'Private Ziyarat Tours', 'Personal Assistant'],
    inclusions: ['Premium Ihram Set', 'Private Hajj Training', 'Luxury Travel Kit', 'Gold ID Card', 'Personal Hajj Guide', 'Comprehensive Medical Coverage'],
    image: 'hajj',
  },
];

export const umrahPackages: PackageType[] = [
  {
    id: 'umrah-ramzan',
    name: 'Ramzan Umrah Package',
    type: 'umrah',
    duration: '26 Days',
    prices: { double: 535000, triple: 442000, quad: 399000, quint: 369000 },
    hotels: [
      { name: 'Land Premium', city: 'Makkah', distance: '1000m from Haram' },
      { name: 'Mahad Al-Madina', city: 'Madinah', distance: '600m from Masjid Nabawi' },
    ],
    services: ['Visa Processing', 'Return Air Ticket', 'AC Transport', 'Breakfast & Dinner', 'Ziyarat Tour'],
    inclusions: ['Travel Bag', 'ID Card', 'Group Guide', 'Basic Medical Kit'],
    image: 'umrah',
  },
  {
    id: 'umrah-ramazan',
    name: 'Standard Umrah Package',
    type: 'umrah',
    duration: '21 Days',
    prices: { double: 280000, triple: 240000, quad: 210000, quint: 190000 },
    hotels: [
      { name: 'Swissotel Makkah', city: 'Makkah', distance: '300m from Haram' },
      { name: 'Millennium Madinah', city: 'Madinah', distance: '200m from Masjid Nabawi' },
    ],
    services: ['Visa Processing', 'Return Air Ticket', 'Private Transport', 'Full Board Meals', 'Complete Ziyarat', 'Laundry'],
    inclusions: ['Premium Travel Bag', 'ID Card', 'Dedicated Guide', 'Medical Insurance', 'Prayer Mat'],
    image: 'umrah',
    featured: true,
  },
  {
    id: 'umrah-premium',
    name: 'Premium Umrah Package',
    type: 'umrah',
    duration: '15 Days',
    prices: { double: 450000, triple: 380000, quad: 330000, quint: 300000 },
    hotels: [
      { name: 'Raffles Makkah Palace', city: 'Makkah', distance: '50m from Haram' },
      { name: 'The Oberoi Madina', city: 'Madinah', distance: '100m from Masjid Nabawi' },
    ],
    services: ['VIP Visa Processing', 'Business Class Ticket', 'Private Luxury Car', 'Fine Dining', 'Private Ziyarat', 'Concierge Service'],
    inclusions: ['Luxury Kit', 'Gold ID Card', 'Personal Guide', 'Full Medical Coverage', 'Premium Prayer Set'],
    image: 'umrah',
  },
  {
    id: 'umrah-ramadan',
    name: 'Ramadan Special Umrah',
    type: 'umrah',
    duration: '15 Days',
    prices: { double: 350000, triple: 300000, quad: 265000, quint: 240000 },
    hotels: [
      { name: 'Makkah Towers', city: 'Makkah', distance: '400m from Haram' },
      { name: 'Anwar Al Madinah', city: 'Madinah', distance: '350m from Masjid Nabawi' },
    ],
    services: ['Visa Processing', 'Return Air Ticket', 'AC Transport', 'Iftar & Suhoor', 'Ziyarat', 'Taraweeh Arrangement'],
    inclusions: ['Travel Kit', 'Ramadan Guide', 'ID Card', 'Group Guide', 'Medical Aid'],
    image: 'umrah',
  },
];

export const testimonials = [
  {
    id: '1',
    name: 'Muhammad Usman',
    location: 'Narowal',
    text: 'Alhamdulillah! The Hajj experience with Alhabib Travel was beyond my expectations. Everything was perfectly organized from visa to accommodation. Highly recommended!',
    rating: 5,
  },
  {
    id: '2',
    name: 'Fatima Bibi',
    location: 'Sialkot',
    text: 'We performed Umrah with our family and the entire journey was smooth and hassle-free. The hotels were close to Haram and the food was excellent. JazakAllah!',
    rating: 5,
  },
  {
    id: '3',
    name: 'Ahmed Khan',
    location: 'Lahore',
    text: 'Professional service, great coordination, and helpful staff. Our Hajj group had an amazing experience. The guide was very knowledgeable and supportive throughout.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Ayesha Siddiqui',
    location: 'Narowal',
    text: 'Third time performing Umrah with Alhabib and every time has been wonderful. Their visa assistance service is the best in the area. Truly a trusted name!',
    rating: 5,
  },
];

export const formatPrice = (price: number): string => {
  return `PKR ${price.toLocaleString()}`;
};
