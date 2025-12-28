"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import Link from "next/link";
import { deleteCustomerAction } from "@/app/dashboard/customers/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CustomerTableActionsProps {
    customerId: string;
}

export function CustomerTableActions({ customerId }: CustomerTableActionsProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this customer?")) {
            setIsDeleting(true);
            await deleteCustomerAction(customerId);
            setIsDeleting(false);
            // Optional: router.refresh() if not automated by action
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <Link href={`/dashboard/customers/${customerId}/edit`} className="flex items-center cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Edit
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <Trash className="mr-2 h-4 w-4" />
                    {isDeleting ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
