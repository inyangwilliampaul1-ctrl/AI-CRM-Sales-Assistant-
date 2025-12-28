"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDealAction, updateDealAction } from "@/app/dashboard/deals/actions";
import { Deal } from "@/lib/db/deals";
import { Customer } from "@/lib/db/customers";
import { Loader2 } from "lucide-react";

interface DealFormProps {
    deal?: Deal;
    customers: Customer[];
}

export function DealForm({ deal, customers }: DealFormProps) {
    const action = deal
        ? updateDealAction.bind(null, deal.id)
        : createDealAction;

    const [state, formAction, isPending] = useActionState(action, {});

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{deal ? "Edit Deal" : "New Deal"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Deal Title</Label>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={deal?.title}
                            required
                            placeholder="Big Contract with Acme"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="value">Value</Label>
                            <Input
                                id="value"
                                name="value"
                                type="number"
                                step="0.01"
                                defaultValue={deal?.value}
                                required
                                placeholder="10000.00"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="currency">Currency</Label>
                            <select
                                id="currency"
                                name="currency"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                                defaultValue={deal?.currency || "USD"}
                            >
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="GBP">GBP</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="customer_id">Customer</Label>
                        <select
                            id="customer_id"
                            name="customer_id"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue={deal?.customer_id || ""}
                            required
                        >
                            <option value="" disabled>Select a customer...</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.first_name} {c.last_name} ({c.company_name || 'No Company'})</option>
                            ))}
                        </select>
                        <p className="text-[0.8rem] text-muted-foreground">Don't see the customer? <a href="/dashboard/customers/new" className="underline">Create one first.</a></p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="stage">Stage</Label>
                        <select
                            id="stage"
                            name="stage"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue={deal?.stage || "lead"}
                        >
                            <option value="lead">Lead</option>
                            <option value="qualified">Qualified</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="expected_close_date">Expected Close Date</Label>
                        <Input
                            id="expected_close_date"
                            name="expected_close_date"
                            type="date"
                            defaultValue={deal?.expected_close_date ? new Date(deal.expected_close_date).toISOString().split('T')[0] : ""}
                        />
                    </div>

                    {state.error && (
                        <div className="text-sm text-red-500 font-medium">{state.error}</div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {deal ? "Update Deal" : "Create Deal"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
