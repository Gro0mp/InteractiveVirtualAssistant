import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { StripePaymentPage } from "./pages/StripePaymentPage.tsx";

import { DashboardPage } from "./pages/DashboardPage.tsx";
import { DocumentManagementPage } from "./pages/DocumentManagementPage.tsx";
import { SettingsPage } from "./pages/SettingsPage.tsx";
import { AssistantPage } from "./pages/AssistantPage.tsx";
import { TranslateDocumentPage } from "./pages/TranslateDocumentPage.tsx";
import { InterviewPage } from "./pages/InterviewPage.tsx";

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoutes } from "./components/ProtectedRoutes.tsx";
import { OAuthCallback } from "./services/OAuthCallback.tsx";

{/* Component Testing */}

/**
 * Wrapper for LandingPage that handles OAuth callback
 */
function LandingPageWithOAuth() {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const oauthSuccess = params.get('oauth');

    if (oauthSuccess === 'success') {
        return <OAuthCallback />;
    }

    return <LandingPage />;
}

export function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPageWithOAuth />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/payment" element={<StripePaymentPage />} />
                    <Route path="/assistant" element={<AssistantPage />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoutes/>}>
                        {/*<Route path="/assistant" element={<AssistantPage />} />*/}
                        <Route path="/dashboard" element={<DashboardPage/>} />
                        <Route path="/documents" element={<DocumentManagementPage/>} />
                        <Route path="/translate" element={<TranslateDocumentPage/>} />
                        <Route path="settings" element={<SettingsPage/>}/>

                        {/* Interview */}
                        <Route path="/interview" element={<InterviewPage />} />
                        <Route path="/interview/:sessionId" element={<InterviewPage />} />
                    </Route>

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}