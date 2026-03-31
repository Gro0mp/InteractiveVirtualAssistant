'use client'

import {DocumentManagementPage} from '../../custompages/DocumentManagementPage'
import ProtectedRoute from "../../components/ProtectedRoutes.tsx";
import {AssistantPage} from "../../custompages/AssistantPage.tsx";

export default function Page() {
    return (
        <ProtectedRoute>
            <DocumentManagementPage/>
        </ProtectedRoute>
    )
}
