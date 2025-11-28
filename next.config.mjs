/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable caching in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "6210",
        pathname: "/uploads/**",
      },
    ],
  },
  // Add headers to disable caching
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        // Apply no-cache headers to all authenticated pages
        source:
          "/(dashboard|inventory|assignments|livestock|feeds|locations|users|maintenance|reservations|approvals|audit-logs|reports|settings|categories|stock-movements|stock-transfers|suppliers|purchase-orders|product-assignments|notifications)/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
      {
        // Apply no-cache headers to auth pages
        source: "/(login|register|logout)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate, private",
          },
          { key: "Pragma", value: "no-cache" },
          { key: "Expires", value: "0" },
        ],
      },
    ];
  },
  // API routes will be handled by custom server
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "/api/:path*",
      },
      {
        source: "/health",
        destination: "/api/health",
      },
    ];
  },
};

export default nextConfig;
