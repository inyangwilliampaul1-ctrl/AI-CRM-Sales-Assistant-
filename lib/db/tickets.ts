import { createClient } from "@/lib/supabase/server";

export type Ticket = {
    id: string;
    business_id: string;
    customer_id: string | null;
    title: string;
    description: string | null;
    status: 'open' | 'pending' | 'resolved' | 'closed'; // Adjusted to match user's custom enum
    priority: 'low' | 'medium' | 'high' | 'urgent'; // Adjusted to match potential superset
    created_at: string;
    updated_at: string;
    customers?: {
        first_name: string;
        last_name: string;
    } | null;
};

export async function getTickets() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tickets")
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

    return data as Ticket[];
}

export async function getTicket(id: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tickets")
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

    return data as Ticket;
}

export async function createTicket(ticket: Omit<Ticket, "id" | "created_at" | "updated_at" | "business_id" | "customers">) {
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
        .from("tickets")
        .insert({ ...ticket, business_id: business.id })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Ticket;
}

export async function updateTicket(id: string, ticket: Partial<Omit<Ticket, "id" | "created_at" | "updated_at" | "business_id" | "customers">>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tickets")
        .update(ticket)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Ticket;
}

export async function deleteTicket(id: string) {
    const supabase = await createClient();
    const { error } = await supabase.from("tickets").delete().eq("id", id);

    if (error) {
        throw new Error(error.message);
    }
}
