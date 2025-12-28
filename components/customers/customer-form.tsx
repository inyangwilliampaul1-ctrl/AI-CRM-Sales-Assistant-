"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCustomerAction, updateCustomerAction } from "@/app/dashboard/customers/actions";
import { Customer } from "@/lib/db/customers";
import { Loader2 } from "lucide-react";

interface CustomerFormProps {
    customer?: Customer;
}

export function CustomerForm({ customer }: CustomerFormProps) {
    // If customer exists, we are editing. Otherwise creating.
    // We bind the ID if editing.
    const action = customer
        ? updateCustomerAction.bind(null, customer.id)
        : createCustomerAction;

    const [state, formAction, isPending] = useActionState(action, {});

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{customer ? "Edit Customer" : "New Customer"}</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name</Label>
                            <Input
                                id="first_name"
                                name="first_name"
                                defaultValue={customer?.first_name}
                                required
                                placeholder="John"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="last_name">Last Name</Label>
                            <Input
                                id="last_name"
                                name="last_name"
                                defaultValue={customer?.last_name}
                                required
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={customer?.email || ""}
                            placeholder="john@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            defaultValue={customer?.phone || ""}
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company_name">Company</Label>
                        <Input
                            id="company_name"
                            name="company_name"
                            defaultValue={customer?.company_name || ""}
                            placeholder="Acme Inc."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            name="status"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue={customer?.status || "active"}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="lead">Lead</option>
                        </select>
                    </div>

                    {state.error && (
                        <div className="text-sm text-red-500 font-medium">{state.error}</div>
                    )}

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {customer ? "Update Customer" : "Create Customer"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
