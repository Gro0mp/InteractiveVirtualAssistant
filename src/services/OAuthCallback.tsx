'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { api } from './api'

export function OAuthCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { login } = useAuth()

    useEffect(() => {
        if (searchParams.get('oauth') !== 'success') return

        const handleOAuth = async () => {
            try {
                const user = await api.getCurrentUser()
                login(user)
                router.replace('/assistant')
            } catch {
                router.replace('/login')
            }
        }

        void handleOAuth()
    }, [searchParams, login, router])

    return (
        <div className="min-h-screen grid place-items-center text-neutral-500 font-mono text-sm">
            <div className="flex flex-col items-center gap-3">
                <span className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                Completing sign in…
            </div>
        </div>
    )
}