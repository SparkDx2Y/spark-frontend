"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Home, Heart, MessageSquare, Bell, Sparkles, Settings, LogOut, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout as logoutService } from "@/services/authService";
import { logout as logoutAction } from "@/store/features/auth/authSlice";
import { showSuccess, showError } from "@/utils/toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { useSocketContext } from "@/contexts/SocketContext";

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);
    const { unreadCount, unreadMessageCount } = useSocketContext();

    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const navItems = [
        { icon: Home, label: "Discover", href: "/user/home" },
        { icon: Heart, label: "Matches", href: "/user/matches" },
        { icon: Clock, label: "Activity", href: "/user/history" },
        { icon: MessageSquare, label: "Messages", href: "/user/messages", badge: unreadMessageCount },
        { icon: Bell, label: "Notifications", href: "/user/notifications", badge: unreadCount },
        { icon: Sparkles, label: "Premium", href: "/user/premium", color: "text-yellow-400" },
        { icon: Settings, label: "Settings", href: "/user/settings" },
    ];



    const handleLogoutClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setShowLogoutModal(true);
    };

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

    const handleLogoutCancel = () => {
        setShowLogoutModal(false);
    };

    return (
        <>
            <aside className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 h-[90vh] w-22 z-50 rounded-full p-px bg-linear-to-b from-white/5 via-primary/40 to-white/5 shadow-2xl shadow-primary/5">
                {/* Inner Content - Solid background to create the border effect */}
                <div className="relative h-full w-full rounded-full bg-black/90 backdrop-blur-xl flex flex-col items-center py-8">
                    {/* Logo Section */}
                    <Link
                        href="/user/home"
                        className="mb-10 flex flex-col items-center group transition-all duration-500"
                    >
                        <div className="relative">
                            {/* Animated Glow behind logo */}
                            <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                            <Image
                                src="/SparkLogo.png"
                                alt="Spark"
                                width={180}
                                height={60}
                                unoptimized
                                className="w-[50px] h-auto object-contain relative z-10 drop-shadow-[0_0_8px_rgba(255,75,125,0.3)]"
                                priority
                            />
                        </div>
                    </Link>

                    {/* Nav Items Section */}
                    <nav className="flex flex-col items-center space-y-6 flex-1 w-full justify-center">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`group relative flex items-center justify-center w-full py-2 transition-all duration-300 ${isActive ? "text-primary" : item.color || "text-gray-500 hover:text-primary"
                                        }`}
                                >
                                    {/* Active Indicator Dot */}
                                    {isActive && (
                                        <div className="absolute left-1 w-1 h-8 bg-primary rounded-full shadow-[0_0_10px_rgba(255,75,125,0.8)]"></div>
                                    )}

                                    <motion.div
                                        initial={{ rotateY: 0 }}
                                        whileHover={{
                                            rotateY: 180,
                                            scale: 1.1,
                                            filter: "drop-shadow(0 0 8px rgba(255, 75, 125, 0.6))",
                                        }}
                                        transition={{
                                            duration: 0.4,
                                            ease: "easeInOut"
                                        }}
                                        className="relative"
                                    >
                                        <motion.div
                                            variants={{
                                                hover: { rotateY: 180 }
                                            }}
                                            transition={{ duration: 0.4 }}
                                            className="relative"
                                        >
                                            <Icon className={`w-5 h-5 ${isActive ? "drop-shadow-[0_0_8px_rgba(255,75,125,0.5)]" : ""}`} />
                                            {item.badge !== undefined && item.badge > 0 && (
                                                <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-black shadow-lg">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </motion.div>
                                    </motion.div>

                                    {/* Tooltip */}
                                    <span className="absolute left-[80%] ml-4 bg-zinc-900 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-xl">
                                        {item.label}
                                        {/* Tooltip Arrow */}
                                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-l border-b border-white/10 rotate-45"></div>
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Section */}
                    <div className="mt-auto w-full flex flex-col items-center space-y-6 pb-2">
                        {/* Logout Button */}
                        <button
                            onClick={handleLogoutClick}
                            className="group relative flex items-center justify-center w-full py-2 text-gray-500 hover:text-red-500 transition-all duration-300"
                        >
                            <motion.div
                                initial={{ rotateY: 0 }}
                                whileHover={{
                                    rotateY: 180,
                                    scale: 1.1,
                                    filter: "drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))", // Red glow for logout
                                }}
                                transition={{
                                    duration: 0.4,
                                    ease: "easeInOut"
                                }}
                                className="relative"
                            >
                                <motion.div
                                    variants={{
                                        hover: { rotateY: 180 }
                                    }}
                                    transition={{ duration: 0.4 }}
                                    className="relative"
                                >
                                    <LogOut className="w-5 h-5" />
                                </motion.div>
                            </motion.div>

                            {/* Tooltip */}
                            <span className="absolute left-[80%] ml-4 bg-zinc-900 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-xl">
                                Logout
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-l border-b border-white/10 rotate-45"></div>
                            </span>
                        </button>

                        {/* Profile Link */}
                        <Link href="/user/profile" className="relative group">
                            <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-white/20 group-hover:ring-primary transition-all duration-500 shadow-lg bg-zinc-900 flex items-center justify-center">
                                {user?.profilePhoto ? (
                                    <Image
                                        src={user.profilePhoto}
                                        alt="Your Profile"
                                        width={40}
                                        height={40}
                                        unoptimized
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/5 text-primary font-bold text-lg">
                                        {user?.name?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                )}
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-black"></div>
                            </div>

                            {/* Status Glow */}
                            <div className="absolute -inset-1 bg-primary/0 group-hover:bg-primary/10 blur-md rounded-full transition-all duration-500"></div>

                            <span className="absolute left-[80%] ml-4 bg-zinc-900 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-xl">
                                {user?.name || "Profile"}
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-l border-b border-white/10 rotate-45"></div>
                            </span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Logout Confirmation Modal */}
            <ConfirmModal
                isOpen={showLogoutModal}
                onClose={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
                title="Sign Out"
                message="Are you sure you want to sign out? You'll need to log in again to access your matches."
                confirmText="Sign Out"
                cancelText="Stay Logged In"
                variant="danger"
                isLoading={isLoggingOut}
            />
        </>
    );
};

export default Sidebar;

