"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signup } from "../actions";
import { useActionState } from "react";

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

    return (
        <div className="flex flex-col space-y-6">
            <Link
                href="/"
                className="absolute left-4 top-4 md:left-8 md:top-8 text-sm font-medium text-muted-foreground hover:text-primary"
            >
                Back
            </Link>

            {/* Header */}
            <div className="flex flex-col space-y-2 text-center">
                <h1 className="text-2xl font-semibold tracking-tight">
                    Create your account
                </h1>
                <p className="text-sm text-muted-foreground">
                    Get started with your CRM in minutes
                </p>
            </div>

            {/* Form */}
            <div className="grid gap-6">
                <form action={formAction}>
                    <div className="grid gap-4">
                        {/* Personal Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Personal Information
                            </h3>

                            {/* Full Name */}
                            <div className="grid gap-1">
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
                            </div>

                            {/* Email */}
                            <div className="grid gap-1">
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
                            <div className="grid gap-1">
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
                        </div>

                        {/* Divider */}
                        <div className="relative my-2">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                        </div>

                        {/* Business Information Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                Business Information
                            </h3>

                            {/* Business Name */}
                            <div className="grid gap-1">
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
                            </div>

                            {/* Industry & Team Size Row */}
                            <div className="grid grid-cols-2 gap-4">
                                {/* Industry */}
                                <div className="grid gap-1">
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
                                </div>

                                {/* Team Size */}
                                <div className="grid gap-1">
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
                                </div>
                            </div>

                            {/* Country */}
                            <div className="grid gap-1">
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
                        </div>

                        {/* Error Message */}
                        {state?.error && (
                            <p className="text-sm text-red-500 font-medium text-center">
                                {state.error}
                            </p>
                        )}

                        {/* Submit Button */}
                        <Button disabled={isPending} className="w-full mt-2">
                            {isPending ? "Creating Account..." : "Create Account"}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Login Link */}
            <p className="px-8 text-center text-sm text-muted-foreground">
                <Link href="/login" className="hover:text-brand underline underline-offset-4">
                    Already have an account? Sign In
                </Link>
            </p>
        </div>
    );
}
