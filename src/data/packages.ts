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
    sharing?: number;
    double?: number;
    triple?: number;
    quad?: number;
    quint?: number;
  };
  pricesUSD?: {
    sharing?: number;
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
  nightsBreakup?: string;
}

// ── HAJJ PACKAGES ──

const hajjRequirements = [
  'Machine readable Pakistani Passport (valid until Dec 6, 2025)',
  'Valid NADRA CNIC / B-Form',
  'Complete address & contact info of next of kin',
  '2 passport photos (4×3 cm) white background',
  'Blood group specification',
  'Biometric confirmation & medical certificate',
];

const hajjNotes = ['Qurbani is NOT included in the above packages'];

export const hajjPackages: PackageType[] = [
  {
    id: 'hajj-13-14-maktab-b',
    name: '13/14 Days Package (Maktab B)',
    type: 'hajj',
    duration: '13/14 Days',
    maktab: 'B',
    flightInfo: { route: 'ISB → MED', date: '28 May | 1 ZH 1446 H' },
    itinerary: [
      { label: '4 Nights Stay in Madina', dates: '28 May – 1 June', islamicDate: '1 ZH – 4 ZH', duration: '4 Nights' },
      { label: 'Aziziya Stay', dates: '1 June – 3/4 June', islamicDate: '4 ZH – 6/7 ZH' },
      { label: '5 Days Hajj', dates: '4 June – 8 June', islamicDate: '7 ZH – 12 ZH', duration: '5 Days' },
      { label: 'Back to Aziziya', dates: '8 June – 10/11 June', islamicDate: '12 ZH – 14/15 ZH' },
      { label: 'Departure to Jeddah Airport', dates: '10/11 June', islamicDate: '14/15 ZH' },
    ],
    hotels: [
      { name: 'Grand Plaza Badr Al-Maqam (3 Star – Full Board)', city: 'Madinah', distance: '600m from Masjid Nabawi' },
      { name: 'Aziziya Building – Behind Souq Salam, Near Electric Escalator (Jamrat)', city: 'Aziziya', distance: 'Near Mina' },
    ],
    prices: { quad: 1839000, triple: 1874000, double: 1934000 },
    pricesUSD: { quad: 6570, triple: 6695, double: 6910 },
    packageDetails: [
      'Aziziya building near Mina',
      '3 time daily buffet meal (double dish)',
      'Accommodation on bed sharing basis',
      'Triple room extra Rs 20,000 per head',
      'Quad room extra Rs 15,000 per head',
      'Guided Ziarat in Madinah',
      'Ziarat by experienced Islamic scholars',
      'Ahram included',
    ],
    services: ['Visa Processing', 'Return Air Ticket (ISB → MED, JED → ISB)', 'AC Transport throughout', 'Guided Ziarat in Madinah'],
    inclusions: ['Ihram', 'Hajj Guide Book', 'Travel Bag', 'ID Card', '24/7 Support', 'Medical Aid'],
    overseasDiscount: 'Rs 300,000 per ticket for overseas Hujjaj',
    requirements: hajjRequirements,
    notes: hajjNotes,
    image: 'hajj',
  },
  {
    id: 'hajj-17-platinum-maktab-b',
    name: '17 Days Platinum Package (Maktab B)',
    type: 'hajj',
    duration: '17 Days',
    maktab: 'B',
    featured: true,
    flightInfo: { route: 'ISB → MED', date: '25 May | 27 ZQ 1446 H' },
    itinerary: [
      { label: '3 Nights Madina', dates: '25 May – 28 May', islamicDate: '27 ZQ – 1 ZH', duration: '3 Nights' },
      { label: '3 Nights Makkah', dates: '28 May – 31 May', islamicDate: '1 ZH – 4 ZH', duration: '3 Nights' },
      { label: 'Aziziya Stay', dates: '31 May – 4 June', islamicDate: '4 ZH – 7 ZH' },
      { label: '5 Days Hajj', dates: '4 June – 8 June', islamicDate: '7 ZH – 12 ZH', duration: '5 Days' },
      { label: 'Back to Aziziya', dates: '8 June – 10/11 June', islamicDate: '12 ZH – 14/15 ZH' },
      { label: 'Departure', dates: '10/11 June', islamicDate: '14/15 ZH' },
    ],
    hotels: [
      { name: 'Madina Oberoi (5 Star)', city: 'Madinah', distance: '150m from Masjid Nabawi' },
      { name: 'Fairmont Makkah (5 Star)', city: 'Makkah', distance: '100m from Haram' },
      { name: 'Aziziya Building – Behind Souq Salam Near Electric Escalator (Jamrat)', city: 'Aziziya', distance: 'Near Mina' },
    ],
    prices: { quad: 2565000, triple: 2640000, double: 2765000 },
    pricesUSD: { quad: 9160, triple: 9430, double: 9875 },
    packageDetails: [
      'Aziziya building near Mina',
      '3 time daily buffet meal',
      'Bed sharing basis',
      'Triple room extra Rs 20,000 per head',
      'Quad room extra Rs 15,000 per head',
      'Guided Ziarat in Madinah',
      'Ziarat with Islamic scholars',
      'Ahram included',
    ],
    services: ['Visa Processing', 'Return Air Ticket (ISB → MED, JED → ISB)', 'AC Transport throughout', 'Guided Ziarat in Madinah'],
    inclusions: ['Ihram', 'Hajj Guide Book', 'Travel Bag', 'ID Card', '24/7 Support', 'Medical Aid'],
    overseasDiscount: 'Rs 400,000 per ticket for overseas Hujjaj',
    requirements: hajjRequirements,
    notes: hajjNotes,
    image: 'hajj',
  },
  {
    id: 'hajj-20-maktab-b-anjum',
    name: '20 Days Package (Maktab B – Anjum)',
    type: 'hajj',
    duration: '20 Days',
    maktab: 'B',
    flightInfo: { route: 'ISB → MED', date: '23 May | 25 ZQ 1446 H' },
    itinerary: [
      { label: '5 Nights Madina', dates: '23 May – 28 May', islamicDate: '25 ZQ – 1 ZH', duration: '5 Nights' },
      { label: '3 Nights Makkah', dates: '28 May – 31 May', islamicDate: '1 ZH – 4 ZH', duration: '3 Nights' },
      { label: 'Aziziya Stay', dates: '31 May – 3/4 June', islamicDate: '4 ZH – 6/7 ZH' },
      { label: '5 Days Hajj', dates: '4 June – 8 June', islamicDate: '7 ZH – 12 ZH', duration: '5 Days' },
      { label: 'Back to Aziziya', dates: '8 June – 10/11 June', islamicDate: '12 ZH – 14/15 ZH' },
      { label: 'Departure', dates: '10/11 June', islamicDate: '14/15 ZH' },
    ],
    hotels: [
      { name: 'Grand Plaza Badr Al-Maqam (3 Star – Full Board)', city: 'Madinah', distance: '600m from Masjid Nabawi' },
      { name: 'Anjum Hotel (5 Star – Half Board)', city: 'Makkah', distance: '450m from Haram' },
      { name: 'Aziziya Building – Behind Souq Salam Near Electric Escalator (Jamrat)', city: 'Aziziya', distance: 'Near Mina' },
    ],
    prices: { quad: 1979000, triple: 2079000, double: 2179000 },
    pricesUSD: { quad: 7070, triple: 7425, double: 7785 },
    packageDetails: [
      'Aziziya building near Mina',
      '3 daily buffet meal',
      'Bed sharing accommodation',
      'Triple room extra Rs 20,000 per head',
      'Quad room extra Rs 15,000 per head',
      'Guided Ziarat in Madinah',
      'Islamic scholar guidance',
      'Ahram included',
    ],
    services: ['Visa Processing', 'Return Air Ticket (ISB → MED, JED → ISB)', 'AC Transport throughout', 'Guided Ziarat in Madinah'],
    inclusions: ['Ihram', 'Hajj Guide Book', 'Travel Bag', 'ID Card', '24/7 Support', 'Medical Aid'],
    overseasDiscount: 'Rs 300,000 per ticket for overseas Hujjaj',
    requirements: hajjRequirements,
    notes: hajjNotes,
    image: 'hajj',
  },
  {
    id: 'hajj-20-maktab-b-movenpick',
    name: '20 Days Package (Maktab B – Movenpick)',
    type: 'hajj',
    duration: '20 Days',
    maktab: 'B',
    flightInfo: { route: 'ISB → MED', date: '23 May | 25 ZQ 1446 H' },
    itinerary: [
      { label: '5 Nights Stay in Madina', dates: '23 May – 28 May', islamicDate: '25 ZQ – 1 ZH', duration: '5 Nights' },
      { label: '3 Nights Stay in Makkah', dates: '28 May – 31 May', islamicDate: '1 ZH – 4 ZH', duration: '3 Nights' },
      { label: 'Aziziya Stay', dates: '31 May – 3/4 June', islamicDate: '4 ZH – 6/7 ZH' },
      { label: '5 Days Hajj', dates: '4 June – 8 June', islamicDate: '7 ZH – 12 ZH', duration: '5 Days' },
      { label: 'Back to Aziziya', dates: '8 June – 10/11 June', islamicDate: '12 ZH – 14/15 ZH' },
      { label: 'Departure to Jeddah Airport', dates: '10/11 June', islamicDate: '14/15 ZH' },
    ],
    hotels: [
      { name: 'Grand Plaza Badr Al-Maqam (3 Star – Full Board)', city: 'Madinah', distance: '600m from Masjid Nabawi' },
      { name: 'Movenpick Residency Hajar Tower (5 Star – Half Board)', city: 'Makkah', distance: '400m from Haram' },
      { name: 'Aziziya Building – Behind Souq Salam, Near Electric Escalator (Jamrat)', city: 'Aziziya', distance: 'Near Mina' },
    ],
    prices: { quad: 2079000, triple: 2179000, double: 2279000 },
    pricesUSD: { quad: 7430, triple: 7790, double: 8150 },
    packageDetails: [
      'Aziziya building located near Mina',
      '3 time daily buffet meal (Double Dish)',
      'Accommodation will be on gender sharing basis',
      'Double room extra Rs 200,000 per head',
      'Triple room extra Rs 150,000 per head',
      'Quad room extra Rs 50,000 per head',
      'Guided Ziarat in Madinah',
      'Ziarat conducted by experienced Islamic scholars',
      'Complete guidance during Hajj',
      'Air ticket included',
    ],
    services: ['Visa Processing', 'Return Air Ticket (ISB → MED, JED → ISB)', 'AC Transport throughout', 'Guided Ziarat in Madinah'],
    inclusions: ['Ihram', 'Hajj Guide Book', 'Travel Bag', 'ID Card', '24/7 Support', 'Medical Aid'],
    roomUpgrades: [
      { type: 'Double Bed Room', extra: 'Rs. 200,000 per head extra' },
      { type: 'Triple Bed Room', extra: 'Rs. 150,000 per head extra' },
      { type: 'Quad Room', extra: 'Rs. 50,000 per head extra' },
    ],
    overseasDiscount: 'Less Rs 300,000 for overseas Hujjaj per ticket',
    requirements: hajjRequirements,
    notes: hajjNotes,
    image: 'hajj',
  },
  {
    id: 'hajj-20-maktab-d-tents',
    name: '20 Days Package (Maktab D – Mina & Arafat Tents)',
    type: 'hajj',
    duration: '20 Days',
    maktab: 'D',
    flightInfo: { route: 'ISB → MED', date: '23 May | 25 ZQ 1446 H' },
    itinerary: [
      { label: '5 Nights Stay in Madina', dates: '23 May – 28 May', islamicDate: '25 ZQ – 1 ZH', duration: '5 Nights' },
      { label: '3 Nights Stay in Makkah', dates: '28 May – 31 May', islamicDate: '1 ZH – 4 ZH', duration: '3 Nights' },
      { label: 'Aziziya Stay', dates: '31 May – 3/4 June', islamicDate: '4 ZH – 6/7 ZH' },
      { label: '5 Days Hajj', dates: '4 June – 8 June', islamicDate: '7 ZH – 12 ZH', duration: '5 Days' },
      { label: 'Back to Aziziya', dates: '8 June – 10/11 June', islamicDate: '12 ZH – 14/15 ZH' },
      { label: 'Departure to Jeddah Airport', dates: '10/11 June', islamicDate: '14/15 ZH' },
    ],
    hotels: [
      { name: 'Grand Plaza Badr Al-Maqam (3 Star – Full Board)', city: 'Madinah', distance: '600m from Masjid Nabawi' },
      { name: 'Anjum Hotel (5 Star – Half Board)', city: 'Makkah', distance: '450m from Haram' },
      { name: 'Aziziya Building – Behind Souq Salam, Near Electric Escalator (Jamrat)', city: 'Aziziya', distance: 'Near Mina' },
    ],
    prices: { quad: 1695000, triple: 1795000, double: 1895000 },
    pricesUSD: { quad: 6060, triple: 6420, double: 6770 },
    packageDetails: [
      'AC & Gypsum tents in Mina and Arafat',
      'Aziziya building located near Mina',
      '3 time daily buffet meal (Double Dish)',
      'Accommodation will be on gender sharing basis',
      'Double room extra Rs 200,000 per head',
      'Triple room extra Rs 150,000 per head',
      'Quad room extra Rs 50,000 per head',
      'Guided Ziarat in Madinah',
      'Ziarat conducted by experienced Islamic scholars',
      'Complete guidance during Hajj',
      'Air ticket included',
    ],
    services: ['Visa Processing', 'Return Air Ticket (ISB → MED, JED → ISB)', 'AC Transport throughout', 'Guided Ziarat in Madinah'],
    inclusions: ['Ihram', 'Hajj Guide Book', 'Travel Bag', 'ID Card', '24/7 Support', 'Medical Aid'],
    roomUpgrades: [
      { type: 'Double Bed Room', extra: 'Rs. 200,000 per head extra' },
      { type: 'Triple Bed Room', extra: 'Rs. 150,000 per head extra' },
      { type: 'Quad Room', extra: 'Rs. 50,000 per head extra' },
    ],
    overseasDiscount: 'Less Rs 300,000 for overseas Hujjaj per ticket',
    requirements: hajjRequirements,
    notes: hajjNotes,
    image: 'hajj',
  },
];

// ── UMRAH PACKAGES ──

const umrahRequirements = [
  'Valid Pakistani passport',
  'Valid NADRA CNIC',
  'Two photographs (4×3 cm) with white background',
  'Vaccination certificate',
];

const umrahServices = ['Visa Processing', 'Return Air Ticket (Saudia Airlines)', 'AC Transport', 'Ziarat in Makkah & Madinah included', 'Hotel Accommodation', 'Group Guide'];
const umrahInclusions = ['Travel Bag', 'ID Card', 'Group Guide', 'Basic Medical Kit'];

export const umrahPackages: PackageType[] = [
  {
    id: 'umrah-26-days',
    name: '26 Days Umrah Package',
    type: 'umrah',
    duration: '26 Days',
    nightsBreakup: '12-12-2',
    flightInfo: { route: 'ISB → JED', date: '24 Feb', flight: 'SV 729', departure: '17:50', arrival: '21:35' },
    returnFlightInfo: { route: 'JED → ISB', date: '22 Mar', flight: 'SV 728', departure: '09:25', arrival: '16:05' },
    hotels: [
      { name: 'Land Premium', city: 'Makkah', distance: '1000 meters from Haram' },
      { name: 'Mahad Al Madina', city: 'Madinah', distance: '600–700 meters from Masjid Nabawi' },
    ],
    prices: { sharing: 369000, quad: 399000, triple: 442000, double: 535000 },
    services: umrahServices,
    inclusions: umrahInclusions,
    requirements: umrahRequirements,
    additionalPrices: [{ label: 'Child Without Bed', price: 199000 }, { label: 'Infant', price: 79000 }],
    image: 'umrah',
  },
  {
    id: 'umrah-21-feb',
    name: '21 Days Umrah Package',
    type: 'umrah',
    duration: '21 Days',
    nightsBreakup: '6-8-6',
    flightInfo: { route: 'ISB → JED', date: '3 Feb', flight: 'SV 723', departure: '10:40', arrival: '14:35' },
    returnFlightInfo: { route: 'JED → ISB', date: '23 Feb', flight: 'SV 726', departure: '17:40', arrival: '00:20' },
    hotels: [
      { name: 'Land Premium', city: 'Makkah', distance: '1000 meters from Haram' },
      { name: 'Mahad Al Madina', city: 'Madinah', distance: '600–700 meters from Masjid Nabawi' },
    ],
    prices: { sharing: 302000, quad: 316000, triple: 340000, double: 379000 },
    services: umrahServices,
    inclusions: umrahInclusions,
    requirements: umrahRequirements,
    additionalPrices: [{ label: 'Child Without Bed', price: 199000 }, { label: 'Infant', price: 79000 }],
    image: 'umrah',
  },
  {
    id: 'umrah-21-ramazan-hijra',
    name: '21 Days Umrah Package (Ramazan)',
    type: 'umrah',
    duration: '21 Days',
    nightsBreakup: '6-8-6',
    featured: true,
    flightInfo: { route: 'ISB → JED', date: '3 Feb', flight: 'SV 723', departure: '10:40', arrival: '14:35' },
    returnFlightInfo: { route: 'JED → ISB', date: '23 Feb', flight: 'SV 726', departure: '17:40', arrival: '00:20' },
    hotels: [
      { name: 'Hijra Al Khair', city: 'Makkah', distance: '700 meters from Haram' },
      { name: 'Mahad Al Madina', city: 'Madinah', distance: '600–700 meters from Masjid Nabawi' },
    ],
    prices: { quint: 320000, quad: 339000, triple: 372000, double: 436000 },
    services: umrahServices,
    inclusions: umrahInclusions,
    requirements: umrahRequirements,
    additionalPrices: [{ label: 'Child Without Bed', price: 199000 }, { label: 'Infant', price: 79000 }],
    image: 'umrah',
  },
  {
    id: 'umrah-21-ramazan-mather',
    name: '21 Days Umrah Package (Ramazan)',
    type: 'umrah',
    duration: '21 Days',
    nightsBreakup: '6-8-6',
    flightInfo: { route: 'ISB → JED', date: '3 Feb', flight: 'SV 723', departure: '10:40', arrival: '14:35' },
    returnFlightInfo: { route: 'JED → ISB', date: '23 Feb', flight: 'SV 726', departure: '17:40', arrival: '00:20' },
    hotels: [
      { name: 'Mather Al Jawar', city: 'Makkah', distance: '700 meters from Haram' },
      { name: 'Mahad Al Madina', city: 'Madinah', distance: '600–700 meters from Masjid Nabawi' },
    ],
    prices: { quint: 325000, quad: 345000, triple: 381000, double: 450000 },
    services: umrahServices,
    inclusions: umrahInclusions,
    requirements: umrahRequirements,
    additionalPrices: [{ label: 'Child Without Bed', price: 199000 }, { label: 'Infant', price: 79000 }],
    image: 'umrah',
  },
  {
    id: 'umrah-21-jan-land',
    name: '21 Days Umrah Package',
    type: 'umrah',
    duration: '21 Days',
    nightsBreakup: '6-8-6',
    flightInfo: { route: 'ISB → JED', date: '11 Jan', flight: 'SV 723', departure: '10:40', arrival: '14:35' },
    returnFlightInfo: { route: 'JED → ISB', date: '31 Jan', flight: 'SV 726', departure: '17:40', arrival: '00:20' },
    hotels: [
      { name: 'Land Premium', city: 'Makkah', distance: '1000 meters from Haram' },
      { name: 'Mahad Al Madina', city: 'Madinah', distance: '600–700 meters from Masjid Nabawi' },
    ],
    prices: { sharing: 294000, quad: 309000, triple: 335000, double: 387000 },
    services: umrahServices,
    inclusions: umrahInclusions,
    requirements: umrahRequirements,
    additionalPrices: [{ label: 'Child Without Bed', price: 199000 }, { label: 'Infant', price: 79000 }],
    image: 'umrah',
  },
  {
    id: 'umrah-21-jan-hijra',
    name: '21 Days Umrah Package',
    type: 'umrah',
    duration: '21 Days',
    nightsBreakup: '6-8-6',
    flightInfo: { route: 'ISB → JED', date: '11 Jan', flight: 'SV 723', departure: '10:40', arrival: '14:35' },
    returnFlightInfo: { route: 'JED → ISB', date: '31 Jan', flight: 'SV 726', departure: '17:40', arrival: '00:20' },
    hotels: [
      { name: 'Hijra Al Khair', city: 'Makkah', distance: '700–800 meters from Haram' },
      { name: 'Mahad Al Madina', city: 'Madinah', distance: '600–700 meters from Masjid Nabawi' },
    ],
    prices: { quint: 309000, quad: 329000, triple: 362000, double: 482000 },
    services: umrahServices,
    inclusions: umrahInclusions,
    requirements: umrahRequirements,
    additionalPrices: [{ label: 'Child Without Bed', price: 199000 }, { label: 'Infant', price: 79000 }],
    image: 'umrah',
  },
  {
    id: 'umrah-21-jan-mather',
    name: '21 Days Umrah Package',
    type: 'umrah',
    duration: '21 Days',
    nightsBreakup: '6-8-6',
    flightInfo: { route: 'ISB → JED', date: '11 Jan', flight: 'SV 723', departure: '10:40', arrival: '14:35' },
    returnFlightInfo: { route: 'JED → ISB', date: '31 Jan', flight: 'SV 726', departure: '17:40', arrival: '00:20' },
    hotels: [
      { name: 'Mather Al Jawar', city: 'Makkah', distance: '500 meters from Haram' },
      { name: 'Mahad Al Madina', city: 'Madinah', distance: '600–700 meters from Masjid Nabawi' },
    ],
    prices: { quint: 317000, quad: 339000, triple: 373000, double: 446000 },
    services: umrahServices,
    inclusions: umrahInclusions,
    requirements: umrahRequirements,
    additionalPrices: [{ label: 'Child Without Bed', price: 199000 }, { label: 'Infant', price: 79000 }],
    image: 'umrah',
  },
  {
    id: 'umrah-15-jan-mather',
    name: '15 Days Umrah Package',
    type: 'umrah',
    duration: '15 Days',
    nightsBreakup: '6-8-6',
    flightInfo: { route: 'ISB → JED', date: '14 Jan', flight: 'SV 723', departure: '17:40', arrival: '21:35' },
    returnFlightInfo: { route: 'JED → ISB', date: '28 Jan', flight: 'SV 728', departure: '09:25', arrival: '16:05' },
    hotels: [
      { name: 'Mather Al Jawar', city: 'Makkah', distance: '500 meters from Haram' },
      { name: 'Mahad Al Madina', city: 'Madinah', distance: '600–700 meters from Masjid Nabawi' },
    ],
    prices: { quint: 292000, quad: 309000, triple: 332000, double: 384000 },
    services: umrahServices,
    inclusions: umrahInclusions,
    requirements: umrahRequirements,
    additionalPrices: [{ label: 'Child Without Bed', price: 199000 }, { label: 'Infant', price: 79000 }],
    image: 'umrah',
  },
];

export const testimonials = [
  { id: '1', name: 'Muhammad Usman', location: 'Narowal', text: 'Alhamdulillah! The Hajj experience with Alhabib Travel was beyond my expectations. Everything was perfectly organized from visa to accommodation. Highly recommended!', rating: 5 },
  { id: '2', name: 'Fatima Bibi', location: 'Sialkot', text: 'We performed Umrah with our family and the entire journey was smooth and hassle-free. The hotels were close to Haram and the food was excellent. JazakAllah!', rating: 5 },
  { id: '3', name: 'Ahmed Khan', location: 'Lahore', text: 'Professional service, great coordination, and helpful staff. Our Hajj group had an amazing experience. The guide was very knowledgeable and supportive throughout.', rating: 5 },
  { id: '4', name: 'Ayesha Siddiqui', location: 'Narowal', text: 'Third time performing Umrah with Alhabib and every time has been wonderful. Their visa assistance service is the best in the area. Truly a trusted name!', rating: 5 },
];

export const formatPrice = (price: number): string => {
  return `PKR ${price.toLocaleString()}`;
};

export const formatPriceUSD = (price: number): string => {
  return `$${price.toLocaleString()}`;
};
