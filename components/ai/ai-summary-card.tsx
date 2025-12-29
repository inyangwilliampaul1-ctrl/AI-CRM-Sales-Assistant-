"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateCustomerSummary, generateMessageDraft } from "@/components/ai/ai-actions";
import { Sparkles, Loader2, MessageCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface AiSummaryCardProps {
    customerId: string;
}

export function AiSummaryCard({ customerId }: AiSummaryCardProps) {
    const [summary, setSummary] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [draft, setDraft] = useState<string | null>(null);
    const [isDrafting, setIsDrafting] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        const result = await generateCustomerSummary(customerId);
        setSummary(result);
        setIsLoading(false);
    };

    const handleDraft = async () => {
        setIsDrafting(true);
        const result = await generateMessageDraft(customerId, "Follow up on recent interest");
        setDraft(result);
        setIsDrafting(false);
    }

    return (
        <Card className="border-indigo-100 bg-indigo-50/30">
            <CardHeader>
                <CardTitle className="flex items-center text-indigo-700">
                    <Sparkles className="mr-2 h-5 w-5" />
                    AI Sales Assistant
                </CardTitle>
                <CardDescription>Get instant insights and draft messages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {!summary ? (
                    <Button onClick={handleGenerate} disabled={isLoading} variant="outline" className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                        Generate Customer Brief
                    </Button>
                ) : (
                    <div className="rounded-md bg-white p-4 text-sm shadow-sm border border-indigo-100">
                        <p className="leading-relaxed">{summary}</p>
                    </div>
                )}

                <div className="pt-2 border-t border-indigo-100">
                    {!draft ? (
                        <Button onClick={handleDraft} disabled={isDrafting} variant="ghost" className="w-full text-indigo-600 justify-start hover:text-indigo-800 hover:bg-indigo-100/50">
                            {isDrafting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <MessageCircle className="mr-2 h-4 w-4" />}
                            Draft WhatsApp Follow-up
                        </Button>
                    ) : (
                        <div className="space-y-2 mt-2">
                            <span className="text-xs font-medium text-indigo-600">Draft Message:</span>
                            <Textarea readOnly value={draft} className="min-h-[80px] text-sm bg-white" />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
