import { DealForm } from "@/components/deals/deal-form";
import { AiDealInsight } from "@/components/ai/ai-deal-insight";
import { getDeal } from "@/lib/db/deals";
import { getCustomers } from "@/lib/db/customers";
import { notFound } from "next/navigation";

export default async function EditDealPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const deal = await getDeal(id);
    const customers = await getCustomers();

    if (!deal) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Edit Deal</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_300px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <DealForm deal={deal} customers={customers} />
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <AiDealInsight dealId={deal.id} />
                </div>
            </div>
        </div>
    );
}

