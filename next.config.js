/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Or specify exact domains
      },
    ],
  },
};

module.exports = nextConfig;
