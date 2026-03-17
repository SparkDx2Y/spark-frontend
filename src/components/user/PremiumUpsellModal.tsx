import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Sparkles, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PremiumUpsellModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
}

export default function PremiumUpsellModal({ isOpen, onClose, title, description }: PremiumUpsellModalProps) {
    const router = useRouter();

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-sm overflow-hidden bg-[#121212] border border-amber-500/20 rounded-3xl shadow-2xl"
                    >
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-amber-500/20 rounded-full blur-[80px] pointer-events-none" />

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="relative p-8 flex flex-col items-center text-center space-y-6">
                            {/* Icon Container */}
                            <div className="relative">
                                <motion.div
                                    animate={{ rotate: [0, -5, 5, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                    className="w-20 h-20 rounded-full bg-linear-to-br from-amber-500/20 to-amber-600/40 border border-amber-500/50 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                                >
                                    <Lock className="w-10 h-10 text-amber-500" />
                                    <div className="absolute -top-1 -right-1">
                                        <Sparkles className="w-6 h-6 text-yellow-400" />
                                    </div>
                                </motion.div>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-white tracking-tight">{title}</h3>
                                <p className="text-stone-400 font-medium leading-relaxed whitespace-pre-line">
                                    {description}
                                </p>
                            </div>

                            <button
                                onClick={() => router.push('/user/premium')}
                                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl font-black uppercase tracking-widest transition-all duration-300 transform active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex flex-col items-center justify-center gap-1 group"
                            >
                                <span>Get Premium Now</span>
                            </button>

                            <button onClick={onClose} className="text-sm text-stone-500 hover:text-white font-medium transition-colors">
                                Maybe Later
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
