'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProtectedRoute from "../../components/ProtectedRoutes.tsx";

export default function Page() {
    const router = useRouter()

    useEffect(() => {
        router.replace('/settings?tab=billing')
    }, [router])

    return (
        <ProtectedRoute>
            <div className="p-4 text-sm text-neutral-500">Redirecting to billing settings...</div>
        </ProtectedRoute>
    )
}
