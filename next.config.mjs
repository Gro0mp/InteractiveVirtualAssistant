/** @type {import('next').NextConfig} */

const nextConfig = {
    async rewrites() {
        return [
            { source: '/api/:path*',    destination: `https://virtual-assistant-backend-402008052255.us-east1.run.app/api/:path*` },
            { source: '/oauth2/:path*', destination: `https://virtual-assistant-backend-402008052255.us-east1.run.app/oauth2/:path*` },
            { source: '/login/:path*',  destination: `https://virtual-assistant-backend-402008052255.us-east1.run.app/login/:path*` },
            { source: '/logout',        destination: `https://virtual-assistant-backend-402008052255.us-east1.run.app/logout` },
        ]
    },
}

export default nextConfig