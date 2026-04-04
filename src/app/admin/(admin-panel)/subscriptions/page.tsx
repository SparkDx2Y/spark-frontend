export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { getSubscriptionsData } from "@/lib/data/admin/subscriptions.data";
import SubscriptionManager from "@/components/admin/SubscriptionManager";


export default async function SubscriptionsPage() {
    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Subscription Management</h1>
                    <p className="text-stone-500 font-medium mt-1 text-sm">
                        Create and manage subscription plans for your users.
                    </p>
                </div>
            </div>

            <Suspense fallback={<SubscriptionSkeleton />}>
                <SubscriptionContent />
            </Suspense>
        </div>
    );
}

async function SubscriptionContent() {
    const data = await getSubscriptionsData();

    return <SubscriptionManager
        initialPlans={data.plans}
        initialPagination={data.pagination}
    />;
}

function SubscriptionSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="h-[400px] bg-white/3 border border-white/5 rounded-2xl animate-pulse" />
        </div>
    );
}
