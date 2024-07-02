/** @type {import('next').NextConfig} */

const nextConfig = {
    async rewrites() {
        return [
          {
            source: '/',
            destination: '/index',
          },
        ];
      },
};

export default nextConfig;
