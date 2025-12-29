import { createClient } from "@/lib/supabase/server";

export type Deal = {
    id: string;
    business_id: string;
    customer_id: string | null;
    title: string;
    value: number;
    currency: string;
    stage: 'lead' | 'qualified' | 'won' | 'lost';
    expected_close_date: string | null;
    created_at: string;
    updated_at: string;
    customers?: {
        first_name: string;
        last_name: string;
    } | null;
};

export async function getDeals() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("deals")
        .select(`
      *,
      customers (
        first_name,
        last_name
      )
    `)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data as Deal[];
}

export async function getDeal(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("deals")
        .select(`
      *,
      customers (
        first_name,
        last_name
      )
    `)
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Deal;
}

export async function createDeal(deal: Omit<Deal, "id" | "created_at" | "updated_at" | "business_id" | "customers">) {
    const supabase = await createClient();

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) throw new Error("Unauthorized");

    const { data: business, error: businessError } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", userData.user.id)
        .single();

    if (businessError || !business) throw new Error("Business not found");

    const { data, error } = await supabase
        .from("deals")
        .insert({ ...deal, business_id: business.id })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Deal;
}

export async function updateDeal(id: string, deal: Partial<Omit<Deal, "id" | "created_at" | "updated_at" | "business_id" | "customers">>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("deals")
        .update(deal)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Deal;
}

export async function deleteDeal(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("deals").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}

export async function getDealsByCustomer(customerId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("deals")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data as Deal[];
}

