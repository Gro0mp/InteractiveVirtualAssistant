    // src/app/layout.tsx
    import type { Metadata } from 'next'
    import { Providers } from './providers'
    import { type ReactNode } from 'react'
    import './index.css'

    export const metadata: Metadata = {
        title: 'IVA',
    }

    export default function RootLayout({ children }: { children: ReactNode }) {
        return (
            <html lang="en" suppressHydrationWarning>
                <body className="bg-white text-neutral-900 dark:bg-[#0A0A0A] dark:text-white">
                    <Providers>{children}</Providers>
                </body>
            </html>
        )
    }