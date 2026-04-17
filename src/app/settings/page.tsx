'use client'

import ProtectedRoute from '../../components/ProtectedRoutes'
import {SettingsPage} from "../../custompages/SettingsPage.tsx";

export default function Page() {
    return (
        <ProtectedRoute>
            <SettingsPage/>
        </ProtectedRoute>
    )
}
