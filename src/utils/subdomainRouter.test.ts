import {
  getPortalUrl,
  getSubdomain,
  LOCAL_DEV_MAIN_PORT,
  LOCAL_DEV_SUBDOMAIN_PORTS,
} from './subdomainRouter';

const setLocation = (hostname: string, port = '', protocol = 'https:') => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { hostname, port, protocol },
  });
};

describe('subdomainRouter', () => {
  describe('getPortalUrl on a production hostname', () => {
    it('builds the portal URL on the apex domain, not on www', () => {
      setLocation('www.bluekottage.com');

      expect(getPortalUrl('admin', '/dashboard')).toBe(
        'https://admin.bluekottage.com/dashboard'
      );
      expect(getPortalUrl('staff')).toBe('https://staff.bluekottage.com/');
      expect(getPortalUrl('host', '/login')).toBe(
        'https://host.bluekottage.com/login'
      );
    });

    it('drops existing portal and www labels', () => {
      setLocation('admin.www.bluekottage.com');

      expect(getPortalUrl('staff', '/dashboard')).toBe(
        'https://staff.bluekottage.com/dashboard'
      );
      expect(getPortalUrl(null)).toBe('https://bluekottage.com/');
    });

    it('keeps the apex domain for the main site', () => {
      setLocation('admin.bluekottage.com');

      expect(getPortalUrl(null, '/Explore')).toBe(
        'https://bluekottage.com/Explore'
      );
    });

    it('leaves multi-level domains and hosting previews untouched', () => {
      setLocation('www.bluekottage.co.uk');
      expect(getPortalUrl('admin')).toBe('https://admin.bluekottage.co.uk/');

      setLocation('kottage-v2--preview-abc.web.app');
      expect(getPortalUrl('admin')).toBe(
        'https://admin.kottage-v2--preview-abc.web.app/'
      );
    });
  });

  describe('getSubdomain on a production hostname', () => {
    it('does not treat www as a portal subdomain', () => {
      setLocation('www.bluekottage.com');
      expect(getSubdomain()).toBeNull();
    });

    it('returns the portal subdomain', () => {
      setLocation('admin.bluekottage.com');
      expect(getSubdomain()).toBe('admin');
    });
  });

  describe('getPortalUrl in local development', () => {
    it('maps portals to their dedicated ports', () => {
      setLocation('localhost', '3000', 'http:');

      expect(getPortalUrl('admin')).toBe(
        `http://localhost:${LOCAL_DEV_SUBDOMAIN_PORTS.admin}/`
      );
      expect(getPortalUrl(null)).toBe(
        `http://localhost:${LOCAL_DEV_MAIN_PORT}/`
      );
    });
  });
});
