"use client";

import { useState } from "react";
import Image from "next/image";
import { getReports, updateReportStatus, updateUserBlockStatus } from "@/services/adminService";
import { AdminReportListItem } from "@/types/admin/report";
import { showError, showSuccess } from "@/utils/toast";
import { AlertTriangle, Clock, CheckCircle, XCircle, ExternalLink, ImageIcon, X, User, FileText, Maximize2, ShieldAlert, ShieldCheck, Lock, Unlock } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { ReportStatus } from "@/constants/report";


interface ReportsTableProps {
    initialReports: AdminReportListItem[];
}

export default function ReportsTable({ initialReports }: ReportsTableProps) {
    const [reports, setReports] = useState<AdminReportListItem[]>(initialReports);
    const [loading, setLoading] = useState(false);
    const [selectedReport, setSelectedReport] = useState<AdminReportListItem | null>(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [nextStatus, setNextStatus] = useState<ReportStatus | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [viewDetailsReport, setViewDetailsReport] = useState<AdminReportListItem | null>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [showBlockConfirm, setShowBlockConfirm] = useState(false);

    const handleUpdateStatus = async (report: AdminReportListItem, status: ReportStatus) => {
        setSelectedReport(report);
        setNextStatus(status);
        setShowStatusModal(true);
    };

    const confirmUpdateStatus = async () => {
        if (!selectedReport || !nextStatus) return;

        try {
            setIsProcessing(true);
            const response = await updateReportStatus(selectedReport._id, nextStatus);

            setReports(prev => prev.map(r =>
                r._id === selectedReport._id ? response.data : r
            ));

            showSuccess(`Report marked as ${nextStatus}`);
            setShowStatusModal(false);
            setSelectedReport(null);
            setNextStatus(null);
        } catch (error) {
            console.error("Failed to update report status:", error);
            showError("Failed to update report status.");
        } finally {
            setIsProcessing(false);
        }
    };

    const confirmBlockUser = async () => {
        if (!viewDetailsReport) return;

        try {
            setIsProcessing(true);
            const targetUserId = viewDetailsReport.reportedUser._id;
            const newBlockStatus = !viewDetailsReport.reportedUser.isBlocked;

            await updateUserBlockStatus(targetUserId, newBlockStatus);

            // Update all reports in the list that involve this user (as reported user or reporter)
            setReports(prev => prev.map(r => {
                let updated = { ...r };
                let changed = false;

                if (r.reportedUser._id === targetUserId) {
                    updated.reportedUser = { ...r.reportedUser, isBlocked: newBlockStatus };
                    changed = true;
                }
                if (r.reportedBy._id === targetUserId) {
                    updated.reportedBy = { ...r.reportedBy, isBlocked: newBlockStatus };
                    changed = true;
                }

                return changed ? updated : r;
            }));

            // Also update the current viewing report detail
            setViewDetailsReport(prev => prev ? ({
                ...prev,
                reportedUser: { ...prev.reportedUser, isBlocked: newBlockStatus }
            }) : null);

            showSuccess(`User ${newBlockStatus ? 'blocked' : 'unblocked'} successfully`);
            setShowBlockConfirm(false);
        } catch (error) {
            console.error("Failed to update user block status:", error);
            showError("Failed to update user status.");
        } finally {
            setIsProcessing(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getStatusStyle = (status: ReportStatus) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'resolved':
                return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'dismissed':
                return 'bg-stone-500/10 text-stone-400 border-stone-500/20';
            default:
                return 'bg-white/10 text-white border-white/20';
        }
    };

    const getStatusIcon = (status: ReportStatus) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-3 h-3" />;
            case 'resolved':
                return <CheckCircle className="w-3 h-3" />;
            case 'dismissed':
                return <XCircle className="w-3 h-3" />;
        }
    };

    return (
        <>
            <div className="bg-linear-to-b from-white/5 to-transparent border border-white/5 rounded-2xl overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/3 border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">Reported By</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">Reported User</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">Details</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {reports.map((report) => (
                                <tr key={report._id} className="hover:bg-white/3 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium text-sm">{report.reportedBy.name}</div>
                                        <div className="text-stone-500 text-xs">{report.reportedBy.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-white font-medium text-sm">{report.reportedUser.name}</div>
                                        <div className="text-stone-500 text-xs">{report.reportedUser.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-stone-300 text-sm font-medium">{report.reason}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setViewDetailsReport(report)}
                                            className="flex items-center gap-1.5 text-amber-500 hover:text-amber-400 transition-colors text-xs font-bold bg-amber-500/5 px-3 py-1.5 rounded-lg border border-amber-500/10 hover:border-amber-500/20"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                            View Details
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${getStatusStyle(report.status)}`}>
                                            {getStatusIcon(report.status)}
                                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-stone-400 text-xs">
                                        {formatDate(report.createdAt)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {report.status === 'pending' && (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(report, 'resolved')}
                                                    className="p-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-all"
                                                    title="Resolve"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(report, 'dismissed')}
                                                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                                                    title="Dismiss"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                        {report.status !== 'pending' && (
                                            <span className="text-stone-600 text-xs font-medium italic">Handled</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Confirmation Modal */}
            <ConfirmModal
                isOpen={showStatusModal}
                onClose={() => !isProcessing && setShowStatusModal(false)}
                onConfirm={confirmUpdateStatus}
                title={`${nextStatus === 'resolved' ? 'Resolve' : 'Dismiss'} Report`}
                message={`Are you sure you want to mark this report as ${nextStatus}? This action cannot be undone.`}
                confirmText={nextStatus === 'resolved' ? 'Resolve' : 'Dismiss'}
                cancelText="Cancel"
                variant={nextStatus === 'resolved' ? 'success' : 'danger'}
                isLoading={isProcessing}
            />

            {/* Block User Confirmation Modal */}
            <ConfirmModal
                isOpen={showBlockConfirm}
                onClose={() => !isProcessing && setShowBlockConfirm(false)}
                onConfirm={confirmBlockUser}
                title={`${viewDetailsReport?.reportedUser.isBlocked ? 'Unblock' : 'Block'} User?`}
                message={`Are you sure you want to ${viewDetailsReport?.reportedUser.isBlocked ? 'unblock' : 'block'} ${viewDetailsReport?.reportedUser.name}? ${viewDetailsReport?.reportedUser.isBlocked ? 'They will regain access to Spark.' : 'They will lose all access to their account immediately.'}`}
                confirmText={viewDetailsReport?.reportedUser.isBlocked ? 'Unblock User' : 'Block User'}
                cancelText="Cancel"
                variant={viewDetailsReport?.reportedUser.isBlocked ? 'success' : 'danger'}
                isLoading={isProcessing}
            />

            {/* Report Details Modal */}
            {viewDetailsReport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setViewDetailsReport(null)}
                    />

                    <div className="relative w-full max-w-2xl bg-[#121214] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight">Report Details</h3>
                                    <p className="text-xs text-stone-500 font-medium">Reviewing report for {viewDetailsReport.reportedUser.name}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewDetailsReport(null)}
                                className="p-2 hover:bg-white/5 rounded-full text-stone-500 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            {/* Infomation Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider font-black text-stone-500">Report Reason</p>
                                    <p className="text-sm font-bold text-amber-500">{viewDetailsReport.reason}</p>
                                </div>
                                <div className="p-4 bg-white/3 border border-white/5 rounded-xl space-y-1">
                                    <p className="text-[10px] uppercase tracking-wider font-black text-stone-500">Filed On</p>
                                    <p className="text-sm font-bold text-stone-300">{formatDate(viewDetailsReport.createdAt)}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-stone-400 font-bold text-xs uppercase tracking-widest">
                                    <FileText className="w-3.5 h-3.5" />
                                    Detailed Description
                                </div>
                                <div className="p-5 bg-white/3 border border-white/5 rounded-2xl">
                                    <p className="text-stone-300 text-sm leading-relaxed whitespace-pre-wrap">
                                        {viewDetailsReport.description || "The reporter did not provide a detailed description."}
                                    </p>
                                </div>
                            </div>

                            {/* Evidence Image */}
                            {viewDetailsReport.image && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-stone-400 font-bold text-xs uppercase tracking-widest">
                                        <ImageIcon className="w-3.5 h-3.5" />
                                        Evidence Screenshot
                                    </div>
                                    <div
                                        className="relative aspect-video w-full bg-black/40 border border-white/5 rounded-2xl overflow-hidden group cursor-zoom-in"
                                        onClick={() => setLightboxImage(viewDetailsReport.image!)}
                                    >
                                        <Image
                                            src={viewDetailsReport.image}
                                            alt="Evidence"
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div
                                                className="px-4 py-2 bg-white text-black text-xs font-black rounded-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                                            >
                                                <Maximize2 className="w-3.5 h-3.5" />
                                                Enlarge Evidence
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-white/3 border-t border-white/5 flex items-center justify-between">
                            <button
                                onClick={() => setShowBlockConfirm(true)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold border transition-all hover:scale-105 active:scale-95 ${viewDetailsReport.reportedUser.isBlocked
                                    ? "bg-stone-500/10 text-stone-300 border-stone-500/20 hover:bg-stone-500/20"
                                    : "bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20"
                                    }`}
                            >
                                {viewDetailsReport.reportedUser.isBlocked ? (
                                    <>
                                        <Unlock className="w-4 h-4" />
                                        Unblock User
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-4 h-4" />
                                        Block Reported User
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => setViewDetailsReport(null)}
                                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-bold rounded-xl border border-white/10 transition-all"
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Evidence Lightbox */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-100 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:scale-110 z-110"
                        onClick={() => setLightboxImage(null)}
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <div className="relative w-full h-full max-w-6xl max-h-[90vh] animate-in zoom-in-95 duration-300">
                        <Image
                            src={lightboxImage}
                            alt="Evidence Fullscreen"
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                </div>
            )}
        </>
    );
}
