import { Suspense } from "react";
import { AlertTriangle } from "lucide-react";
import { getServerReports } from "@/lib/data/admin/reports.data";
import ReportsTable from "@/components/admin/ReportsTable";

export default async function AdminReportsPage() {
    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        Report Management
                    </h1>
                    <p className=" font-medium mt-1 text-sm text-stone-500">
                        Review and handle user reports to keep Spark safe.
                    </p>
                </div>
            </div>

            <Suspense fallback={<ReportsTableSkeleton />}>
                <ReportsListContent />
            </Suspense>
        </div>
    )
}

async function ReportsListContent() {
    const response = await getServerReports();
    const reports = response.data;

    if (reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white/3 border border-white/5 rounded-2xl">
                <AlertTriangle className="w-12 h-12 text-stone-700 mb-4" />
                <p className="text-stone-500 text-sm font-medium">
                    No reports found. Great job keeping the community clean!
                </p>
            </div>
        );
    }

    return <ReportsTable initialReports={reports} />;
}

function ReportsTableSkeleton() {
    return (
        <div className="bg-white/3 border border-white/5 rounded-2xl overflow-hidden mt-6 animate-pulse">
            <div className="h-12 bg-white/5 border-b border-white/5" />
            {[...Array(5)].map((_, i) => (
                <div key={i} className="p-6 border-b border-white/5 last:border-0 space-y-3">
                    <div className="grid grid-cols-6 gap-4">
                        <div className="h-4 bg-white/5 rounded w-3/4" />
                        <div className="h-4 bg-white/5 rounded w-3/4" />
                        <div className="h-4 bg-white/5 rounded w-1/2" />
                        <div className="h-4 bg-white/5 rounded w-full" />
                        <div className="h-6 bg-white/5 rounded-lg w-20" />
                        <div className="h-4 bg-white/5 rounded w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}
