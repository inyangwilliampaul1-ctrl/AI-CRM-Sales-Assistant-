/**
 * Authentication Server Actions
 * 
 * These actions handle signup, login, and signout.
 * They use the Supabase SSR client to properly set cookies.
 */
"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Get the site URL for redirects.
 * Priority: NEXT_PUBLIC_SITE_URL > VERCEL_URL > localhost
 */
function getSiteUrl(): string {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
    }
    return "http://localhost:3000";
}

/**
 * Create a Supabase client for server actions.
 * This client can set cookies.
 */
async function createActionClient() {
    const cookieStore = await cookies();

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // Ignore errors in Server Components
                    }
                },
            },
        }
    );
}

export async function login(prevState: any, formData: FormData) {
    console.log("Login action started");
    const supabase = await createActionClient();

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "Email and password are required" };
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        console.error("Login error:", error.message);
        return { error: error.message };
    }

    console.log("Login successful, redirecting to dashboard...");
    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signup(prevState: any, formData: FormData) {
    console.log("Signup action started");
    const supabase = await createActionClient();

    const fullName = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const businessName = formData.get("business_name") as string;
    const industry = formData.get("industry") as string;
    const teamSize = formData.get("team_size") as string;
    const country = (formData.get("country") as string) || "Nigeria";

    // Validate required fields
    if (!email || !password || !fullName || !businessName || !industry || !teamSize) {
        return { error: "All fields are required" };
    }

    // Build the email redirect URL
    // CRITICAL: This must point to your production URL, not localhost
    const siteUrl = getSiteUrl();
    const emailRedirectTo = `${siteUrl}/auth/callback`;

    console.log("Signup: Using emailRedirectTo:", emailRedirectTo);

    // Step 1: Create auth user
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo,
            data: {
                full_name: fullName,
            },
        },
    });

    if (error) {
        console.error("Signup error:", error.message);
        return { error: error.message };
    }

    if (!data.user) {
        return { error: "Signup failed. Please try again." };
    }

    // Step 2: Create business record
    const { error: businessError } = await supabase
        .from("businesses")
        .insert({
            user_id: data.user.id,
            name: businessName,
            industry,
            team_size: teamSize,
            country,
        });

    if (businessError) {
        console.error("Business creation error:", businessError.message);
        // Don't fail signup if business creation fails
    }

    // Check if email confirmation is required
    // If session exists, user was auto-confirmed (email confirmations disabled)
    if (data.session) {
        console.log("Signup: User auto-confirmed, redirecting to dashboard");
        revalidatePath("/", "layout");
        redirect("/dashboard");
    }

    // Email confirmation required
    console.log("Signup: Email confirmation required");
    return {
        success: true,
        message: "Please check your email to verify your account.",
    };
}

export async function signout() {
    const supabase = await createActionClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}
