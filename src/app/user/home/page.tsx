import { Suspense } from 'react';
import { getServerMatchFeed } from '@/lib/data/user/match.data';
import SwipeManager from '@/components/user/discover/SwipeManager';

/**
 * SERVER COMPONENT: Match Discovery Page
 * Uses Hybrid approach: Static background + Streamed content
 */
export default async function UserHomePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] md:h-[calc(100vh-80px)] overflow-hidden relative p-4 md:p-0">
            {/* 1. Background renders INSTANTLY */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-linear-to-b from-black/80 to-black z-10" />
                <div className="absolute top-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/20 rounded-full blur-[80px] md:blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-purple-500/10 rounded-full blur-[80px] md:blur-[120px]" />
            </div>

            {/* 2. Content streams in */}
            <Suspense fallback={<SwipeSkeleton />}>
                <SwipeContent />
            </Suspense>
        </div>
    );
}

/**
 * Component that fetches data on the server
 */
async function SwipeContent() {
    const profiles = await getServerMatchFeed();
    return <SwipeManager initialProfiles={profiles} />;
}

/**
 * Premium skeleton for the discovery card
 */
function SwipeSkeleton() {
    return (
        <div className="relative z-10 w-full max-w-[min(90vw,400px)] aspect-[3/4.5] md:aspect-3/4 max-h-[70vh] md:h-[65vh] bg-primary/5 rounded-3xl border border-white/10 animate-pulse overflow-hidden">
            {/* Brand Gradient Glow at the top */}
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary/40 via-purple-500/40 to-primary/40" />

            <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/20 to-transparent" />

            {/* Bottom info skeleton with brand colors */}
            <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                <div className="h-8 w-2/3 bg-linear-to-r from-primary/20 to-purple-500/20 rounded-lg" />
                <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
                <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 bg-primary/10 rounded-full" />
                    <div className="h-6 w-20 bg-purple-500/10 rounded-full" />
                </div>
            </div>
        </div>
    );
}
