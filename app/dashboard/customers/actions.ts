"use server";

import { createCustomer, updateCustomer, deleteCustomer } from "@/lib/db/customers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ActionState = {
    error?: string;
    success?: boolean;
};

export async function createCustomerAction(prevState: ActionState, formData: FormData) {
    try {
        const rawData = {
            first_name: formData.get("first_name") as string,
            last_name: formData.get("last_name") as string,
            email: (formData.get("email") as string) || null,
            phone: (formData.get("phone") as string) || null,
            company_name: (formData.get("company_name") as string) || null,
            status: (formData.get("status") as string) || "active",
            tags: [], // Tags handling can be added later if needed via JSON parsing or multi-select
        };

        if (!rawData.first_name || !rawData.last_name) {
            return { error: "First name and last name are required." };
        }

        await createCustomer(rawData);
    } catch (error: any) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/customers");
    redirect("/dashboard/customers");
}

export async function updateCustomerAction(id: string, prevState: ActionState, formData: FormData) {
    try {
        const rawData = {
            first_name: formData.get("first_name") as string,
            last_name: formData.get("last_name") as string,
            email: (formData.get("email") as string) || null,
            phone: (formData.get("phone") as string) || null,
            company_name: (formData.get("company_name") as string) || null,
            status: (formData.get("status") as string) || "active",
        };

        if (!rawData.first_name || !rawData.last_name) {
            return { error: "First name and last name are required." };
        }

        await updateCustomer(id, rawData);
    } catch (error: any) {
        return { error: error.message };
    }

    revalidatePath("/dashboard/customers");
    redirect("/dashboard/customers");
}

export async function deleteCustomerAction(id: string) {
    try {
        await deleteCustomer(id);
        revalidatePath("/dashboard/customers");
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}
