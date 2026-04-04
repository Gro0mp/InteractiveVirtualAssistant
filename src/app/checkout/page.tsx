'use client'

import React, { Suspense } from 'react'

export default function Page() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <Suspense fallback={null}>
                Placeholder for checkout page. This page is currently being developed and will be available soon.
            </Suspense>
        </div>
    )
}
