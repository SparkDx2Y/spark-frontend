import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  //*  Enable gzip compression
  compress: true,

  //* Remove X-Powered-By header for security
  poweredByHeader: false,

  //* Image optimization
  images: {
    formats: ['image/avif', 'image/webp'], //* image formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
        pathname: '/**',
      },
    ],
  },

  //* features for better performance
  experimental: {
    optimizePackageImports: ['@/components'], //* Tree-shaking 
  },
};

export default nextConfig;
