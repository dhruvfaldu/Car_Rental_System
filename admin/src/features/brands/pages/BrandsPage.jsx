import React, { useState } from "react";
import { useBrands } from "../hooks/useBrands";
import MasterTable from "@/components/master/MasterTable";
import StatusBadge from "@/components/master/StatusBadge";
import DeleteDialog from "@/components/master/DeleteDialog";
import BrandForm from "../components/BrandForm";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Calendar } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import toast from "react-hot-toast";

export default function BrandsPage() {
    const {
        brands,
        isLoading,
        createBrand,
        isCreating,
        updateBrand,
        isUpdating,
        deleteBrand,
        isDeleting,
    } = useBrands();

    // Search and Pagination states
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // CRUD Modal/Drawer states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingBrand, setEditingBrand] = useState(null);
    const [deletingBrand, setDeletingBrand] = useState(null);

    // Filter brands by search query
    const filteredBrands = brands.filter((brand) =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Frontend pagination logic
    const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
    const paginatedBrands = filteredBrands.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        setCurrentPage(1); // Reset page on search
    };

    const handleCreateOrUpdate = async (formData) => {
        try {
            if (editingBrand) {
                await updateBrand({ id: editingBrand._id, formData });
                toast.success("Brand updated successfully");
            } else {
                await createBrand(formData);
                toast.success("Brand created successfully");
            }
            setIsFormOpen(false);
            setEditingBrand(null);
        } catch (error) {
            // Already toasted by hook
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingBrand) return;
        try {
            await deleteBrand(deletingBrand._id);
            setDeletingBrand(null);
        } catch (error) {
            // Handled in query hook
        }
    };

    const renderBrandRow = (brand) => (
        <TableRow
            key={brand._id}
            className="border-b border-border transition-colors hover:bg-accent/40"
        >
            <TableCell className="py-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg border border-border bg-card p-1.5">
                    {brand.logo?.secure_url ? (
                        <img
                            src={brand.logo.secure_url}
                            alt={`${brand.name} logo`}
                            className="max-h-full max-w-full object-contain"
                        />
                    ) : (
                        <span className="text-xs font-bold uppercase text-muted-foreground">
                            {brand.name.slice(0, 2)}
                        </span>
                    )}
                </div>
            </TableCell>

            <TableCell className="py-3 font-semibold text-foreground">
                {brand.name}
            </TableCell>

            <TableCell className="py-3">
                <StatusBadge status={brand.isActive} type="active" />
            </TableCell>

            <TableCell className="py-3 font-medium text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {new Date(brand.createdAt).toLocaleDateString("en-IN", {
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
                            setEditingBrand(brand);
                            setIsFormOpen(true);
                        }}
                        className="h-8 w-8 rounded-lg text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingBrand(brand)}
                        className="h-8 w-8 rounded-lg text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Brand Management
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Create, edit, and manage manufacturers for your rental fleet.
                    </p>
                </div>
            </div>

            {/* Table */}
            <MasterTable
                headers={["Logo", "Name", "Status", "Created At", "Actions"]}
                data={paginatedBrands}
                isLoading={isLoading}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search brands..."
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                renderRow={renderBrandRow}
                emptyMessage="No brands found."
                addButton={
                    <Button
                        onClick={() => {
                            setEditingBrand(null);
                            setIsFormOpen(true);
                        }}
                        className="h-11 rounded-lg bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Brand
                    </Button>
                }
            />

            {/* Brand Form Drawer */}
            <Sheet
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingBrand(null);
                }}
            >
                <SheetContent className="w-full max-w-md border-l border-border bg-background p-6">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-2xl font-semibold text-foreground">
                            {editingBrand ? "Edit Brand" : "Add Brand"}
                        </SheetTitle>

                        <SheetDescription className="text-sm text-muted-foreground">
                            Enter the manufacturer details below.
                        </SheetDescription>
                    </SheetHeader>

                    <BrandForm
                        initialData={editingBrand}
                        onSubmit={handleCreateOrUpdate}
                        onCancel={() => {
                            setIsFormOpen(false);
                            setEditingBrand(null);
                        }}
                        isLoading={isCreating || isUpdating}
                    />
                </SheetContent>
            </Sheet>

            {/* Delete Dialog */}
            <DeleteDialog
                isOpen={!!deletingBrand}
                onClose={() => setDeletingBrand(null)}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={`Delete ${deletingBrand?.name}?`}
                description={`Are you sure you want to delete ${deletingBrand?.name}? Cars associated with this brand may lose their manufacturer reference.`}
            />
        </div>
    );
}
