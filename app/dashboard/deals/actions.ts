"use server";

import { createDeal, updateDeal, deleteDeal } from "@/lib/db/deals";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = {
    error?: string;
    success?: boolean;
};

export async function createDealAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const rawData = {
            title: formData.get("title") as string,
            value: parseFloat(formData.get("value") as string),
            currency: (formData.get("currency") as string) || "USD",
            stage: (formData.get("stage") as "lead" | "qualified" | "won" | "lost") || "lead",
            customer_id: (formData.get("customer_id") as string) || null,
            expected_close_date: (formData.get("expected_close_date") as string) || null,
        };

        if (!rawData.title) {
            return { error: "Deal title is required." };
        }
        if (isNaN(rawData.value)) {
            return { error: "Deal value must be a number." };
        }

        await createDeal(rawData);
    } catch (error: any) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/deals");
    redirect("/dashboard/deals");
}

export async function updateDealAction(id: string, prevState: ActionState, formData: FormData): Promise<ActionState> {
    try {
        const rawData = {
            title: formData.get("title") as string,
            value: parseFloat(formData.get("value") as string),
            currency: (formData.get("currency") as string) || "USD",
            stage: (formData.get("stage") as "lead" | "qualified" | "won" | "lost") || "lead",
            customer_id: (formData.get("customer_id") as string) || null,
            expected_close_date: (formData.get("expected_close_date") as string) || null,
        };

        if (!rawData.title) {
            return { error: "Deal title is required." };
        }
        if (isNaN(rawData.value)) {
            return { error: "Deal value must be a number." };
        }

        await updateDeal(id, rawData);
    } catch (error: any) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/deals");
    redirect("/dashboard/deals");
}

export async function deleteDealAction(id: string) {
    try {
        await deleteDeal(id);
        revalidatePath("/dashboard/deals");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
