'use client';

import { useEffect, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { getDashboardStats } from '@/services/adminService';
import { DashboardStats } from '@/types/admin/dashboard';
import { Users, Sparkles, IndianRupee, TrendingUp, GitMerge, Calendar, RefreshCw } from 'lucide-react';


const RevenueChart = dynamic(() => import('@/components/admin/DashboardCharts').then(mod => mod.RevenueChart), {
    ssr: false,
    loading: () => <div className="h-[260px] w-full bg-white/5 animate-pulse rounded-xl" />
});

const GrowthCharts = dynamic(() => import('@/components/admin/DashboardCharts').then(mod => mod.GrowthCharts), {
    ssr: false,
    loading: () => <div className="h-[220px] w-full bg-white/5 animate-pulse rounded-xl" />
});

type RangePreset = '7d' | '30d' | '90d' | '1y' | 'custom';

const fmt = (n: number) => n?.toLocaleString('en-IN') ?? '0';
const fmtMoney = (n: number) => `₹${fmt(n)}`;
const shortDate = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

function getRange(preset: RangePreset): { from: string; to: string } {
    const to = new Date();
    const from = new Date();
    if (preset === '7d') from.setDate(to.getDate() - 7);
    else if (preset === '30d') from.setDate(to.getDate() - 30);
    else if (preset === '90d') from.setDate(to.getDate() - 90);
    else if (preset === '1y') from.setFullYear(to.getFullYear() - 1);
    return {
        from: from.toISOString().split('T')[0],
        to: to.toISOString().split('T')[0],
    };
}

function StatCard({
    label, value, sub, icon: Icon, color, bg
}: {
    label: string; value: string; sub?: string; icon: React.ElementType;
    color: string; bg: string; positive?: boolean;
}) {
    return (
        <div className="bg-linear-to-b from-white/5 to-white/1 border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className="flex justify-between items-start relative z-10">
                <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center border border-white/5`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
            </div>
            <div className="mt-4 relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tight">{value}</h3>
                <p className="text-[10px] text-stone-500 font-black uppercase tracking-widest mt-1">{label}</p>
                {sub && <p className="text-[10px] text-stone-400 mt-1">{sub}</p>}
            </div>
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/2 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
    );
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [preset, setPreset] = useState<RangePreset>('30d');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');

    const fetchStats = useCallback(async () => {
        setLoading(true);
        try {
            let from: string, to: string;
            if (preset === 'custom' && customFrom && customTo) {
                from = customFrom; to = customTo;
            } else if (preset !== 'custom') {
                ({ from, to } = getRange(preset));
            } else return;

            const response = await getDashboardStats({ from, to });
            setStats(response.data);
        } catch (err) {
            console.error('Failed to load dashboard stats', err);
        } finally {
            setLoading(false);
        }
    }, [preset, customFrom, customTo]);

    useEffect(() => { fetchStats(); }, [fetchStats]);

    const presets: { key: RangePreset; label: string }[] = [
        { key: '7d', label: 'Last 7 Days' },
        { key: '30d', label: 'Last 30 Days' },
        { key: '90d', label: 'Last 3 Months' },
        { key: '1y', label: 'Last Year' },
        { key: 'custom', label: 'Custom' },
    ];

    const presetLabel = presets.find(p => p.key === preset)?.label ?? '';

    
    const formattedChartData = stats?.chartData.map(d => ({
        ...d,
        date: shortDate(d.date)
    })) || [];

    return (
        <div className="space-y-8 pb-12">
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-stone-500 font-medium mt-1 text-sm">
                        Monitoring Spark platform activities and health.
                    </p>
                </div>

                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-stone-300 text-xs font-bold hover:bg-white/10 transition-all"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {/* ── Date Range Filters  */}
            <div className="flex flex-wrap items-center gap-3">
                <Calendar className="w-4 h-4 text-stone-500" />
                <div className="flex flex-wrap gap-2">
                    {presets.map(p => (
                        <button
                            key={p.key}
                            onClick={() => setPreset(p.key)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${preset === p.key
                                ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                                : 'bg-white/5 border border-white/5 text-stone-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>

                {preset === 'custom' && (
                    <div className="flex items-center gap-2 mt-1">
                        <input
                            type="date"
                            value={customFrom}
                            onChange={e => setCustomFrom(e.target.value)}
                            className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500/50"
                        />
                        <span className="text-stone-500 text-xs">to</span>
                        <input
                            type="date"
                            value={customTo}
                            onChange={e => setCustomTo(e.target.value)}
                            className="bg-white/5 border border-white/10 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500/50"
                        />
                        <button
                            onClick={fetchStats}
                            disabled={!customFrom || !customTo}
                            className="px-4 py-1.5 bg-amber-500 text-black text-xs font-black rounded-lg disabled:opacity-50"
                        >
                            Apply
                        </button>
                    </div>
                )}
            </div>

            {/* Stat Cards */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-36 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        label="Total Users"
                        value={fmt(stats.totalUsers)}
                        sub={`+${fmt(stats.newUsers)} this period`}
                        icon={Users}
                        color="text-amber-400"
                        bg="bg-amber-500/10"
                    />
                    <StatCard
                        label="Premium Users"
                        value={fmt(stats.premiumUsers)}
                        sub={`${fmt(stats.activeSubscriptions)} active`}
                        icon={Sparkles}
                        color="text-purple-400"
                        bg="bg-purple-500/10"
                    />
                    <StatCard
                        label={`Revenue (${presetLabel})`}
                        value={fmtMoney(stats.revenueInRange)}
                        sub={`Total: ${fmtMoney(stats.totalRevenue)}`}
                        icon={IndianRupee}
                        color="text-emerald-400"
                        bg="bg-emerald-500/10"
                    />
                    <StatCard
                        label="Matches Made"
                        value={fmt(stats.totalMatches)}
                        sub={`+${fmt(stats.newMatches)} this period`}
                        icon={GitMerge}
                        color="text-sky-400"
                        bg="bg-sky-500/10"
                    />
                </div>
            ) : null}

            {/* ── Charts Row  */}
            {!loading && stats && formattedChartData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Revenue Area Chart */}
                    <div className="lg:col-span-2 bg-linear-to-b from-white/5 to-transparent border border-white/5 p-6 rounded-3xl">
                        <div className="mb-6">
                            <h3 className="text-lg font-black text-white">Revenue Over Time</h3>
                            <p className="text-stone-500 text-xs mt-1">{presetLabel} revenue breakdown</p>
                        </div>
                        <RevenueChart data={formattedChartData} />
                    </div>

                    {/* Subscription Breakdown */}
                    <div className="bg-linear-to-b from-white/5 to-transparent border border-white/5 p-6 rounded-3xl flex flex-col">
                        <h3 className="text-lg font-black text-white mb-6">Subscription Status</h3>
                        <div className="flex-1 space-y-5">
                            {[
                                { label: 'Active', value: stats.activeSubscriptions, total: stats.activeSubscriptions + stats.expiredSubscriptions, color: 'bg-emerald-500', text: 'text-emerald-400' },
                                { label: 'Expired', value: stats.expiredSubscriptions, total: stats.activeSubscriptions + stats.expiredSubscriptions, color: 'bg-red-500', text: 'text-red-400' },
                            ].map(item => {
                                const pct = item.total > 0 ? Math.round((item.value / item.total) * 100) : 0;
                                return (
                                    <div key={item.label}>
                                        <div className="flex justify-between text-xs mb-2">
                                            <span className={`font-bold ${item.text}`}>{item.label}</span>
                                            <span className="text-stone-400 font-bold">{fmt(item.value)} <span className="text-stone-600">({pct}%)</span></span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className={`h-full ${item.color} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Quick summary */}
                        <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
                            {[
                                { label: 'Total Users', value: fmt(stats.totalUsers), icon: Users },
                                { label: 'New This Period', value: fmt(stats.newUsers), icon: TrendingUp },
                                { label: 'Total Revenue', value: fmtMoney(stats.totalRevenue), icon: IndianRupee },
                            ].map(({ label, value, icon: Icon }) => (
                                <div key={label} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-2 text-stone-500">
                                        <Icon className="w-3.5 h-3.5" />
                                        {label}
                                    </div>
                                    <span className="font-black text-white">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ── User & Match Growth Charts */}
            {!loading && stats && formattedChartData.length > 0 && (
                <GrowthCharts data={formattedChartData} />
            )}

            
            {!loading && stats && formattedChartData.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center bg-white/2 border border-white/5 rounded-3xl">
                    <TrendingUp className="w-12 h-12 text-stone-700 mb-4" />
                    <h3 className="text-white font-bold mb-2">No activity in this range</h3>
                    <p className="text-stone-500 text-sm">Try selecting a wider date range to see data.</p>
                </div>
            )}
        </div>
    );
}
