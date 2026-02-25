"use client";

import { ReactNode } from "react";

export interface Column<T> {
    header: string;
    key?: string;
    className?: string;
    render: (item: T, index: number) => ReactNode;
}

interface TableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    loadingMessage?: string;
    emptyMessage?: string;
    emptyIcon?: ReactNode;
    className?: string;
}

export default function Table<T>({
    data,
    columns,
    loading = false,
    loadingMessage = "Loading data...",
    emptyMessage = "No data found.",
    emptyIcon,
    className = "",
}: TableProps<T>) {
    return (
        <div className={`space-y-4 ${className}`}>
            {loading ? (
                <div className="flex items-center justify-center py-20 bg-white/3 border border-white/5 rounded-2xl">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
                        <div className="text-stone-500 text-sm font-medium">{loadingMessage}</div>
                    </div>
                </div>
            ) : data.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/3 border border-white/5 rounded-2xl text-center px-4">
                    {emptyIcon && <div className="mb-4 text-stone-700">{emptyIcon}</div>}
                    <p className="text-stone-500 text-sm font-medium max-w-xs mx-auto">
                        {emptyMessage}
                    </p>
                </div>
            ) : (
                <div className="bg-linear-to-b from-white/5 to-transparent border border-white/5 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-white/3 border-b border-white/5">
                                <tr>
                                    {columns.map((column, index) => (
                                        <th
                                            key={index}
                                            className={`px-6 py-4 text-left text-xs font-bold text-stone-400 uppercase tracking-wider ${column.className || ""}`}
                                        >
                                            {column.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {data.map((item, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className="hover:bg-white/3 transition-colors group"
                                    >
                                        {columns.map((column, colIndex) => (
                                            <td key={colIndex} className="px-6 py-4">
                                                {column.render(item, rowIndex)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
