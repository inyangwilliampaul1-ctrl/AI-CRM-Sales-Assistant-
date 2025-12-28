import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="flex flex-col space-y-6 text-center">
            <Link
                href="/"
                className="absolute left-4 top-4 md:left-8 md:top-8 text-sm font-medium text-muted-foreground hover:text-primary"
            >
                Back
            </Link>
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
                <p className="text-sm text-muted-foreground">
                    Enter your email below to create your account
                </p>
            </div>
            <div className="grid gap-6">
                <form>
                    <div className="grid gap-2">
                        <div className="grid gap-1 text-left">
                            <label className="sr-only" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <Button>Sign Up with Email</Button>
                    </div>
                </form>
            </div>
            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link href="/login" className="hover:text-brand underline underline-offset-4">
                    Already have an account? Sign In
                </Link>
            </p>
        </div>
    );
}
