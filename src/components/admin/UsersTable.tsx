"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { getAllUsers, updateUserBlockStatus } from "@/services/adminService";
import { User, Pagination } from "@/types/admin/userList/response";
import { showError, showSuccess } from "@/utils/toast";
import { Users, Search, Mail, Calendar, Shield, ShieldOff, CheckCircle, XCircle, Crown } from "lucide-react";
import ConfirmModal from "@/components/ui/ConfirmModal";
import TablePagination from "./TablePagination";


import Table, { Column } from "@/components/ui/Table";

interface UsersTableProps {
    initialUsers: User[];
    initialPagination: Pagination;
}

export default function UsersTable({ initialUsers, initialPagination }: UsersTableProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [users, setUsers] = useState<User[]>(initialUsers);
    const [pagination, setPagination] = useState<Pagination>(initialPagination);

    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [currentPage, setCurrentPage] = useState(initialPagination.page);

    const [showBlockModal, setShowBlockModal] = useState(false);
    const [showUnblockModal, setShowUnblockModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchUsers = useCallback(async (page: number, search: string) => {
        try {
            setLoading(true);
            const response = await getAllUsers({
                search: search || undefined,
                page,
                limit: 5
            });
            setUsers(response.data.users);
            setPagination(response.data.pagination);

            const params = new URLSearchParams();
            if (search) params.set('search', search);
            if (page > 1) params.set('page', page.toString());
            const newUrl = params.toString() ? `?${params.toString()}` : '';
            router.replace(`/admin/users${newUrl}`, { scroll: false });
        } catch (error) {
            console.error("Failed to fetch users:", error);
            showError("Failed to load users. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(currentPage, searchQuery);
        }, searchQuery ? 500 : 0);

        return () => clearTimeout(timer);
    }, [currentPage, searchQuery, fetchUsers]);

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
        } catch {
            setUsers(originalUsers);
            setShowBlockModal(true);
            setSelectedUser(userToUpdate);
            showError(`Failed to ${block ? "block" : "unblock"} user ${userToUpdate.name}. Please try again.`);
        } finally {
            setIsProcessing(false);
        }
    };

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

    // Define table columns
    const columns: Column<User>[] = [
        {
            header: "User",
            render: (user) => (
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
                        <div className="text-white font-medium text-sm">{user.name}</div>
                        <div className="text-stone-500 text-xs">ID: {user._id.slice(-8)}</div>
                    </div>
                </div>
            )
        },
        {
            header: "Email",
            render: (user) => (
                <div className="flex items-center gap-2 text-stone-300 text-sm">
                    <Mail className="w-4 h-4 text-stone-500" />
                    {user.email}
                </div>
            )
        },
        {
            header: "Status",
            render: (user) => (
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
            )
        },
        {
            header: "Plan",
            render: (user) => (
                <div className="flex items-center">
                    {user.plan === 'Free' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-500/10 text-stone-400 text-xs font-bold border border-stone-500/20">
                            {user.plan}
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                            <Crown className="w-3.5 h-3.5" />
                            {user.plan}
                        </span>
                    )}
                </div>
            )
        },
        {
            header: "Joined",
            render: (user) => (
                <div className="flex items-center gap-2 text-stone-400 text-sm">
                    <Calendar className="w-4 h-4 text-stone-500" />
                    {formatDate(user.createdAt)}
                </div>
            )
        },
        {
            header: "Actions",
            render: (user) => (
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
            )
        }
    ];

    return (
        <div className="space-y-6">
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

            <Table
                data={users}
                columns={columns}
                loading={loading}
                loadingMessage="Fetching users..."
                emptyMessage={searchQuery ? "No users found matching your search." : "No users have joined yet."}
                emptyIcon={<Users className="w-12 h-12" />}
            />

            {!loading && users.length > 0 && (
                <TablePagination
                    pagination={pagination}
                    currentPage={currentPage}
                    loading={loading}
                    onPageChange={handlePageChange}
                    itemName="users"
                />
            )}

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

