"use client";

import { Deal } from "@/lib/db/deals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // We might need to install badge
import Link from "next/link";
import { Edit, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface KanbanBoardProps {
    deals: Deal[];
}

const STAGES = [
    { id: 'lead', label: 'Lead', color: 'bg-blue-100 text-blue-800' },
    { id: 'qualified', label: 'Qualified', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'won', label: 'Won', color: 'bg-green-100 text-green-800' },
    { id: 'lost', label: 'Lost', color: 'bg-red-100 text-red-800' },
] as const;

export function KanbanBoard({ deals }: KanbanBoardProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 h-full overflow-x-auto pb-4">
            {STAGES.map((stage) => {
                const stageDeals = deals.filter(deal => deal.stage === stage.id);
                const totalValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

                return (
                    <div key={stage.id} className="flex-1 min-w-[300px] flex flex-col gap-4">
                        <div className="flex items-center justify-between p-2 rounded-md bg-muted/50 border">
                            <span className="font-semibold">{stage.label}</span>
                            <span className="text-sm text-muted-foreground">{stageDeals.length}</span>
                        </div>
                        <div className="text-xs text-muted-foreground px-2">
                            Total: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalValue)}
                        </div>

                        <div className="flex-1 flex flex-col gap-3">
                            {stageDeals.map((deal) => (
                                <Card key={deal.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                    <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-sm font-medium leading-none truncate">
                                            {deal.title}
                                        </CardTitle>
                                        <Link href={`/dashboard/deals/${deal.id}/edit`}>
                                            <Edit className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                        </Link>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-lg font-bold">
                                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: deal.currency }).format(deal.value)}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                                            {deal.customers && (
                                                <div className="flex items-center">
                                                    <span className="truncate">{deal.customers.first_name} {deal.customers.last_name}</span>
                                                </div>
                                            )}
                                            {deal.expected_close_date && (
                                                <div className="flex items-center">
                                                    <Calendar className="mr-1 h-3 w-3" />
                                                    {new Date(deal.expected_close_date).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            {stageDeals.length === 0 && (
                                <div className="h-20 border-2 border-dashed rounded-md flex items-center justify-center text-muted-foreground text-sm">
                                    No deals
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
