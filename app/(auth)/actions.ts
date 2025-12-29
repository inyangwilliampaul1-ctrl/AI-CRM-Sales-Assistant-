"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
    console.log("Login action started");
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("your-project")) {
        console.error("CRITICAL: Supabase URL is still set to placeholder.");
        return { error: "Supabase not configured. Check .env.local" };
    }

    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        console.error("Login error:", error.message);
        return { error: error.message };
    }

    console.log("Login successful, redirecting...");
    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signup(prevState: any, formData: FormData) {
    console.log("Signup action started");
    const supabase = await createClient();

    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("your-project")) {
        console.error("CRITICAL: Supabase URL is still set to placeholder.");
        return { error: "Supabase not configured. Check .env.local" };
    }

    // Determine the site URL for redirection
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const { error } = await supabase.auth.signUp({
        ...data,
        options: {
            emailRedirectTo: `${siteUrl}/auth/callback`,
        },
    });

    if (error) {
        console.error("Signup error:", error.message);
        return { error: error.message };
    }

    console.log("Signup successful, waiting for confirmation...");
    return { success: true };
}

export async function signout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}
