import { getTickets } from "@/lib/db/tickets";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus } from "lucide-react";
import { TicketActions } from "@/components/tickets/ticket-actions";

export default async function TicketsPage() {
    const tickets = await getTickets();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Support Tickets</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/tickets/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Ticket
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No tickets found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell className="font-medium">{ticket.title}</TableCell>
                                    <TableCell>
                                        {ticket.customers ? (
                                            `${ticket.customers.first_name} ${ticket.customers.last_name}`
                                        ) : (
                                            <span className="text-muted-foreground italic">Unknown</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            ticket.status === 'open' ? 'default' :
                                                ticket.status === 'resolved' ? 'secondary' :
                                                    'outline'
                                        }>
                                            {ticket.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            ticket.priority === 'urgent' ? 'border-red-500 text-red-500' :
                                                ticket.priority === 'high' ? 'border-orange-500 text-orange-500' :
                                                    'border-gray-500'
                                        }>
                                            {ticket.priority}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <TicketActions ticketId={ticket.id} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
