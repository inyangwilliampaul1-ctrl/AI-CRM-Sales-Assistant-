import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
                <Button>Download Report</Button>
            </div>
            <div className="rounded-lg border border-dashed shadow-sm p-8 text-center">
                <p className="text-muted-foreground">No data available.</p>
            </div>
        </div>
    );
}
