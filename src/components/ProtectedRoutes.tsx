import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../context/AuthContext.tsx";

export function ProtectedRoutes() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; // Redirect to login if not authenticated
    }

    return <Outlet />; // Render child routes if authenticated
}