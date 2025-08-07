/**
 * Utility to handle subdomain-based routing
 */

// Define valid subdomains
export const VALID_SUBDOMAINS = ['admin', 'staff', 'host'];

/**
 * Extracts the subdomain from the current hostname
 * @returns The subdomain or null if no subdomain exists
 */
export const getSubdomain = (): string | null => {
  // Get the hostname (e.g., admin.bluekottage.com)
  const hostname = window.location.hostname;

  // Check if we're on localhost for development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // For local development, check if subdomain is simulated in localStorage
    return localStorage.getItem('simulated_subdomain');
  }

  // Split the hostname by dots
  const parts = hostname.split('.');

  // If we have more than 2 parts (subdomain.domain.tld), the first part is the subdomain
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
  return subdomain !== null && VALID_SUBDOMAINS.includes(subdomain);
};

/**
 * For development purposes: simulate a subdomain
 * @param subdomain The subdomain to simulate
 */
export const simulateSubdomain = (subdomain: string | null): void => {
  if (subdomain) {
    localStorage.setItem('simulated_subdomain', subdomain);
  } else {
    localStorage.removeItem('simulated_subdomain');
  }

  // Reload the page to apply the simulated subdomain
  window.location.reload();
};
