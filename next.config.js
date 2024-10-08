/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URI
const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URI

const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
		return [
			{
				source: '/api/:path*',
				destination: `${API_URL}/:path*`,
			},
			{
				source: '/socket.io/:path*',
				destination: `${WEBSOCKET_URL}/socket.io/:path*`,
			},
		]
	},
};

module.exports = nextConfig;
