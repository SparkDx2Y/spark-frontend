import { Suspense } from "react";
import { getInterestsData } from "@/lib/data/admin/interests.data";
import InterestsManager from "@/components/admin/InterestsManager";

/**
 * SERVER COMPONENT: Interests & Categories Page
 */
export default async function InterestsPage() {
    return (
        <div className="space-y-8 pb-12">
            {/* 1. Header renders INSTANTLY */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Interests & Categories</h1>
                    <p className="text-stone-500 font-medium mt-1 text-sm">
                        Manage interest categories and user interests.
                    </p>
                </div>
            </div>

            {/* Suspense boundary for the dynamic content */}
            <Suspense fallback={<InterestsSkeleton />}>
                <InterestsContent />
            </Suspense>
        </div>
    );
}

/**
 * Async component that fetches data on the server
 */
async function InterestsContent() {
    const { categories, interests } = await getInterestsData();

    return (
        <InterestsManager
            initialCategories={categories}
            initialInterests={interests}
        />
    );
}

/**
 * Skeleton component for the interests and categories (fallback)
 */
function InterestsSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
            {/* Categories Skeleton */}
            <div className="lg:col-span-4 space-y-6">
                <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
                <div className="bg-white/3 border border-white/5 rounded-2xl h-[400px] animate-pulse" />
            </div>

            {/* Interests Skeleton */}
            <div className="lg:col-span-8 space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-6 w-32 bg-white/5 rounded animate-pulse" />
                    <div className="h-10 w-48 bg-white/5 rounded-xl animate-pulse" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/3 border border-white/5 h-32 animate-pulse" />
                    ))}
                </div>
            </div>
        </div>
    );
}
