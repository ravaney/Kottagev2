import { onRequest } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';

if (!admin.apps.length) {
  admin.initializeApp();
}

interface RawTicketOrder {
  confirmation?: unknown;
  eventId?: unknown;
  eventTitle?: unknown;
  guestName?: unknown;
  quantity?: unknown;
  reservedAt?: unknown;
  ticketId?: unknown;
  tierId?: unknown;
  tierName?: unknown;
  total?: unknown;
}

interface FoundTicket {
  order: RawTicketOrder;
  ownerUid: string;
  ticketId: string;
}

const getString = (value: unknown) => (typeof value === 'string' ? value : '');

const getNumber = (value: unknown) =>
  typeof value === 'number' && Number.isFinite(value) ? value : Number(value || 0);

const getTicketIdCandidates = (order: RawTicketOrder) => {
  const ticketId = getString(order.ticketId);
  const eventId = getString(order.eventId);
  const confirmation = getString(order.confirmation);

  return [
    ticketId,
    eventId && confirmation ? `${eventId}-${confirmation}` : '',
  ].filter(Boolean);
};

const getTicketIdFromPath = (path: string) => {
  const match = path.match(/^\/(?:tickets\/)?([^/]+)\/validate\/?$/);

  if (!match?.[1]) {
    return null;
  }

  try {
    return decodeURIComponent(match[1]);
  } catch (error) {
    return null;
  }
};

const findTicketById = async (ticketId: string): Promise<FoundTicket | null> => {
  const usersSnapshot = await admin.database().ref('users').once('value');
  const users = usersSnapshot.val();

  if (!users || typeof users !== 'object') {
    return null;
  }

  for (const [ownerUid, rawUser] of Object.entries(users)) {
    const user = rawUser as {
      eventWallet?: {
        ticketOrders?: unknown;
      };
    };
    const rawTicketOrders = user.eventWallet?.ticketOrders;
    const ticketOrders =
      rawTicketOrders && typeof rawTicketOrders === 'object'
        ? Object.values(rawTicketOrders as Record<string, RawTicketOrder>)
        : [];

    for (const order of ticketOrders) {
      if (!order || typeof order !== 'object') {
        continue;
      }

      const candidates = getTicketIdCandidates(order);
      if (candidates.includes(ticketId)) {
        return {
          order,
          ownerUid,
          ticketId: candidates[0] || ticketId,
        };
      }
    }
  }

  return null;
};

const getEvent = async (eventId: string) => {
  if (!eventId) {
    return null;
  }

  const eventSnapshot = await admin.database().ref(`events/${eventId}`).once('value');
  return eventSnapshot.exists() ? eventSnapshot.val() : null;
};

export const tickets = onRequest(
  {
    cors: true,
    region: 'us-central1',
  },
  async (req, res) => {
    res.set('Cache-Control', 'no-store');

    if (req.method !== 'GET') {
      res.set('Allow', 'GET');
      res.status(405).json({
        valid: false,
        status: 'method_not_allowed',
        message: 'Use GET to validate a ticket.',
      });
      return;
    }

    const requestedTicketId = getTicketIdFromPath(req.path);

    if (!requestedTicketId) {
      res.status(400).json({
        valid: false,
        status: 'bad_request',
        message: 'Expected GET /tickets/{ticketId}/validate.',
      });
      return;
    }

    try {
      const foundTicket = await findTicketById(requestedTicketId);

      if (!foundTicket) {
        res.status(404).json({
          valid: false,
          status: 'not_found',
          ticketId: requestedTicketId,
          message: 'Ticket was not found.',
        });
        return;
      }

      const { order, ticketId } = foundTicket;
      const eventId = getString(order.eventId);
      const event = await getEvent(eventId);
      const eventStatus = getString(event?.status);
      const isCancelled = eventStatus === 'cancelled';

      res.status(200).json({
        valid: !isCancelled,
        status: isCancelled ? 'cancelled' : 'valid',
        validatedAt: new Date().toISOString(),
        ticket: {
          ticketId,
          confirmation: getString(order.confirmation),
          eventId,
          eventTitle: getString(order.eventTitle) || getString(event?.title),
          tierId: getString(order.tierId),
          tierName: getString(order.tierName),
          quantity: getNumber(order.quantity),
          total: getNumber(order.total),
          guestName: getString(order.guestName),
          reservedAt: getString(order.reservedAt),
        },
        event: event
          ? {
              id: eventId,
              title: getString(event.title),
              status: eventStatus || 'unknown',
              startDate: getString(event.startDate),
              endDate: getString(event.endDate),
              venue: {
                name: getString(event.venue?.name),
                city: getString(event.venue?.city),
                parish: getString(event.venue?.parish),
              },
            }
          : null,
      });
    } catch (error) {
      logger.error('Ticket validation failed', {
        ticketId: requestedTicketId,
        error,
      });
      res.status(500).json({
        valid: false,
        status: 'error',
        ticketId: requestedTicketId,
        message: 'Unable to validate ticket right now.',
      });
    }
  }
);
