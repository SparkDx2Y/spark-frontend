"use client";

import Modal from "./Modal";
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "danger" | "warning" | "info" | "success";
    isLoading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "warning",
    isLoading = false,
}: ConfirmModalProps) {

    //? Variant Configurations
    const variants = {
        danger: {
            icon: XCircle,
            iconColor: "text-red-500",
            iconBg: "bg-red-500/10",
            buttonClass: "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-[0_4px_15px_rgba(239,68,68,0.3)]",
        },
        warning: {
            icon: AlertTriangle,
            iconColor: "text-amber-500",
            iconBg: "bg-amber-500/10",
            buttonClass: "bg-gradient-to-br from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-[0_4px_15px_rgba(245,158,11,0.3)]",
        },
        info: {
            icon: Info,
            iconColor: "text-blue-500",
            iconBg: "bg-blue-500/10",
            buttonClass: "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-[0_4px_15px_rgba(59,130,246,0.3)]",
        },
        success: {
            icon: CheckCircle,
            iconColor: "text-green-500",
            iconBg: "bg-green-500/10",
            buttonClass: "bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-[0_4px_15px_rgba(34,197,94,0.3)]",
        },
    };

    const config = variants[variant];
    const Icon = config.icon;

    return (
        //? Modal Component
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
            <div className="space-y-6">
                {/* Icon & Title */}
                
                <div className="flex flex-col items-center text-center gap-4">
                    <div className={`w-16 h-16 rounded-2xl ${config.iconBg} border border-white/5 flex items-center justify-center`}>
                        <Icon className={`w-8 h-8 ${config.iconColor}`} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                            {title}
                        </h3>
                        <p className="text-sm text-stone-400 leading-relaxed max-w-sm">
                            {message}
                        </p>
                    </div>
                </div>

                
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 rounded-xl bg-white/3 border border-white/5 text-stone-300 text-sm font-bold hover:bg-white/8 hover:border-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`flex-1 px-6 py-3 rounded-xl text-[#0d0d0f] text-sm font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed ${config.buttonClass}`}
                    >
                        {isLoading ? "Processing..." : confirmText}
                    </button>
                </div>

            </div>
        </Modal>
    );
}
