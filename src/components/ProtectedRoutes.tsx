"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
                                           children,
                                       }: {
    children: ReactNode;
}) {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace("/login");
        }
    }, [user, isLoading, router]);

    if (isLoading) return <p>Loading...</p>;

    if (!user) return null;

    return <>{children}</>;
}