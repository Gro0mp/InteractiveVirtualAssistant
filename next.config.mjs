/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: './dist', // Changes the build output directory to `./dist/`.
    images: {
        unoptimized: true,
    },
    experimental: {
        optimizePackageImports: ['lucide-react', 'recharts'],
    }
}
