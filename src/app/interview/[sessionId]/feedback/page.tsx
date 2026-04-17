'use client'

import { InterviewFeedbackPage } from '../../../../custompages/InterviewFeedbackPage'
import ProtectedRoute from "../../../../components/ProtectedRoutes.tsx";

export default function Page() {
    return (
        <ProtectedRoute>
            <InterviewFeedbackPage />
        </ProtectedRoute>
    )
}
