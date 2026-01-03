/**
 * Supabase Browser Client
 * 
 * This client is used in Client Components (use client) to interact with Supabase.
 * It automatically handles session persistence via cookies.
 * 
 * IMPORTANT: This is a singleton pattern - only one instance is created per browser tab.
 */
import { createBrowserClient } from "@supabase/ssr";

let client: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
    if (client) return client;

    client = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    return client;
};

// For backwards compatibility
export const getSupabaseBrowserClient = createClient;
