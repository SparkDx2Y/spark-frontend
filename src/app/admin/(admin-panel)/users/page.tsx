"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getAllUsers, updateUserBlockStatus, User, Pagination } from "@/services/adminService";
import { showError, showSuccess } from "@/utils/toast";
import { Users, Search, Mail, Calendar, Shield, ShieldOff, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AdminUsersPage() {
    // Data states
    const [users, setUsers] = useState<User[]>([]); 
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    }); // Pagination info (total users, total pages, etc.)

    // UI states
    const [loading, setLoading] = useState(true); // Shows loading spinner when fetching users
    const [searchQuery, setSearchQuery] = useState(""); 
    const [currentPage, setCurrentPage] = useState(1); 

    // Modal states
    const [showBlockModal, setShowBlockModal] = useState(false); 
    const [showUnblockModal, setShowUnblockModal] = useState(false); 
    const [selectedUser, setSelectedUser] = useState<User | null>(null); // Which user is being blocked/unblocked
    const [isProcessing, setIsProcessing] = useState(false); // Shows loading in modal during block/unblock action

    const fetchUsers = useCallback(async (page: number, search: string) => {
        try {
            setLoading(true);
            const response = await getAllUsers({
                search: search || undefined,
                page,
                limit: 10
            });
            setUsers(response.data.users);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error("Failed to fetch users:", error);
            showError("Failed to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounce search to wait for user to finish typing
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(currentPage, searchQuery);
        }, searchQuery ? 500 : 0); 

        return () => clearTimeout(timer);
    }, [currentPage, searchQuery, fetchUsers]);

    // Format date to display in the table
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };



    const handleToggleClick = (user: User, block: boolean) => {
        setSelectedUser(user);
        if (block) {
            setShowBlockModal(true);
        } else {
            setShowUnblockModal(true);
        }
    };
    


    const handleToggleBlockStatus = async (block: boolean) => {
        if (!selectedUser) return;

        const originalUsers = [...users];
        const userToUpdate = selectedUser;

        try {
            setIsProcessing(true);
            setUsers(users.map(user => 
                user._id === userToUpdate._id 
                    ? { ...user, isBlocked: block }
                    : user
            ));

            setShowBlockModal(false);
            setShowUnblockModal(false);
            setSelectedUser(null);

            await updateUserBlockStatus(userToUpdate._id, block);
            showSuccess(`User ${userToUpdate.name} has been ${block ? "blocked" : "unblocked"} successfully`);
        } catch  {
            setUsers(originalUsers);
            setShowBlockModal(true);
            setSelectedUser(userToUpdate);
            showError(`Failed to ${block ? "block" : "unblock"} user ${userToUpdate.name}. Please try again.`);
        } finally {
            setIsProcessing(false);
        }
    }   


    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleModalClose = () => {
        if (!isProcessing) {
            setShowBlockModal(false);
            setShowUnblockModal(false);
            setSelectedUser(null);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
                    <p className="text-stone-500 font-medium mt-1 text-sm">
                        Manage and monitor all registered users on the platform.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white/3 border border-white/5 px-4 py-2.5 rounded-xl text-stone-300 text-xs font-bold flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {pagination.total} Total Users
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-12 pr-4 py-3 bg-white/3 border border-white/5 rounded-xl text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/5 transition-all"
                />
            </div>

            {/* Users Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-stone-500 text-sm font-medium">Loading users...</div>
                </div>
            ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/3 border border-white/5 rounded-2xl">
                    <Users className="w-12 h-12 text-stone-700 mb-4" />
                    <p className="text-stone-500 text-sm font-medium">
                        {searchQuery ? "No users found matching your search." : "No users found."}
                    </p>
                </div>
            ) : (
                <>
                    <div className="bg-linear-to-b from-white/5 to-transparent border border-white/5 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/3 border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">
                                            Joined
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-stone-400 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map((user) => (
                                    <tr
                                        key={user._id}
                                        className="hover:bg-white/3 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-bold text-sm shrink-0">
                                                    {user.profilePhoto ? (
                                                        <Image
                                                            src={user.profilePhoto}
                                                            alt={user.name}
                                                            width={40}
                                                            height={40}
                                                            className="w-full h-full object-cover"
                                                            unoptimized
                                                        />
                                                    ) : (
                                                        <span>{user.name.charAt(0).toUpperCase()}</span>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium text-sm">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-stone-500 text-xs">
                                                        ID: {user._id.slice(-8)}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-stone-300 text-sm">
                                                <Mail className="w-4 h-4 text-stone-500" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {user.isVerified ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Verified
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs font-bold border border-yellow-500/20">
                                                        <XCircle className="w-3 h-3" />
                                                        Unverified
                                                    </span>
                                                )}
                                                {user.isBlocked ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20">
                                                        <ShieldOff className="w-3 h-3" />
                                                        Blocked
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-500/10 text-stone-400 text-xs font-bold border border-stone-500/20">
                                                        <Shield className="w-3 h-3" />
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-stone-400 text-sm">
                                                <Calendar className="w-4 h-4 text-stone-500" />
                                                {formatDate(user.createdAt)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {user.isBlocked ? (
                                                    <button
                                                        onClick={() => handleToggleClick(user, false)}
                                                        className="px-4 py-2 rounded-lg bg-green-500/10 text-green-400 text-xs font-bold border border-green-500/20 hover:bg-green-500/20 hover:border-green-500/40 transition-all flex items-center gap-1.5"
                                                    >
                                                        <Shield className="w-3 h-3" />
                                                        Unblock
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleToggleClick(user, true)}
                                                        className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 transition-all flex items-center gap-1.5"
                                                    >
                                                        <ShieldOff className="w-3 h-3" />
                                                        Block
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex items-center justify-between bg-white/3 border border-white/5 rounded-xl px-6 py-4">
                            <div className="text-stone-400 text-sm">
                                Showing {((currentPage - 1) * pagination.limit) + 1} to {Math.min(currentPage * pagination.limit, pagination.total)} of {pagination.total} users
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1 || loading}
                                    className="px-3 py-2 rounded-lg bg-white/3 border border-white/5 text-stone-300 text-sm font-bold hover:bg-white/8 hover:border-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Previous
                                </button>
                                
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                                        .filter(page => {
                                            // Show first page, last page, current page, and pages around current
                                            if (page === 1 || page === pagination.totalPages) return true;
                                            if (Math.abs(page - currentPage) <= 1) return true;
                                            return false;
                                        })
                                        .map((page, index, array) => {
                                            // Add ellipsis if there's a gap
                                            const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                                            return (
                                                <div key={page} className="flex items-center gap-1">
                                                    {showEllipsisBefore && (
                                                        <span className="px-2 text-stone-500">...</span>
                                                    )}
                                                    <button
                                                        onClick={() => handlePageChange(page)}
                                                        disabled={currentPage === page}
                                                        className={`px-3 py-2 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                                            currentPage === page
                                                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                                                                : "bg-white/3 border border-white/5 text-stone-300 hover:bg-white/8 hover:border-white/10"
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagination.totalPages}
                                    className="px-3 py-2 rounded-lg bg-white/3 border border-white/5 text-stone-300 text-sm font-bold hover:bg-white/8 hover:border-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                                >
                                    Next
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Block Confirmation Modal */}
            <ConfirmModal
                isOpen={showBlockModal}
                onClose={handleModalClose}
                onConfirm={() => handleToggleBlockStatus(true)}
                title="Block User"
                message={`Are you sure you want to block ${selectedUser?.name}? They will not be able to access the platform.`}
                confirmText="Block User"
                cancelText="Cancel"
                variant="danger"
                isLoading={isProcessing}
            />

            {/* Unblock Confirmation Modal */}
            <ConfirmModal
                isOpen={showUnblockModal}
                onClose={handleModalClose}
                onConfirm={() => handleToggleBlockStatus(false)}
                title="Unblock User"
                message={`Are you sure you want to unblock ${selectedUser?.name}? They will regain access to the platform.`}
                confirmText="Unblock User"
                cancelText="Cancel"
                variant="success"
                isLoading={isProcessing}
            />
        </div>
    );
}

