/**
 * Auth Callback Page
 * 
 * This page handles the auth callback after email verification.
 * 
 * FLOW:
 * 1. User clicks email verification link
 * 2. Supabase redirects to /auth/callback with tokens in URL
 * 3. This page shows loading state
 * 4. Supabase client automatically detects and processes tokens
 * 5. Session is established
 * 6. User is redirected to dashboard
 * 
 * MOBILE COMPATIBILITY:
 * - Works with iOS Safari (which has strict cookie policies)
 * - Works with in-app email browsers
 * - Uses detectSessionInUrl for token processing
 */
"use client";

import { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

type AuthStatus = "initializing" | "processing" | "success" | "error";

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<AuthStatus>("initializing");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [attemptCount, setAttemptCount] = useState(0);

    const handleAuthCallback = useCallback(async () => {
        try {
            const supabase = createClient();

            // Check for explicit errors in URL
            const urlError = searchParams.get("error");
            const urlErrorDescription = searchParams.get("error_description");

            if (urlError) {
                console.error("Auth error from URL:", urlError, urlErrorDescription);
                setStatus("error");
                setErrorMessage(urlErrorDescription || urlError || "Authentication failed");
                return;
            }

            setStatus("processing");

            // Get the auth code from URL (PKCE flow)
            const code = searchParams.get("code");

            if (code) {
                console.log("Auth callback: Found code, exchanging for session...");

                // Exchange code for session
                const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

                if (exchangeError) {
                    console.error("Code exchange error:", exchangeError.message);

                    // If exchange fails, try getting existing session
                    // This handles cases where the token was already processed
                    const { data: sessionData } = await supabase.auth.getSession();

                    if (sessionData?.session) {
                        console.log("Auth callback: Found existing session after exchange error");
                        setStatus("success");
                        setTimeout(() => router.replace("/dashboard"), 1000);
                        return;
                    }

                    setStatus("error");
                    setErrorMessage(exchangeError.message);
                    return;
                }

                if (data?.session) {
                    console.log("Auth callback: Session created successfully");
                    setStatus("success");
                    setTimeout(() => router.replace("/dashboard"), 1000);
                    return;
                }
            }

            // No code in URL - check for existing session
            // This can happen if:
            // 1. Session was already established
            // 2. Tokens were in URL hash (implicit flow)
            // 3. User navigated directly to callback
            console.log("Auth callback: No code in URL, checking for session...");

            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                console.error("Session check error:", sessionError.message);
                setStatus("error");
                setErrorMessage(sessionError.message);
                return;
            }

            if (session) {
                console.log("Auth callback: Session found");
                setStatus("success");
                setTimeout(() => router.replace("/dashboard"), 1000);
                return;
            }

            // No session yet - wait for auth state change
            // This handles async token processing
            console.log("Auth callback: No session yet, waiting for auth state change...");

            const { data: { subscription } } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
                console.log("Auth state change:", event, !!session);

                if (event === "SIGNED_IN" && session) {
                    subscription.unsubscribe();
                    setStatus("success");
                    setTimeout(() => router.replace("/dashboard"), 1000);
                } else if (event === "TOKEN_REFRESHED" && session) {
                    subscription.unsubscribe();
                    setStatus("success");
                    setTimeout(() => router.replace("/dashboard"), 1000);
                }
            });

            // Retry logic - wait a bit then check again
            // This helps with slow network/processing
            if (attemptCount < 3) {
                setTimeout(() => {
                    setAttemptCount(prev => prev + 1);
                }, 2000);
            } else {
                // After 3 attempts (6 seconds), show manual retry option
                subscription.unsubscribe();
                setStatus("error");
                setErrorMessage("Session verification is taking longer than expected. Please try refreshing the page or logging in manually.");
            }

            return () => subscription.unsubscribe();

        } catch (err) {
            console.error("Auth callback exception:", err);
            setStatus("error");
            setErrorMessage("An unexpected error occurred. Please try again.");
        }
    }, [router, searchParams, attemptCount]);

    useEffect(() => {
        handleAuthCallback();
    }, [handleAuthCallback]);

    // Initializing State
    if (status === "initializing") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <h2 className="text-xl font-semibold">Preparing...</h2>
                </div>
            </div>
        );
    }

    // Processing State
    if (status === "processing") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <h2 className="text-xl font-semibold">Verifying your account...</h2>
                    <p className="text-muted-foreground text-sm">
                        This usually takes just a moment.
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
                <h2 className="text-xl font-semibold text-red-600">Verification Issue</h2>
                <p className="text-muted-foreground text-sm">
                    {errorMessage || "We couldn't verify your account. The link may have expired."}
                </p>
                <div className="flex flex-col gap-3 mt-4 w-full max-w-xs">
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        Try Again
                    </button>
                    <a
                        href="/login"
                        className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
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

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <AuthCallbackContent />
        </Suspense>
    );
}
