'use client';

import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface ChartData {
    date: string;
    revenue: number;
    users: number;
    matches: number;
}

const fmt = (n: number) => n?.toLocaleString('en-IN') ?? '0';

const CustomTooltip = ({ active, payload, label, prefix = '' }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-[#18181b] border border-white/10 rounded-xl px-4 py-3 shadow-2xl text-sm">
            <p className="text-green-400 text-xs mb-1">{label}</p>
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: p.color }} className="font-bold">
                    {p.name}: {prefix}{fmt(p.value)}
                </p>
            ))}
        </div>
    );
};

export function RevenueChart({ data }: { data: ChartData[] }) {
    return (
        <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v}`} />
                <Tooltip content={<CustomTooltip prefix="₹" />} />
                <Area type="monotone" dataKey="revenue" name="Revenue (₹)" stroke="#f59e0b" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: '#f59e0b' }} />
            </AreaChart>
        </ResponsiveContainer>
    );
}

export function GrowthCharts({ data }: { data: ChartData[] }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-linear-to-b from-white/5 to-transparent border border-white/5 p-6 rounded-3xl">
                <div className="mb-6">
                    <h3 className="text-lg font-black text-white">New Signups</h3>
                    <p className="text-stone-500 text-xs mt-1">User registrations per day</p>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="users" name="New Users" fill="#a78bfa" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-linear-to-b from-white/5 to-transparent border border-white/5 p-6 rounded-3xl">
                <div className="mb-6">
                    <h3 className="text-lg font-black text-white">New Matches</h3>
                    <p className="text-stone-500 text-xs mt-1">Mutual matches per day</p>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                        <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="matches" name="New Matches" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
