import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['ipfs.io', 'api.qrserver.com', 'gateway.pinata.cloud', 'jade-adjacent-mosquito-859.mypinata.cloud', 'cloudflare-ipfs.com', 'dweb.link', 'media.istockphoto.com', 'encrypted-tbn0.gstatic.com', 'c8.alamy.com', 'eos.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ipfs.io',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'gateway.pinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'jade-adjacent-mosquito-859.mypinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'cloudflare-ipfs.com',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'dweb.link',
        port: '',
        pathname: '/ipfs/**',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
        port: '',
        pathname: '/id/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/images/**',
      }
    ],
  },
};

export default nextConfig;
