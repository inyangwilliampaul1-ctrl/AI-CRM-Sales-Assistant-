"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateNextAction } from "@/components/ai/ai-actions";
import { Lightbulb, Loader2 } from "lucide-react";

interface AiDealInsightProps {
    dealId: string;
}

export function AiDealInsight({ dealId }: AiDealInsightProps) {
    const [insight, setInsight] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        const result = await generateNextAction(dealId);
        setInsight(result);
        setIsLoading(false);
    };

    return (
        <Card className="border-amber-100 bg-amber-50/30">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center text-amber-700 text-lg">
                    <Lightbulb className="mr-2 h-5 w-5" />
                    Smart Recommendation
                </CardTitle>
            </CardHeader>
            <CardContent>
                {!insight ? (
                    <Button onClick={handleGenerate} disabled={isLoading} variant="ghost" className="w-full text-amber-700 hover:bg-amber-100 hover:text-amber-800">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                            </>
                        ) : (
                            "Suggest Next Best Action"
                        )}
                    </Button>
                ) : (
                    <div className="text-sm font-medium text-amber-900 bg-white p-3 rounded border border-amber-200 shadow-sm">
                        {insight}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
