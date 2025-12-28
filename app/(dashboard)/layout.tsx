export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col space-y-6">
            <header className="sticky top-0 z-40 border-b bg-background">
                <div className="container flex h-16 items-center justify-between py-4">
                    <div className="flex gap-6 md:gap-10">
                        <a href="/" className="hidden items-center space-x-2 md:flex">
                            <span className="hidden font-bold sm:inline-block">
                                SaaS Starter
                            </span>
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* User Nav would go here */}
                        <div className="h-8 w-8 rounded-full bg-secondary"></div>
                    </div>
                </div>
            </header>
            <div className="container grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
                <aside className="hidden w-[200px] flex-col md:flex">
                    <nav className="grid items-start gap-2">
                        <a href="/dashboard" className="group flex items-center rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-foreground hover:bg-accent hover:text-accent-foreground">
                            <span>Dashboard</span>
                        </a>
                        <a href="/dashboard/settings" className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                            <span>Settings</span>
                        </a>
                    </nav>
                </aside>
                <main className="flex w-full flex-1 flex-col overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
