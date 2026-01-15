import AuthFormWrapper from "@/components/auth/AuthFormWrapper";
import InterestsSelection from "@/components/auth/InterestsSelection";

export const metadata = {
    title: "Select Your Interests | Spark",
    description: "Choose your interests to help us find the perfect matches for you.",
};

export default function InterestsPage() {
    return (
        <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-primary/10 w-full max-w-2xl overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 blur-[100px] rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-secondary/20 blur-[100px] rounded-full" />

                <div className="relative z-10">
                    <InterestsSelection />
                </div>
            </div>
        </main>
    );
}
