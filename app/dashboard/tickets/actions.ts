"use server";

import { createTicket, updateTicket, deleteTicket } from "@/lib/db/tickets";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = {
    error?: string;
    success?: boolean;
};

export async function createTicketAction(prevState: ActionState, formData: FormData) {
    try {
        const rawData = {
            title: formData.get("title") as string,
            description: (formData.get("description") as string) || null,
            status: (formData.get("status") as "open" | "pending" | "resolved" | "closed") || "open",
            priority: (formData.get("priority") as "low" | "medium" | "high" | "urgent") || "medium",
            customer_id: (formData.get("customer_id") as string) || null,
        };

        if (!rawData.title) {
            return { error: "Ticket title is required." };
        }

        await createTicket(rawData);
    } catch (error: any) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/tickets");
    redirect("/dashboard/tickets");
}

export async function updateTicketAction(id: string, prevState: ActionState, formData: FormData) {
    try {
        const rawData = {
            title: formData.get("title") as string,
            description: (formData.get("description") as string) || null,
            status: (formData.get("status") as "open" | "pending" | "resolved" | "closed") || "open",
            priority: (formData.get("priority") as "low" | "medium" | "high" | "urgent") || "medium",
            customer_id: (formData.get("customer_id") as string) || null,
        };

        if (!rawData.title) {
            return { error: "Ticket title is required." };
        }

        await updateTicket(id, rawData);
    } catch (error: any) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/tickets");
    redirect("/dashboard/tickets");
}

export async function deleteTicketAction(id: string) {
    try {
        await deleteTicket(id);
        revalidatePath("/dashboard/tickets");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
