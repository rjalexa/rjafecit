/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/random',
        destination: `${
          process.env.NEXT_PUBLIC_BACKEND_API_BASE || 'http://localhost:8080'
        }/api/v1/random`,
      },
    ];
  },
};

export default nextConfig;
