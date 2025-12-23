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
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default nextConfig;
