'use client'

import { InterviewSessionPage } from '../../../custompages/InterviewSessionPage'
import ProtectedRoute from "../../../components/ProtectedRoutes.tsx";
import React from "react";
import {InterviewPage} from "../../../custompages/InterviewPage.tsx";
import {useParams} from "next/navigation";

export default function Page() {
    const params = useParams<{ sessionId: string }>()

    return (
        <ProtectedRoute>
            {params.sessionId === 'new' ? (
                // If the URL is /interview/new, route to the Setup panel
                <InterviewPage />
            ) : (
                // If the URL is /interview/123, route to the active Chat session
                <InterviewSessionPage />
            )}
        </ProtectedRoute>
    )
}