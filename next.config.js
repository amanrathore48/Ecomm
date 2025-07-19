/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["mongoose"],
  },
  // Configure Next.js to look for pages only in the app directory
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
