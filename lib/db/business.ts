/**
 * Business Database Functions
 * 
 * Handles business record creation and lookup.
 * Includes auto-creation logic for users without a business.
 */
import { createClient } from "@/lib/supabase/server";

export type Business = {
    id: string;
    user_id: string;
    name: string;
    industry: string | null;
    team_size: string | null;
    country: string | null;
    created_at: string;
    updated_at: string;
};

/**
 * Get the business for the current user.
 * If no business exists, auto-creates one with default values.
 * This ensures users can always access the app even if signup had issues.
 */
export async function getOrCreateBusiness(): Promise<Business> {
    const supabase = await createClient();

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
        throw new Error("Unauthorized - please log in");
    }

    // Try to find existing business
    const { data: existingBusiness, error: fetchError } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", userData.user.id)
        .single();

    // If business exists, return it
    if (existingBusiness) {
        return existingBusiness as Business;
    }

    // No business found - create one automatically
    console.log("No business found for user, creating default business...");

    // Get user's name from metadata if available
    const fullName = userData.user.user_metadata?.full_name ||
        userData.user.email?.split("@")[0] ||
        "My Business";

    const { data: newBusiness, error: createError } = await supabase
        .from("businesses")
        .insert({
            user_id: userData.user.id,
            name: `${fullName}'s Business`,
            industry: "other",
            team_size: "1-5",
            country: "Nigeria",
        })
        .select()
        .single();

    if (createError) {
        console.error("Failed to create business:", createError.message);
        throw new Error("Unable to set up your business. Please contact support.");
    }

    console.log("Business created successfully:", newBusiness.id);
    return newBusiness as Business;
}

/**
 * Get business by user ID (read-only, for queries)
 */
export async function getBusinessByUserId(userId: string): Promise<Business | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", userId)
        .single();

    if (error) {
        return null;
    }

    return data as Business;
}
