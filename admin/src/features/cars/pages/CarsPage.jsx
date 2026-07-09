import React, { useState } from "react";
import { useCars } from "../hooks/useCars";
import { useBrands } from "../../brands/hooks/useBrands";
import { useCategories } from "../../categories/hooks/useCategories";
import MasterTable from "@/components/master/MasterTable";
import StatusBadge from "@/components/master/StatusBadge";
import DeleteDialog from "@/components/master/DeleteDialog";
import CarForm from "../components/CarForm";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, IndianRupee } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";
import toast from "react-hot-toast";

export default function CarsPage() {
    const { brands } = useBrands();
    const { categories } = useCategories();

    // Query parameters states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Build API query parameters
    const queryParams = {
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        brand: selectedBrand !== "all" ? selectedBrand : undefined,
        category: selectedCategory !== "all" ? selectedCategory : undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
    };

    const {
        cars,
        pagination,
        isLoading,
        createCar,
        isCreating,
        updateCar,
        isUpdating,
        deleteCar,
        isDeleting,
    } = useCars(queryParams);

    // CRUD Modal/Drawer states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCar, setEditingCar] = useState(null);
    const [deletingCar, setDeletingCar] = useState(null);

    const handleSearchChange = (val) => {
        setSearchQuery(val);
        setCurrentPage(1);
    };

    const handleBrandFilterChange = (val) => {
        setSelectedBrand(val);
        setCurrentPage(1);
    };

    const handleCategoryFilterChange = (val) => {
        setSelectedCategory(val);
        setCurrentPage(1);
    };

    const handleStatusFilterChange = (val) => {
        setSelectedStatus(val);
        setCurrentPage(1);
    };

    const handleCreateOrUpdate = async (formData) => {
        try {
            if (editingCar) {
                await updateCar({ id: editingCar._id, formData });
            } else {
                await createCar(formData);
            }
            setIsFormOpen(false);
            setEditingCar(null);
        } catch (error) {
            // Toast automatically handled
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deletingCar) return;
        try {
            await deleteCar(deletingCar._id);
            setDeletingCar(null);
        } catch (error) {
            // Handled
        }
    };

    const renderCarRow = (car) => (
        <TableRow key={car._id} className="border-b border-zinc-800/50 hover:bg-zinc-900/20 transition-colors">
            <TableCell className="py-3">
                <div className="w-16 h-11 rounded-lg border border-zinc-800 bg-zinc-950 flex items-center justify-center p-1 overflow-hidden">
                    {car.images?.[0]?.secure_url ? (
                        <img
                            src={car.images[0].secure_url}
                            alt={`${car.name}`}
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <span className="text-[10px] text-zinc-600 font-bold uppercase">NO IMG</span>
                    )}
                </div>
            </TableCell>
            <TableCell className="py-3 font-semibold text-zinc-200">
                <div>
                    <p className="text-sm">{car.name}</p>
                    <p className="text-xs font-normal text-zinc-500 mt-0.5">
                        {car.registrationNumber} • {car.year}
                    </p>
                </div>
            </TableCell>
            <TableCell className="py-3">
                <span className="inline-flex items-center rounded-md bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-300 ring-1 ring-inset ring-zinc-700">
                    {car.brand?.name || "N/A"}
                </span>
            </TableCell>
            <TableCell className="py-3">
                <span className="inline-flex items-center rounded-md bg-zinc-800/40 px-2 py-1 text-xs font-medium text-sky-400 ring-1 ring-inset ring-sky-500/20">
                    {car.category?.name || "N/A"}
                </span>
            </TableCell>
            <TableCell className="py-3 font-semibold text-zinc-200">
                <div className="flex items-center text-xs">
                    <IndianRupee className="h-3 w-3 mr-0.5 text-zinc-400" />
                    {car.pricePerDay}/day
                </div>
            </TableCell>
            <TableCell className="py-3">
                <StatusBadge status={car.status} type="car-status" />
            </TableCell>
            <TableCell className="py-3">
                <StatusBadge status={car.isActive} type="active" />
            </TableCell>
            <TableCell className="py-3">
                <div className="flex items-center gap-1.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setEditingCar(car);
                            setIsFormOpen(true);
                        }}
                        className="h-8 w-8 text-zinc-400 hover:text-sky-400 hover:bg-sky-500/10 rounded-lg"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingCar(car)}
                        className="h-8 w-8 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
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
                        Fleet Management
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Review, modify, and manage car listings. Add up to 5 images per vehicle.
                    </p>
                </div>
            </div>

            {/* Filter toolbar components */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Brand filter */}
                <Select value={selectedBrand} onValueChange={handleBrandFilterChange}>
                    <SelectTrigger className="w-[140px] h-10 bg-zinc-900/50 border-zinc-800 text-zinc-300 rounded-lg text-xs">
                        <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem value="all">All Brands</SelectItem>
                        {brands.map(b => (
                            <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Category filter */}
                <Select value={selectedCategory} onValueChange={handleCategoryFilterChange}>
                    <SelectTrigger className="w-[140px] h-10 bg-zinc-900/50 border-zinc-800 text-zinc-300 rounded-lg text-xs">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(c => (
                            <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Status filter */}
                <Select value={selectedStatus} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className="w-[140px] h-10 bg-zinc-900/50 border-zinc-800 text-zinc-300 rounded-lg text-xs">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem value="all">All Statuses</SelectItem>
                        {["Available", "Booked", "Rented", "Maintenance"].map(status => (
                            <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Reusable master table */}
            <MasterTable
                headers={["Image", "Model & Details", "Brand", "Category", "Rate", "Status", "Active", "Actions"]}
                data={cars}
                isLoading={isLoading}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                searchPlaceholder="Search cars by model name..."
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
                renderRow={renderCarRow}
                emptyMessage="No cars found. Add a vehicle listing to start your fleet!"
                addButton={
                    <Button
                        onClick={() => {
                            setEditingCar(null);
                            setIsFormOpen(true);
                        }}
                        className="h-10 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-sky-500/10 active:scale-[0.98] transition-all"
                    >
                        <Plus className="h-5 w-5 mr-1" />
                        Add Vehicle
                    </Button>
                }
            />

            {/* Sheet Form (Drawer) */}
            <Sheet
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingCar(null);
                }}
            >
                <SheetContent className="bg-zinc-950 border-l border-zinc-800 text-zinc-100 max-w-5xl w-full sm:max-w-2xl p-4">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-zinc-100 font-bold text-xl">
                            {editingCar ? "Edit Vehicle" : "Add Vehicle"}
                        </SheetTitle>
                        <SheetDescription className="text-zinc-400 text-sm">
                            Configure standard fleet listing parameters, select equipment/specs, and manage attachments.
                        </SheetDescription>
                    </SheetHeader>

                    {isFormOpen && (
                        <CarForm
                            initialData={editingCar}
                            onSubmit={handleCreateOrUpdate}
                            onCancel={() => {
                                setIsFormOpen(false);
                                setEditingCar(null);
                            }}
                            isLoading={isCreating || isUpdating}
                        />
                    )}
                </SheetContent>
            </Sheet>

            {/* Deletion confirmation dialog */}
            <DeleteDialog
                isOpen={!!deletingCar}
                onClose={() => setDeletingCar(null)}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
                title={`Delete ${deletingCar?.name}?`}
                description={`Are you sure you want to permanently delete the listing for ${deletingCar?.name}? This will remove all linked bookings and statistics associated with this vehicle.`}
            />
        </div>
    );
}
