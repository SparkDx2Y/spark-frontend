import { Users, Sparkles, IndianRupee, LineChart, BarChart, TrendingUp } from "lucide-react";
import Image from "next/image";

export default function AdminDashboard() {

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-stone-500 font-medium mt-1 text-sm">Monitoring Spark platform activities and health.</p>
                </div>

                <div className="flex gap-3">
                    <button className="bg-white/3 border border-white/5 px-6 py-2.5 rounded-xl text-stone-300 text-xs font-bold hover:bg-white/6 transition-all flex items-center gap-2">
                        <BarChart className="w-4 h-4" />
                        Download Report
                    </button>
                    <button className="bg-linear-to-br from-amber-500 to-yellow-600 px-6 py-2.5 rounded-xl text-[#0d0d0f] text-xs font-black shadow-[0_4px_15px_rgba(217,119,6,0.3)] hover:scale-105 transition-all">
                        Platform View
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Users", value: "12,482", change: "+12.5%", icon: Users, color: "text-amber-500", bg: "bg-amber-500/10" },
                    { label: "Active Users", value: "2,847", change: "+5.2%", icon: TrendingUp, color: "text-stone-300", bg: "bg-stone-300/10" },
                    { label: "Premium Users", value: "1,550", change: "+8.2%", icon: Sparkles, color: "text-amber-500", bg: "bg-amber-500/10" },
                    { label: "Revenue", value: "₹32,621", change: "+23.5%", icon: IndianRupee, color: "text-amber-500", bg: "bg-amber-500/10" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-linear-to-b from-white/5 to-white/1 border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="flex justify-between items-start relative z-10">
                            <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center border border-white/5`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-lg">{stat.change}</span>
                        </div>
                        <div className="mt-4 relative z-10">
                            <h3 className="text-3xl font-bold text-white tracking-tight">{stat.value}</h3>
                            <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mt-1">{stat.label}</p>
                        </div>
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/2 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </div>
                ))}
            </div>

            {/* Major Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-linear-to-b from-white/5 to-transparent border border-white/5 p-8 rounded-3xl relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-10 relative z-10">
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Growth Analytics</h3>
                            <p className="text-stone-500 text-sm mt-1">Real-time user acquisition and retention.</p>
                        </div>
                        <LineChart className="w-6 h-6 text-stone-700" />
                    </div>

                    <div className="h-64 flex items-end justify-between px-2 gap-4 relative z-10">
                        {[30, 45, 60, 55, 80, 75, 95, 85, 100].map((h, i) => (
                            <div key={i} className="flex-1 bg-amber-500/5 border-t-2 border-amber-500/40 relative group/bar transition-all duration-500 hover:bg-amber-500/10" style={{ height: `${h}%` }}>
                                <div className="absolute inset-0 bg-linear-to-t from-amber-500/20 to-transparent opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#0f0f11] border border-white/5 p-8 rounded-3xl flex flex-col relative overflow-hidden">
                    <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                        Recent Reports
                    </h3>

                    <div className="space-y-6 flex-1">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-4 group cursor-pointer">
                                <div className="w-12 h-12 rounded-full border border-white/5 bg-stone-900 flex items-center justify-center text-xs font-bold text-stone-500 overflow-hidden ring-2 ring-transparent group-hover:ring-amber-500/20 transition-all relative">
                                    <Image
                                        src={`https://i.pravatar.cc/150?u=${i + 15}`}
                                        alt=""
                                        fill
                                        className="object-cover group-hover:scale-110 transition-all"
                                        unoptimized
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors">User #{i * 123}</p>
                                    <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">Inappropriate Content</p>
                                </div>
                                <div className="w-2 h-2 rounded-full bg-red-500/20 ring-4 ring-red-500/5"></div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-10 py-4 rounded-2xl bg-white/3 border border-white/5 text-white text-xs font-bold hover:bg-amber-500 hover:text-[#0d0d0f] transition-all">
                        View All Reports
                    </button>
                </div>
            </div>
        </div>
    );
}
