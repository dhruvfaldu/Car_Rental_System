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
        <TableRow
            key={category._id}
            className="border-b border-border transition-colors hover:bg-muted/40"
        >
            <TableCell className="py-3">
                <div className="flex h-10 w-12 items-center justify-center overflow-hidden rounded-lg border border-border bg-card p-1.5">
                    {category.image?.secure_url ? (
                        <img
                            src={category.image.secure_url}
                            alt={`${category.name} illustration`}
                            className="max-h-full max-w-full object-contain"
                        />
                    ) : (
                        <span className="text-xs font-bold uppercase text-muted-foreground">
                            {category.name.slice(0, 2)}
                        </span>
                    )}
                </div>
            </TableCell>

            <TableCell className="py-3">
                <div>
                    <p className="font-semibold text-foreground">
                        {category.name}
                    </p>

                    <p
                        title={category.description}
                        className="mt-0.5 max-w-[240px] truncate text-xs font-normal text-muted-foreground"
                    >
                        {category.description || "No description provided."}
                    </p>
                </div>
            </TableCell>

            <TableCell className="py-3">
                <StatusBadge status={category.isActive} type="active" />
            </TableCell>

            <TableCell className="py-3 font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />

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
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingCategory(category)}
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <div className="mx-auto max-w-7xl space-y-6 p-8">
            {/* Header section */}
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Category Management
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Define vehicle categories like Sedan, SUV, Luxury etc.
                    </p>
                </div>
            </div>

            {/* Reusable table component */}
            <MasterTable
                headers={[
                    "Image",
                    "Name & Description",
                    "Status",
                    "Created At",
                    "Actions",
                ]}
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
                        className="h-10 rounded-lg bg-primary text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
                    >
                        <Plus className="mr-1 h-5 w-5" />
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
                <SheetContent className="w-full max-w-md border-l border-border bg-background p-6">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-2xl font-semibold text-foreground">
                            {editingCategory ? "Edit Category" : "Add Category"}
                        </SheetTitle>

                        <SheetDescription className="text-sm text-muted-foreground">
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
