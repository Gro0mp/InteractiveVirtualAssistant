'use client'

import ProtectedRoute from '../../components/ProtectedRoutes'
import {InterviewPage} from "../../custompages/InterviewPage.tsx";

export default function Page() {
    return (
        <ProtectedRoute>
            <InterviewPage/>
        </ProtectedRoute>
    )
}
