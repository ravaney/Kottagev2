import { Kottage } from '../hooks/propertyHooks';

export type SeededKottage = Kottage & { key: string };

const approvedAt = '2026-03-18T00:00:00.000Z';
const portlandOwnerId = 'DMGKM8Nx6DZ3eer3pWlaExeVH7f1';
const portlandHost = {
  id: 'DMGKM8Nx6DZ3eer3pWlaExeVH7f1',
  name: 'cleaggggrfields@mailchimp.com',
  avatar:
    'https://firebasestorage.googleapis.com/v0/b/kottage-v2.appspot.com/o/profileImages%2Fe1.jpg?alt=media&token=0d8babf9-39da-469d-9cef-79e06fded0e0',
};

const approvedProperty = (
  property: Omit<SeededKottage, 'approval' | 'createdAt' | 'updatedAt'>
): SeededKottage => ({
  ...property,
  createdAt: approvedAt,
  updatedAt: approvedAt,
  approval: {
    status: 'approved',
    submittedAt: approvedAt,
    reviewedAt: approvedAt,
    reviewedBy: 'blu-kottage-editorial',
    requiredDocuments: [],
    submittedDocuments: [],
    notes: 'Editorially seeded Portland listing.',
    approvalScore: 100,
  },
});

export const seededProperties: SeededKottage[] = [
  approvedProperty({
    id: 'seed-geejam-hotel',
    key: 'seed-geejam-hotel',
    ownerId: portlandOwnerId,
    name: 'Geejam Hotel',
    description:
      'A design-forward rainforest retreat in San San with villa-style stays, a creative energy, and quick access to the coast near Port Antonio.',
    phone: '+1 876-993-7000',
    address: {
      address1: 'Lot 122, Skippers Boulevard, Off New Pond Road, San San',
      city: 'Port Antonio',
      state: 'Portland',
      country: 'Jamaica',
    },
    rating: 4.8,
    isListed: true,
    amenities: [
      'WiFi',
      'Pool',
      'Air Conditioning',
      'Garden',
      'Parking',
      'Beach Access',
    ],
    images: ['/Geejam1.jpg', '/Geejam2.jpg'],
    propertyType: 'resort',
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 2,
    squareFootage: 980,
    roomTypes: [
      {
        id: 'studio-suite',
        name: 'San San Studio Suite',
        description:
          'A polished suite with lush views, a writing nook, and breezy indoor-outdoor living.',
        maxOccupancy: 4,
        pricePerNight: 565,
        quantityAvailable: 4,
        amenities: ['WiFi', 'Air Conditioning', 'Pool', 'Parking'],
        images: ['/Geejam1.jpg', '/Geejam2.jpg'],
        listStatus: 'listed',
      },
    ],
    host: { ...portlandHost, superhost: true },
    coordinates: {
      latitude: 18.1833,
      longitude: -76.3965,
    },
  }),
  approvedProperty({
    id: 'seed-trident-hotel',
    key: 'seed-trident-hotel',
    ownerId: portlandOwnerId,
    name: 'The Trident Hotel',
    description:
      'An oceanfront Portland stay in Anchovy known for spacious villas, polished dining spaces, and dramatic Caribbean views.',
    phone: '+1 876-250-7025',
    address: {
      address1: 'Anchovy, Port Antonio, P.O. Box 119',
      city: 'Port Antonio',
      state: 'Portland',
      country: 'Jamaica',
    },
    rating: 4.7,
    isListed: true,
    amenities: [
      'WiFi',
      'Pool',
      'Spa',
      'Restaurant',
      'Parking',
      'Gym',
    ],
    images: ['/trident.jpg', '/Port_antonio2.jpg'],
    propertyType: 'resort',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 3,
    squareFootage: 1450,
    roomTypes: [
      {
        id: 'ocean-villa',
        name: 'Ocean View Villa',
        description:
          'A larger villa stay with sea-facing terraces, a lounge area, and resort-style privacy.',
        maxOccupancy: 6,
        pricePerNight: 625,
        quantityAvailable: 5,
        amenities: ['WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant'],
        images: ['/trident.jpg', '/Port_antonio2.jpg'],
        listStatus: 'listed',
      },
    ],
    host: { ...portlandHost, superhost: true },
    coordinates: {
      latitude: 18.1707,
      longitude: -76.4776,
    },
  }),
  approvedProperty({
    id: 'seed-great-huts',
    key: 'seed-great-huts',
    ownerId: portlandOwnerId,
    name: 'Great Huts',
    description:
      'A cliffside Boston Bay retreat with a strong Jamaica-first character, elevated views, and easy access to surf, beaches, and Portland adventures.',
    phone: '+1 876-353-3388',
    address: {
      address1: '6-10 Boston Bay',
      city: 'Port Antonio',
      state: 'Portland',
      country: 'Jamaica',
    },
    rating: 4.6,
    isListed: true,
    amenities: [
      'WiFi',
      'Pool',
      'Beach Access',
      'Restaurant',
      'Parking',
      'Garden',
    ],
    images: ['/Port_antonio2.jpg', '/swift river.jpg'],
    propertyType: 'resort',
    maxGuests: 4,
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 720,
    roomTypes: [
      {
        id: 'cliffside-hut',
        name: 'Cliffside Hut',
        description:
          'A breezy Portland stay with natural textures, ocean views, and a laid-back boutique resort feel.',
        maxOccupancy: 4,
        pricePerNight: 245,
        quantityAvailable: 8,
        amenities: ['WiFi', 'Pool', 'Beach Access', 'Restaurant'],
        images: ['/Port_antonio2.jpg', '/swift river.jpg'],
        listStatus: 'listed',
      },
    ],
    host: { ...portlandHost, superhost: true },
    coordinates: {
      latitude: 18.1998,
      longitude: -76.3602,
    },
  }),
  approvedProperty({
    id: 'seed-jamaica-palace',
    key: 'seed-jamaica-palace',
    ownerId: portlandOwnerId,
    name: 'Jamaica Palace Hotel',
    description:
      'A hilltop Port Antonio hotel with classic styling, landscaped grounds, and a larger full-service footprint near Turtle Harbour.',
    phone: '+1 876-993-7720',
    address: {
      address1: 'Williamsfield',
      city: 'Port Antonio',
      state: 'Portland',
      country: 'Jamaica',
    },
    rating: 4.4,
    isListed: true,
    amenities: [
      'WiFi',
      'Pool',
      'Restaurant',
      'Parking',
      'Air Conditioning',
      'Garden',
    ],
    images: ['/Port_antonio2.jpg', '/Geejam1.jpg'],
    propertyType: 'resort',
    maxGuests: 4,
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 680,
    roomTypes: [
      {
        id: 'deluxe-room',
        name: 'Deluxe Room',
        description:
          'A classic room setup with breakfast, air conditioning, and access to the hotel grounds and pool.',
        maxOccupancy: 4,
        pricePerNight: 215,
        quantityAvailable: 10,
        amenities: ['WiFi', 'Pool', 'Restaurant', 'Air Conditioning'],
        images: ['/Port_antonio2.jpg', '/Geejam1.jpg'],
        listStatus: 'listed',
      },
    ],
    host: { ...portlandHost, superhost: false },
    coordinates: {
      latitude: 18.1714,
      longitude: -76.4576,
    },
  }),
  approvedProperty({
    id: 'seed-frenchmans-cove',
    key: 'seed-frenchmans-cove',
    ownerId: portlandOwnerId,
    name: "Frenchman's Cove",
    description:
      'An iconic San San address pairing private villas, lush grounds, and one of Portland’s best-known beach settings.',
    phone: '+1 876-227-8257',
    address: {
      address1: "Frenchman's Cove, San San",
      city: 'Port Antonio',
      state: 'Portland',
      country: 'Jamaica',
    },
    rating: 4.7,
    isListed: true,
    amenities: [
      'WiFi',
      'Beach Access',
      'Restaurant',
      'Parking',
      'Garden',
    ],
    images: ['/frenchman.jpg', '/Port_antonio2.jpg'],
    propertyType: 'villa',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1320,
    roomTypes: [
      {
        id: 'cove-villa',
        name: 'Cove Villa',
        description:
          'A villa-style stay tucked into tropical parkland near the river-meets-sea setting of Frenchman’s Cove.',
        maxOccupancy: 6,
        pricePerNight: 540,
        quantityAvailable: 6,
        amenities: ['WiFi', 'Beach Access', 'Restaurant', 'Parking'],
        images: ['/frenchman.jpg', '/Port_antonio2.jpg'],
        listStatus: 'listed',
      },
    ],
    host: { ...portlandHost, superhost: true },
    coordinates: {
      latitude: 18.1712,
      longitude: -76.3941,
    },
  }),
  approvedProperty({
    id: 'seed-goblin-hill',
    key: 'seed-goblin-hill',
    ownerId: portlandOwnerId,
    name: 'Goblin Hill Villas at San San',
    description:
      'A relaxed San San villa property set above the coast with gardens, breezes, pool access, and a classic Port Antonio feel.',
    phone: '+1 876-993-7443',
    address: {
      address1: 'Fairfield / Mile Gully Road, San San',
      city: 'Port Antonio',
      state: 'Portland',
      country: 'Jamaica',
    },
    rating: 4.5,
    isListed: true,
    amenities: [
      'WiFi',
      'Pool',
      'Kitchen',
      'Parking',
      'Garden',
      'Beach Access',
    ],
    images: ['/Port_antonio2.jpg', '/Geejam2.jpg'],
    propertyType: 'villa',
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    squareFootage: 1600,
    roomTypes: [
      {
        id: 'garden-villa',
        name: 'Garden Villa',
        description:
          'A spacious villa stay with breezy verandas, kitchen access, and a calm base for exploring the San San coast.',
        maxOccupancy: 6,
        pricePerNight: 365,
        quantityAvailable: 7,
        amenities: ['WiFi', 'Pool', 'Kitchen', 'Parking', 'Beach Access'],
        images: ['/Port_antonio2.jpg', '/Geejam2.jpg'],
        listStatus: 'listed',
      },
    ],
    host: { ...portlandHost, superhost: false },
    coordinates: {
      latitude: 18.1792,
      longitude: -76.4024,
    },
  }),
  approvedProperty({
    id: 'seed-bay-view-eco-resort',
    key: 'seed-bay-view-eco-resort',
    ownerId: portlandOwnerId,
    name: 'Bay View Eco Resort & Spa',
    description:
      'A hillside Port Antonio stay in Anchovy with sea views, spa services, country-style hospitality, and easy access to Portland excursions.',
    phone: '+1 876-993-3118',
    address: {
      address1: 'Anchovy',
      city: 'Port Antonio',
      state: 'Portland',
      country: 'Jamaica',
    },
    rating: 4.3,
    isListed: true,
    amenities: [
      'WiFi',
      'Pool',
      'Spa',
      'Restaurant',
      'Parking',
      'Garden',
    ],
    images: ['/swift river.jpg', '/Port_antonio2.jpg'],
    propertyType: 'resort',
    maxGuests: 4,
    bedrooms: 1,
    bathrooms: 1,
    squareFootage: 640,
    roomTypes: [
      {
        id: 'mango-house-room',
        name: 'Mango House Room',
        description:
          'A simple Portland stay with balcony access, breakfast options, and a resort setting just outside the heart of Port Antonio.',
        maxOccupancy: 4,
        pricePerNight: 180,
        quantityAvailable: 12,
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Parking'],
        images: ['/swift river.jpg', '/Port_antonio2.jpg'],
        listStatus: 'listed',
      },
    ],
    host: { ...portlandHost, superhost: false },
    coordinates: {
      latitude: 18.1719,
      longitude: -76.4728,
    },
  }),
];

export const mergeSeededProperties = <T extends SeededKottage>(
  properties: T[]
): T[] => {
  const merged = new Map<string, T>();

  seededProperties.forEach(property => {
    merged.set(property.key, property as T);
  });

  properties.forEach(property => {
    merged.set(property.key, property);
  });

  return Array.from(merged.values());
};

export const getSeededPropertyById = (id: string) =>
  seededProperties.find(property => property.key === id || property.id === id) ||
  null;

export const getSeededPropertiesByOwnerId = (ownerId?: string | null) =>
  ownerId
    ? seededProperties.filter(property => property.ownerId === ownerId)
    : [];
