import { Suspense } from "react";
import { Users } from "lucide-react";
import { getServerUsers } from "@/lib/data/admin/users.data";
import UsersTable from "@/components/admin/UsersTable";

interface PageProps {
    searchParams: Promise<{
        search?: string;
        page?: string;
    }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const search = params.search || '';
    const page = Number(params.page) || 1;

    return (
        <div className="space-y-8 pb-12">
            {/* 1. Header render instantly when page loads */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        User Management
                    </h1>
                    <p className=" font-medium mt-1 text-sm text-stone-500">
                        Manage and monitor all registered users on the platform.
                    </p>
                </div>

                <div id="users-metrics-portal" />
            </div>

            {/* Suspense boundary for the dynamic content */}
            <Suspense key={search + page} fallback={<UsersTableSkeleton />}>
                <UsersListContent search={search} page={page} />
            </Suspense>
        </div>
    )
}

/**
 * This component fetches data and renders the table.
 * It is wrapped in Suspense so the rest of the page can show up immediately.
 */
async function UsersListContent({ search, page }: { search: string; page: number }) {
    const response = await getServerUsers({
        search: search || undefined,
        page,
        limit: 10
    });

    const { users, pagination } = response;

    return (
        <>
            <div className="flex justify-end -mt-16 md:-mt-20 mb-8">
                <div className="bg-white/3 border border-white/5 px-4 py-2.5 rounded-xl text-stone-300 text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-500">
                    <Users className="w-4 h-4 text-emerald-500" />
                    {pagination.total} Total Users
                </div>
            </div>

            <UsersTable
                initialUsers={users}
                initialPagination={pagination}
            />
        </>
    );
}

/**
 * Skeleton component for the table (fallback)
 */
function UsersTableSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Search Bar Skeleton */}
            <div className="w-full h-[50px] bg-white/3 border border-white/5 rounded-xl animate-pulse relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-white/5 rounded" />
            </div>

            {/* Total Users Badge Skeleton */}
            <div className="flex justify-end -mt-2">
                <div className="w-32 h-10 bg-white/3 border border-white/5 rounded-xl animate-pulse" />
            </div>

            {/* Table Skeleton */}
            <div className="bg-white/3 border border-white/5 rounded-2xl overflow-hidden mt-2">
                <div className="h-12 bg-white/5 border-b border-white/5" />
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="p-4 flex items-center gap-4 border-b border-white/5 last:border-0 h-20">
                        <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="w-1/3 h-4 bg-white/5 rounded animate-pulse" />
                            <div className="w-1/4 h-3 bg-white/5 rounded animate-pulse" />
                        </div>
                        <div className="w-24 h-6 bg-white/5 rounded-lg animate-pulse" />
                        <div className="w-20 h-8 bg-white/5 rounded-lg animate-pulse" />
                    </div>
                ))}
            </div>
        </div>
    );
}
