/**
 * Utility to handle subdomain-based routing
 */

export const VALID_SUBDOMAINS = ['admin', 'staff', 'host'] as const;
export type ValidSubdomain = (typeof VALID_SUBDOMAINS)[number];

export const LOCAL_DEV_MAIN_PORT = '3000';
export const LOCAL_DEV_SUBDOMAIN_PORTS: Record<ValidSubdomain, string> = {
  admin: '3001',
  staff: '3002',
  host: '3003',
};

const LOCAL_DEV_HOSTS = new Set(['localhost', '127.0.0.1']);
const SIMULATED_SUBDOMAIN_KEY = 'simulated_subdomain';

const isLocalDevHost = (hostname: string): boolean => {
  return LOCAL_DEV_HOSTS.has(hostname);
};

const isValidSubdomainValue = (
  subdomain: string | null | undefined
): subdomain is ValidSubdomain => {
  return !!subdomain && VALID_SUBDOMAINS.includes(subdomain as ValidSubdomain);
};

const getLocalDevSubdomainByPort = (port: string): ValidSubdomain | null => {
  const match = Object.entries(LOCAL_DEV_SUBDOMAIN_PORTS).find(
    ([, mappedPort]) => mappedPort === port
  );

  return match ? (match[0] as ValidSubdomain) : null;
};

const getBaseHostname = (hostname: string): string => {
  const parts = hostname.split('.');

  if (parts.length > 2 && isValidSubdomainValue(parts[0])) {
    return parts.slice(1).join('.');
  }

  return hostname;
};

/**
 * Extracts the subdomain from the current hostname
 * @returns The subdomain or null if no subdomain exists
 */
export const getSubdomain = (): string | null => {
  const { hostname, port } = window.location;

  if (isLocalDevHost(hostname)) {
    const configuredSubdomain = process.env.REACT_APP_LOCAL_SUBDOMAIN;

    if (isValidSubdomainValue(configuredSubdomain)) {
      return configuredSubdomain;
    }

    const portSubdomain = getLocalDevSubdomainByPort(port);
    if (portSubdomain) {
      return portSubdomain;
    }

    return localStorage.getItem(SIMULATED_SUBDOMAIN_KEY);
  }

  const parts = hostname.split('.');

  if (parts.length > 2) {
    return parts[0];
  }

  return null;
};

/**
 * Checks if the current subdomain matches the specified one
 * @param subdomain The subdomain to check
 * @returns True if the current subdomain matches
 */
export const isSubdomain = (subdomain: string): boolean => {
  return getSubdomain() === subdomain;
};

/**
 * Checks if the current subdomain is any of the valid subdomains
 * @returns True if the current subdomain is valid
 */
export const isValidSubdomain = (): boolean => {
  const subdomain = getSubdomain();
  return isValidSubdomainValue(subdomain);
};

/**
 * Resolves the canonical URL for a subdomain or the main site.
 * In local development, portal subdomains are mapped to dedicated ports.
 */
export const getPortalUrl = (
  subdomain: string | null,
  path = '/'
): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const { protocol, hostname } = window.location;

  if (isLocalDevHost(hostname)) {
    const localPort = isValidSubdomainValue(subdomain)
      ? LOCAL_DEV_SUBDOMAIN_PORTS[subdomain]
      : LOCAL_DEV_MAIN_PORT;

    return `${protocol}//${hostname}:${localPort}${normalizedPath}`;
  }

  const baseHostname = getBaseHostname(hostname);
  const targetHostname = isValidSubdomainValue(subdomain)
    ? `${subdomain}.${baseHostname}`
    : baseHostname;

  return `${protocol}//${targetHostname}${normalizedPath}`;
};

export const navigateToPortal = (
  subdomain: string | null,
  path = '/'
): void => {
  if (isLocalDevHost(window.location.hostname)) {
    localStorage.removeItem(SIMULATED_SUBDOMAIN_KEY);
  }

  window.location.assign(getPortalUrl(subdomain, path));
};

/**
 * For development purposes: simulate a subdomain
 * @param subdomain The subdomain to simulate
 */
export const simulateSubdomain = (subdomain: string | null): void => {
  if (isLocalDevHost(window.location.hostname)) {
    navigateToPortal(subdomain);
    return;
  }

  if (subdomain) {
    localStorage.setItem(SIMULATED_SUBDOMAIN_KEY, subdomain);
  } else {
    localStorage.removeItem(SIMULATED_SUBDOMAIN_KEY);
  }

  window.location.reload();
};
