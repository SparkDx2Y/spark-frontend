"use client";

import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Sparkles, Layers, Search, FolderPlus, AlertCircle, Edit2, CheckCircle2, XCircle } from "lucide-react";
import { getAllCategories, getAllInterests, createCategory, createInterest, updateCategory, updateInterest, setCategoryActive, setInterestActive } from "@/services/adminService";

import { Category, Interest } from "@/types/admin/interest";
import { createCategorySchema, createInterestSchema, CreateCategoryInput, CreateInterestInput } from "@/validations/adminInterest";
import { showSuccess, showError } from "@/utils/toast";
import Modal from "@/components/ui/Modal";

interface InterestsManagerProps {
    initialCategories: Category[];
    initialInterests: Interest[];
}

interface ConfirmState {
    isOpen: boolean;
    type: "category" | "interest";
    item: Category | Interest | null;
}

export default function InterestsManager({ initialCategories, initialInterests }: InterestsManagerProps) {

    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [interests, setInterests] = useState<Interest[]>(initialInterests);
    const [isLoading, setIsLoading] = useState(false);

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isInterestModalOpen, setIsInterestModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [confirmState, setConfirmState] = useState<ConfirmState>({
        isOpen: false,
        type: "category",
        item: null
    });

    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editingInterest, setEditingInterest] = useState<Interest | null>(null);

    // Search
    const [searchTerm, setSearchTerm] = useState("");

    // Category Form
    const { register: registerCategory, handleSubmit: handleSubmitCategory, reset: resetCategory, setValue: setCategoryValue, formState: { errors: categoryErrors } } = useForm<CreateCategoryInput>({
        resolver: zodResolver(createCategorySchema)
    });

    // Interest Form
    const { register: registerInterest, handleSubmit: handleSubmitInterest, reset: resetInterest, setValue: setInterestValue, formState: { errors: interestErrors } } = useForm<CreateInterestInput>({
        resolver: zodResolver(createInterestSchema)
    });

    /**
     * Client-side fetch to refresh data after mutations (Create/Update/Toggle)
     */
    const refreshData = async () => {
        try {
            // No need to show loader for quick refreshes
            const [catsRes, intsRes] = await Promise.all([
                getAllCategories(),
                getAllInterests()
            ]);
            setCategories(catsRes.data);
            setInterests(intsRes.data || []);
        } catch (error) {
            console.error("Failed to fetch fresh data", error);
        }
    };

    // CONFIRMATION HANDLER
    const handleToggleConfirm = async () => {
        if (!confirmState.item) return;

        setIsSubmitting(true);
        const item = confirmState.item;
        const newStatus = !item.isActive;

        try {
            if (confirmState.type === "category") {
                await setCategoryActive(item.id, { isActive: newStatus });
            } else {
                await setInterestActive(item.id, { isActive: newStatus });
            }

            showSuccess(`${confirmState.type === 'category' ? 'Category' : 'Interest'} ${newStatus ? 'activated' : 'deactivated'}`);
            refreshData(); // Refresh list after update
            setConfirmState({ isOpen: false, type: "category", item: null });
        } catch (error: any) {
            showError(error.response?.data?.message || "Operation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    // CATEGORY HANDLERS
    const onCategorySubmit = async (data: CreateCategoryInput) => {
        setIsSubmitting(true);
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, data);
                showSuccess("Category updated successfully");
            } else {
                await createCategory(data);
                showSuccess("Category created successfully");
            }
            closeCategoryModal();
            refreshData();
        } catch (error: any) {
            const message = error.response?.data?.message || "Operation failed";
            showError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const requestToggleCategory = (category: Category) => {
        setConfirmState({
            isOpen: true,
            type: "category",
            item: category
        });
    };

    const openEditCategory = (category: Category) => {
        setEditingCategory(category);
        setCategoryValue("name", category.name);
        setIsCategoryModalOpen(true);
    };

    const closeCategoryModal = () => {
        setIsCategoryModalOpen(false);
        setEditingCategory(null);
        resetCategory();
    };

    // INTEREST HANDLERS
    const onInterestSubmit = async (data: CreateInterestInput) => {
        setIsSubmitting(true);
        try {
            if (editingInterest) {
                await updateInterest(editingInterest.id, { name: data.name });
                showSuccess("Interest updated successfully");
            } else {
                await createInterest(data);
                showSuccess("Interest created successfully");
            }
            closeInterestModal();
            refreshData();
        } catch (error: any) {
            const message = error.response?.data?.message || "Operation failed";
            showError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const requestToggleInterest = (interest: Interest) => {
        setConfirmState({
            isOpen: true,
            type: "interest",
            item: interest
        });
    };

    const openEditInterest = (interest: Interest) => {
        setEditingInterest(interest);
        setInterestValue("name", interest.name);
        setInterestValue("categoryId", interest.categoryId);
        setIsInterestModalOpen(true);
    };

    const closeInterestModal = () => {
        setIsInterestModalOpen(false);
        setEditingInterest(null);
        resetInterest();
    };

    const filteredInterests = interests.filter(interest =>
        interest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        interest.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-end items-center gap-3">
                <button
                    onClick={() => setIsCategoryModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-white/3 border border-white/5 text-stone-300 text-xs font-bold hover:bg-white/8 hover:text-white transition-all flex items-center gap-2"
                >
                    <FolderPlus className="w-4 h-4" />
                    Add Category
                </button>
                <button
                    onClick={() => setIsInterestModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold hover:bg-amber-500/20 transition-all flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Interest
                </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Categories Column */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-stone-500" />
                            <h2 className="text-lg font-bold text-white tracking-tight">Categories</h2>
                        </div>
                        <span className="text-xs font-bold px-2 py-1 rounded-md bg-white/5 text-stone-400 border border-white/5">
                            {categories.length}
                        </span>
                    </div>

                    <div className="bg-linear-to-b from-white/5 to-transparent border border-white/5 rounded-2xl overflow-hidden">
                        {categories.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-stone-500 text-sm font-medium">No categories found.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {categories.map((category) => (
                                    <div key={category.id} className="p-4 flex items-center justify-between hover:bg-white/3 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-stone-400 group-hover:text-amber-500 group-hover:border-amber-500/20 transition-colors">
                                                <Layers className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-medium text-stone-300 group-hover:text-white transition-colors">
                                                {category.name}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEditCategory(category)}
                                                className="p-1.5 rounded-lg hover:bg-white/5 text-stone-500 hover:text-white transition-all"
                                                title="Edit Category"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => requestToggleCategory(category)}
                                                className={`p-1.5 rounded-lg hover:bg-white/5 transition-all ${category.isActive ? 'text-green-500' : 'text-red-500'}`}
                                                title={category.isActive ? "Deactivate" : "Activate"}
                                            >
                                                {category.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Interests Column */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-1">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-stone-500" />
                            <h2 className="text-lg font-bold text-white tracking-tight">Interests</h2>
                            <span className="text-xs font-bold px-2 py-1 rounded-md bg-white/5 text-stone-400 border border-white/5 ml-2">
                                {interests.length}
                            </span>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                            <input
                                type="text"
                                placeholder="Search interests..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white/3 border border-white/5 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500/50 focus:bg-white/5 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredInterests.map((interest) => {
                            const categoryName = interest.category?.name || 'Unknown';

                            return (
                                <div key={interest.id} className="p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group relative">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                                            <Sparkles className="w-4 h-4" />
                                        </div>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditInterest(interest)}
                                                className="p-1.5 rounded-lg hover:bg-white/10 text-stone-400 hover:text-white transition-all"
                                            >
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => requestToggleInterest(interest)}
                                                className={`p-1.5 rounded-lg hover:bg-white/10 transition-all ${interest.isActive ? 'text-green-500' : 'text-red-500'}`}
                                            >
                                                {interest.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-stone-200 text-sm mb-1 group-hover:text-white transition-colors">{interest.name}</h3>
                                    <div className="flex items-center gap-1.5 text-xs text-stone-500">
                                        <Layers className="w-3 h-3" />
                                        <span>{categoryName}</span>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredInterests.length === 0 && (
                            <div className="col-span-full py-12 text-center border border-dashed border-white/10 rounded-2xl">
                                <Sparkles className="w-8 h-8 text-stone-700 mx-auto mb-3" />
                                <p className="text-stone-500 text-sm font-medium">No interests found matching query.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            <Modal
                isOpen={confirmState.isOpen}
                onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
                title="Confirm Action"
            >
                <div className="space-y-6">
                    <div className="flex flex-col items-center text-center gap-4 py-2">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${confirmState.item?.isActive ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                            {confirmState.item?.isActive ? <XCircle className="w-8 h-8" /> : <CheckCircle2 className="w-8 h-8" />}
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white tracking-tight">
                                {confirmState.item?.isActive ? 'Deactivate' : 'Activate'} {confirmState.type === 'category' ? 'Category' : 'Interest'}?
                            </h3>
                            <p className="text-stone-500 text-sm mt-1 max-w-[280px]">
                                Are you sure you want to {confirmState.item?.isActive ? 'deactivate' : 'activate'} <span className="text-white font-bold">"{confirmState.item?.name}"</span>?
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setConfirmState({ ...confirmState, isOpen: false })}
                            className="py-3 rounded-xl bg-white/5 border border-white/10 text-stone-300 font-bold hover:bg-white/10 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleToggleConfirm}
                            disabled={isSubmitting}
                            className={`py-3 rounded-xl font-bold transition-all text-sm text-black disabled:opacity-50 ${confirmState.item?.isActive ? 'bg-red-500 hover:bg-red-400' : 'bg-green-500 hover:bg-green-400'}`}
                        >
                            {isSubmitting ? "Processing..." : (confirmState.item?.isActive ? 'Deactivate' : 'Activate')}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Category Modal */}
            <Modal
                isOpen={isCategoryModalOpen}
                onClose={closeCategoryModal}
                title={editingCategory ? "Edit Category" : "Add Category"}
            >
                <form onSubmit={handleSubmitCategory(onCategorySubmit)} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                            Category Name
                        </label>
                        <input
                            {...registerCategory("name")}
                            type="text"
                            placeholder="e.g. Sports, Music"
                            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${categoryErrors.name ? 'border-red-500/50' : 'border-white/10'} focus:border-amber-500/50 focus:bg-white/10 outline-none text-white transition-all text-sm font-medium placeholder-stone-600`}
                            autoFocus
                        />
                        {categoryErrors.name && (
                            <p className="mt-2 text-xs text-red-400 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3" />
                                {categoryErrors.name.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-white text-black hover:bg-stone-200 font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {isSubmitting ? "Processing..." : (editingCategory ? "Update Category" : "Create Category")}
                    </button>
                </form>
            </Modal>

            {/* Interest Modal */}
            <Modal
                isOpen={isInterestModalOpen}
                onClose={closeInterestModal}
                title={editingInterest ? "Edit Interest" : "Add Interest"}
            >
                <form onSubmit={handleSubmitInterest(onInterestSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                            Category
                        </label>
                        <div className="relative">
                            <select
                                {...registerInterest("categoryId")}
                                disabled={!!editingInterest}
                                className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${interestErrors.categoryId ? 'border-red-500/50' : 'border-white/10'} focus:border-amber-500/50 focus:bg-white/10 outline-none text-white transition-all text-sm font-medium appearance-none disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <option value="" className="bg-[#0d0d0f]">Select a category</option>
                                {categories.filter(cat => cat.isActive).map(cat => (
                                    <option key={cat.id} value={cat.id} className="bg-[#0d0d0f]">{cat.name}</option>
                                ))}
                            </select>
                        </div>
                        {interestErrors.categoryId && (
                            <p className="mt-2 text-xs text-red-400 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3" />
                                {interestErrors.categoryId.message}
                            </p>
                        )}
                        {editingInterest && (
                            <p className="mt-1 text-[10px] text-stone-500 italic">Category cannot be changed during edit.</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                            Interest Name
                        </label>
                        <input
                            {...registerInterest("name")}
                            type="text"
                            placeholder="e.g. Football, Jazz"
                            className={`w-full px-4 py-3 rounded-xl bg-white/5 border ${interestErrors.name ? 'border-red-500/50' : 'border-white/10'} focus:border-amber-500/50 focus:bg-white/10 outline-none text-white transition-all text-sm font-medium placeholder-stone-600`}
                        />
                        {interestErrors.name && (
                            <p className="mt-2 text-xs text-red-400 flex items-center gap-1 font-medium">
                                <AlertCircle className="w-3 h-3" />
                                {interestErrors.name.message}
                            </p>
                        )}
                    </div>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {isSubmitting ? "Processing..." : (editingInterest ? "Update Interest" : "Create Interest")}
                    </button>
                </form>
            </Modal>
        </div>
    );
}
