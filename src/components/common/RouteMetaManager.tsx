import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import routeMeta from '../../data/publicRouteMeta.json';
import { applyDocumentMeta } from '../../utils/documentMeta';

type RouteMetaRecord = Record<
  string,
  {
    title: string;
    description: string;
  }
>;

const publicRouteMeta = routeMeta as RouteMetaRecord;

const defaultMeta = publicRouteMeta['/'];

const resolveRouteMeta = (pathname: string) => {
  const normalizedPath = pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
  const directMatch =
    publicRouteMeta[normalizedPath] ||
    publicRouteMeta[normalizedPath.toLowerCase()];

  if (directMatch) {
    return directMatch;
  }

  if (
    normalizedPath.startsWith('/Events/') ||
    normalizedPath.startsWith('/events/')
  ) {
    return {
      title: 'Event Details | Blue Kottage',
      description:
        'View event details, ticket tiers, coupons, and planning information for upcoming Jamaica events.',
    };
  }

  if (
    normalizedPath.startsWith('/Kottages/') ||
    normalizedPath.startsWith('/kottages/')
  ) {
    return {
      title: 'Property Details | Blue Kottage',
      description:
        'View Jamaica stay details, amenities, and booking information on Blue Kottage.',
    };
  }

  if (
    normalizedPath.startsWith('/MyAccount/TicketsAndCoupons') ||
    normalizedPath.startsWith('/myaccount/ticketsandcoupons')
  ) {
    return {
      title: 'Tickets & Coupons | Blue Kottage',
      description:
        'View your saved event ticket reservations and coupons in one place on Blue Kottage.',
    };
  }

  return defaultMeta;
};

export default function RouteMetaManager() {
  const location = useLocation();

  useEffect(() => {
    applyDocumentMeta(resolveRouteMeta(location.pathname));
  }, [location.pathname]);

  return null;
}
