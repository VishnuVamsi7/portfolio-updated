/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  experimental: {
    optimizePackageImports: ['framer-motion', '@react-three/drei'],
  },
};

module.exports = nextConfig;
