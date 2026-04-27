"use client";

import {useRouter, usePathname} from "next/navigation";
import React, {useEffect, useMemo, useState, type ReactNode} from "react";
import {useAuth} from "../context/AuthContext";

export default function ProtectedRoute({
                                           children,
                                       }: {
    children: ReactNode;
}) {
    const {user, isLoading} = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [timedOut, setTimedOut] = useState(false);
    const timeoutMs = 6000;

    useEffect(() => {
        if (!isLoading) return;
        const t = window.setTimeout(() => setTimedOut(true), timeoutMs);
        return () => window.clearTimeout(t);
    }, [isLoading]);

    useEffect(() => {
        if (isLoading) return;

        // Not logged in → go to login
        if (!user) {
            router.replace("/login");
            return;
        }

        // Logged in but setup not done → redirect to account-setup,
        // unless they're already there (avoids an infinite redirect loop)
        if (!user.setUpComplete && pathname !== "/account-setup") {
            router.replace("/account-setup");
        }
    }, [user, isLoading, router, pathname]);

    const loadingUi = useMemo(
        () => (
            <div className="min-h-[60vh] grid place-items-center">
                <div className="text-center space-y-3">
                    <div className="text-neutral-500 font-mono text-sm">Loading…</div>
                    {timedOut && (
                        <div className="text-xs text-neutral-400 font-mono max-w-md">
                            This is taking longer than expected. If you just returned from
                            Stripe, make sure cookies are allowed for{" "}
                            <span className="font-semibold">
                {process.env.NEXT_PUBLIC_BACKEND_URL ?? "your backend"}
              </span>
                            .
                        </div>
                    )}
                    {timedOut && (
                        <button
                            type="button"
                            onClick={() => router.replace("/login")}
                            className="mx-auto inline-flex items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/60 backdrop-blur px-4 py-2 text-xs font-semibold font-mono"
                        >
                            Go to login
                        </button>
                    )}
                </div>
            </div>
        ),
        [router, timedOut],
    );

    if (isLoading) return loadingUi;
    if (!user) return null;

    // Block rendering protected content until setup is done
    // (the useEffect above will have already fired the redirect)
    if (!user.setUpComplete && pathname !== "/account-setup") return null;

    return <>{children}</>;
}