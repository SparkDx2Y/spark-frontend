"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    showCloseButton?: boolean;
    className?: string;
}

export default function Modal({
    isOpen,
    onClose,
    children,
    title,
    showCloseButton = true,
    className = "max-w-md"
}: ModalProps) {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            // Prevent body scroll when modal is open
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center">
            {/* Backdrop with blur  and click to close*/}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`relative z-101 w-full mx-4 animate-scale-in transition-all duration-300 ${className}`}>
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-amber-500/20 blur-2xl rounded-3xl opacity-50" />

                {/* Modal Content */}
                <div className="relative bg-[#0d0d0f] border border-amber-500/20 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] overflow-hidden">
                    {/* Luxury Background Pattern */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                        style={{
                            backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)',
                            backgroundSize: '24px 24px'
                        }}
                    />

                    {/* Amber Accent Glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 blur-[80px] rounded-full" />

                    {/* Header */}
                    {title && (
                        <div className="relative border-b border-white/5 px-8 py-6">
                            <h3 className="text-xl font-bold text-white tracking-tight">
                                {title}
                            </h3>
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-white/3 border border-white/5 flex items-center justify-center text-stone-500 hover:text-white hover:bg-white/8 transition-all"
                                    aria-label="Close modal"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Body */}
                    <div className="relative px-8 py-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {children}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }

                .animate-scale-in {
                    animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 10px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(245, 158, 11, 0.1);
                    border-radius: 10px;
                    border: 2px solid transparent;
                    background-clip: content-box;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(245, 158, 11, 0.3);
                }
            `}</style>
        </div>
    );
}
