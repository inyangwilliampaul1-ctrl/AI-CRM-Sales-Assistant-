import { createClient } from "@/lib/supabase/server";

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
    const { data, error } = await supabase
        .from("customers")
        .select("*")
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

    // Get current user to verify business ownership or simpler: relying on RLS + trigger if we had one for auto-business-id, 
    // but usually we need to fetch business_id or let RLS handle it if we set it.
    // Wait, our RLS checks for business_id. We need to insert with the correct business_id.
    // For the MVP, we assume the user has one business.

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("Unauthorized");

    // Fetch the business ID for this user
    const { data: business, error: businessError } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", userData.user.id)
        .single();

    if (businessError || !business) throw new Error("Business not found");

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
