import type { NextConfig } from "next";

// Permanent redirects for old paths that moved to /tracker/* during reorganisation.
// 308 = permanent redirect (preserves HTTP method).
const OLD_TRACKER_PATHS = [
  'dashboard', 'products', 'inventory', 'purchases', 'sales',
  'returns', 'customers', 'invoices', 'reports', 'settings',
];

const nextConfig: NextConfig = {
  async redirects() {
    const trackerPageRedirects = OLD_TRACKER_PATHS.map(path => ({
      source:      `/${path}`,
      destination: `/tracker/${path}`,
      permanent:   true,
    }));

    return [
      ...trackerPageRedirects,
      { source: '/login',    destination: '/tracker/login',    permanent: true },
      { source: '/register', destination: '/tracker/register', permanent: true },
    ];
  },
};

export default nextConfig;
