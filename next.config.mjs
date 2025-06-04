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
      '@sparticuz/chromium', // or '@sparticuz/chromium-min' if using the minimal package
    ],
  },
};

export default nextConfig;
