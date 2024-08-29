/** @type {import('next').NextConfig} */

const API_URL = process.env.NEXT_PUBLIC_NODE_ENV

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
		]
	},
};

module.exports = nextConfig;
