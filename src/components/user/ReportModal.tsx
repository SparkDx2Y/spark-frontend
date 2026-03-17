'use client';

import { useState } from 'react';
import Modal from '@/components/ui/Modal';
import { createReport } from '@/services/reportService';
import { uploadFile } from '@/services/fileService';
import { showSuccess, showError, handleApiError } from '@/utils/toast';
import { Loader2, AlertTriangle, Upload, X } from 'lucide-react';
import { REPORT_REASONS, ReportReason } from '@/constants/report';

interface ReportModalProps {
    isOpen: boolean;
    onClose: () => void;
    reportedUserId: string | null;
}

export default function ReportModal({ isOpen, onClose, reportedUserId }: ReportModalProps) {
    const [reason, setReason] = useState<ReportReason>(REPORT_REASONS[0]);
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reportedUserId) return;

        try {
            setLoading(true);

            let imageUrl = undefined;
            if (selectedFile) {
                try {
                    imageUrl = await uploadFile(selectedFile);
                } catch (error) {
                    console.error('Failed to upload evidence', error);
                    showError('Failed to upload image, but continuing with report.');
                }
            }

            await createReport({
                reportedUser: reportedUserId,
                reason,
                description,
                image: imageUrl
            });
            showSuccess('Report submitted successfully. We will review it shortly.');
            onClose();
            setDescription('');
            setReason(REPORT_REASONS[0]);
            setSelectedFile(null);
        } catch (error: unknown) {
            console.error('Failed to submit report', error);
            handleApiError(error, 'Failed to submit report. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} showCloseButton={true}>
            <div className="p-6 bg-gray-900 border border-gray-800 rounded-2xl max-w-md w-full">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-red-500/10 rounded-full">
                        <AlertTriangle className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Report User</h2>
                        <p className="text-gray-400 text-sm">Help us keep Spark safe.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Reason</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value as ReportReason)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        >
                            {REPORT_REASONS.map((r) => (
                                <option key={r} value={r}>
                                    {r}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Description <span className="text-gray-500">(Optional)</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Please provide more details..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Evidence <span className="text-gray-500">(Optional Screenshot)</span>
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="report-evidence"
                            />
                            <label
                                htmlFor="report-evidence"
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl cursor-pointer hover:bg-gray-700 transition"
                            >
                                <Upload className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-300">
                                    {selectedFile ? 'Change Image' : 'Upload Image'}
                                </span>
                            </label>
                            {selectedFile && (
                                <span className="text-sm text-gray-400 truncate max-w-[150px]">
                                    {selectedFile.name}
                                </span>
                            )}
                            {selectedFile && (
                                <button
                                    type="button"
                                    onClick={() => setSelectedFile(null)}
                                    className="p-1 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>


                    <div className="pt-4 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
