"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface TablePaginationProps {
    pagination: Pagination;
    currentPage: number;
    loading?: boolean;
    onPageChange: (page: number) => void;
    itemName?: string;
}

export default function TablePagination({ pagination, currentPage, loading = false, onPageChange, itemName = "items" }: TablePaginationProps) {

    // Don't render if there's only one page
    if (pagination.totalPages <= 1) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/3 border border-white/5 rounded-xl px-6 py-4">
            {/* Page info text */}
            <div className="text-stone-400 text-sm">
                Showing <span className="text-stone-200">{((currentPage - 1) * pagination.limit) + 1}</span> to <span className="text-stone-200">{Math.min(currentPage * pagination.limit, pagination.total)}</span> of <span className="text-stone-200">{pagination.total}</span> {itemName}
            </div>

            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="px-3 py-2 rounded-lg bg-white/3 border border-white/5 text-stone-300 text-sm font-bold hover:bg-white/8 hover:border-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden xs:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                        .filter(page => {
                            if (page === 1 || page === pagination.totalPages) return true;
                            if (Math.abs(page - currentPage) <= 1) return true;
                            return false;
                        })
                        .map((page, index, array) => {
                            const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;

                            return (
                                <div key={page} className="flex items-center gap-1">
                                    {showEllipsisBefore && (
                                        <span className="px-2 text-stone-500" aria-hidden="true">...</span>
                                    )}
                                    <button
                                        onClick={() => onPageChange(page)}
                                        disabled={currentPage === page || loading}
                                        className={`min-w-[40px] h-10 px-3 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${currentPage === page
                                            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                            : "bg-white/3 border border-white/5 text-stone-300 hover:bg-white/8 hover:border-white/10"
                                            }`}
                                        aria-current={currentPage === page ? "page" : undefined}
                                    >
                                        {page}
                                    </button>
                                </div>
                            );
                        })}
                </div>

                {/* Next Button */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages || loading}
                    className="px-3 py-2 rounded-lg bg-white/3 border border-white/5 text-stone-300 text-sm font-bold hover:bg-white/8 hover:border-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                    aria-label="Next page"
                >
                    <span className="hidden xs:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
