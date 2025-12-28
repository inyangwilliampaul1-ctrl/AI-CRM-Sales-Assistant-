import { DealForm } from "@/components/deals/deal-form";
import { getCustomers } from "@/lib/db/customers";

export default async function NewDealPage() {
    const customers = await getCustomers();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">New Deal</h2>
            </div>
            <div className="h-full flex-1 flex-col space-y-8 md:flex">
                <DealForm customers={customers} />
            </div>
        </div>
    );
}
