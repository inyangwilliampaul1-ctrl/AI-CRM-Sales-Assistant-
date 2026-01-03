/**
 * Supabase Browser Client
 * 
 * This client is used in Client Components to interact with Supabase.
 * 
 * CRITICAL SETTINGS FOR MOBILE COMPATIBILITY:
 * - persistSession: true - Store session in localStorage
 * - autoRefreshToken: true - Automatically refresh expired tokens
 * - detectSessionInUrl: true - Process auth tokens from URL hash
 * 
 * These settings ensure the client works correctly on:
 * - iOS Safari (which has strict cookie policies)
 * - Mobile email apps (which open links in embedded browsers)
 * - Cross-tab authentication scenarios
 */
import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
    if (client) return client;

    client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            auth: {
                // CRITICAL: These settings ensure mobile compatibility
                persistSession: true,        // Store session in localStorage
                autoRefreshToken: true,      // Auto-refresh expired tokens
                detectSessionInUrl: true,    // Process tokens from URL hash/params
                flowType: "pkce",            // Use PKCE flow for security
            },
        }
    );

    return client;
};

// For backwards compatibility
export const getSupabaseBrowserClient = createClient;
