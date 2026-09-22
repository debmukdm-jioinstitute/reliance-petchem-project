import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/documents',
        destination: '/',
        permanent: false,
      },
      {
        source: '/documents/:path*',
        destination: '/',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
