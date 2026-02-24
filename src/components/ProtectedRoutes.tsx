import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import {useAuth} from "../context/AuthContext.tsx";

export function ProtectedRoutes() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-[50vh] w-full grid place-items-center text-slate-500">
                Loading...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; // Redirect to login if not authenticated
    }

    return <Outlet />; // Render child routes if authenticated
 }
