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
        <TableRow key={brand._id} className="border-b border-zinc-800/50 hover:bg-zinc-900/20 transition-colors">
            <TableCell className="py-3">
                <div className="w-10 h-10 rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-center p-1.5 overflow-hidden">
                    {brand.logo?.secure_url ? (
                        <img
                            src={brand.logo.secure_url}
                            alt={`${brand.name} logo`}
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <span className="text-zinc-600 font-bold text-xs uppercase">
                            {brand.name.slice(0, 2)}
                        </span>
                    )}
                </div>
            </TableCell>
            <TableCell className="py-3 font-semibold text-zinc-200">
                {brand.name}
            </TableCell>
            <TableCell className="py-3">
                <StatusBadge status={brand.isActive} type="active" />
            </TableCell>
            <TableCell className="py-3 text-zinc-400 font-medium">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-zinc-500" />
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
                        className="h-8 w-8 text-zinc-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg transition-all"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingBrand(brand)}
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
                        Brand Management
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Create, edit, and manage manufacturers for the fleet.
                    </p>
                </div>
            </div>

            {/* Reusable table component */}
            <MasterTable
                headers={["Logo", "Name", "Status", "Created At", "Actions"]}
                data={paginatedBrands}
                isLoading={isLoading}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search brands by name..."
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                renderRow={renderBrandRow}
                emptyMessage="No brands found. Add a new brand to get started!"
                addButton={
                    <Button
                        onClick={() => {
                            setEditingBrand(null);
                            setIsFormOpen(true);
                        }}
                        className="h-10 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-sky-500/10 active:scale-[0.98] transition-all"
                    >
                        <Plus className="h-5 w-5 mr-1" />
                        Add Brand
                    </Button>
                }
            />

            {/* Sheet Form (Drawer) */}
            <Sheet
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingBrand(null);
                }}
            >
                <SheetContent className="bg-zinc-900 border-l border-zinc-800 text-zinc-100 max-w-md w-full p-6">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-zinc-100 font-bold text-xl">
                            {editingBrand ? "Edit Brand" : "Add Brand"}
                        </SheetTitle>
                        <SheetDescription className="text-zinc-400 text-sm">
                            Fill in the manufacturer details. Make sure the logo is transparent for best rendering.
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

            {/* Deletion confirmation dialog */}
            <DeleteDialog
                isOpen={!!deletingBrand}
                onClose={() => setDeletingBrand(null)}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={`Delete ${deletingBrand?.name}?`}
                description={`Are you sure you want to delete ${deletingBrand?.name}? All cars linked to this brand may lose their manufacturer reference.`}
            />
        </div>
    );
}
