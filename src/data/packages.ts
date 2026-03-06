export interface HotelInfo {
  name: string;
  city: string;
  distance: string;
}

export interface ItineraryItem {
  label: string;
  duration?: string;
  dates: string;
  islamicDate: string;
}

export interface PackageType {
  id: string;
  name: string;
  type: 'hajj' | 'umrah';
  duration: string;
  prices: {
    double?: number;
    triple?: number;
    quad?: number;
    quint?: number;
  };
  hotels: HotelInfo[];
  services: string[];
  inclusions: string[];
  image: string;
  featured?: boolean;
  maktab?: string;
  itinerary?: ItineraryItem[];
  flightInfo?: { route: string; date: string; flight?: string; departure?: string; arrival?: string };
  returnFlightInfo?: { route: string; date: string; flight?: string; departure?: string; arrival?: string };
  packageDetails?: string[];
  requirements?: string[];
  notes?: string[];
  overseasDiscount?: string;
  roomUpgrades?: { type: string; extra: string }[];
  additionalPrices?: { label: string; price: number }[];
}

// ── HAJJ PACKAGES ──

const hajjBase = {
  type: 'hajj' as const,
  duration: '20 Days (23 May – 11 June)',
  flightInfo: { route: 'ISB → MED', date: '23 May (25 Zil-Qadah 1446 H)' },
  returnFlightInfo: { route: 'JED → ISB', date: '10/11 June (14/15 Zil-Hajj 1446 H)' },
  itinerary: [
    { label: 'Flight', dates: '23 May', islamicDate: '25 ZQ 1446 H', duration: 'ISB → MED' },
    { label: 'Madina Stay', dates: '23 May – 28 May', islamicDate: '25 ZQ – 1 ZH', duration: '5 Nights' },
    { label: 'Makkah Stay', dates: '28 May – 31 May', islamicDate: '1 ZH – 4 ZH', duration: '3 Nights' },
    { label: 'Aziziya Stay', dates: '31 May – 3/4 June', islamicDate: '4 ZH – 7/8 ZH' },
    { label: 'Hajj Days', dates: '3/4 June – 8 June', islamicDate: '7/8 ZH – 12 ZH', duration: '5 Days' },
    { label: 'Return to Aziziya', dates: '8 June – 10/11 June', islamicDate: '12 ZH – 14/15 ZH' },
    { label: 'Departure to Jeddah', dates: '10/11 June', islamicDate: '14/15 ZH' },
  ],
  services: [
    'Visa Processing',
    'Return Air Ticket (ISB → MED, JED → ISB)',
    'AC Transport throughout',
    '3-time daily buffet meals in Aziziya (double dish)',
    'Complete guided Ziarat in Madinah',
    'Horooghy guided journey by Islamic scholars',
  ],
  inclusions: [
    'Ihram',
    'Hajj Guide Book',
    'Travel Bag',
    'ID Card',
    '24/7 Support',
    'Medical Aid',
    'Training Sessions: Orientation before Hajj',
    'Accommodation in Aziziya on gender sharing basis',
  ],
  packageDetails: [
    'Aziziya building located near Mina',
    '3-time daily buffet meals in Aziziya (double dish)',
    'Accommodation in Aziziya on gender sharing basis',
    'Horooghy guided journey organized by Islamic scholars',
    'Complete guided Ziarat in Madinah included',
    'Package includes air ticket',
  ],
  roomUpgrades: [
    { type: 'Double Bed Room', extra: 'Rs. 200,000 per head extra' },
    { type: 'Triple Bed Room', extra: 'Rs. 150,000 per head extra' },
    { type: 'Quad Room', extra: 'No extra charges' },
  ],
  overseasDiscount: 'Less Rs. 300,000 for overseas Hujjaj (additional ticket cost adjustment)',
  requirements: [
    'Pakistani machine-readable passport valid until Dec 06, 2025',
    'Valid NADRA CNIC / B-Form',
    'Provide contact details and emergency contact',
    'Two photographs (4×3 cm) with white background',
    'Specify blood group',
    'Biometric confirmation & medical certificate required',
  ],
  notes: ['Qurbani is NOT included in the above packages'],
  image: 'hajj',
};

export const hajjPackages: PackageType[] = [
  {
    ...hajjBase,
    id: 'hajj-maktab-a',
    name: 'Hajj Package – Maktab A',
    maktab: 'A',
    prices: { quad: 1979000, triple: 2129000, double: 2179000 },
    hotels: [
      { name: 'MovInPick-Hajar Tower', city: 'Makkah', distance: '400m from Haram' },
      { name: 'Grand Plaza Badr Al-Maqam', city: 'Madinah', distance: '600m from Masjid Nabawi' },
      { name: 'Aziziya Building (Near Mina)', city: 'Aziziya', distance: '2–4 km from Masjid al-Haram' },
    ],
  },
  {
    ...hajjBase,
    id: 'hajj-maktab-b',
    name: 'Hajj Package – Maktab B',
    maktab: 'B',
    prices: { quad: 2079000, triple: 2229000, double: 2279000 },
    hotels: [
      { name: 'Anjum Hotel', city: 'Makkah', distance: '450m from Haram' },
      { name: 'Grand Plaza Badr Al-Maqam', city: 'Madinah', distance: '600m from Masjid Nabawi' },
      { name: 'Aziziya Building (Near Mina)', city: 'Aziziya', distance: '2–4 km from Masjid al-Haram' },
    ],
    featured: true,
  },
  {
    ...hajjBase,
    id: 'hajj-maktab-c',
    name: 'Hajj Package – Maktab C',
    maktab: 'C',
    prices: { quad: 2265000, triple: 2415000, double: 2465000 },
    hotels: [
      { name: 'Fairmont Makkah', city: 'Makkah', distance: '100m from Haram' },
      { name: 'Madina Oberoi', city: 'Madinah', distance: '150m from Masjid Nabawi' },
      { name: 'Aziziya Building (Near Mina)', city: 'Aziziya', distance: '2–4 km from Masjid al-Haram' },
    ],
  },
  {
    ...hajjBase,
    id: 'hajj-maktab-d',
    name: 'Hajj Package – Maktab D',
    maktab: 'D',
    prices: { quad: 2565000, triple: 2715000, double: 2765000 },
    hotels: [
      { name: 'Fairmont Makkah (Premium)', city: 'Makkah', distance: '50m from Haram' },
      { name: 'The Oberoi Madina', city: 'Madinah', distance: '100m from Masjid Nabawi' },
      { name: 'Aziziya Building (Near Mina)', city: 'Aziziya', distance: '2–4 km from Masjid al-Haram' },
    ],
  },
];

// ── UMRAH PACKAGES ──

const umrahBase = {
  type: 'umrah' as const,
  duration: '21 Days',
  flightInfo: { route: 'ISB → JED', date: '11 Jan', flight: 'SV 723', departure: '10:40', arrival: '14:35' },
  returnFlightInfo: { route: 'JED → ISB', date: '31 Jan', flight: 'SV 726', departure: '17:40', arrival: '00:20' },
  services: [
    'Visa Processing',
    'Return Air Ticket (Saudia Airlines)',
    'AC Transport',
    'Ziarat in Makkah & Madinah included',
    'Hotel Accommodation',
    'Group Guide',
  ],
  inclusions: [
    'Travel Bag',
    'ID Card',
    'Group Guide',
    'Basic Medical Kit',
    'Nights Breakup: 6 – 8 – 6',
  ],
  requirements: [
    'Valid Pakistani passport',
    'Valid NADRA CNIC',
    'Two photographs (4×3 cm) with white background',
    'Vaccination certificate',
  ],
  image: 'umrah',
};

export const umrahPackages: PackageType[] = [
  {
    ...umrahBase,
    id: 'umrah-pkg-1',
    name: 'Umrah Package 1 – Economy',
    prices: { quint: 294000, quad: 309000, triple: 335000, double: 387000 },
    hotels: [
      { name: 'Land Premium', city: 'Makkah', distance: '1000 meters from Haram' },
      { name: 'Mahad Al Madina', city: 'Madinah', distance: '600–700 meters from Masjid Nabawi' },
    ],
  },
  {
    ...umrahBase,
    id: 'umrah-pkg-2',
    name: 'Umrah Package 2 – Standard',
    prices: { quint: 309000, quad: 329000, triple: 362000, double: 428000 },
    hotels: [
      { name: 'Hijra Al Khair', city: 'Makkah', distance: '700–800 meters from Haram' },
      { name: 'Mahad Al Madina', city: 'Madinah', distance: '600–700 meters from Masjid Nabawi' },
    ],
    featured: true,
  },
  {
    ...umrahBase,
    id: 'umrah-pkg-3',
    name: 'Umrah Package 3 – Premium',
    prices: { quint: 317000, quad: 339000, triple: 373000, double: 446000 },
    hotels: [
      { name: 'Mather Al Jawar', city: 'Makkah', distance: '500 meters from Haram' },
      { name: 'Mahad Al Madina', city: 'Madinah', distance: '600–700 meters from Masjid Nabawi' },
    ],
  },
  {
    ...umrahBase,
    id: 'umrah-pkg-4',
    name: 'Umrah Package 4 – Platinum',
    prices: { quint: 349000, quad: 379000, triple: 426000, double: 526000 },
    hotels: [
      { name: 'Mather Al Jawar', city: 'Makkah', distance: '500 meters from Haram' },
      { name: 'Rama Al Madina', city: 'Madinah', distance: '100 meters from Masjid Nabawi' },
    ],
  },
];

export const umrahAdditionalPrices = [
  { label: 'Child Without Bed', price: 199000 },
  { label: 'Infant', price: 79000 },
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
