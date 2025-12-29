export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center py-8">
            <div className="w-full max-w-lg space-y-8 px-4 sm:px-6 lg:px-8">
                {children}
            </div>
        </div>
    );
}
