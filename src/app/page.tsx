'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { LandingPage } from '../custompages/LandingPage'
import { OAuthCallback } from '../services/OAuthCallback'

function RootPageInner() {
    const searchParams = useSearchParams()
    if (searchParams.get('oauth') === 'success') return <OAuthCallback />
    return <LandingPage />
}

export default function Page() {
    return (
        <Suspense fallback={null}>
            <RootPageInner />
        </Suspense>
    )
}