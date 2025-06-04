/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: [
      'puppeteer-core',
      '@sparticuz/chromium-min',
    ],
  },
};

export default nextConfig;
