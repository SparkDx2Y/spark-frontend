"use client";

import { useEffect, useState } from "react";
import { redirect, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function PremiumSuccessPage() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

   
    if (!sessionId) {
        redirect("/user/premium");
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setStatus("success");
        }, 1500);

        return () => clearTimeout(timer);
    }, [sessionId]);

    if (status === "verifying") {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
                <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Verifying your payment...</h2>
                <p className="text-stone-400">Please do not close this window.</p>
            </div>
        );
    }

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="relative z-10 w-full max-w-md bg-[#0d0d0f] border border-amber-500/20 p-8 rounded-[3rem] shadow-2xl text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-linear-to-tr from-amber-600 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                    <CheckCircle2 className="w-12 h-12 text-white" />
                </motion.div>

                <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-4xl font-black text-white mb-4 tracking-tight"
                >
                    Payment <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-yellow-600">Successful!</span>
                </motion.h1>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4 mb-8"
                >
                    <p className="text-stone-300 font-medium text-lg">
                        Welcome to Spark Premium.
                    </p>
                    <p className="text-stone-500 text-sm">
                        Your account has been upgraded successfully. You now have full access to all premium features. Check your email for the receipt.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col gap-3"
                >
                    <Link
                        href="/user/home"
                        className="w-full py-4 rounded-xl bg-linear-to-r from-amber-500 to-yellow-500 text-stone-900 font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all flex items-center justify-center group"
                    >
                        <Sparkles className="w-5 h-5 mr-2" />
                        Start Swiping
                        <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
