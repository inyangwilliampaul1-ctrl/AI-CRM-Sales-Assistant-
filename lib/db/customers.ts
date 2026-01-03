import { createClient } from "@/lib/supabase/server";
import { getOrCreateBusiness } from "@/lib/db/business";

export type Customer = {
    id: string;
    business_id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    phone: string | null;
    company_name: string | null;
    status: string;
    tags: string[];
    created_at: string;
    updated_at: string;
};

export async function getCustomers() {
    const supabase = await createClient();

    // Explicitly get current user and business context
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return [];

    const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", userData.user.id)
        .single();

    if (!business) return [];

    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("business_id", business.id)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data as Customer[];
}


export async function getCustomer(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Customer;
}

export async function createCustomer(customer: Omit<Customer, "id" | "created_at" | "updated_at" | "business_id">) {
    const supabase = await createClient();

    // Get current user to verify authentication
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("Unauthorized");

    // Get or create business for this user (auto-creates if missing)
    const business = await getOrCreateBusiness();

    const { data, error } = await supabase
        .from("customers")
        .insert({ ...customer, business_id: business.id })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Customer;
}

export async function updateCustomer(id: string, customer: Partial<Omit<Customer, "id" | "created_at" | "updated_at" | "business_id">>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("customers")
        .update(customer)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Customer;
}

export async function deleteCustomer(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("customers").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}
