/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '6210',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;
