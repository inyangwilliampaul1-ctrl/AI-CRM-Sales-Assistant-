export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="container z-40 bg-background">
                <div className="flex h-20 items-center justify-between py-6">
                    <div className="flex gap-6 md:gap-10">
                        <a href="/" className="flex items-center space-x-2">
                            <span className="inline-block font-bold">AI CRM Sales Assistant</span>
                        </a>
                    </div>
                    <nav>
                        <a href="/login" className="px-4 py-2 text-sm font-medium transition-colors hover:text-primary">
                            Login
                        </a>
                    </nav>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-12">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © 2024 AI CRM Sales Assistant. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
