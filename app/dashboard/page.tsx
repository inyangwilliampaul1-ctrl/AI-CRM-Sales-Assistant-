import { getDashboardMetrics } from "@/lib/db/metrics";
import { Users, Briefcase, Ticket, DollarSign } from "lucide-react";
import { Suspense } from "react";
import { MetricCard } from "@/components/dashboard/metric-card";

export default function DashboardPage() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <Suspense fallback={<DashboardSkeleton />}>
                <DashboardStats />
            </Suspense>
        </div>
    );
}

async function DashboardStats() {
    const metrics = await getDashboardMetrics();

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                title="Total Revenue"
                value={new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(metrics.totalRevenue)}
                description="+20.1% from last month"
                icon={DollarSign}
            />
            <MetricCard
                title="Customers"
                value={metrics.totalCustomers}
                description="+180.1% from last month"
                icon={Users}
            />
            <MetricCard
                title="Active Deals"
                value={metrics.totalDeals}
                description="+19% from last month"
                icon={Briefcase}
            />
            <MetricCard
                title="Open Tickets"
                value={metrics.activeTickets}
                description="+201 since last hour"
                icon={Ticket}
            />
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* We could also make a skeletal MetricCard, but this is fine for now */}
            {[...Array(4)].map((_, i) => (
                <div key={i} className="rounded-xl border bg-card text-card-foreground shadow h-[120px] animate-pulse bg-muted/50" />
            ))}
        </div>
    );
}
