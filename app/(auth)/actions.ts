"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(prevState: any, formData: FormData) {
    console.log("Login action started");
    const supabase = await createServerSupabaseClient();

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
    const supabase = await createServerSupabaseClient();

    const fullName = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const businessName = formData.get("business_name") as string;
    const industry = formData.get("industry") as string;
    const teamSize = formData.get("team_size") as string;
    const country = formData.get("country") as string || "Nigeria";

    // Validate required fields
    if (!email || !password || !fullName || !businessName || !industry || !teamSize) {
        return { error: "All fields are required" };
    }

    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("your-project")) {
        console.error("CRITICAL: Supabase URL is still set to placeholder.");
        return { error: "Supabase not configured. Check .env.local" };
    }

    // Step 1: Create auth user with full_name in metadata
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            },
        },
    });

    if (error || !data.user) {
        console.error("Signup error:", error?.message);
        return { error: error?.message ?? "Signup failed" };
    }

    // Step 2: Create business record for the new user
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
        return { error: "Business setup failed. Please try again." };
    }

    console.log("Signup successful, redirecting to dashboard...");
    revalidatePath("/", "layout");
    redirect("/dashboard");
}

export async function signout() {
    const supabase = await createServerSupabaseClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/login");
}
