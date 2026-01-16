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

    // Read query values. Parse search params for search and page
    const search = params.search || '';
    const page = Number(params.page) || 1;

    // SERVER: Fetch data before rendering
    // This runs on the server
    const response = await getServerUsers({
        search: search || undefined,
        page,
        limit: 10
    });

    const { users, pagination } = response.data;

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">
                        User Management
                    </h1>
                    <p className="text-stone-500 font-medium mt-1 text-sm">
                        Manage and monitor all registered users on the platform.
                    </p>
                </div>


                <div className="flex items-center gap-3">
                    <div className="bg-white/3 border border-white/5 px-4 py-2.5 rounded-xl text-stone-300 text-xs font-bold flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {pagination.total} Total Users
                    </div>
                </div>
            </div>

            {/* Suspense fallback component for loading state
             to show while data is being fetched for UsersTable component */}
            <Suspense fallback={<LoadingState />}>
                <UsersTable
                    initialUsers={users}
                    initialPagination={pagination}
                />
            </Suspense>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-stone-500 text-sm font-medium">Loading users...</div>
        </div>
    );
}
