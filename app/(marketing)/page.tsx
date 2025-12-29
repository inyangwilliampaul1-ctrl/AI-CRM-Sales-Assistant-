export default function IndexPage() {
    return (
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
            <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
                <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                    Maximize Revenue with AI-Driven CRM.
                </h1>
                <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                    The all-in-one AI CRM Sales Assistant SaaS. Built to streamline your pipeline, empower your reps, and deliver actionable insights instantly.
                </p>
                <div className="space-x-4">
                    <a href="/login" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                        Get Started
                    </a>
                </div>
            </div>
        </section>
    );
}
