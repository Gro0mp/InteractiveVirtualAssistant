/** @type {import('next').NextConfig} */
const BACKEND = process.env.BACKEND_URL

const nextConfig = {
    async rewrites() {
        return [
            { source: '/api/:path*',    destination: `${BACKEND}/api/:path*` },
            { source: '/oauth2/:path*', destination: `${BACKEND}/oauth2/:path*` },
            { source: '/login/:path*',  destination: `${BACKEND}/login/:path*` },
            { source: '/logout',        destination: `${BACKEND}/logout` },
        ]
    },
}

export default nextConfig