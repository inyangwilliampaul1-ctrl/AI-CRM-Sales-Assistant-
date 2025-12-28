import { getDeals } from "@/lib/db/deals";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/deals/kanban-board";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function DealsPage() {
    const deals = await getDeals();

    return (
        <div className="flex-1 flex flex-col h-full space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Deals Pipeline</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/deals/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Deal
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex-1 h-full overflow-hidden">
                <KanbanBoard deals={deals} />
            </div>
        </div>
    );
}
