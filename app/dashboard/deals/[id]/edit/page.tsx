import { DealForm } from "@/components/deals/deal-form";
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
            <div className="h-full flex-1 flex-col space-y-8 md:flex">
                <DealForm deal={deal} customers={customers} />
            </div>
        </div>
    );
}
