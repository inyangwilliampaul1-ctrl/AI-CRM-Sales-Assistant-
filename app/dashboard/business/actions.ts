"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createBusiness(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "User not authenticated" };
    }

    const { error } = await supabase.from("businesses").insert({
        name,
        user_id: user.id,
    });

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/business");
}

export async function updateBusiness(formData: FormData) {
    const supabase = await createClient();
    const name = formData.get("name") as string;
    const id = formData.get("id") as string;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "User not authenticated" };
    }

    // RLS policies ensure user can only update their own business, 
    // but we pass user_id explicitly for safety and clarity if needed, 
    // though fetch by ID + RLS is sufficient. 
    // Here we update based on the business ID and implicitly rely on RLS 
    // (or we could .eq('user_id', user.id) to be explicit).
    const { error } = await supabase
        .from("businesses")
        .update({ name, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("user_id", user.id);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/business");
}
