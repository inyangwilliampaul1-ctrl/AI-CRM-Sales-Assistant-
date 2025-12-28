import { createClient } from "@/lib/supabase/server";

export type DashboardMetrics = {
    totalCustomers: number;
    totalDeals: number;
    totalRevenue: number;
    activeTickets: number;
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
    const supabase = await createClient();

    // 1. Get current user & business
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return { totalCustomers: 0, totalDeals: 0, totalRevenue: 0, activeTickets: 0 };

    const { data: business } = await supabase
        .from("businesses")
        .select("id")
        .eq("user_id", userData.user.id)
        .single();

    if (!business) return { totalCustomers: 0, totalDeals: 0, totalRevenue: 0, activeTickets: 0 };

    // 2. Fetch counts in parallel
    const [customers, deals, tickets] = await Promise.all([
        supabase.from("customers").select("*", { count: "exact", head: true }).eq("business_id", business.id),
        supabase.from("deals").select("value, stage").eq("business_id", business.id),
        supabase.from("tickets").select("*", { count: "exact", head: true }).eq("business_id", business.id).neq("status", "closed"),
    ]);

    // 3. Calculate metrics
    // Total Revenue = Sum of value of all 'won' deals
    const wonDeals = deals.data?.filter(d => d.stage === 'won') || [];
    const totalRevenue = wonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);

    return {
        totalCustomers: customers.count || 0,
        totalDeals: deals.data?.length || 0,
        totalRevenue: totalRevenue,
        activeTickets: tickets.count || 0,
    };
}
