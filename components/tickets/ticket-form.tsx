"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Need to ensure Textarea exists or use Input for simple description
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTicketAction, updateTicketAction, ActionState } from "@/app/dashboard/tickets/actions";
import { Ticket } from "@/lib/db/tickets";
import { Customer } from "@/lib/db/customers";
import { Loader2 } from "lucide-react";

interface TicketFormProps {
    ticket?: Ticket;
    customers: Customer[];
}

export function TicketForm({ ticket, customers }: TicketFormProps) {
    const action = ticket
        ? updateTicketAction.bind(null, ticket.id)
        : createTicketAction;

    const initialState: ActionState = {};
    const [state, formAction, isPending] = useActionState(action, initialState);

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{ticket ? "Edit Ticket" : "New Ticket"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Subject</Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={ticket?.title}
                            required
                            placeholder="Issue with login..."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            name="description"
                            defaultValue={ticket?.description || ""}
                            placeholder="Detailed explanation..."
                        />
                        {/* Note: Ideally use Textarea component here if available, falling back to Input for now */}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                name="status"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                defaultValue={ticket?.status || "open"}
                            >
                                <option value="open">Open</option>
                                <option value="pending">Pending</option>
                                <option value="resolved">Resolved</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <select
                                id="priority"
                                name="priority"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                defaultValue={ticket?.priority || "medium"}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                                <option value="urgent">Urgent</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="customer_id">Customer</Label>
                        <select
                            id="customer_id"
                            name="customer_id"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue={ticket?.customer_id || ""}
                            required
                        >
                            <option value="" disabled>Select a customer...</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.first_name} {c.last_name} ({c.company_name || 'No Company'})</option>
                            ))}
                        </select>
                    </div>

                    {state.error && (
                        <div className="text-sm text-red-500 font-medium">{state.error}</div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {ticket ? "Update Ticket" : "Create Ticket"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
