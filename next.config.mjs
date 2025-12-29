/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,
  },
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
  reactStrictMode: true,
  // Disable webpack config when using Turbopack
  ...(process.env.TURBO ? {} : {
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
  }),
};

export default nextConfig;
