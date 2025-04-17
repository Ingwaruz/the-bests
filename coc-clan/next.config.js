/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    domains: ['api-assets.clashofclans.com'],
  },
  experimental: {
    staticPagesRoot: '.',
  },
};

module.exports = nextConfig; 