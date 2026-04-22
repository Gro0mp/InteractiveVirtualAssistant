/** @type {import('next').NextConfig} */

const nextConfig = {
    distDir: './dist',
    async rewrites() {
        return [
            { source: '/api/:path*',    destination: `${BACKEND}/api/:path*` },
            { source: '/oauth2/:path*', destination: `${BACKEND}/oauth2/:path*` },
            { source: '/login/:path*',  destination: `${BACKEND}/login/:path*` },
            { source: '/logout',        destination: `${BACKEND}/logout` },
        ]
    },
}

const BACKEND = process.env.BACKEND_URL
export default nextConfig