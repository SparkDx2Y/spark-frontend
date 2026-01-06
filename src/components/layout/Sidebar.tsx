"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Home,
    Heart,
    MessageSquare,
    Bell,
    Sparkles,
    Settings
} from "lucide-react";
import { useAppSelector } from "@/store/hooks";

const Sidebar = () => {
    const pathname = usePathname();
    const { user } = useAppSelector((state) => state.auth);

    const navItems = [
        { icon: Home, label: "Discover", href: "/user/home" },
        { icon: Heart, label: "Matches", href: "/user/matches" },
        { icon: MessageSquare, label: "Messages", href: "/user/messages", badge: 2 },
        { icon: Bell, label: "Notifications", href: "/user/notifications", badge: 3 },
        { icon: Sparkles, label: "Premium", href: "/user/premium", color: "text-yellow-400" },
        { icon: Settings, label: "Settings", href: "/user/settings" },
    ];

    return (
        <aside className="w-20 bg-black/95 backdrop-blur-xl fixed left-0 top-0 h-screen flex flex-col items-center py-8 border-r border-white/5 z-50 shadow-2xl">
            {/* Logo Section */}
            <Link
                href="/user/home"
                className="mb-12 flex flex-col items-center group transition-all duration-500"
            >
                <div className="relative">
                    {/* Animated Glow behind logo */}
                    <div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
                    <Image
                        src="/SparkLogo.png"
                        alt="Spark"
                        width={180}
                        height={60}
                        className="w-[60px] h-auto object-contain relative z-10 drop-shadow-[0_0_8px_rgba(255,75,125,0.3)]"
                        priority
                    />
                </div>
            </Link>

            {/* Nav Items Section */}
            <nav className="flex flex-col items-center space-y-7 flex-1 w-full">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`group relative flex items-center justify-center w-full py-2 transition-all duration-300 ${isActive ? "text-primary" : item.color || "text-gray-500 hover:text-white"
                                }`}
                        >
                            {/* Active Indicator Line */}
                            {isActive && (
                                <div className="absolute left-0 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_15px_rgba(255,75,125,0.8)]"></div>
                            )}

                            <div className="relative transition-transform duration-300 group-hover:scale-110">
                                <Icon className={`w-6 h-6 ${isActive ? "drop-shadow-[0_0_8px_rgba(255,75,125,0.5)]" : ""}`} />
                                {item.badge && (
                                    <span className="absolute -top-2 -right-2 bg-primary text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-black shadow-lg">
                                        {item.badge}
                                    </span>
                                )}
                            </div>

                            {/* Tooltip - Modern Styled */}
                            <span className="absolute left-[85%] ml-4 bg-zinc-900 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-xl">
                                {item.label}
                                {/* Tooltip Arrow */}
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-l border-b border-white/10 rotate-45"></div>
                            </span>
                        </Link>
                    );
                })}

                {/* Profile Section at Bottom */}
                <div className="mt-auto pb-4 w-full flex flex-col items-center">
                    <Link href="/user/profile" className="relative group">
                        <div className="w-10 h-10 rounded-2xl overflow-hidden ring-1 ring-white/20 group-hover:ring-primary group-hover:rounded-xl transition-all duration-500 shadow-lg">
                            <Image
                                src="https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg"
                                alt="Your Profile"
                                width={40}
                                height={40}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-black"></div>
                        </div>

                        {/* Status Glow */}
                        <div className="absolute -inset-1 bg-primary/0 group-hover:bg-primary/10 blur-md rounded-full transition-all duration-500"></div>

                        <span className="absolute left-[85%] ml-4 bg-zinc-900 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap pointer-events-none z-50 shadow-xl">
                            {user?.name || "Profile"} & Settings
                            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-zinc-900 border-l border-b border-white/10 rotate-45"></div>
                        </span>
                    </Link>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
