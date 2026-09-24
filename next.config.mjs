/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Only needed if you want to proxy /api/* straight to Spring Boot during dev
  // instead of calling it directly from the browser (avoids CORS setup).
  async rewrites() {
    return [
      {
        source: '/backend/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:8080'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
