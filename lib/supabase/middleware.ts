/**
 * Middleware for Session Management
 * 
 * This middleware:
 * 1. Refreshes expired sessions automatically
 * 2. Protects /dashboard routes from unauthenticated access
 * 3. Redirects authenticated users away from login/register
 * 
 * IMPORTANT: The /auth/callback route is excluded to allow
 * the auth callback to process tokens without interference.
 */
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    // Skip middleware for auth callback to prevent interference
    if (request.nextUrl.pathname.startsWith("/auth/callback")) {
        return NextResponse.next();
    }

    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    response = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Refresh the session - this is important for keeping sessions alive
    const { data: { user } } = await supabase.auth.getUser();

    // Protect dashboard routes
    if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect authenticated users away from login/register
    if (user && isAuthPage(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return response;
}

function isAuthPage(path: string): boolean {
    return path === "/login" || path === "/register";
}
