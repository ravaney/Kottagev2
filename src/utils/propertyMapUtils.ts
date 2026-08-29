import { KottageWithId } from '../hooks/usePropertySearch';

export interface ResolvedPropertyCoordinates {
  latitude: number;
  longitude: number;
  precision: 'exact' | 'city' | 'parish' | 'country';
}

const JAMAICA_CENTER = {
  latitude: 18.1096,
  longitude: -77.2975,
} as const;

const cityCoordinates: Record<string, { latitude: number; longitude: number }> = {
  kingston: { latitude: 17.9712, longitude: -76.7936 },
  portmore: { latitude: 17.9503, longitude: -76.8828 },
  'spanish town': { latitude: 17.9911, longitude: -76.9571 },
  'old harbour': { latitude: 17.9413, longitude: -77.1089 },
  'may pen': { latitude: 17.9645, longitude: -77.2451 },
  'ocho rios': { latitude: 18.4079, longitude: -77.1031 },
  'runaway bay': { latitude: 18.4587, longitude: -77.3259 },
  'montego bay': { latitude: 18.4762, longitude: -77.8939 },
  negril: { latitude: 18.2683, longitude: -78.3482 },
  falmouth: { latitude: 18.4922, longitude: -77.6568 },
  lucea: { latitude: 18.4516, longitude: -78.1736 },
  'savanna la mar': { latitude: 18.2184, longitude: -78.1332 },
  'savanna-la-mar': { latitude: 18.2184, longitude: -78.1332 },
  mandeville: { latitude: 18.0417, longitude: -77.5071 },
  'black river': { latitude: 18.0261, longitude: -77.8487 },
  'treasure beach': { latitude: 17.8817, longitude: -77.7642 },
  'port antonio': { latitude: 18.1761, longitude: -76.4509 },
  'annotto bay': { latitude: 18.2711, longitude: -76.7665 },
  oracabessa: { latitude: 18.4032, longitude: -76.9463 },
  mobay: { latitude: 18.4762, longitude: -77.8939 },
};

const parishCoordinates: Record<
  string,
  { latitude: number; longitude: number }
> = {
  kingston: { latitude: 17.9838, longitude: -76.7936 },
  'st andrew': { latitude: 18.0157, longitude: -76.7924 },
  'saint andrew': { latitude: 18.0157, longitude: -76.7924 },
  'st catherine': { latitude: 17.9985, longitude: -76.9581 },
  'saint catherine': { latitude: 17.9985, longitude: -76.9581 },
  clarendon: { latitude: 17.9557, longitude: -77.2408 },
  manchester: { latitude: 18.0667, longitude: -77.5167 },
  'st ann': { latitude: 18.3281, longitude: -77.2015 },
  'saint ann': { latitude: 18.3281, longitude: -77.2015 },
  'st mary': { latitude: 18.3093, longitude: -76.8994 },
  'saint mary': { latitude: 18.3093, longitude: -76.8994 },
  portland: { latitude: 18.1928, longitude: -76.6138 },
  'st thomas': { latitude: 17.9989, longitude: -76.3503 },
  'saint thomas': { latitude: 17.9989, longitude: -76.3503 },
  'st james': { latitude: 18.3922, longitude: -77.8595 },
  'saint james': { latitude: 18.3922, longitude: -77.8595 },
  hanover: { latitude: 18.4098, longitude: -78.1336 },
  westmoreland: { latitude: 18.2944, longitude: -78.1564 },
  trelawny: { latitude: 18.3526, longitude: -77.6078 },
  'st elizabeth': { latitude: 18.0788, longitude: -77.6994 },
  'saint elizabeth': { latitude: 18.0788, longitude: -77.6994 },
};

const normalizeLocationKey = (value?: string | null) =>
  value
    ?.toLowerCase()
    .replace(/[.,]/g, '')
    .replace(/\s+/g, ' ')
    .trim() || '';

const toNumericCoordinate = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

export const getPropertyPriceLabel = (property: KottageWithId) => {
  const validPrices =
    property.roomTypes
      ?.map(room => room.pricePerNight)
      .filter(price => Number.isFinite(price) && price > 0) || [];
  const lowestPrice = validPrices.length ? Math.min(...validPrices) : undefined;

  return lowestPrice && lowestPrice > 0 ? `$${lowestPrice}/night` : 'View stay';
};

export const getPropertyLocationLabel = (property: KottageWithId) => {
  const city = property.address?.city?.trim();
  const state = property.address?.state?.trim();

  if (city && state) {
    return `${city}, ${state}`;
  }

  return city || state || 'Jamaica';
};

export const resolvePropertyCoordinates = (
  property: KottageWithId
): ResolvedPropertyCoordinates => {
  const exactLatitude = toNumericCoordinate(
    property.coordinates?.latitude ??
      (property as unknown as Record<string, unknown>).latitude ??
      (property.address as unknown as Record<string, unknown> | undefined)
        ?.latitude ??
      (property.address as unknown as Record<string, unknown> | undefined)?.lat
  );
  const exactLongitude = toNumericCoordinate(
    property.coordinates?.longitude ??
      (property as unknown as Record<string, unknown>).longitude ??
      (property.address as unknown as Record<string, unknown> | undefined)
        ?.longitude ??
      (property.address as unknown as Record<string, unknown> | undefined)?.lng
  );

  if (
    exactLatitude !== undefined &&
    exactLongitude !== undefined &&
    exactLatitude >= -90 &&
    exactLatitude <= 90 &&
    exactLongitude >= -180 &&
    exactLongitude <= 180
  ) {
    return {
      latitude: exactLatitude,
      longitude: exactLongitude,
      precision: 'exact',
    };
  }

  const cityKey = normalizeLocationKey(property.address?.city);
  if (cityKey && cityCoordinates[cityKey]) {
    return {
      ...cityCoordinates[cityKey],
      precision: 'city',
    };
  }

  const stateKey = normalizeLocationKey(property.address?.state);
  if (stateKey && parishCoordinates[stateKey]) {
    return {
      ...parishCoordinates[stateKey],
      precision: 'parish',
    };
  }

  return {
    ...JAMAICA_CENTER,
    precision: 'country',
  };
};
