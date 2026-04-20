'use client'

import { AccountSetupPage } from '../../custompages/AccountSetupPage'
import ProtectedRoute from "../../components/ProtectedRoutes.tsx";

export default function Page() {
    return (
        <ProtectedRoute>
            <AccountSetupPage />
        </ProtectedRoute>
    )
}
