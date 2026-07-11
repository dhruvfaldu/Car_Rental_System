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
        <TableRow
            key={car._id}
            className="border-b border-border hover:bg-muted/50 transition-colors"
        >
            <TableCell className="py-3">
                <div className="w-16 h-11 rounded-lg border border-border bg-muted flex items-center justify-center p-1 overflow-hidden">
                    {car.images?.[0]?.secure_url ? (
                        <img
                            src={car.images[0].secure_url}
                            alt={car.name}
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                            NO IMG
                        </span>
                    )}
                </div>
            </TableCell>

            <TableCell className="py-3">
                <div>
                    <p className="text-sm font-semibold text-foreground">
                        {car.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        {car.registrationNumber} • {car.year}
                    </p>
                </div>
            </TableCell>

            <TableCell className="py-3">
                <span className="inline-flex items-center rounded-md border border-border bg-muted px-2 py-1 text-xs font-medium text-foreground">
                    {car.brand?.name || "N/A"}
                </span>
            </TableCell>

            <TableCell className="py-3">
                <span className="inline-flex items-center rounded-md border border-border bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                    {car.category?.name || "N/A"}
                </span>
            </TableCell>

            <TableCell className="py-3">
                <div className="flex items-center text-sm font-semibold text-foreground">
                    <IndianRupee className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                    {car.pricePerDay}/day
                </div>
            </TableCell>

            <TableCell className="py-3">
                <StatusBadge
                    status={car.status}
                    type="car-status"
                />
            </TableCell>

            <TableCell className="py-3">
                <StatusBadge
                    status={car.isActive}
                    type="active"
                />
            </TableCell>

            <TableCell className="py-3">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setEditingCar(car);
                            setIsFormOpen(true);
                        }}
                        className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeletingCar(car)}
                        className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
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
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">
                        Fleet Management
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Review, modify, and manage car listings. Add up to 5 images per vehicle.
                    </p>
                </div>
            </div>

            {/* Filter Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Brand Filter */}
                <Select value={selectedBrand} onValueChange={handleBrandFilterChange}>
                    <SelectTrigger className="w-[160px] h-10 bg-background border-border text-foreground rounded-lg">
                        <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground">
                        <SelectItem value="all">All Brands</SelectItem>
                        {brands.map((b) => (
                            <SelectItem key={b._id} value={b._id}>
                                {b.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={handleCategoryFilterChange}>
                    <SelectTrigger className="w-[160px] h-10 bg-background border-border text-foreground rounded-lg">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((c) => (
                            <SelectItem key={c._id} value={c._id}>
                                {c.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select value={selectedStatus} onValueChange={handleStatusFilterChange}>
                    <SelectTrigger className="w-[160px] h-10 bg-background border-border text-foreground rounded-lg">
                        <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border text-popover-foreground">
                        <SelectItem value="all">All Statuses</SelectItem>
                        {["Available", "Booked", "Rented", "Maintenance"].map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Master Table */}
            <MasterTable
                headers={[
                    "Image",
                    "Model & Details",
                    "Brand",
                    "Category",
                    "Rate",
                    "Status",
                    "Active",
                    "Actions",
                ]}
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
                        className="h-11 rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-medium shadow-sm"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vehicle
                    </Button>
                }
            />

            {/* Vehicle Form Drawer */}
            <Sheet
                open={isFormOpen}
                onOpenChange={(open) => {
                    setIsFormOpen(open);
                    if (!open) setEditingCar(null);
                }}
            >
                <SheetContent className="w-full sm:max-w-2xl bg-card border-l border-border text-card-foreground p-6">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-2xl font-semibold text-card-foreground">
                            {editingCar ? "Edit Vehicle" : "Add Vehicle"}
                        </SheetTitle>

                        <SheetDescription className="text-muted-foreground">
                            Configure vehicle information, pricing, features and images.
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

            {/* Delete Dialog */}
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
