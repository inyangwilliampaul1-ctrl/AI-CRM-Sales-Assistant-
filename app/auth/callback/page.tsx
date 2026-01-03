/**
 * Auth Callback Page (Client Component)
 * 
 * This page handles the OAuth/Magic Link callback flow.
 * 
 * FLOW:
 * 1. User clicks email verification link
 * 2. Supabase redirects to /auth/callback?code=xxx (PKCE) or with hash tokens
 * 3. This page shows a loading spinner (prevents blank screen)
 * 4. We exchange the code for a session OR process hash tokens
 * 5. Session cookies are set
 * 6. User is redirected to /dashboard
 * 
 * WHY CLIENT COMPONENT?
 * - URL hash (#access_token=...) is only accessible client-side
 * - We can show loading/error states for better UX
 * - Supabase browser client handles auth state changes
 */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

type AuthStatus = "loading" | "processing" | "success" | "error";

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<AuthStatus>("loading");
    const [errorMessage, setErrorMessage] = useState<string>("");

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const supabase = createClient();

                // Check for errors in URL params
                const error = searchParams.get("error");
                const errorDescription = searchParams.get("error_description");

                if (error) {
                    console.error("Auth callback error from URL:", error, errorDescription);
                    setStatus("error");
                    setErrorMessage(errorDescription || error);
                    return;
                }

                // Get the code from URL (PKCE flow)
                const code = searchParams.get("code");

                if (code) {
                    setStatus("processing");
                    console.log("Auth callback: Processing code exchange...");

                    // Exchange the code for a session
                    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

                    if (exchangeError) {
                        console.error("Code exchange error:", exchangeError.message);
                        setStatus("error");
                        setErrorMessage(exchangeError.message);
                        return;
                    }

                    console.log("Auth callback: Code exchange successful");
                    setStatus("success");

                    // Redirect to dashboard after short delay to show success
                    setTimeout(() => {
                        router.replace("/dashboard");
                    }, 1000);
                    return;
                }

                // No code - check if there's a session from hash tokens
                // This handles the implicit flow where tokens are in the URL hash
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();

                if (sessionError) {
                    console.error("Session error:", sessionError.message);
                    setStatus("error");
                    setErrorMessage(sessionError.message);
                    return;
                }

                if (session) {
                    console.log("Auth callback: Session already exists");
                    setStatus("success");
                    setTimeout(() => {
                        router.replace("/dashboard");
                    }, 1000);
                    return;
                }

                // Listen for auth state changes (handles hash-based tokens)
                setStatus("processing");
                const { data: { subscription } } = supabase.auth.onAuthStateChange(
                    (event: AuthChangeEvent, session: Session | null) => {
                        console.log("Auth state changed:", event, !!session);

                        if (event === "SIGNED_IN" && session) {
                            setStatus("success");
                            setTimeout(() => {
                                router.replace("/dashboard");
                            }, 1000);
                        }
                    }
                );

                // Timeout after 15 seconds
                const timeout = setTimeout(() => {
                    subscription.unsubscribe();
                    if (status === "loading" || status === "processing") {
                        setStatus("error");
                        setErrorMessage("Authentication timed out. The link may have expired.");
                    }
                }, 15000);

                // Cleanup
                return () => {
                    clearTimeout(timeout);
                    subscription.unsubscribe();
                };

            } catch (err) {
                console.error("Auth callback exception:", err);
                setStatus("error");
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
        };

        handleAuthCallback();
    }, [router, searchParams]);

    // Loading State
    if (status === "loading" || status === "processing") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <h2 className="text-xl font-semibold">
                        {status === "loading" ? "Preparing..." : "Verifying your account..."}
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Please wait while we complete authentication.
                    </p>
                </div>
            </div>
        );
    }

    // Success State
    if (status === "success") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <div className="rounded-full bg-green-100 p-3">
                        <svg
                            className="h-8 w-8 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-green-600">Verified!</h2>
                    <p className="text-muted-foreground text-sm">
                        Redirecting to your dashboard...
                    </p>
                </div>
            </div>
        );
    }

    // Error State
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="flex flex-col items-center space-y-4 max-w-md text-center px-4">
                <div className="rounded-full bg-red-100 p-3">
                    <svg
                        className="h-8 w-8 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-red-600">Verification Failed</h2>
                <p className="text-muted-foreground text-sm">
                    {errorMessage || "We couldn't verify your account. The link may have expired."}
                </p>
                <div className="flex gap-4 mt-4">
                    <a
                        href="/login"
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Go to Login
                    </a>
                    <a
                        href="/register"
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
                    >
                        Sign Up Again
                    </a>
                </div>
            </div>
        </div>
    );
}

// Loading fallback for Suspense
function LoadingFallback() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <h2 className="text-xl font-semibold">Loading...</h2>
            </div>
        </div>
    );
}

// Default export wrapped in Suspense to handle useSearchParams
export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AuthCallbackContent />
        </Suspense>
    );
}
