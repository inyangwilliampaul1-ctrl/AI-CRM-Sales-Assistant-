"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { getCustomer } from "@/lib/db/customers";
import { getDealsByCustomer, getDeal } from "@/lib/db/deals";
import { getTicketsByCustomer } from "@/lib/db/tickets";

export async function generateCustomerSummary(customerId: string) {
    try {
        const customer = await getCustomer(customerId);
        if (!customer) return "Customer not found.";

        const deals = await getDealsByCustomer(customerId);
        const tickets = await getTicketsByCustomer(customerId);

        const prompt = `
        You are an expert sales assistant. Analyze this customer and provide a concise summary (max 3-4 sentences).
        Highlight key opportunities, risks (open tickets), and total value.
        
        Customer: ${customer.first_name} ${customer.last_name}
        Company: ${customer.company_name}
        Status: ${customer.status}
        
        Deals History:
        - Total Deals: ${deals.length}
        - Total Value: $${deals.reduce((sum, d) => sum + d.value, 0).toFixed(2)}
        - Latest Deal: ${deals[0]?.title || 'None'} (Stage: ${deals[0]?.stage || 'N/A'})
        
        Support History:
        - Total Tickets: ${tickets.length}
        - Open Tickets: ${tickets.filter(t => t.status === 'open' || t.status === 'pending').length}
        - Latest Ticket: ${tickets[0]?.title || 'None'}
        `;

        const { text } = await generateText({
            model: openai("gpt-4o"),
            prompt: prompt,
        });

        return text;
    } catch (error: any) {
        console.error("AI Error:", error);
        return "Unable to generate summary. Please check your API key.";
    }
}

export async function generateNextAction(dealId: string) {
    try {
        const deal = await getDeal(dealId);
        if (!deal) return "Deal not found.";

        // We could fetch customer info too for context
        const customerString = deal.customer_id ? `linked to customer ID ${deal.customer_id}` : "no customer linked";

        const prompt = `
        Suggest the single most important next action to move this deal forward. Be specific and actionable (Start with a verb like "Call", "Email", "Schedule").
        
        Deal: ${deal.title}
        Value: ${deal.value} ${deal.currency}
        Stage: ${deal.stage}
        Expected Close: ${deal.expected_close_date || 'Unknown'}
        Context: ${customerString}
        `;

        const { text } = await generateText({
            model: openai("gpt-4o"),
            prompt: prompt,
        });

        return text;
    } catch (error: any) {
        console.error("AI Error:", error);
        return "Unable to generate recommendation.";
    }
}

export async function generateMessageDraft(customerId: string, intent: string) {
    try {
        const customer = await getCustomer(customerId);
        if (!customer) return "Customer not found.";

        const prompt = `
        Draft a short, professional WhatsApp message to this customer.
        Intent: ${intent}
        
        Customer: ${customer.first_name} ${customer.last_name}
        Company: ${customer.company_name}
        `;

        const { text } = await generateText({
            model: openai("gpt-4o"),
            prompt: prompt,
        });

        return text;
    } catch (error: any) {
        console.error("AI Error:", error);
        return "Unable to generate draft.";
    }
}
