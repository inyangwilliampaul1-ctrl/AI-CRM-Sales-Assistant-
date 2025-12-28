import { CustomerForm } from "@/components/customers/customer-form";
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
            <div className="h-full flex-1 flex-col space-y-8 md:flex">
                <CustomerForm customer={customer} />
            </div>
        </div>
    );
}
