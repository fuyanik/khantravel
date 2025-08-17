/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'vitamu.imgix.net',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
      }
    ]
  },
  // Hot reload optimization
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    // Optimize for development
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

export default nextConfig;
