import { Suspense } from "react";
import { getInterestsData } from "@/lib/data/admin/interests";
import InterestsManager from "@/components/admin/InterestsManager";

/**
 * SERVER COMPONENT: Interests & Categories Page
 * 1. Fetch Categories and Interests on the SERVER.
 * 2. Pass them to the CLIENT component for interactivity.
 */
export default async function InterestsPage() {
    // SERVER: Fetch data simultaneously
    const { categories, interests } = await getInterestsData();

    return (
        <Suspense fallback={<InterestsLoading />}>
            <InterestsManager
                initialCategories={categories}
                initialInterests={interests}
            />
        </Suspense>
    );
}

function InterestsLoading() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-stone-500 text-sm font-medium animate-pulse italic">
                Gathering interests...
            </div>
        </div>
    );
}
