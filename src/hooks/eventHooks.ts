import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { get, push, ref, remove, set, update } from 'firebase/database';
import {
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from 'firebase/storage';
import { auth, database, storage } from '../firebase';

export type EventCategory =
  | 'Music'
  | 'Live Music'
  | 'Food & Drink'
  | 'Food & Rum'
  | 'Business'
  | 'Culture'
  | 'Wellness'
  | 'Nightlife'
  | 'Parties'
  | 'Family';

export type EventStatus = 'published' | 'draft' | 'sold_out' | 'cancelled';
export type EventSource = 'sample' | 'database';

export interface EventVenue {
  name: string;
  city: string;
  parish: string;
  address: string;
}

export interface EventTicketTier {
  id: string;
  name: string;
  price: number;
  remaining: number;
  perks: string[];
}

export interface EventCoupon {
  code: string;
  description: string;
  discountText: string;
  expiresAt: string;
}

export interface EventRecord {
  id: string;
  title: string;
  summary: string;
  description: string;
  image: string;
  images: string[];
  startDate: string;
  endDate: string;
  category: EventCategory;
  status: EventStatus;
  featured: boolean;
  badge?: string;
  organizer: string;
  venue: EventVenue;
  tags: string[];
  perks: string[];
  lineup: string[];
  ticketTiers: EventTicketTier[];
  coupon?: EventCoupon;
  ticketUrl?: string;
  website?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  source?: EventSource;
}

export interface UseEventsOptions {
  includeDrafts?: boolean;
  upcomingOnly?: boolean;
  featuredOnly?: boolean;
}

export interface EventInput {
  title: string;
  summary: string;
  description: string;
  images: string[];
  startDate: string;
  endDate: string;
  category: EventCategory;
  status: EventStatus;
  featured: boolean;
  badge?: string;
  organizer: string;
  venue: EventVenue;
  tags: string[];
  perks: string[];
  lineup: string[];
  ticketTiers: EventTicketTier[];
  coupon?: EventCoupon;
  ticketUrl?: string;
  website?: string;
}

export const eventCategoryOptions: EventCategory[] = [
  'Music',
  'Live Music',
  'Food & Drink',
  'Business',
  'Culture',
  'Wellness',
  'Nightlife',
  'Parties',
  'Family',
];

const eventQueryKey = ['events', 'all'];
const ignoredLegacyEventImages = new Set(['/swift river.jpg']);

const sanitizeFileName = (fileName: string) =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, '-');

const isIgnoredLegacyEventImage = (imageUrl: string) =>
  ignoredLegacyEventImages.has(imageUrl);

const toArray = <T>(value: unknown): T[] => {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, T>);
  }

  if (typeof value === 'string') {
    return [value as T];
  }

  return [];
};

const toStringArray = (value: unknown) =>
  toArray<unknown>(value).filter(
    (item): item is string => typeof item === 'string'
  );

const uniqueImageUrls = (imageUrls: string[]) =>
  imageUrls
    .map(imageUrl => imageUrl.trim())
    .filter(
      (imageUrl, index, allImageUrls) =>
        Boolean(imageUrl) && allImageUrls.indexOf(imageUrl) === index
    );

const normalizeEventImageUrls = (
  raw: Partial<EventRecord> & Record<string, unknown>
) => {
  const rawImages = toStringArray(raw.images);
  const rawImageUrls = toStringArray(raw.imageUrls);
  const rawPhotos = toStringArray(raw.photos);
  const legacyImage = typeof raw.image === 'string' ? raw.image : '';
  const legacyImageUrl = typeof raw.imageUrl === 'string' ? raw.imageUrl : '';
  const legacyImageURL = typeof raw.imageURL === 'string' ? raw.imageURL : '';
  const coverImageUrl =
    typeof raw.coverImageUrl === 'string' ? raw.coverImageUrl : '';
  const imageUrls = uniqueImageUrls([
    ...rawImages,
    ...rawImageUrls,
    ...rawPhotos,
    legacyImage,
    legacyImageUrl,
    legacyImageURL,
    coverImageUrl,
  ]);
  return imageUrls.filter(imageUrl => !isIgnoredLegacyEventImage(imageUrl));
};

const normalizeEvent = (
  eventId: string,
  raw: Partial<EventRecord> & Record<string, unknown>,
  source: EventSource
): EventRecord => {
  const venue = (raw.venue as Partial<EventVenue> | undefined) || {};
  const coupon = (raw.coupon as Partial<EventCoupon> | undefined) || undefined;
  const images = normalizeEventImageUrls(raw);
  const primaryImage = images[0] || '';
  const ticketTiers = toArray<Partial<EventTicketTier>>(raw.ticketTiers).map(
    (tier, index) => ({
      id: tier.id || `tier-${index + 1}`,
      name: tier.name || `Tier ${index + 1}`,
      price: Number(tier.price || 0),
      remaining: Number(tier.remaining ?? 0),
      perks: Array.isArray(tier.perks)
        ? (tier.perks.filter(Boolean) as string[])
        : [],
    })
  );

  return {
    id: eventId,
    title: raw.title || 'Untitled Event',
    summary: raw.summary || '',
    description: raw.description || '',
    image: primaryImage,
    images,
    startDate: raw.startDate || new Date().toISOString(),
    endDate: raw.endDate || raw.startDate || new Date().toISOString(),
    category: (raw.category as EventCategory) || 'Culture',
    status: (raw.status as EventStatus) || 'draft',
    featured: Boolean(raw.featured),
    badge: typeof raw.badge === 'string' ? raw.badge : undefined,
    organizer: raw.organizer || 'Yaad Events',
    venue: {
      name: venue.name || 'Venue TBA',
      city: venue.city || 'Jamaica',
      parish: venue.parish || 'Jamaica',
      address: venue.address || 'Address to be announced',
    },
    tags: Array.isArray(raw.tags) ? (raw.tags.filter(Boolean) as string[]) : [],
    perks: Array.isArray(raw.perks)
      ? (raw.perks.filter(Boolean) as string[])
      : [],
    lineup: Array.isArray(raw.lineup)
      ? (raw.lineup.filter(Boolean) as string[])
      : [],
    ticketTiers,
    coupon: coupon
      ? {
          code: coupon.code || '',
          description: coupon.description || '',
          discountText: coupon.discountText || '',
          expiresAt: coupon.expiresAt || raw.endDate || raw.startDate || '',
        }
      : undefined,
    ticketUrl: raw.ticketUrl || undefined,
    website: raw.website || undefined,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt,
    createdBy: raw.createdBy,
    source,
  };
};

const isUpcomingEvent = (event: EventRecord) =>
  new Date(event.endDate).getTime() >= new Date().setHours(0, 0, 0, 0);

const sortEvents = (events: EventRecord[]) =>
  [...events].sort(
    (left, right) =>
      new Date(left.startDate).getTime() - new Date(right.startDate).getTime()
  );

const fetchDatabaseEvents = async (): Promise<EventRecord[]> => {
  try {
    const dbRef = ref(database, 'events');

    const snapshot = await get(dbRef);

    if (!snapshot.exists()) {
      return [];
    }

    const rawEvents = snapshot.val();

    const events = Object.entries(rawEvents || {}).map(([eventId, raw]) => {
      return normalizeEvent(eventId, raw as Partial<EventRecord>, 'database');
    });

    return events;
  } catch (error) {
    if (error instanceof Error) {
    }
    return [];
  }
};

const fetchEvents = async (): Promise<EventRecord[]> => {
  const databaseEvents = await fetchDatabaseEvents();
  const sorted = sortEvents(databaseEvents);
  return sorted;
};

const filterEvents = (
  events: EventRecord[],
  {
    includeDrafts = false,
    upcomingOnly = true,
    featuredOnly = false,
  }: UseEventsOptions
) => {
  let filtered = [...events];

  if (!includeDrafts) {
    filtered = filtered.filter(
      event => event.status === 'published' || event.status === 'sold_out'
    );
  }

  if (upcomingOnly) {
    filtered = filtered.filter(isUpcomingEvent);
  }

  if (featuredOnly) {
    filtered = filtered.filter(event => event.featured);
  }

  return sortEvents(filtered);
};

export const useEvents = (options: UseEventsOptions = {}) =>
  useQuery({
    queryKey: [...eventQueryKey, options],
    queryFn: fetchEvents,
    select: data => filterEvents(data, options),
  });

export const useEventById = (
  eventId: string | undefined,
  includeDrafts = false
) =>
  useQuery({
    queryKey: [...eventQueryKey, 'detail', eventId, includeDrafts],
    queryFn: fetchEvents,
    enabled: !!eventId,
    select: data =>
      data.find(
        event =>
          event.id === eventId &&
          (includeDrafts ||
            event.status === 'published' ||
            event.status === 'sold_out')
      ) || null,
  });

export const useAddEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (event: EventInput) => {
      const newEventRef = push(ref(database, 'events'));
      const eventId = newEventRef.key!;
      // Defensive: ensure images array is always set and not empty
      const images = uniqueImageUrls(
        event.images && event.images.length ? event.images : []
      );
      const payload: EventRecord = {
        id: eventId,
        ...event,
        images,
        image: images[0] || '',
        createdAt: new Date().toISOString(),
        createdBy: auth?.currentUser?.uid || 'admin',
        source: 'database',
      };
      await set(ref(database, `events/${eventId}`), payload);
      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      eventId,
      updates,
    }: {
      eventId: string;
      updates: Partial<EventInput>;
    }) => {
      const normalizedUpdates: Partial<EventInput> & { image?: string } = {
        ...updates,
      };
      if (updates.images && updates.images.length > 0) {
        const images = uniqueImageUrls(updates.images);
        normalizedUpdates.images = images;
        normalizedUpdates.image = images[0] || '';
      } else {
        // If images is present but empty, do not overwrite existing images/image
        delete normalizedUpdates.images;
        delete normalizedUpdates.image;
      }
      await update(ref(database, `events/${eventId}`), {
        ...normalizedUpdates,
        updatedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const useUploadEventImages = () =>
  useMutation({
    mutationFn: async (files: File[]) => {
      const currentUserId = auth?.currentUser?.uid || 'admin';
      const timestamp = Date.now();

      return Promise.all(
        files.map(async (file, index) => {
          const safeFileName = sanitizeFileName(file.name || 'event-image');
          const fileRef = storageRef(
            storage,
            `eventImages/${currentUserId}/${timestamp}-${index + 1}-${safeFileName}`
          );
          const snapshot = await uploadBytes(fileRef, file);

          return getDownloadURL(snapshot.ref);
        })
      );
    },
  });

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (eventId: string) => {
      await remove(ref(database, `events/${eventId}`));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

export const getEventPriceLabel = (event: EventRecord) => {
  if (!event.ticketTiers.length) {
    return 'Ticket info coming soon';
  }

  if (
    event.ticketTiers.some(
      tier => tier.price === 0 && /free/i.test(`${tier.id} ${tier.name}`)
    )
  ) {
    return 'Free';
  }

  const prices = event.ticketTiers
    .map(tier => tier.price)
    .filter(price => price > 0);
  if (!prices.length) {
    return event.ticketUrl || event.website
      ? 'Pricing on event site'
      : 'Ticket options available';
  }

  const lowest = Math.min(...prices);
  return `From $${lowest}`;
};

export const getEventTicketTierPriceLabel = (
  tier: Pick<EventTicketTier, 'id' | 'name' | 'price'>
) => {
  if (tier.price > 0) {
    return `$${tier.price}`;
  }

  if (/free/i.test(`${tier.id} ${tier.name}`)) {
    return 'Free';
  }

  return 'Price TBA';
};

export const getEventImageUrls = (
  event: Pick<EventRecord, 'image' | 'images'>
) =>
  normalizeEventImageUrls(
    event as Partial<EventRecord> & Record<string, unknown>
  );

export const getEventPrimaryImage = (
  event: Pick<EventRecord, 'image' | 'images'>
) => getEventImageUrls(event)[0] || '';

export const getEventLocationLabel = (event: EventRecord) =>
  `${event.venue.city}, ${event.venue.parish}`;

export const getEventStatusLabel = (status: EventStatus) => {
  switch (status) {
    case 'sold_out':
      return 'Sold Out';
    case 'cancelled':
      return 'Cancelled';
    case 'draft':
      return 'Draft';
    case 'published':
    default:
      return 'Published';
  }
};

export const isEventClosedForGuestActions = (
  event: Pick<EventRecord, 'status'>
) => event.status === 'sold_out' || event.status === 'cancelled';

export const getEventClosedActionMessage = (
  event: Pick<EventRecord, 'status'>
) => {
  if (event.status === 'cancelled') {
    return 'This event has been cancelled.';
  }

  if (event.status === 'sold_out') {
    return 'This event is sold out.';
  }

  return '';
};
