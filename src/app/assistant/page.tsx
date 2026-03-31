'use client'

import { AssistantPage } from '../../custompages/AssistantPage'
import ProtectedRoute from "../../components/ProtectedRoutes.tsx";

export default function Page() {
    return (
        <ProtectedRoute>
            <AssistantPage />
        </ProtectedRoute>
    )
}
