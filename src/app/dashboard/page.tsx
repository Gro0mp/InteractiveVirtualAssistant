'use client'

import ProtectedRoute from '../../components/ProtectedRoutes'

export default function Page() {
    return (
        <ProtectedRoute>
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-semibold">Dashboard</h1>
                    <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                        This route is a placeholder while you migrate the rest of the app to Next.js.
                    </p>
                </div>
            </div>
        </ProtectedRoute>
    )
}
