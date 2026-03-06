import { ChangePasswordForm } from "@/components/user/settings/ChangePasswordForm";
import { ShieldCheck, Settings } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="relative min-h-[calc(100vh-80px)] md:min-h-screen bg-black text-white overflow-hidden">
            
            <div className="absolute top-[-20%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/20 rounded-full blur-[100px] md:blur-[150px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-500/10 rounded-full blur-[100px] md:blur-[150px] pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 pt-12 pb-24">
                {/* Header */}
                <div className="mb-12 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
                        <Settings className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-white to-white/70">
                            Settings
                        </h1>
                        <p className="text-sm md:text-base text-gray-400 mt-2 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-400" />
                            Secure and personalize your experience
                        </p>
                    </div>
                </div>

                {/* Main Settings Content */}
                <div className="max-w-3xl space-y-4">
                    <ChangePasswordForm />
                    {/* Additional settings forms can be added here in the future as expandable sections */}
                </div>
            </div>
        </div>
    );
}
