import { createClient } from "@/lib/supabase/server";
import { createBusiness, updateBusiness } from "./actions";
import { Button } from "@/components/ui/button";

export const metadata = {
    title: "Business Settings",
    description: "Manage your business settings",
};

export default async function BusinessPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null; // Handled by middleware
    }

    const { data: business } = await supabase
        .from("businesses")
        .select("*")
        .eq("user_id", user.id)
        .single();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Business Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage your business profile and settings.
                </p>
            </div>
            <div className="max-w-xl">
                {!business ? (
                    <div className="rounded-lg border p-4 shadow-sm">
                        <h4 className="mb-4 text-sm font-medium">Create Business</h4>
                        <form action={createBusiness} className="space-y-4">
                            <div className="grid gap-2">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Business Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    placeholder="Acme Corp"
                                    required
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <Button type="submit">Create Business</Button>
                        </form>
                    </div>
                ) : (
                    <div className="rounded-lg border p-4 shadow-sm">
                        <h4 className="mb-4 text-sm font-medium">Update Business Details</h4>
                        <form action={updateBusiness} className="space-y-4">
                            <input type="hidden" name="id" value={business.id} />
                            <div className="grid gap-2">
                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Business Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    defaultValue={business.name}
                                    required
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>
                            <div className="text-xs text-muted-foreground">
                                <p>Created: {new Date(business.created_at).toLocaleDateString()}</p>
                                <p>Last Updated: {new Date(business.updated_at).toLocaleDateString()}</p>
                            </div>
                            <Button type="submit">Update Business</Button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
