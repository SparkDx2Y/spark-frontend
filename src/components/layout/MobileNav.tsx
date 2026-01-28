"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Settings,
    Heart,
    MessageSquare,
    Bell,
    Sparkles,
    LogOut,
    User,
    Compass
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout as logoutService } from "@/services/authService";
import { logout as logoutAction } from "@/store/features/auth/authSlice";
import { showSuccess, showError } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmModal from "@/components/ui/ConfirmModal";

const MobileNav = () => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const handleLogoutConfirm = async () => {
        setIsLoggingOut(true);
        try {
            await logoutService();
            dispatch(logoutAction());
            showSuccess("Logged out successfully");
            router.push("/login");
        } catch (error) {
            console.error("Logout failed", error);
            showError("Logout failed. Please try again.");
            setIsLoggingOut(false);
            setShowLogoutModal(false);
        }
    };

    // Define all tabs
    const navItems = [
        { icon: MessageSquare, href: "/user/messages", label: "Inbox" },
        { icon: Bell, href: "/user/notifications", label: "Alerts" },
        { icon: Compass, href: "/user/home", label: "Spark", isCenter: true },
        { icon: Heart, href: "/user/matches", label: "Dates" },
        { icon: User, href: "/user/profile", label: "Me", isProfile: true },
    ];

    return (
        <nav className="md:hidden fixed bottom-5 left-0 right-0 px-4 z-50 flex justify-center">
            {/* The Unified Dock */}
            <div className="relative flex items-center p-px rounded-[2.5rem] bg-linear-to-r from-white/5 via-primary/40 to-white/5 shadow-2xl shadow-primary/10">
                {/* Nav Links */}
                <div className="flex items-center bg-black/90 backdrop-blur-3xl rounded-[2.5rem] p-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        // Unified Tab Wrapper to ensure perfect centering
                        return (
                            <div key={item.href} className="relative flex items-center justify-center h-14 w-16 px-1">

                                {/* The Sliding Blob - Now inside the tab for perfect centering */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-blob"
                                            className="absolute inset-x-0 inset-y-1 rounded-[2.5rem] bg-white/8 border border-white/10 -z-10"
                                            transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                                        />
                                    )}
                                </AnimatePresence>

                                {item.isCenter ? (
                                    <Link href={item.href} className="relative" onClick={() => setIsMenuOpen(false)}>
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden ${isActive ? 'scale-110' : ''}`}>
                                            {/* Glow Effect for Active Spark */}
                                            <AnimatePresence>
                                                {isActive && (
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="absolute inset-0 z-0"
                                                    >
                                                        <div className="absolute inset-0 bg-primary animate-pulse blur-xl opacity-40" />
                                                        <div className="absolute inset-0 bg-linear-to-br from-primary to-purple-600 opacity-90" />
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            <div className={`absolute inset-0 border border-white/10 rounded-full transition-colors ${isActive ? 'bg-transparent border-white/20' : 'bg-zinc-900'}`} />
                                            <Icon className={`w-7 h-7 relative z-10 transition-all duration-500 ${isActive ? 'text-white drop-shadow-[0_0_8px_white]' : 'text-gray-400'}`} />
                                        </div>
                                    </Link>
                                ) : item.isProfile ? (
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="relative flex items-center justify-center w-full h-full"
                                    >
                                        <div className={`w-9 h-9 rounded-full overflow-hidden border transition-all duration-300 ${isActive || isMenuOpen ? 'border-primary ring-4 ring-primary/20' : 'border-white/10 opacity-70'}`}>
                                            {user?.profilePhoto ? (
                                                <Image
                                                    src={user.profilePhoto}
                                                    alt="Me"
                                                    width={36}
                                                    height={36}
                                                    unoptimized
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-gray-500" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="w-full h-full flex flex-col items-center justify-center relative group/item"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Icon className={`w-6 h-6 transition-all duration-500 ${isActive ? 'text-white translate-y-[-2px]' : 'text-gray-500 group-hover/item:text-gray-300'}`} />
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.span
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-[9px] font-bold text-white mt-0.5 absolute bottom-1.5 tracking-tighter uppercase"
                                                >
                                                    {item.label}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Premium Context Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md -z-10"
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 100, scale: 0.9 }}
                            className="absolute bottom-24 w-[90vw] max-w-sm bg-neutral-900/90 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-6 shadow-2xl overflow-hidden"
                        >
                            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent" />

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-primary/30">
                                    <Image
                                        src={user?.profilePhoto || '/SparkLogo.png'}
                                        alt="User"
                                        width={64}
                                        height={64}
                                        unoptimized
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{user?.name || 'Hello!'}</h3>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Link
                                    href="/user/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group/opt"
                                >
                                    <div className="flex items-center gap-3">
                                        <Settings className="w-5 h-5 text-gray-400 group-hover/opt:text-white" />
                                        <span className="text-sm font-medium">Edit Profile</span>
                                    </div>
                                    <div className="w-2 h-2 rounded-full bg-white/10" />
                                </Link>

                                <Link
                                    href="/user/premium"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all group/opt"
                                >
                                    <div className="flex items-center gap-3">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                        <span className="text-sm font-medium text-white">Spark Premium</span>
                                    </div>
                                    <div className="px-2 py-0.5 rounded-full bg-primary text-[10px] font-bold text-white">UPGRADE</div>
                                </Link>

                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setShowLogoutModal(true);
                                    }}
                                    className="w-full flex items-center gap-3 p-4 rounded-2xl text-red-400 hover:bg-red-400/10 transition-all mt-4"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="text-sm font-medium">Sign Out</span>
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogoutConfirm}
                title="Sign Out"
                message="Are you sure you want to end your session?"
                confirmText="Sign Out"
                cancelText="Not yet"
                variant="danger"
                isLoading={isLoggingOut}
            />
        </nav>
    );
};

export default MobileNav;
