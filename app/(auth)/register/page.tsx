"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signup } from "../actions";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const INDUSTRIES = [
    { value: "retail", label: "Retail" },
    { value: "tech", label: "Tech" },
    { value: "services", label: "Services" },
    { value: "education", label: "Education" },
    { value: "healthcare", label: "Healthcare" },
    { value: "other", label: "Other" },
];

const TEAM_SIZES = [
    { value: "1-5", label: "1–5" },
    { value: "6-20", label: "6–20" },
    { value: "21-50", label: "21–50" },
    { value: "50+", label: "50+" },
];

const COUNTRIES = [
    { value: "Nigeria", label: "Nigeria" },
    { value: "Ghana", label: "Ghana" },
    { value: "Kenya", label: "Kenya" },
    { value: "South Africa", label: "South Africa" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "United States", label: "United States" },
    { value: "Other", label: "Other" },
];

const inputClassName = "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const selectClassName = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export default function RegisterPage() {
    const [state, formAction, isPending] = useActionState(signup, null);
    const router = useRouter();

    // If signup succeeded with email confirmation required, show success UI
    const showEmailConfirmation = state?.success === true;

    if (showEmailConfirmation) {
        return (
            <div className="flex flex-col items-center justify-center space-y-6 text-center px-4">
                <div className="rounded-full bg-green-100 p-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-12 h-12 text-green-600"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                        />
                    </svg>
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Check your email
                    </h1>
                    <p className="text-muted-foreground max-w-sm">
                        We&apos;ve sent a verification link to your email address.
                        Click the link to verify your account and access your dashboard.
                    </p>
                </div>
                <div className="flex flex-col gap-2 w-full max-w-xs">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/login")}
                        className="w-full"
                    >
                        Go to Login
                    </Button>
                    <p className="text-xs text-muted-foreground">
                        Didn&apos;t receive the email? Check your spam folder.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-6">
            <Link
                href="/"
                className="absolute left-4 top-4 md:left-8 md:top-8 text-sm font-medium text-muted-foreground hover:text-primary"
            >
                ← Back
            </Link>

            {/* Header */}
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Create your account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Start managing customers, deals, and support in one place.
                </p>
            </div>

            {/* Form */}
            <div className="grid gap-6">
                <form action={formAction}>
                    <div className="grid gap-4">
                        {/* Full Name */}
                        <div className="grid gap-1.5">
                            <label htmlFor="full_name" className="text-sm font-medium">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="full_name"
                                name="full_name"
                                placeholder="John Doe"
                                type="text"
                                required
                                className={inputClassName}
                            />
                            <p className="text-xs text-muted-foreground">
                                This will be shown inside your dashboard.
                            </p>
                        </div>

                        {/* Email */}
                        <div className="grid gap-1.5">
                            <label htmlFor="email" className="text-sm font-medium">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                placeholder="name@example.com"
                                type="email"
                                autoCapitalize="none"
                                autoComplete="email"
                                autoCorrect="off"
                                required
                                className={inputClassName}
                            />
                        </div>

                        {/* Password */}
                        <div className="grid gap-1.5">
                            <label htmlFor="password" className="text-sm font-medium">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="password"
                                name="password"
                                placeholder="Create a strong password"
                                type="password"
                                required
                                minLength={6}
                                className={inputClassName}
                            />
                        </div>

                        {/* Divider */}
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                        </div>

                        {/* Business Name */}
                        <div className="grid gap-1.5">
                            <label htmlFor="business_name" className="text-sm font-medium">
                                Business Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="business_name"
                                name="business_name"
                                placeholder="Acme Inc."
                                type="text"
                                required
                                className={inputClassName}
                            />
                            <p className="text-xs text-muted-foreground">
                                Used to personalize your CRM workspace.
                            </p>
                        </div>

                        {/* Industry & Team Size Row */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Industry */}
                            <div className="grid gap-1.5">
                                <label htmlFor="industry" className="text-sm font-medium">
                                    Industry <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="industry"
                                    name="industry"
                                    required
                                    defaultValue=""
                                    className={selectClassName}
                                >
                                    <option value="" disabled>
                                        Select industry
                                    </option>
                                    {INDUSTRIES.map((industry) => (
                                        <option key={industry.value} value={industry.value}>
                                            {industry.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-muted-foreground">
                                    Helps us tailor AI insights for your business.
                                </p>
                            </div>

                            {/* Team Size */}
                            <div className="grid gap-1.5">
                                <label htmlFor="team_size" className="text-sm font-medium">
                                    Team Size <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="team_size"
                                    name="team_size"
                                    required
                                    defaultValue=""
                                    className={selectClassName}
                                >
                                    <option value="" disabled>
                                        Select size
                                    </option>
                                    {TEAM_SIZES.map((size) => (
                                        <option key={size.value} value={size.value}>
                                            {size.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-muted-foreground">
                                    Used for internal setup only.
                                </p>
                            </div>
                        </div>

                        {/* Country */}
                        <div className="grid gap-1.5">
                            <label htmlFor="country" className="text-sm font-medium">
                                Country
                            </label>
                            <select
                                id="country"
                                name="country"
                                defaultValue="Nigeria"
                                className={selectClassName}
                            >
                                {COUNTRIES.map((country) => (
                                    <option key={country.value} value={country.value}>
                                        {country.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Error Message */}
                        {state?.error && (
                            <p className="text-sm text-red-500 font-medium text-center">
                                {state.error}
                            </p>
                        )}

                        {/* Submit Button */}
                        <Button disabled={isPending} className="w-full mt-2">
                            {isPending ? "Creating workspace..." : "Create my workspace →"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Login Link */}
            <p className="px-8 text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
                    Sign in
                </Link>
            </p>
        </div>
    );
}
