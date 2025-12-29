import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <Skeleton className="h-9 w-[150px]" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-9 w-[100px]" />
                </div>
            </div>
            <div className="flex gap-4 h-[500px] overflow-x-auto pb-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-1 min-w-[300px] flex flex-col gap-4">
                        <div className="flex items-center justify-between p-2 rounded-md bg-muted/50 border">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-4 w-8" />
                        </div>
                        <div className="flex flex-col gap-3">
                            <Skeleton className="h-32 w-full" />
                            <Skeleton className="h-32 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
