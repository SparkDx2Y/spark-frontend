export const dynamic = "force-dynamic";
import { Suspense } from "react";
import { getActivePlansData, getCurrentPlanData } from "@/lib/data/user/subscription.data";
import PremiumPlans from "@/components/user/premium/PremiumPlans";
import { Shield } from "lucide-react";

export const metadata = {
    title: "Premium - Spark",
    description: "Upgrade your spark experience with our premium plans",
};

export default async function PremiumPage() {
    return (
        <div className="relative min-h-screen pb-24 overflow-hidden">
            {/* Standard Spark Background */}
            <div className="fixed inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-b from-black/80 to-black z-10" />
                <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[120px]" />
            </div>

            <div className="relative z-10">
                <Suspense fallback={<PremiumSkeleton />}>
                    <PremiumContent />
                </Suspense>
            </div>
        </div>
    );
}

async function PremiumContent() {
    const [plans, currentPlanResponse] = await Promise.all([
        getActivePlansData(),
        getCurrentPlanData(),
    ]);
    const currentPlan = currentPlanResponse?.plan;
    const subscriptionDetails = currentPlanResponse?.subscription;

    if (!plans || plans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
                <div className="w-20 h-20 rounded-4xl bg-stone-500/5 flex items-center justify-center text-stone-700 mb-6 border border-white/5">
                    <Shield className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-2">No Plans Available</h2>
                <p className="text-stone-500 font-medium text-center max-w-sm">
                    Our team is currently refining our premium offerings. Please check back later for more exciting features!
                </p>
            </div>
        );
    }

    return (
        <PremiumPlans 
            plans={plans} 
            currentPlanId={currentPlan?._id} 
            expiryDate={subscriptionDetails?.endDate}
        />
    );
}

function PremiumSkeleton() {
    return (
        <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 animate-pulse">
            <div className="space-y-4 text-center">
                <div className="h-12 bg-white/5 rounded-2xl w-3/4 max-w-xl mx-auto" />
                <div className="h-6 bg-white/5 rounded-xl w-1/2 max-w-lg mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[600px] bg-white/3 border border-white/5 rounded-[3rem]" />
                ))}
            </div>
        </div>
    );
}
