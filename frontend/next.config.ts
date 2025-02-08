/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Enables React strict mode for better debugging
  swcMinify: true, // Uses SWC for faster builds
  experimental: {
    appDir: true, // Ensures usage of Next.js App Router (`src/app/`)
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint errors during production builds
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Authorization, Content-Type' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
