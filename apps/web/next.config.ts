import path from 'path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { hostname: 'localhost' },
      { protocol: 'https', hostname: 'api.cms.neelo.id' },
      { protocol: 'https', hostname: 'placehold.co' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure that all imports of 'yjs' resolve to the same instance
      config.resolve.alias['yjs'] = path.resolve(__dirname, 'node_modules/yjs');
    }
    return config;
  },
};

export default nextConfig;
