/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir: './dist', // Changes the build output directory to `./dist/`.
    images: {
        unoptimized: true,
    },
    experimental: {
        optimizePackageImports: ['lucide-react', 'recharts'],
    },
    serverExternalPackages: [
        'three',
        '@react-three/fiber',
        '@react-three/drei',
        'pdfjs-dist',
        'mammoth',
        'pdf-lib',
    ],
}
