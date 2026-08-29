export interface StoredEventTicketOrder {
  confirmation: string;
  eventId: string;
  eventTitle: string;
  ticketId?: string;
  tierId: string;
  tierName: string;
  quantity: number;
  total: number;
  guestName: string;
  guestEmail: string;
  reservedAt: string;
}

export interface EventWalletRecord {
  savedCouponIds: string[];
  ticketOrders: StoredEventTicketOrder[];
}

export const SAVED_EVENT_COUPON_STORAGE_KEY = 'yaad-saved-event-coupons';
export const EVENT_TICKET_ORDER_STORAGE_KEY = 'yaad-ticket-orders';

export const emptyEventWallet: EventWalletRecord = {
  savedCouponIds: [],
  ticketOrders: [],
};

const parseStoredArray = <T,>(value: string | null): T[] => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch (error) {
    console.warn('Unable to parse legacy event wallet storage.', error);
    return [];
  }
};

const normalizeSavedCouponIds = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return Array.from(
      new Set(
        value.filter((couponId): couponId is string => {
          return typeof couponId === 'string' && couponId.trim().length > 0;
        })
      )
    );
  }

  if (value && typeof value === 'object') {
    return normalizeSavedCouponIds(Object.values(value as Record<string, unknown>));
  }

  return [];
};

const normalizeTicketOrder = (value: unknown): StoredEventTicketOrder | null => {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const raw = value as Partial<StoredEventTicketOrder>;

  if (typeof raw.confirmation !== 'string' || typeof raw.eventId !== 'string') {
    return null;
  }

  return {
    confirmation: raw.confirmation,
    eventId: raw.eventId,
    eventTitle: typeof raw.eventTitle === 'string' ? raw.eventTitle : 'Event',
    ticketId: typeof raw.ticketId === 'string' ? raw.ticketId : undefined,
    tierId: typeof raw.tierId === 'string' ? raw.tierId : '',
    tierName: typeof raw.tierName === 'string' ? raw.tierName : 'Ticket',
    quantity: Number(raw.quantity || 0),
    total: Number(raw.total || 0),
    guestName: typeof raw.guestName === 'string' ? raw.guestName : '',
    guestEmail: typeof raw.guestEmail === 'string' ? raw.guestEmail : '',
    reservedAt:
      typeof raw.reservedAt === 'string'
        ? raw.reservedAt
        : new Date().toISOString(),
  };
};

const normalizeTicketOrders = (value: unknown): StoredEventTicketOrder[] => {
  const source = Array.isArray(value)
    ? value
    : value && typeof value === 'object'
      ? Object.values(value as Record<string, unknown>)
      : [];

  const deduped = new Map<string, StoredEventTicketOrder>();

  source.forEach(item => {
    const order = normalizeTicketOrder(item);
    if (order) {
      deduped.set(getStoredEventTicketOrderKey(order), order);
    }
  });

  return Array.from(deduped.values()).sort(
    (left, right) =>
      new Date(right.reservedAt).getTime() - new Date(left.reservedAt).getTime()
  );
};

export const normalizeEventWallet = (value: unknown): EventWalletRecord => {
  if (!value || typeof value !== 'object') {
    return emptyEventWallet;
  }

  const raw = value as Partial<EventWalletRecord>;

  return {
    savedCouponIds: normalizeSavedCouponIds(raw.savedCouponIds),
    ticketOrders: normalizeTicketOrders(raw.ticketOrders),
  };
};

export const serializeEventWallet = (wallet: EventWalletRecord) => ({
  savedCouponIds: normalizeSavedCouponIds(wallet.savedCouponIds),
  ticketOrders: normalizeTicketOrders(wallet.ticketOrders),
});

export const getStoredEventTicketOrderKey = (order: StoredEventTicketOrder) =>
  `${order.confirmation}-${order.reservedAt}`;

export const mergeEventWallets = (
  primary: EventWalletRecord,
  secondary: EventWalletRecord
): EventWalletRecord => {
  return {
    savedCouponIds: Array.from(
      new Set([...primary.savedCouponIds, ...secondary.savedCouponIds])
    ),
    ticketOrders: normalizeTicketOrders([
      ...primary.ticketOrders,
      ...secondary.ticketOrders,
    ]),
  };
};

export const getEventWalletCount = (wallet: EventWalletRecord) =>
  wallet.savedCouponIds.length + wallet.ticketOrders.length;

export const readLegacySavedEventCouponIds = (): string[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  return normalizeSavedCouponIds(
    parseStoredArray<string>(
      window.localStorage.getItem(SAVED_EVENT_COUPON_STORAGE_KEY)
    )
  );
};

export const readLegacyStoredEventTicketOrders = (): StoredEventTicketOrder[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  return normalizeTicketOrders(
    parseStoredArray<StoredEventTicketOrder>(
      window.localStorage.getItem(EVENT_TICKET_ORDER_STORAGE_KEY)
    )
  );
};

export const readLegacyEventWallet = (): EventWalletRecord => ({
  savedCouponIds: readLegacySavedEventCouponIds(),
  ticketOrders: readLegacyStoredEventTicketOrders(),
});

export const hasLegacyEventWalletData = () => {
  const legacyWallet = readLegacyEventWallet();
  return (
    legacyWallet.savedCouponIds.length > 0 || legacyWallet.ticketOrders.length > 0
  );
};

export const clearLegacyEventWalletStorage = () => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(SAVED_EVENT_COUPON_STORAGE_KEY);
  window.localStorage.removeItem(EVENT_TICKET_ORDER_STORAGE_KEY);
};
