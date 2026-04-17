'use client'

import ProtectedRoute from '../../components/ProtectedRoutes'
import {InterviewDashboardPage} from "../../custompages/InterviewDashboardPage.tsx";

export default function Page() {
    return (
        // <ProtectedRoute>
        //     <InterviewDashboardPage/>
        // </ProtectedRoute>
        <InterviewDashboardPage/>
    )
}
