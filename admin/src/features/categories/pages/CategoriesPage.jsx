import React, { useState } from "react";
import { useCategories } from "../hooks/useCategories";
import MasterTable from "@/components/master/MasterTable";
import StatusBadge from "@/components/master/StatusBadge";
import DeleteDialog from "@/components/master/DeleteDialog";
import CategoryForm from "../components/CategoryForm";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Calendar, FileText } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import toast from "react-hot-toast";

export default function CategoriesPage() {
    const {
        categories,
        isLoading,
        createCategory,
        isCreating,
        updateCategory,
        isUpdating,
        deleteCategory,
        isDeleting,
    } = useCategories();

    // Search and Pagination states
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // CRUD Modal/Drawer states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deletingCategory, setDeletingCategory] = useState(null);

    // Filter categories by search query
    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Frontend pagination logic
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset page on search
    };

    const handleCreateOrUpdate = async (formData) => {
        try {
            if (editingCategory) {
                await updateCategory({ id: editingCategory._id, formData });
                toast.success("Category updated successfully");
            } else {
                await createCategory(formData);
                toast.success("Category created successfully");
            }
            setIsFormOpen(false);
            setEditingCategory(null);
        } catch (error) {
            // Already handled
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingCategory) return;
        try {
            await deleteCategory(deletingCategory._id);
            setDeletingCategory(null);
        } catch (error) {
            // Already handled
        }
    };

    const renderCategoryRow = (category) => (
        <TableRow key={category._id} className="border-b border-zinc-800/50 hover:bg-zinc-900/20 transition-colors">
            <TableCell className="py-3">
                <div className="w-12 h-10 rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-center p-1.5 overflow-hidden">
                    {category.image?.secure_url ? (
                        <img
                            src={category.image.secure_url}
                            alt={`${category.name} illustration`}
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <span className="text-zinc-600 font-bold text-xs uppercase">
                            {category.name.slice(0, 2)}
                        </span>
                    )}
                </div>
            </TableCell>
            <TableCell className="py-3 font-semibold text-zinc-200">
                <div>
                    <p>{category.name}</p>
                    <p className="text-xs font-normal text-zinc-500 max-w-[240px] truncate mt-0.5" title={category.description}>
                        {category.description || "No description provided."}
                    </p>
                </div>
            </TableCell>
            <TableCell className="py-3">
                <StatusBadge status={category.isActive} type="active" />
            </TableCell>
            <TableCell className="py-3 text-zinc-400 font-medium">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-zinc-500" />
                    {new Date(category.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    })}
                </div>
            </TableCell>
            <TableCell className="py-3">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setEditingCategory(category);
                            setIsFormOpen(true);
                        }}
                        className="h-8 w-8 text-zinc-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-all"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingCategory(category)}
                        className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <div className="p-8 space-y-6 max-w-7xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-zinc-100 to-zinc-400">
                        Category Management
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Define vehicle categories like Sedan, SUV, Luxury etc.
                    </p>
                </div>
            </div>

            {/* Reusable table component */}
            <MasterTable
                headers={["Image", "Name & Description", "Status", "Created At", "Actions"]}
                data={paginatedCategories}
                isLoading={isLoading}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search categories by name..."
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                renderRow={renderCategoryRow}
                emptyMessage="No categories found. Add a new category to get started!"
                addButton={
                    <Button
                        onClick={() => {
                            setEditingCategory(null);
                            setIsFormOpen(true);
                        }}
                        className="h-10 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-sky-500/10 active:scale-[0.98] transition-all"
                    >
                        <Plus className="h-5 w-5 mr-1" />
                        Add Category
                    </Button>
                }
            />

            {/* Sheet Form (Drawer) */}
            <Sheet
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingCategory(null);
                }}
            >
                <SheetContent className="bg-zinc-950 border-l border-zinc-800 text-zinc-100 max-w-md w-full p-6">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-zinc-100 font-bold text-xl">
                            {editingCategory ? "Edit Category" : "Add Category"}
                        </SheetTitle>
                        <SheetDescription className="text-zinc-400 text-sm">
                            Configure vehicle classification details and image visual representation.
                        </SheetDescription>
                    </SheetHeader>

                    <CategoryForm
                        initialData={editingCategory}
                        onSubmit={handleCreateOrUpdate}
                        onCancel={() => {
                            setIsFormOpen(false);
                            setEditingCategory(null);
                        }}
                        isLoading={isCreating || isUpdating}
                    />
                </SheetContent>
            </Sheet>

            {/* Deletion confirmation dialog */}
            <DeleteDialog
                isOpen={!!deletingCategory}
                onClose={() => setDeletingCategory(null)}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={`Delete ${deletingCategory?.name}?`}
                description={`Are you sure you want to delete ${deletingCategory?.name}? All cars categorized under this class may lose their category classification.`}
            />
        </div>
    );
}
