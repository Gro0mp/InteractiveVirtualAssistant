'use client'

import {StripePaymentPage} from "../../custompages/StripePaymentPage.tsx";
import ProtectedRoute from "../../components/ProtectedRoutes.tsx";

export default function Page() {
    return (
        <ProtectedRoute>
            <StripePaymentPage/>
        </ProtectedRoute>
    )
}
