"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Users,
    Sparkles,
    Ticket,
    AlertTriangle,
    LogOut
} from "lucide-react";
import { logout } from "@/services/authService";
import { logout as logoutAction } from "@/store/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { showSuccess, showError } from "@/utils/toast";

const AdminSidebar = () => {

    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    /**
   * navItems
   */
    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
        { icon: Users, label: "Users", href: "/admin/users" },
        { icon: Sparkles, label: "Interests", href: "/admin/interests" },
        { icon: Ticket, label: "Subscriptions", href: "/admin/subscriptions" },
        { icon: AlertTriangle, label: "Reported Users", href: "/admin/reports" },
    ];

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };


    const handleLogoutConfirm = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            dispatch(logoutAction());
            showSuccess("Logged out successfully");
            router.push('/admin/login');
        } catch (error) {
            console.error("Logout failed", error);
            showError("Logout failed. Please try again.");
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
            <aside className="fixed w-60 h-screen bg-[#0d0d0f] border-r border-[#1a1a1c] flex flex-col z-50">
                {/* Logo */}
                <div className="p-8 border-b border-[#1a1a1c]">
                    <div className="flex flex-col items-center gap-2">
                        <Image
                            src="/SparkLogo.png"
                            alt="Spark"
                            width={120}
                            height={40}
                            className="w-auto h-8 object-contain"
                        />
                        <p className="text-[10px] text-amber-500/80 font-black uppercase tracking-[0.2em]">Admin Portal</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="px-4 flex-1 py-8 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                    ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.05)]"
                                    : "text-stone-500 hover:text-stone-200 hover:bg-white/5"
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? "text-amber-500" : "group-hover:text-amber-500"}`} />
                                <span className="text-sm font-medium tracking-tight">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-[#1a1a1c]">
                    <button
                        onClick={handleLogoutClick}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-stone-500 hover:text-red-400 hover:bg-red-400/5 transition-all duration-300"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout Session</span>
                    </button>
                </div>
            </aside>

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={showLogoutModal}
                onClose={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
                title="Confirm Logout"
                message="Are you sure you want to logout? You'll need to log back in to access the admin panel."
                confirmText="Logout"
                cancelText="Stay Logged In"
                variant="danger"
                isLoading={isLoggingOut}
            />
        </>
    );
};

export default AdminSidebar;
