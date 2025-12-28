import { TicketForm } from "@/components/tickets/ticket-form";
import { getCustomers } from "@/lib/db/customers";

export default async function NewTicketPage() {
    const customers = await getCustomers();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">New Ticket</h2>
            </div>
            <div className="h-full flex-1 flex-col space-y-8 md:flex">
                <TicketForm customers={customers} />
            </div>
        </div>
    );
}
