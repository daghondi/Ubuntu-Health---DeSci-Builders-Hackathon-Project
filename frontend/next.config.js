/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: false, // We'll use pages directory for now
  },
  images: {
    domains: [
      'ipfs.io',
      'gateway.pinata.cloud',
      'arweave.net',
      'ubuntu-cultural-assets.ipfs.dweb.link'
    ],
  },
  env: {
    NEXT_PUBLIC_SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
    NEXT_PUBLIC_ANCHOR_WALLET: process.env.NEXT_PUBLIC_ANCHOR_WALLET,
    NEXT_PUBLIC_IPFS_GATEWAY: process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
    NEXT_PUBLIC_ARWEAVE_GATEWAY: process.env.NEXT_PUBLIC_ARWEAVE_GATEWAY || 'https://arweave.net/',
    NEXT_PUBLIC_UBUNTU_PHILOSOPHY_IPFS: process.env.NEXT_PUBLIC_UBUNTU_PHILOSOPHY_IPFS,
    NEXT_PUBLIC_ELDER_COUNCIL_AUTHORITY: process.env.NEXT_PUBLIC_ELDER_COUNCIL_AUTHORITY,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },
  i18n: {
    locales: ['en', 'fr', 'sw', 'zu', 'am', 'pt'],
    defaultLocale: 'en',
    localeDetection: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
