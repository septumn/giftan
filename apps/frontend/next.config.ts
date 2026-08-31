<<<<<<< HEAD
import type { NextConfig } from "next"
=======
import type { NextConfig } from "next";
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78

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
<<<<<<< HEAD
  transpilePackages: ['@giftan/contracts'],
};

export default nextConfig
=======
};

export default nextConfig;
>>>>>>> a425819849e63eecfc5a85d7a32df2390ec1cc78
