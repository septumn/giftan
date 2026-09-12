import type { NextConfig } from "next"
import path from 'path'

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/avatars/**',
      },
    ],
  },
  transpilePackages: ['@giftan/shared'],
  turbopack: {
    root: path.resolve(__dirname, '../../'),
  },
};

export default nextConfig
