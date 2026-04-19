/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      // Add other image hosts here if menu item images are hosted elsewhere
      // e.g. Cloudinary, S3, etc.
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS sources (restrict this once you know your image host)
      },
    ],
  },
};

module.exports = nextConfig;