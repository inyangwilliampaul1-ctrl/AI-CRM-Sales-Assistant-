import { getCustomers } from "@/lib/db/customers";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Plus } from "lucide-react";
import { CustomerTableActions } from "@/components/customers/customer-table-actions";

export default async function CustomersPage() {
    const customers = await getCustomers();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/customers/new">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Add Customer
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center">
                                    No customers found. Add your first one!
                                </TableCell>
                            </TableRow>
                        ) : (
                            customers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell>
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={`https://avatar.vercel.sh/${customer.email}`} alt={customer.first_name} />
                                            <AvatarFallback>{customer.first_name[0]}{customer.last_name[0]}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        {customer.first_name} {customer.last_name}
                                    </TableCell>
                                    <TableCell>{customer.email}</TableCell>
                                    <TableCell>{customer.phone}</TableCell>
                                    <TableCell>{customer.company_name}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${customer.status === 'active' ? 'bg-green-100 text-green-800' :
                                                customer.status === 'lead' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {customer.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <CustomerTableActions customerId={customer.id} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
