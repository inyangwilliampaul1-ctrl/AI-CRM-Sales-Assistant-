import { CustomerForm } from "@/components/customers/customer-form";
import { AiSummaryCard } from "@/components/ai/ai-summary-card";
import { getCustomer } from "@/lib/db/customers";
import { notFound } from "next/navigation";

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const customer = await getCustomer(id);

    if (!customer) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Edit Customer</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_300px] lg:grid-cols-3 lg:gap-8">
                <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <CustomerForm customer={customer} />
                </div>
                <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <AiSummaryCard customerId={customer.id} />
                </div>
            </div>
        </div>
    );
}

