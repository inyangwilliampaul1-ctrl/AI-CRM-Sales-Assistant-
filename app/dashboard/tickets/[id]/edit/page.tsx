import { TicketForm } from "@/components/tickets/ticket-form";
import { getTicket } from "@/lib/db/tickets";
import { getCustomers } from "@/lib/db/customers";
import { notFound } from "next/navigation";

export default async function EditTicketPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const ticket = await getTicket(id);
    const customers = await getCustomers();

    if (!ticket) {
        notFound();
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Edit Ticket</h2>
            </div>
            <div className="h-full flex-1 flex-col space-y-8 md:flex">
                <TicketForm ticket={ticket} customers={customers} />
            </div>
        </div>
    );
}
