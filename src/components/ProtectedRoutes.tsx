"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // If auth hydration gets stuck (e.g., cross-site cookie blocked / backend down),
  // avoid trapping the user on an infinite loading screen.
  const [timedOut, setTimedOut] = useState(false);
  const timeoutMs = 6000;

  useEffect(() => {
    if (!isLoading) return;
    const t = window.setTimeout(() => setTimedOut(true), timeoutMs);
    return () => window.clearTimeout(t);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [user, isLoading, router]);

  const loadingUi = useMemo(
    () => (
      <div className="min-h-[60vh] grid place-items-center">
        <div className="text-center space-y-3">
          <div className="text-neutral-500 font-mono text-sm">Loading…</div>
          {timedOut ? (
            <div className="text-xs text-neutral-400 font-mono max-w-md">
              This is taking longer than expected. If you just returned from Stripe,
              make sure cookies are allowed for <span className="font-semibold">{process.env.NEXT_PUBLIC_BACKEND_URL ?? 'your backend'}</span>.
            </div>
          ) : null}
          {timedOut ? (
            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="mx-auto inline-flex items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-950/60 backdrop-blur px-4 py-2 text-xs font-semibold font-mono"
            >
              Go to login
            </button>
          ) : null}
        </div>
      </div>
    ),
    [router, timedOut],
  );

  if (isLoading) return loadingUi;

  if (!user) return null;

  return <>{children}</>;
}