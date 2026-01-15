import InterestsSelection from "@/components/auth/InterestsSelection";

export const metadata = {
    title: "Select Your Interests | Spark",
    description: "Choose your interests to help us find the perfect matches for you.",
};

export default function InterestsPage() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
            <div className="w-full max-w-3xl relative z-10">
                <div className="bg-white/3 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] transform-gpu backface-hidden will-change-transform">
                    <InterestsSelection />
                </div>
            </div>
        </main>
    );
}





